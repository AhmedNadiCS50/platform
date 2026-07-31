import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { updateUserDocument } from '../../services/firestoreService';
import { getSubjectsByPath } from '../../services/contentService';
import {
  User, Mail, GraduationCap, Compass, BookOpen, Award, CheckCircle,
  FileCheck2, Clock, Settings, Shield, Bell, Palette, ChevronLeft,
  Camera, Copy, Check, Edit3, X, Sliders, Loader2, TrendingUp, AlertCircle,
} from 'lucide-react';
import './ProfilePage.css';

/* ─── Mapping helpers ────────────────────────────────────────────────────── */
const PATH_LABELS = {
  medicine: { title: 'مسار الطب والعلوم الصحية', color: '#00e676', bg: 'rgba(0, 230, 118, 0.12)' },
  engineering: { title: 'مسار الهندسة والتكنولوجيا', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  arts: { title: 'مسار الإنسانيات والفنون', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
  business: { title: 'مسار إدارة الأعمال والاقتصاد', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
};

const GRADE_LABELS = {
  'grade-1': 'الصف الأول الثانوي',
  'grade-2': 'الصف الثاني الثانوي',
  'grade-3': 'الصف الثالث الثانوي',
};

export default function ProfilePage() {
  const { currentUser, userProfile, selectedGrade, selectedPath, selectedSpecialization } = useUserSession();

  const [copiedEmail, setCopiedEmail]   = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName]         = useState('');
  const [savingEdit, setSavingEdit]     = useState(false);
  const [editError, setEditError]       = useState('');

  // Subjects for progress calculation
  const [userSubjects, setUserSubjects]   = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Resolve user info — Firestore first, Auth fallback
  const userName     = userProfile?.fullName  || currentUser?.displayName || 'طالب';
  const userEmail    = userProfile?.email     || currentUser?.email       || '—';
  const userInitials = userName.trim().substring(0, 2);

  // Resolve academic data — strictly from Firestore
  const resolvedGrade  = userProfile?.grade          || selectedGrade;
  const resolvedPath   = userProfile?.path           || selectedPath;
  const resolvedSpec   = userProfile?.specialization || selectedSpecialization;

  const pathConfig         = PATH_LABELS[resolvedPath]  || null;
  const gradeText          = GRADE_LABELS[resolvedGrade] || '—';
  const specializationText = resolvedSpec               || '—';

  // Real metrics from Firestore profile
  const completedLessonsCount  = userProfile?.completedLessons?.length  || 0;
  const completedQuizzesCount  = userProfile?.completedQuizzes?.length  || 0;

  // Load subjects to compute total lessons for progress %
  useEffect(() => {
    let isMounted = true;
    async function loadSubjects() {
      if (!resolvedPath) { setLoadingProfile(false); return; }
      const subs = await getSubjectsByPath(resolvedPath);
      if (isMounted) {
        setUserSubjects(subs);
        setLoadingProfile(false);
      }
    }
    loadSubjects();
    return () => { isMounted = false; };
  }, [resolvedPath]);

  const totalLessons = userSubjects.reduce((acc, sub) => acc + (sub.lessonsCount || 0), 0) || 1;
  const completionPct = Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100));

  // Estimated learning time: each lesson ≈ 30 min
  const learningHours = ((completedLessonsCount * 30) / 60).toFixed(1);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(userEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleOpenEditModal = () => {
    setEditName(userName);
    setEditError('');
    setEditModalOpen(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) { setEditError('الاسم لا يمكن أن يكون فارغاً'); return; }
    if (!currentUser?.uid) return;
    setSavingEdit(true);
    setEditError('');
    try {
      await updateUserDocument(currentUser.uid, { fullName: editName.trim() });
      setEditModalOpen(false);
      // Force UI refresh by reloading (UserSessionContext will re-fetch on next auth event)
      // Soft: just close modal — data will update on next re-render from context
    } catch (err) {
      setEditError('حدث خطأ أثناء الحفظ. يرجى المحاولة مجدداً.');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loadingProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
        <Loader2 size={26} className="spin-icon" />
        <span>جاري تحميل بياناتك الشخصية من Firestore...</span>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* ── 1. Hero Profile Banner ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-user-left">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-inner">
                <span>{userInitials}</span>
              </div>
              <button
                type="button"
                className="profile-avatar-edit-btn"
                onClick={handleOpenEditModal}
                title="تعديل البيانات الشخصية"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="profile-user-details">
              <div className="profile-name-row">
                <h1 className="profile-user-name">{userName}</h1>
                {userProfile?.completedLessons?.length >= 10 && (
                  <span className="profile-pro-badge">PRO</span>
                )}
              </div>

              <div className="profile-user-email">
                <Mail size={15} />
                <span>{userEmail}</span>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  onClick={handleCopyEmail}
                  title="نسخ البريد الإلكتروني"
                >
                  {copiedEmail ? <Check size={14} color="#00e676" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <button
              type="button"
              className="profile-btn-edit"
              onClick={handleOpenEditModal}
            >
              <Edit3 size={16} />
              <span>تعديل الاسم</span>
            </button>
            <Link to="/dashboard/settings" className="profile-btn-settings">
              <Settings size={16} />
              <span>الإعدادات</span>
            </Link>
          </div>
        </div>

        {/* Academic Details Breakdown */}
        <div className="profile-academic-grid">
          <div className="academic-info-card">
            <div className="academic-icon-box">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="academic-label">الصف الدراسي</span>
              <span className="academic-value">{gradeText}</span>
            </div>
          </div>

          <div className="academic-info-card">
            <div
              className="academic-icon-box"
              style={pathConfig ? { background: pathConfig.bg, borderColor: `${pathConfig.color}44`, color: pathConfig.color } : {}}
            >
              <Compass size={22} />
            </div>
            <div>
              <span className="academic-label">المسار التعليمي</span>
              <span className="academic-value" style={pathConfig ? { color: pathConfig.color } : {}}>
                {pathConfig?.title || '—'}
              </span>
            </div>
          </div>

          <div className="academic-info-card">
            <div className="academic-icon-box" style={{ background: 'rgba(192, 132, 252, 0.12)', borderColor: 'rgba(192, 132, 252, 0.3)', color: '#c084fc' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <span className="academic-label">المادة الاختيارية (التخصص)</span>
              <span className="academic-value">{specializationText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Progress Overview Card ── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            <TrendingUp size={22} />
            نسبة الإنجاز الأكاديمي
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--green-neon)', fontWeight: 'bold' }}>
            {completionPct}% مكتمل
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Progress bar */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>الدروس المكتملة: {completedLessonsCount} من {totalLessons}</span>
              <span>{completionPct}%</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${completionPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00e676, #00b248)',
                  boxShadow: '0 0 12px rgba(0,230,118,0.5)',
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>

          {/* Subjects breakdown */}
          {userSubjects.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '200px' }}>
              {userSubjects.slice(0, 3).map((sub) => (
                <div key={sub.id} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span>{sub.title}</span>
                  <span style={{ color: sub.color || 'var(--green-neon)' }}>{sub.progress || 0}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Key Stats Metric Cards ── */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-icon-wrap green">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="stat-val-num">{completedLessonsCount}</span>
            <span className="stat-val-lbl">الدروس المكتملة</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap blue">
            <FileCheck2 size={24} />
          </div>
          <div>
            <span className="stat-val-num">{completedQuizzesCount}</span>
            <span className="stat-val-lbl">اختبارات مجتازة</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap amber">
            <Award size={24} />
          </div>
          <div>
            <span className="stat-val-num">{completedLessonsCount * 50 + completedQuizzesCount * 100}</span>
            <span className="stat-val-lbl">إجمالي النقاط المكتسبة</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap purple">
            <Clock size={24} />
          </div>
          <div>
            <span className="stat-val-num">{learningHours} ساعة</span>
            <span className="stat-val-lbl">وقت التعلم التقديري</span>
          </div>
        </div>
      </div>

      {/* ── 4. Achievements Section ── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            <Award size={22} />
            الإنجازات المكتسبة
          </h2>
        </div>

        {completedLessonsCount === 0 && completedQuizzesCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,230,118,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--green-neon)' }}>
              <AlertCircle size={26} />
            </div>
            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>لا توجد إنجازات حتى الآن.</p>
            <p style={{ fontSize: '0.85rem' }}>أكمل دروسك واجتز اختباراتك لتحصل على أوسمة الإنجاز!</p>
          </div>
        ) : (
          <div className="achievements-grid">
            {completedLessonsCount >= 1 && (
              <div className="achievement-card unlocked">
                <div className="achievement-badge-icon"><span>📖</span></div>
                <div className="achievement-content">
                  <h3 className="achievement-name">بداية الرحلة</h3>
                  <p className="achievement-desc">أتممت درسك الأول بنجاح.</p>
                  <span className="achievement-date">مكتمل</span>
                </div>
              </div>
            )}
            {completedLessonsCount >= 5 && (
              <div className="achievement-card unlocked">
                <div className="achievement-badge-icon"><span>🔥</span></div>
                <div className="achievement-content">
                  <h3 className="achievement-name">المثابر</h3>
                  <p className="achievement-desc">أتممت 5 دروس متكاملة.</p>
                  <span className="achievement-date">مكتمل</span>
                </div>
              </div>
            )}
            {completedLessonsCount >= 10 && (
              <div className="achievement-card unlocked">
                <div className="achievement-badge-icon"><span>⭐</span></div>
                <div className="achievement-content">
                  <h3 className="achievement-name">المتميز</h3>
                  <p className="achievement-desc">أتممت 10 دروس — أنت في المسار الصحيح!</p>
                  <span className="achievement-date">مكتمل</span>
                </div>
              </div>
            )}
            {completedQuizzesCount >= 1 && (
              <div className="achievement-card unlocked">
                <div className="achievement-badge-icon"><span>🎯</span></div>
                <div className="achievement-content">
                  <h3 className="achievement-name">أول اختبار مكتمل</h3>
                  <p className="achievement-desc">اجتزت اختبارك الأول بنجاح.</p>
                  <span className="achievement-date">مكتمل</span>
                </div>
              </div>
            )}
            {completedQuizzesCount >= 3 && (
              <div className="achievement-card unlocked">
                <div className="achievement-badge-icon"><span>🏆</span></div>
                <div className="achievement-content">
                  <h3 className="achievement-name">بطل الاختبارات</h3>
                  <p className="achievement-desc">اجتزت 3 اختبارات مختلفة.</p>
                  <span className="achievement-date">مكتمل</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 5. Quick Settings Shortcuts ── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            <Sliders size={22} />
            اختصارات الإعدادات والتفضيلات
          </h2>
        </div>

        <div className="settings-shortcut-grid">
          <Link to="/dashboard/settings" className="settings-shortcut-card">
            <div className="shortcut-left">
              <div className="shortcut-icon-box">
                <Shield size={20} />
              </div>
              <div>
                <span className="shortcut-info-title">أمان الحساب وتغيير كلمة المرور</span>
                <span className="shortcut-info-desc">إدارة حماية الحساب والمصادقة</span>
              </div>
            </div>
            <ChevronLeft size={20} className="shortcut-arrow" />
          </Link>

          <Link to="/dashboard/settings" className="settings-shortcut-card">
            <div className="shortcut-left">
              <div className="shortcut-icon-box" style={{ background: 'rgba(0, 230, 118, 0.12)', borderColor: 'rgba(0, 230, 118, 0.3)', color: '#00e676' }}>
                <Bell size={20} />
              </div>
              <div>
                <span className="shortcut-info-title">إعدادات الإشعارات والتنبيهات</span>
                <span className="shortcut-info-desc">تخصيص تذكيرات الدروس والاختبارات</span>
              </div>
            </div>
            <ChevronLeft size={20} className="shortcut-arrow" />
          </Link>

          <Link to="/select-path" className="settings-shortcut-card">
            <div className="shortcut-left">
              <div className="shortcut-icon-box" style={{ background: 'rgba(251, 191, 36, 0.12)', borderColor: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }}>
                <Compass size={20} />
              </div>
              <div>
                <span className="shortcut-info-title">تغيير المسار الأكاديمي</span>
                <span className="shortcut-info-desc">التبديل بين المسار الطبي، الهندسي أو الأدبي</span>
              </div>
            </div>
            <ChevronLeft size={20} className="shortcut-arrow" />
          </Link>

          <Link to="/dashboard/settings" className="settings-shortcut-card">
            <div className="shortcut-left">
              <div className="shortcut-icon-box" style={{ background: 'rgba(192, 132, 252, 0.12)', borderColor: 'rgba(192, 132, 252, 0.3)', color: '#c084fc' }}>
                <Palette size={20} />
              </div>
              <div>
                <span className="shortcut-info-title">تخصيص نسق الواجهة والألوان</span>
                <span className="shortcut-info-desc">النمط الليلي الخارق والخطوط</span>
              </div>
            </div>
            <ChevronLeft size={20} className="shortcut-arrow" />
          </Link>
        </div>
      </div>

      {/* ── Edit Name Modal ── */}
      {editModalOpen && (
        <div className="quiz-modal-overlay">
          <div className="quiz-modal-card" style={{ maxWidth: '480px' }}>
            <div className="question-card-header" style={{ width: '100%' }}>
              <h3 className="quiz-modal-title" style={{ fontSize: '1.2rem' }}>تعديل الاسم الكامل</h3>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', textAlign: 'start' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>الاسم الكامل</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="hw-answer-input"
                  style={{ height: '44px', padding: '0 0.9rem' }}
                  placeholder="أدخل اسمك الكامل"
                />
                {editError && (
                  <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.4rem' }}>{editError}</p>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="hw-answer-input"
                  style={{ height: '44px', padding: '0 0.9rem', opacity: 0.6 }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.3rem', display: 'block' }}>لا يمكن تغيير البريد الإلكتروني مباشرةً. استخدم صفحة الإعدادات.</span>
              </div>
            </div>

            <div className="quiz-modal-actions">
              <button
                type="button"
                className="quiz-modal-btn cancel"
                onClick={() => setEditModalOpen(false)}
                disabled={savingEdit}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="quiz-modal-btn confirm"
                onClick={handleSaveName}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  'حفظ التغييرات في Firestore'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
