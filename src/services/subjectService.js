/**
 * subjectService.js
 * ============================================================================
 * Firestore CRUD operations for the `subjects` collection.
 * Students use getSubjectsByGradeAndTrack().
 * Admins use getAllSubjects() + create/update/delete operations.
 * Fail-safe in-memory filtering prevents index errors & ensures subjects always render.
 * ============================================================================
 */

import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { INITIAL_SUBJECTS, SEED_SENTINEL_ID } from '../config/seedData';

const SUBJECTS_COLLECTION = 'subjects';
const LESSONS_COLLECTION  = 'lessons';

/* ─── Student Queries ─────────────────────────────────────────────────────── */

/**
 * Fetches subjects relevant to a student based on their grade and track.
 * In-memory filtering avoids complex composite index requirements in Firestore.
 * Falls back to INITIAL_SUBJECTS if Firestore is empty or fails.
 *
 * @param {string} grade - 'grade-1' | 'grade-2' | 'grade-3'
 * @param {string} track - 'medicine' | 'engineering' | 'arts' | 'business'
 * @returns {Promise<object[]>}
 */
export async function getSubjectsByGradeAndTrack(grade, track) {
  // Try auto-seeding initial subjects if not seeded yet
  try {
    await seedInitialSubjects();
  } catch (err) {
    console.warn('[subjectService] Auto-seed check skipped/failed:', err);
  }

  let allDocs = [];

  try {
    const snap = await getDocs(collection(db, SUBJECTS_COLLECTION));
    allDocs = snap.docs
      .filter(d => d.id !== SEED_SENTINEL_ID)
      .map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[subjectService] Firestore fetch error, fallback to seedData:', err);
  }

  // Use Firestore docs if present, otherwise fallback to local INITIAL_SUBJECTS
  const pool = allDocs.length > 0 ? allDocs : INITIAL_SUBJECTS;

  const targetGrade = grade || 'grade-1';
  const targetTrack = track || 'medicine';

  // Filter in memory: common subjects for grade + track-specific subjects
  const filtered = pool.filter((sub) => {
    if (sub.published === false) return false;

    // Common subjects for the student's grade
    if (sub.track === 'common') {
      return !sub.grade || sub.grade === targetGrade;
    }

    // Track-specific subjects matching the student's track
    if (sub.track === targetTrack) {
      return true;
    }

    return false;
  });

  // Sort: common subjects first, then track subjects, ordered by 'order'
  filtered.sort((a, b) => {
    if (a.track === 'common' && b.track !== 'common') return -1;
    if (a.track !== 'common' && b.track === 'common') return 1;
    return (a.order || 99) - (b.order || 99);
  });

  return filtered;
}

/**
 * Fetches a single subject by its Firestore document ID.
 * Falls back to INITIAL_SUBJECTS if doc does not exist in Firestore.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getSubjectById(id) {
  if (!id) return null;
  try {
    const snap = await getDoc(doc(db, SUBJECTS_COLLECTION, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.warn('[getSubjectById] Firestore read error:', err);
  }

  // Fallback to local INITIAL_SUBJECTS
  const fallback = INITIAL_SUBJECTS.find(s => s.id === id);
  return fallback || null;
}

/* ─── Admin Queries ───────────────────────────────────────────────────────── */

/**
 * Fetches ALL subjects (published or not) — for admin panel use only.
 * @returns {Promise<object[]>}
 */
export async function getAllSubjects() {
  let subjects = [];
  try {
    const snap = await getDocs(collection(db, SUBJECTS_COLLECTION));
    subjects = snap.docs
      .filter(d => d.id !== SEED_SENTINEL_ID)
      .map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[getAllSubjects] Firestore fetch error:', err);
  }

  if (subjects.length === 0) {
    subjects = [...INITIAL_SUBJECTS];
  }

  subjects.sort((a, b) => {
    const gradeOrder = { 'grade-1': 1, 'grade-2': 2, 'grade-3': 3, null: 9 };
    const gA = gradeOrder[a.grade] ?? 9;
    const gB = gradeOrder[b.grade] ?? 9;
    if (gA !== gB) return gA - gB;
    return (a.order || 99) - (b.order || 99);
  });

  return subjects;
}

/**
 * Creates a new subject in Firestore.
 * @param {object} data - Subject data
 * @returns {Promise<string>} - The new document ID
 */
export async function createSubject(data) {
  const rawId = `${(data.grade || 'all')}-${data.track}-${data.name}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 60);
  const id = `${rawId}-${Date.now()}`;

  const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
  await setDoc(subjectRef, {
    ...data,
    published: data.published ?? true,
    syncedAt: null,
    lessonsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return id;
}

/**
 * Updates an existing subject document.
 * @param {string} id
 * @param {object} updates
 */
export async function updateSubject(id, updates) {
  const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
  await updateDoc(subjectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a subject AND all its associated lesson documents.
 * @param {string} subjectId
 */
export async function deleteSubjectWithLessons(subjectId) {
  try {
    const lessonsSnap = await getDocs(query(
      collection(db, LESSONS_COLLECTION),
      where('subjectId', '==', subjectId),
    ));

    const BATCH_SIZE = 400;
    const lessonDocs = lessonsSnap.docs;

    for (let i = 0; i < lessonDocs.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      lessonDocs.slice(i, i + BATCH_SIZE).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (err) {
    console.warn('[deleteSubjectWithLessons] Could not delete lessons:', err);
  }

  await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
}

/* ─── Initial Data Seeding ────────────────────────────────────────────────── */

/**
 * Seeds initial subjects into Firestore if not already seeded.
 * Safe to call repeatedly.
 */
export async function seedInitialSubjects() {
  try {
    const sentinelRef = doc(db, SUBJECTS_COLLECTION, SEED_SENTINEL_ID);
    const sentinelSnap = await getDoc(sentinelRef);
    if (sentinelSnap.exists()) return; // Already seeded

    const batch = writeBatch(db);

    for (const subject of INITIAL_SUBJECTS) {
      const { id, ...rest } = subject;
      const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
      batch.set(subjectRef, {
        ...rest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    batch.set(sentinelRef, { seededAt: serverTimestamp(), version: 1 });
    await batch.commit();
    console.info(`[Vision] Seeded ${INITIAL_SUBJECTS.length} initial subjects into Firestore.`);
  } catch (err) {
    console.warn('[seedInitialSubjects] Seeding skipped/failed (likely permission or offline):', err);
  }
}
