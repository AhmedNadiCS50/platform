/**
 * useProgress.js
 * ============================================================================
 * Reusable hook for tracking student progress.
 * Wraps progressService with React state management.
 * Used by DashboardOverview and LessonPage.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import {
  markLessonComplete as markComplete,
  saveLastOpenedLesson as saveLast,
} from '../services/progressService';

/**
 * Provides progress-related actions and state for a student.
 * @param {string} uid - Firebase Auth UID
 * @returns {{ marking: boolean, markLessonComplete, saveLastOpened }}
 */
export function useProgress(uid) {
  const [marking, setMarking] = useState(false);

  /**
   * Marks a lesson as complete and updates Firestore.
   * @param {string} lessonId
   * @param {string} subjectId
   * @param {object[]} allSubjectLessons
   * @param {object} lessonData - { title, subjectName, thumbnail }
   * @returns {Promise<{ progressPct, isSubjectComplete }>}
   */
  const markLessonComplete = useCallback(async (lessonId, subjectId, allSubjectLessons, lessonData = {}) => {
    if (!uid || marking) return;
    setMarking(true);
    try {
      const result = await markComplete(uid, lessonId, subjectId, allSubjectLessons, lessonData);
      return result;
    } finally {
      setMarking(false);
    }
  }, [uid, marking]);

  /**
   * Saves the last opened lesson to Firestore (non-blocking).
   * @param {object} lesson
   */
  const saveLastOpened = useCallback((lesson) => {
    if (!uid) return;
    saveLast(uid, lesson); // Fire-and-forget
  }, [uid]);

  return { marking, markLessonComplete, saveLastOpened };
}
