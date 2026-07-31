import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { useSubjects } from '../../hooks/useSubjects';
import {
  Sparkles,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Flame,
  BarChart2,
  TrendingUp,
  FileText,
  Loader2,
} from 'lucide-react';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { currentUser, userProfile, selectedGrade, selectedPath, selectedSpecialization } = useUserSession();

  const activeGradeKey = userProfile?.grade || selectedGrade || 'grade-1';
  const activePathKey  = userProfile?.path  || selectedPath  || 'medicine';

  const { subjects: userSubjects, loading: loadingSubjects } = useSubjects(activeGradeKey, activePathKey);

  // Resolve first name
  const fullName = userProfile?.fullName || currentUser?.displayName || '';
  const firstName = fullName.trim().split(' ')[0] || 'طالب';

  const getGradeName = () => {
    const g = activeGradeKey;
    if (g === 'grade-1') return 'الصف الأول الثانوي';
    if (g === 'grade-2') return 'الصف الثاني الثانوي';
    if (g === 'grade-3') return 'الصف الثالث الثانوي';
    return null;
  };

  const getPathName = () => {
    const p = activePathKey;
    const map = {
      medicine: 'مسار الطب وعلوم الحياة',
      engineering: 'مسار الهندسة وعلوم الحاسب',
      arts: 'مسار الآداب والفنون',
      business: 'مسار إدارة الأعمال',
    };
    return map[p] || null;
  };

  const getSpecializationName = () => userProfile?.specialization || selectedSpecialization || null;

  // Compute real metrics from Firestore profile data
  const completedLessonsCount = userProfile?.completedLessons?.length || 0;
  const completedQuizzesCount = userProfile?.completedQuizzes?.length || 0;
  const lastLesson = userProfile?.lastLesson || null;

  // Calculate total lessons dynamically from subjects list in Firestore
  const totalLessonsCount = userSubjects.reduce((acc, sub) => acc + (sub.lessonsCount || 0), 0) || 1;
  const completionPercentage = Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100));

  // Recent real activities from Firestore (completed quizzes)
  const completedQuizzesList = userProfile?.completedQuizzes || [];

  return (
    <div className="dash-home-container">

      {/* 1. Header / Welcome Banner */}
      <div className="dash-home-welcome">
        <div className="dash-welcome-content">
          <div className="dash-welcome-badge">
            <Sparkles size={16} />
            <span>لوحة التحكم الشخصية</span>
          </div>
          <h1 className="dash-welcome-title">مرحبًا، {firstName} 👋</h1>
          <p className="dash-welcome-subtitle">
            استكمل رحلتك التعليمية اليوم وحقق أهدافك بخطوات مدروسة واحترافية.
          </p>

          <div className="dash-welcome-chips">
            {getGradeName() && <span className="dash-chip-item">{getGradeName()}</span>}
            {getPathName()  && <span className="dash-chip-item path">{getPathName()}</span>}
            {getSpecializationName() && (
              <span className="dash-chip-item spec">{getSpecializationName()}</span>
            )}
          </div>
        </div>

        <div className="dash-welcome-graphic">
          <div className="dash-graphic-circle glow-1" />
          <div className="dash-graphic-circle glow-2" />
          <div className="dash-streak-pill">
            <Flame size={20} className="flame-icon" />
            <div>
              <span className="streak-num">{completedLessonsCount > 0 ? `${completedLessonsCount} دروس` : 'ابدأ مسيرتك'}</span>
              <span className="streak-lbl">إنجاز حقيقي</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Section Grid: Continue Lesson + Progress */}
      <div className="dash-grid-top">

        {/* Card 1: Continue Last Lesson */}
        <div className="dash-card continue-lesson-card">
          <div className="dash-card-header">
            <div className="dash-card-tag green">
              <BookOpen size={16} />
              <span>آخر درس تم فتحه</span>
            </div>
            {lastLesson && (
              <span className="lesson-time-rem">
                <Clock size={14} /> {lastLesson.duration || 'درس معتمد'}
              </span>
            )}
          </div>

          <div className="dash-lesson-details">
            <h3 className="dash-lesson-title">
              {lastLesson ? lastLesson.title : 'لم تبدأ في قراءة أي درس بعد'}
            </h3>
            <p className="dash-lesson-sub">
              {lastLesson
                ? `المادة: ${lastLesson.subjectName || 'المادة الدراسية'}`
                : 'اختر مادة دراسية وابدأ في تصفح دروسك المخصصة لمسارك'}
            </p>

            <div className="dash-lesson-progress">
              <div className="dash-progress-text">
                <span>إنجاز الدروس بالمقارنة بالمنهج</span>
                <span className="progress-perc">{completionPercentage}%</span>
              </div>
              <div className="dash-progress-track">
                <div className="dash-progress-fill" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="dash-lesson-actions">
            <button
              type="button"
              className="btn-primary dash-continue-btn"
              onClick={() => {
                if (lastLesson?.id) {
                  navigate(`/dashboard/lesson/${lastLesson.id}`);
                } else {
                  navigate('/dashboard/subjects');
                }
              }}
            >
              <Play size={18} fill="#040806" />
              <span>{lastLesson ? 'استكمال التعلم' : 'تصفح المواد والدروس'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Overall Progress Card */}
        <div className="dash-card progress-card">
          <div className="dash-card-header">
            <div className="dash-card-tag blue">
              <TrendingUp size={16} />
              <span>نسبة الإنجاز الأكاديمي</span>
            </div>
            <span className="dash-badge-glow">
              {completionPercentage >= 50 ? 'ممتاز 🔥' : 'في بداية المسار 🚀'}
            </span>
          </div>

          <div className="dash-progress-main">
            <div className="dash-circle-gauge">
              <svg viewBox="0 0 100 100" className="gauge-svg">
                <circle cx="50" cy="50" r="42" className="gauge-bg" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="gauge-fill"
                  style={{ strokeDashoffset: `${264 - (264 * completionPercentage) / 100}` }}
                />
              </svg>
              <div className="gauge-content">
                <span className="gauge-number">{completionPercentage}%</span>
                <span className="gauge-label">إنجازك الفعلي</span>
              </div>
            </div>

            <div className="dash-subject-bars">
              {loadingSubjects ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Loader2 size={16} className="spin-icon" />
                  <span>جاري حساب المواد...</span>
                </div>
              ) : userSubjects.length === 0 ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>لا توجد مواد مسجلة لمسارك حتى الآن.</p>
              ) : (
                userSubjects.slice(0, 3).map((sub) => {
                  const subProg = userProfile?.progress?.[sub.id] || 0;
                  const subTitle = sub.name || sub.title;
                  return (
                    <div key={sub.id} className="subj-bar-item">
                      <div className="subj-info">
                        <span>{subTitle}</span>
                        <span>{subProg}%</span>
                      </div>
                      <div className="subj-track">
                        <div
                          className="subj-fill"
                          style={{
                            width: `${subProg}%`,
                            background: sub.color || 'var(--green-neon)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Middle Section Grid: Real Learning Stats */}
      <div className="dash-grid-mid">

        {/* Card 3: Learning Stats */}
        <div className="dash-card stats-card">
          <div className="dash-card-header">
            <div className="dash-card-tag amber">
              <BarChart2 size={16} />
              <span>إحصائياتك الحقيقية في Firestore</span>
            </div>
          </div>

          <div className="dash-stats-items-grid">
            <div className="stat-box-item">
              <div className="stat-box-icon green">
                <BookOpen size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">{userSubjects.length} مواد</span>
                <span className="stat-box-lbl">المواد المسجل بها</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon blue">
                <CheckCircle2 size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">{completedLessonsCount} دروس</span>
                <span className="stat-box-lbl">الدروس المكتملة</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon purple">
                <FileText size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">{completedQuizzesCount} اختبارات</span>
                <span className="stat-box-lbl">الاختبارات المكتملة</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon amber">
                <Award size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">{completedLessonsCount * 50 + completedQuizzesCount * 100} نقطة</span>
                <span className="stat-box-lbl">مجموع النقاط المكتسبة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Recent Real Activity */}
        <div className="dash-card activities-card">
          <div className="dash-card-header">
            <div className="dash-card-tag green">
              <Clock size={16} />
              <span>آخر أنشطتك</span>
            </div>
          </div>

          <div className="activities-list">
            {completedQuizzesList.length === 0 && !lastLesson ? (
              <div style={{ textTransform: 'none', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.95rem' }}>لا توجد أنشطة سابقة حتى الآن.</p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '0.8rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => navigate('/dashboard/subjects')}
                >
                  ابدأ مسيرتك الدراسية الآن
                </button>
              </div>
            ) : (
              <>
                {lastLesson && (
                  <div className="activity-item">
                    <div className="activity-icon green">
                      <BookOpen size={16} />
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">تصفحت درس: "{lastLesson.title}"</p>
                      <span className="activity-time">آخر تصفح</span>
                    </div>
                  </div>
                )}
                {completedQuizzesList.slice(0, 3).map((q, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon blue">
                      <FileText size={16} />
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">اجتزت اختبار بدرجة {q.percentage}% ({q.score} درجة)</p>
                      <span className="activity-time">{q.date ? new Date(q.date).toLocaleDateString('ar-EG') : 'حديثاً'}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
