/**
 * useLessons.js
 * ============================================================================
 * Reusable hook for fetching subject lessons from Firestore.
 * Enriches each lesson with: unlocked, completed, isCurrent flags.
 * Used by SubjectDetails and LessonPage sidebar.
 * ============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { getLessonsBySubject, enrichLessonsWithProgress } from '../services/lessonService';

/**
 * @param {string} subjectId - Firestore subject document ID
 * @param {string[]} completedLessons - User's completed lesson IDs from Firestore
 * @returns {{ lessons: object[], loading: boolean, error: string|null, refetch: Function }}
 */
export function useLessons(subjectId, completedLessons = []) {
  const [rawLessons, setRawLessons] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = async () => {
    if (!subjectId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await getLessonsBySubject(subjectId);
      setRawLessons(data);
    } catch (err) {
      console.error('[useLessons] Error:', err);
      setError('تعذّر تحميل الدروس. يرجى المحاولة مجدداً.');
      setRawLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!subjectId) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const data = await getLessonsBySubject(subjectId);
        if (!cancelled) setRawLessons(data);
      } catch (err) {
        if (!cancelled) {
          console.error('[useLessons] Error:', err);
          setError('تعذّر تحميل الدروس. يرجى المحاولة مجدداً.');
          setRawLessons([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [subjectId]);

  // Re-compute unlock/completion status whenever completedLessons changes
  const lessons = useMemo(
    () => enrichLessonsWithProgress(rawLessons, completedLessons),
    [rawLessons, completedLessons]
  );

  return { lessons, loading, error, refetch: load };
}
