/**
 * lessonService.js
 * ============================================================================
 * Firestore CRUD operations for the `lessons` collection.
 * Lessons are created by youtubeService (sync), read by students.
 * ============================================================================
 */

import {
  collection, doc, getDoc, getDocs,
  query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const LESSONS_COLLECTION = 'lessons';

/* ─── Student Read Operations ─────────────────────────────────────────────── */

/**
 * Fetches all published lessons for a subject, sorted by order.
 * @param {string} subjectId
 * @returns {Promise<object[]>}
 */
export async function getLessonsBySubject(subjectId) {
  if (!subjectId) return [];

  const snap = await getDocs(query(
    collection(db, LESSONS_COLLECTION),
    where('subjectId', '==', subjectId),
    where('published', '==', true),
    orderBy('order', 'asc'),
  ));

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Fetches a single lesson by its document ID.
 * @param {string} lessonId
 * @returns {Promise<object|null>}
 */
export async function getLessonById(lessonId) {
  if (!lessonId) return null;
  const snap = await getDoc(doc(db, LESSONS_COLLECTION, lessonId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/* ─── Unlock Logic ────────────────────────────────────────────────────────── */

/**
 * Determines if a lesson is unlocked based on the student's progress.
 *
 * Rules:
 * - The first lesson (order === 1) is ALWAYS unlocked.
 * - Any subsequent lesson is unlocked if the previous lesson (order - 1) is completed.
 *
 * @param {object} lesson - The lesson to check { order, id }
 * @param {string[]} completedLessons - Array of completed lesson IDs
 * @param {object[]} allLessons - All lessons for this subject, sorted by order
 * @returns {boolean}
 */
export function isLessonUnlocked(lesson, completedLessons = [], allLessons = []) {
  if (!lesson) return false;

  // First lesson always unlocked
  if (lesson.order <= 1) return true;

  // Find the lesson immediately before this one
  const prevLesson = allLessons.find(l => l.order === lesson.order - 1);

  // If no previous lesson found (data inconsistency), unlock
  if (!prevLesson) return true;

  return completedLessons.includes(prevLesson.id);
}

/**
 * Enriches a lessons array with computed UI state fields.
 * @param {object[]} lessons - Raw lessons from Firestore
 * @param {string[]} completedLessons - User's completed lesson IDs
 * @returns {object[]} - Lessons with { unlocked, completed, isCurrent }
 */
export function enrichLessonsWithProgress(lessons, completedLessons = []) {
  if (!lessons?.length) return [];

  return lessons.map((lesson) => {
    const completed = completedLessons.includes(lesson.id);
    const unlocked  = isLessonUnlocked(lesson, completedLessons, lessons);

    // "Current" lesson = first unlocked lesson that's not completed
    const isCurrent = unlocked && !completed;

    return { ...lesson, completed, unlocked, isCurrent };
  });
}

/**
 * Finds the next lesson after a given lesson ID.
 * @param {string} currentLessonId
 * @param {object[]} allLessons - All subject lessons sorted by order
 * @returns {object|null}
 */
export function getNextLesson(currentLessonId, allLessons = []) {
  if (!allLessons.length) return null;
  const currentIdx = allLessons.findIndex(l => l.id === currentLessonId);
  if (currentIdx === -1 || currentIdx >= allLessons.length - 1) return null;
  return allLessons[currentIdx + 1];
}
