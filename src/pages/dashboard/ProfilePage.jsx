import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import {
  User, Mail, GraduationCap, Compass, BookOpen, Award, CheckCircle,
  FileCheck2, Clock, Flame, Settings, Shield, Bell, Palette, ChevronLeft,
  Camera, Copy, Check, Sparkles, Star, Zap, Edit3, X, Sliders
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

const SAMPLE_ACHIEVEMENTS = [
  {
    id: 1,
    title: 'بطل الكيمياء الحيوية',
    desc: 'أتممت جميع دروس واختبارات الوحدة الأولى بنجاح ساحق.',
    icon: '🧪',
    unlocked: true,
    date: 'تم الإنجاز: 28 يوليو 2026',
  },
  {
    id: 2,
    title: 'السرعة الخاطفة',
    desc: 'أنهيت اختباراً كاملاً في أقل من 10 دقائق وبدرجة 100%.',
    icon: '⚡',
    unlocked: true,
    date: 'تم الإنجاز: 25 يوليو 2026',
  },
  {
    id: 3,
    title: 'العلامة الكاملة',
    desc: 'حققت الدرجة النهائية في 3 اختبارات متتالية دون خطأ.',
    icon: '🎯',
    unlocked: true,
    date: 'تم الإنجاز: 20 يوليو 2026',
  },
  {
    id: 4,
    title: 'المثابر الذهبي',
    desc: 'حافظت على سلسلة تعلم يومية لمدة 14 يوماً متواصلاً.',
    icon: '🔥',
    unlocked: true,
    date: 'تم الإنجاز: 15 يوليو 2026',
  },
  {
    id: 5,
    title: 'قارئ الملازم الأكاديمي',
    desc: 'قم بتمحيل ومراجعة أكثر من 15 ملزمة بصيغة PDF.',
    icon: '📚',
    unlocked: false,
    date: 'قيد التقدم (12/15)',
  },
  {
    id: 6,
    title: 'عبقري المسابقات 🏆',
    desc: 'احتل المركز الأول على مستوى الصف في الاختبار النصف سنوي.',
    icon: '👑',
    unlocked: false,
    date: 'مغلق حالياً',
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { selectedGrade, selectedPath, selectedSpecialization } = useUserSession();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // User information
  const userName = 'أحمد محمد علي';
  const userEmail = 'ahmed.nadi@vision.edu.sa';

  const pathConfig = PATH_LABELS[selectedPath] || PATH_LABELS.medicine;
  const gradeText = GRADE_LABELS[selectedGrade] || 'الصف الثاني الثانوي';
  const specializationText = selectedSpecialization || 'الكيمياء الحيوية والوراثة';

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(userEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="profile-page-container">
      {/* ── 1. Hero Profile Banner ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-user-left">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-inner">
                <span>أح</span>
              </div>
              <button
                type="button"
                className="profile-avatar-edit-btn"
                onClick={() => setEditModalOpen(true)}
                title="تعديل الصورة الشخصية"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="profile-user-details">
              <div className="profile-name-row">
                <h1 className="profile-user-name">{userName}</h1>
                <span className="profile-pro-badge">PRO</span>
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
              onClick={() => setEditModalOpen(true)}
            >
              <Edit3 size={16} />
              <span>تعديل البيانات</span>
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
              style={{ background: pathConfig.bg, borderColor: `${pathConfig.color}44`, color: pathConfig.color }}
            >
              <Compass size={22} />
            </div>
            <div>
              <span className="academic-label">المسار التعليمي</span>
              <span className="academic-value" style={{ color: pathConfig.color }}>
                {pathConfig.title}
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

      {/* ── 2. Key Stats Metric Cards ── */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-icon-wrap green">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="stat-val-num">42</span>
            <span className="stat-val-lbl">الدروس المكتملة (من 56)</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap blue">
            <FileCheck2 size={24} />
          </div>
          <div>
            <span className="stat-val-num">18</span>
            <span className="stat-val-lbl">اختبارات مجتازة (متوسط 94%)</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap amber">
            <Flame size={24} />
          </div>
          <div>
            <span className="stat-val-num">14 يوماً</span>
            <span className="stat-val-lbl">سلسلة التعلم المستمر 🔥</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-wrap purple">
            <Clock size={24} />
          </div>
          <div>
            <span className="stat-val-num">68 ساعة</span>
            <span className="stat-val-lbl">إجمالي وقت التعلم</span>
          </div>
        </div>
      </div>

      {/* ── 3. Achievements Section (الإنجازات) ── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            <Award size={22} />
            سجل الإنجازات والأوسمة
          </h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--green-neon)', fontWeight: 'bold' }}>
            4 من أصل 6 أوسمة مكتملة
          </span>
        </div>

        <div className="achievements-grid">
          {SAMPLE_ACHIEVEMENTS.map((item) => (
            <div
              key={item.id}
              className={`achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-badge-icon">
                <span>{item.icon}</span>
              </div>
              <div className="achievement-content">
                <h3 className="achievement-name">{item.title}</h3>
                <p className="achievement-desc">{item.desc}</p>
                <span className="achievement-date">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Quick Settings Shortcuts (اختصارات الإعدادات) ── */}
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

      {/* ── Edit Profile Modal Placeholder ── */}
      {editModalOpen && (
        <div className="quiz-modal-overlay">
          <div className="quiz-modal-card" style={{ maxWidth: '520px' }}>
            <div className="question-card-header" style={{ width: '100%' }}>
              <h3 className="quiz-modal-title" style={{ fontSize: '1.25rem' }}>تعديل البيانات الشخصية</h3>
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
                  defaultValue={userName}
                  className="hw-answer-input"
                  style={{ height: '42px', padding: '0 0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  className="hw-answer-input"
                  style={{ height: '42px', padding: '0 0.9rem' }}
                />
              </div>
            </div>

            <div className="quiz-modal-actions">
              <button
                type="button"
                className="quiz-modal-btn cancel"
                onClick={() => setEditModalOpen(false)}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="quiz-modal-btn confirm"
                onClick={() => setEditModalOpen(false)}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
