/**
 * useSubjects.js
 * ============================================================================
 * Reusable hook for fetching subjects from Firestore.
 * Used by SubjectsPage and DashboardOverview.
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { getSubjectsByGradeAndTrack } from '../services/subjectService';

/**
 * Fetches subjects for a student based on their grade and track.
 * @param {string} grade - 'grade-1' | 'grade-2' | 'grade-3'
 * @param {string} track - 'medicine' | 'engineering' | 'arts' | 'business'
 * @returns {{ subjects: object[], loading: boolean, error: string|null, refetch: Function }}
 */
export function useSubjects(grade, track) {
  const [subjects, setSubjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = async () => {
    if (!grade) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getSubjectsByGradeAndTrack(grade, track);
      setSubjects(data);
    } catch (err) {
      console.error('[useSubjects] Error:', err);
      setError('تعذّر تحميل المواد الدراسية. يرجى المحاولة مجدداً.');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!grade) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const data = await getSubjectsByGradeAndTrack(grade, track);
        if (!cancelled) setSubjects(data);
      } catch (err) {
        if (!cancelled) {
          console.error('[useSubjects] Error:', err);
          setError('تعذّر تحميل المواد الدراسية. يرجى المحاولة مجدداً.');
          setSubjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [grade, track]);

  return { subjects, loading, error, refetch: load };
}
