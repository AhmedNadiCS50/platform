import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { getSubjectById, getSubjectLessons } from '../../services/contentService';
import { ArrowRight, Play, CheckCircle, Clock, BookOpen, Lock, Loader2 } from 'lucide-react';

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, selectedPath } = useUserSession();

  const [subject, setSubject] = useState(null);
  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const activePathKey = userProfile?.path || selectedPath || 'medicine';

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [subData, lesData] = await Promise.all([
        getSubjectById(id, activePathKey),
        getSubjectLessons(id),
      ]);
      if (isMounted) {
        setSubject(subData);
        setLessons(lesData);
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id, activePathKey]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
        <Loader2 size={26} className="spin-icon" />
        <span>جاري تحميل تفاصيل المادة والدروس من Firestore...</span>
      </div>
    );
  }

  if (!subject) return null;

  const Icon = subject.icon || BookOpen;

  // Group lessons by unit
  const unitsMap = lessons.reduce((acc, lesson) => {
    const uTitle = lesson.unitTitle || 'الوحدة الأولى: المفاهيم الأساسية';
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
          <h1 className="banner-title">{subject.title}</h1>
          <p className="banner-desc">{subject.description}</p>
          <div className="banner-stats-row">
            <span>📚 {lessons.length || subject.lessonsCount} درسًا معتمدًا</span>
            <span>⚡ نسبة إنجازك: {subject.progress || 0}%</span>
          </div>
        </div>
      </div>

      {/* Course Units & Lessons List */}
      <div className="units-list-section">
        <h2 className="units-heading">منهج المادة والدروس المتاحة</h2>
        <div className="units-accordion-group">
          {unitsList.map((unit, uIdx) => (
            <div key={uIdx} className="unit-card">
              <h3 className="unit-title">{unit.unitTitle}</h3>
              <div className="lessons-group">
                {unit.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`lesson-row ${lesson.current ? 'is-current' : ''} ${lesson.locked ? 'is-locked' : ''}`}
                    onClick={() => {
                      if (lesson.locked) return;
                      if (lesson.isQuiz) navigate(`/quiz/${lesson.quizId || 'biology-quiz-1'}`);
                      else navigate(`/dashboard/lesson/${lesson.id}`);
                    }}
                    style={{ cursor: lesson.locked ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="lesson-left">
                      {lesson.completed && <CheckCircle size={20} className="icon-done" />}
                      {!lesson.completed && !lesson.locked && <Play size={20} className="icon-current" fill="currentColor" />}
                      {lesson.locked && <Lock size={20} className="icon-locked" />}
                      <span className="lesson-name">{lesson.title}</span>
                    </div>

                    <div className="lesson-right">
                      <span className="lesson-time"><Clock size={14} /> {lesson.duration}</span>
                      {!lesson.locked && (
                        <button type="button" className="btn-primary lesson-start-btn">
                          <span>متابعة الدرس</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
