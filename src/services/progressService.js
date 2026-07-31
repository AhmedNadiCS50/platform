/**
 * progressService.js
 * ============================================================================
 * Student progress tracking in Firestore (users/{uid}).
 * Handles lesson completion, subject progress %, and last-opened tracking.
 * ============================================================================
 */

import {
  doc, getDoc, updateDoc, arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/* ─── Read Progress ───────────────────────────────────────────────────────── */

/**
 * Reads a student's full progress data from Firestore.
 * @param {string} uid
 * @returns {Promise<object>}
 */
export async function getUserProgress(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    completedLessons:  data.completedLessons  || [],
    completedSubjects: data.completedSubjects  || [],
    progress:          data.progress           || {},
    lastLesson:        data.lastLesson         || null,
    currentLesson:     data.currentLesson      || null,
    lastOpenedAt:      data.lastOpenedAt       || null,
  };
}

/* ─── Lesson Completion ───────────────────────────────────────────────────── */

/**
 * Marks a lesson as complete for a student.
 * - Adds lessonId to completedLessons array
 * - Recalculates progress percentage for the subject
 * - Marks subject as complete if all lessons are done
 * - Updates lastLesson
 *
 * @param {string} uid - Firebase Auth UID
 * @param {string} lessonId - ID of the completed lesson
 * @param {string} subjectId - ID of the parent subject
 * @param {object[]} allSubjectLessons - All lessons for this subject
 * @param {object} lessonData - Basic lesson data to store in lastLesson
 * @returns {Promise<{ progressPct: number, isSubjectComplete: boolean }>}
 */
export async function markLessonComplete(uid, lessonId, subjectId, allSubjectLessons, lessonData = {}) {
  if (!uid || !lessonId || !subjectId) return;

  const userRef  = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};

  const completedLessons  = userData.completedLessons  || [];
  const completedSubjects = userData.completedSubjects  || [];

  // Already completed — skip
  if (completedLessons.includes(lessonId)) {
    return { progressPct: 100, isSubjectComplete: false };
  }

  const newCompleted = [...completedLessons, lessonId];

  // Calculate subject progress percentage
  const totalInSubject    = allSubjectLessons.length || 1;
  const doneInSubject     = allSubjectLessons.filter(l => newCompleted.includes(l.id)).length;
  const progressPct       = Math.min(100, Math.round((doneInSubject / totalInSubject) * 100));
  const isSubjectComplete = doneInSubject >= totalInSubject;

  const updates = {
    completedLessons:          arrayUnion(lessonId),
    [`progress.${subjectId}`]: progressPct,
    lastLesson: {
      id:          lessonId,
      title:       lessonData.title        || '',
      subjectId,
      subjectName: lessonData.subjectName  || '',
      thumbnail:   lessonData.thumbnail    || '',
    },
    lastOpenedAt: serverTimestamp(),
    updatedAt:    serverTimestamp(),
  };

  if (isSubjectComplete && !completedSubjects.includes(subjectId)) {
    updates.completedSubjects = arrayUnion(subjectId);
  }

  await updateDoc(userRef, updates);

  return { progressPct, isSubjectComplete };
}

/* ─── Current / Last Lesson Tracking ─────────────────────────────────────── */

/**
 * Saves the currently opened lesson to the user's Firestore document.
 * Used to power the "Continue Learning" button on the Dashboard.
 *
 * @param {string} uid
 * @param {object} lesson - { id, title, subjectId, subjectName, thumbnail }
 */
export async function saveLastOpenedLesson(uid, lesson) {
  if (!uid || !lesson?.id) return;
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    lastLesson: {
      id:          lesson.id,
      title:       lesson.title        || '',
      subjectId:   lesson.subjectId    || '',
      subjectName: lesson.subjectName  || '',
      thumbnail:   lesson.thumbnail    || '',
    },
    lastOpenedAt: serverTimestamp(),
  }).catch(() => {}); // Non-blocking — don't show error to user
}

/* ─── Progress Calculation Helpers ───────────────────────────────────────── */

/**
 * Calculates overall completion percentage across all subjects.
 * @param {string[]} completedLessons - User's completed lesson IDs
 * @param {number} totalLessons - Total lessons across all user's subjects
 * @returns {number} - 0–100
 */
export function calcOverallProgress(completedLessons = [], totalLessons = 0) {
  if (totalLessons === 0) return 0;
  return Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
}
