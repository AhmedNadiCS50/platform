/**
 * youtubeService.js
 * ============================================================================
 * YouTube Data API v3 integration — ADMIN ONLY.
 * Students never call these functions. All video data is read from Firestore.
 * ============================================================================
 */

import {
  collection, doc, setDoc, updateDoc, getDocs,
  query, where, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';
const LESSONS_COLLECTION = 'lessons';
const SUBJECTS_COLLECTION = 'subjects';

/* ─── URL Parsers ─────────────────────────────────────────────────────────── */

/**
 * Extracts YouTube playlist ID or video ID from a URL.
 * Handles: playlist?list=..., youtu.be/..., youtube.com/watch?v=...
 * @param {string} url
 * @returns {{ type: 'playlist'|'video', id: string }|null}
 */
export function extractYouTubeInfo(url) {
  if (!url) return null;
  const urlStr = url.trim();

  // Playlist URL: ?list=PLAYLIST_ID
  const playlistMatch = urlStr.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (playlistMatch) {
    return { type: 'playlist', id: playlistMatch[1] };
  }

  // Short video URL: youtu.be/VIDEO_ID
  const shortMatch = urlStr.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (shortMatch) {
    return { type: 'video', id: shortMatch[1] };
  }

  // Long video URL: youtube.com/watch?v=VIDEO_ID
  const longMatch = urlStr.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (longMatch) {
    return { type: 'video', id: longMatch[1] };
  }

  return null;
}

/* ─── Duration Parser ─────────────────────────────────────────────────────── */

/**
 * Converts ISO 8601 duration (PT12M30S) to Arabic readable string.
 * @param {string} iso - e.g. "PT12M30S"
 * @returns {string} - e.g. "12 دقيقة"
 */
export function parseDuration(iso) {
  if (!iso) return '—';
  const hoursMatch   = iso.match(/(\d+)H/);
  const minutesMatch = iso.match(/(\d+)M/);
  const secondsMatch = iso.match(/(\d+)S/);

  const hours   = hoursMatch   ? parseInt(hoursMatch[1], 10)   : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  const parts = [];
  if (hours > 0)                    parts.push(`${hours} ساعة`);
  if (minutes > 0)                  parts.push(`${minutes} دقيقة`);
  if (seconds > 0 && hours === 0)   parts.push(`${seconds} ثانية`);

  return parts.length > 0 ? parts.join(' و') : 'أقل من دقيقة';
}

/* ─── YouTube API Fetchers ────────────────────────────────────────────────── */

/**
 * Fetches all playlist items (video IDs + positions + titles) from a YouTube playlist.
 * Handles pagination automatically.
 * @param {string} playlistId
 * @param {string} apiKey
 * @returns {Promise<Array<{ videoId, title, thumbnail, position }>>}
 */
async function fetchPlaylistItems(playlistId, apiKey) {
  const items = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId,
      maxResults: '50',
      key: apiKey,
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`${YT_API_BASE}/playlistItems?${params}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        `YouTube API Error: ${res.status} — ${errData?.error?.message || res.statusText}`
      );
    }
    const data = await res.json();

    for (const item of data.items || []) {
      const snippet = item.snippet || {};
      const videoId = snippet.resourceId?.videoId;
      if (!videoId || videoId === 'undefined') continue;

      items.push({
        videoId,
        title: snippet.title || 'درس بدون عنوان',
        thumbnail:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        position: (snippet.position ?? items.length) + 1,
      });
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return items;
}

/**
 * Fetches video durations in bulk from YouTube Data API.
 * @param {string[]} videoIds - Array of video IDs (max 50 per call)
 * @param {string} apiKey
 * @returns {Promise<Object>} - Map of videoId → duration string
 */
async function fetchVideoDurations(videoIds, apiKey) {
  const durations = {};
  const CHUNK_SIZE = 50;

  for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
    const chunk = videoIds.slice(i, i + CHUNK_SIZE);
    const params = new URLSearchParams({
      part: 'contentDetails',
      id: chunk.join(','),
      key: apiKey,
    });

    const res = await fetch(`${YT_API_BASE}/videos?${params}`);
    if (!res.ok) continue; // Skip duration on error — not critical

    const data = await res.json();
    for (const item of data.items || []) {
      durations[item.id] = parseDuration(item.contentDetails?.duration);
    }
  }

  return durations;
}

/* ─── Main Sync Function ──────────────────────────────────────────────────── */

/**
 * Syncs a subject's YouTube content into Firestore lessons collection.
 * - For playlists: fetches all videos → creates/updates lesson documents
 * - For single videos: creates a single lesson document
 * - Does NOT delete existing student progress
 * - Calls onProgress({ current, total, title }) during sync for UI feedback
 *
 * @param {string} subjectId - Firestore subject document ID
 * @param {object} subject - Subject data { playlistUrl, contentType, name }
 * @param {string} apiKey - YouTube Data API v3 key
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{ count: number }>} - Number of lessons synced
 */
export async function syncSubjectContent(subjectId, subject, apiKey, onProgress = () => {}) {
  if (!apiKey) throw new Error('YouTube API Key غير موجود. يرجى إضافة VITE_YOUTUBE_API_KEY في ملف .env');

  const ytInfo = extractYouTubeInfo(subject.playlistUrl);
  if (!ytInfo) throw new Error('رابط YouTube غير صالح. يرجى التأكد من الرابط.');

  let videoItems = [];

  if (ytInfo.type === 'playlist') {
    onProgress({ current: 0, total: 0, title: 'جاري جلب قائمة التشغيل...' });
    videoItems = await fetchPlaylistItems(ytInfo.id, apiKey);

    // Fetch durations in bulk
    onProgress({ current: 0, total: videoItems.length, title: 'جاري جلب مدد الفيديوهات...' });
    const durations = await fetchVideoDurations(videoItems.map(v => v.videoId), apiKey);

    videoItems = videoItems.map(v => ({
      ...v,
      duration: durations[v.videoId] || '—',
    }));
  } else {
    // Single video
    onProgress({ current: 0, total: 1, title: 'جاري جلب بيانات الفيديو...' });
    const durations = await fetchVideoDurations([ytInfo.id], apiKey);
    videoItems = [{
      videoId: ytInfo.id,
      title: subject.name,
      thumbnail: `https://i.ytimg.com/vi/${ytInfo.id}/hqdefault.jpg`,
      position: 1,
      duration: durations[ytInfo.id] || '—',
    }];
  }

  if (videoItems.length === 0) {
    throw new Error('لم يتم العثور على فيديوهات في هذه القائمة. تأكد من أن القائمة عامة (Public).');
  }

  // Write lessons to Firestore in batches (Firestore batch limit: 500)
  const BATCH_SIZE = 400;
  let syncedCount = 0;

  for (let i = 0; i < videoItems.length; i += BATCH_SIZE) {
    const chunk = videoItems.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const video of chunk) {
      const lessonId = `${subjectId}_${video.videoId}`;
      const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);

      batch.set(lessonRef, {
        subjectId,
        youtubeVideoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        order: video.position,
        published: true,
        syncedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true }); // merge:true preserves any extra fields

      syncedCount++;
      onProgress({ current: i + syncedCount, total: videoItems.length, title: video.title });
    }

    await batch.commit();
  }

  // Update subject document
  const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
  await updateDoc(subjectRef, {
    syncedAt: serverTimestamp(),
    lessonsCount: videoItems.length,
    updatedAt: serverTimestamp(),
  });

  return { count: syncedCount };
}
