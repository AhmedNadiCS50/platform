import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { getSubjectById } from '../../services/subjectService';
import { useLessons } from '../../hooks/useLessons';
import {
  ArrowRight, Play, CheckCircle, Clock, BookOpen, Lock, Loader2,
  Globe, Calculator, Atom, Zap, ScrollText, Brain, Code2, FlaskConical, AlertCircle
} from 'lucide-react';

const ICON_MAP = {
  BookOpen, Globe, Calculator, Atom, Zap, ScrollText, Brain, Code2, FlaskConical,
};

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useUserSession();

  const [subject, setSubject] = useState(null);
  const [loadingSubject, setLoadingSubject] = useState(true);

  const completedLessons = userProfile?.completedLessons || [];
  const { lessons, loading: loadingLessons } = useLessons(id, completedLessons);

  useEffect(() => {
    let isMounted = true;
    async function loadSub() {
      setLoadingSubject(true);
      try {
        const subData = await getSubjectById(id);
        if (isMounted) setSubject(subData);
      } catch (err) {
        console.error('[SubjectDetails] Error loading subject:', err);
      } finally {
        if (isMounted) setLoadingSubject(false);
      }
    }
    loadSub();
    return () => { isMounted = false; };
  }, [id]);

  const loading = loadingSubject || loadingLessons;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
        <Loader2 size={26} className="spin-icon" />
        <span>جاري تحميل تفاصيل المادة والدروس من Firestore...</span>
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={40} style={{ margin: '0 auto 1rem', display: 'block', color: '#ef4444' }} />
        <h3>المادة غير موجودة</h3>
        <button type="button" className="back-to-subjects-btn" onClick={() => navigate('/dashboard/subjects')} style={{ marginTop: '1rem' }}>
          <ArrowRight size={18} />
          <span>العودة لجميع المواد</span>
        </button>
      </div>
    );
  }

  const Icon = typeof subject.icon === 'string'
    ? (ICON_MAP[subject.icon] || BookOpen)
    : (subject.icon || BookOpen);

  const subjectProgress = userProfile?.progress?.[id] || 0;
  const subjectTitle = subject.name || subject.title;

  // Group lessons by unit if unitTitle exists, otherwise single unit
  const unitsMap = lessons.reduce((acc, lesson) => {
    const uTitle = lesson.unitTitle || 'محتوى المادة والدروس المتزامنة';
    if (!acc[uTitle]) acc[uTitle] = [];
    acc[uTitle].push(lesson);
    return acc;
  }, {});

  const unitsList = Object.entries(unitsMap).map(([unitTitle, unitLessons]) => ({
    unitTitle,
    lessons: unitLessons,
  }));

  return (
    <div className="subject-details-container">
      {/* Back button */}
      <button
        type="button"
        className="back-to-subjects-btn"
        onClick={() => navigate('/dashboard/subjects')}
      >
        <ArrowRight size={18} />
        <span>العودة لجميع المواد</span>
      </button>

      {/* Hero Banner */}
      <div
        className="subject-banner-card"
        style={{
          '--subj-color': subject.color || 'var(--green-neon)',
          '--subj-glow': subject.glow || 'rgba(0, 230, 118, 0.3)',
          '--subj-accent': subject.accent || 'rgba(0, 230, 118, 0.1)',
        }}
      >
        <div className="banner-content">
          <div className="banner-icon-badge">
            <Icon size={36} />
          </div>
          <h1 className="banner-title">{subjectTitle}</h1>
          <p className="banner-desc">{subject.description}</p>
          <div className="banner-stats-row">
            <span>📚 {lessons.length || subject.lessonsCount || 0} درسًا معتمدًا</span>
            <span>⚡ نسبة إنجازك: {subjectProgress}%</span>
          </div>
        </div>
      </div>

      {/* Course Units & Lessons List */}
      <div className="units-list-section">
        <h2 className="units-heading">منهج المادة والدروس المتاحة</h2>
        {lessons.length === 0 ? (
          <div style={{ background: 'var(--bg-surface-2)', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>⏳ لم يقم المسؤول بمزامنة دروس هذه المادة بعد.</p>
          </div>
        ) : (
          <div className="units-accordion-group">
            {unitsList.map((unit, uIdx) => (
              <div key={uIdx} className="unit-card">
                <h3 className="unit-title">{unit.unitTitle}</h3>
                <div className="lessons-group">
                  {unit.lessons.map((lesson) => {
                    const isLocked = !lesson.unlocked;
                    return (
                      <div
                        key={lesson.id}
                        className={`lesson-row ${lesson.isCurrent ? 'is-current' : ''} ${isLocked ? 'is-locked' : ''}`}
                        onClick={() => {
                          if (isLocked) return;
                          if (lesson.isQuiz) navigate(`/quiz/${lesson.quizId || 'biology-quiz-1'}`);
                          else navigate(`/dashboard/lesson/${lesson.id}`);
                        }}
                        style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                      >
                        <div className="lesson-left">
                          {lesson.completed && <CheckCircle size={20} className="icon-done" />}
                          {!lesson.completed && !isLocked && <Play size={20} className="icon-current" fill="currentColor" />}
                          {isLocked && <Lock size={20} className="icon-locked" />}
                          <span className="lesson-name">{lesson.order ? `${lesson.order}. ` : ''}{lesson.title}</span>
                        </div>

                        <div className="lesson-right">
                          <span className="lesson-time"><Clock size={14} /> {lesson.duration}</span>
                          {!isLocked && (
                            <button type="button" className="btn-primary lesson-start-btn">
                              <span>{lesson.completed ? 'مراجعة الدرس' : 'متابعة الدرس'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
