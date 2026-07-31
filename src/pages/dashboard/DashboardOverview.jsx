import React from 'react';
import { useUserSession } from '../../context/UserSessionContext';
import {
  Sparkles,
  Play,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  Flame,
  BarChart2,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ChevronLeft
} from 'lucide-react';

const WEEK_DAYS = [
  { day: 'السبت', subject: 'الأحياء', time: '04:00 م', status: 'done' },
  { day: 'الأحد', subject: 'الفيزياء', time: '05:30 م', status: 'done' },
  { day: 'الإثنين', subject: 'الكيمياء', time: '04:00 م', status: 'today' },
  { day: 'الثلاثاء', subject: 'الرياضيات', time: '06:00 م', status: 'upcoming' },
  { day: 'الأربعاء', subject: 'اللغة العربية', time: '04:30 م', status: 'upcoming' },
  { day: 'الخميس', subject: 'اختبار شمول', time: '07:00 م', status: 'upcoming' },
  { day: 'الجمعة', subject: 'راحة ومراجعة', time: '—', status: 'rest' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: 'أتممت درس "الانقسام الميوزي والخلايا الحية"',
    type: 'lesson',
    time: 'منذ ساعتين',
    points: '+50 نقطة',
    color: '#00e676',
  },
  {
    id: 2,
    title: 'حصلت على درجة 95% في "اختبار الفيزياء التجريبي"',
    type: 'exam',
    time: 'أمس الساعة 8:30 م',
    points: '+120 نقطة',
    color: '#38bdf8',
  },
  {
    id: 3,
    title: 'فتحت وسام "المستكشف المتميز" للتفوق المستمر',
    type: 'badge',
    time: 'منذ 3 أيام',
    points: '+200 نقطة',
    color: '#fbbf24',
  },
  {
    id: 4,
    title: 'أنهيت 25 سؤالاً في بنك أسئلة الكيمياء العضوية',
    type: 'practice',
    time: 'منذ 4 أيام',
    points: '+80 نقطة',
    color: '#c084fc',
  },
];

export default function DashboardOverview() {
  const { currentUser, userProfile, selectedGrade, selectedPath, selectedSpecialization } = useUserSession();

  // Resolve first name from Firestore fullName or Auth displayName
  const fullName = userProfile?.fullName || currentUser?.displayName || '';
  const firstName = fullName.trim().split(' ')[0] || 'طالب';

  const getGradeName = () => {
    const g = userProfile?.grade || selectedGrade;
    if (g === 'grade-1') return 'الصف الأول الثانوي';
    if (g === 'grade-2') return 'الصف الثاني الثانوي';
    if (g === 'grade-3') return 'الصف الثالث الثانوي';
    return null;
  };

  const getPathName = () => {
    const p = userProfile?.path || selectedPath;
    const map = {
      medicine: 'مسار الطب وعلوم الحياة',
      engineering: 'مسار الهندسة وعلوم الحاسب',
      arts: 'مسار الآداب والفنون',
      business: 'مسار إدارة الأعمال',
    };
    return map[p] || null;
  };

  const getSpecializationName = () => userProfile?.specialization || selectedSpecialization || null;

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
              <span className="streak-num">7 أيام</span>
              <span className="streak-lbl">حماس مستمر!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Top Section Grid: Continue Lesson + Progress */}
      <div className="dash-grid-top">

        {/* Card 1: Continue Last Lesson */}
        <div className="dash-card continue-lesson-card">
          <div className="dash-card-header">
            <div className="dash-card-tag green">
              <BookOpen size={16} />
              <span>استكمال آخر درس</span>
            </div>
            <span className="lesson-time-rem">
              <Clock size={14} /> 15 دقيقة متبقية
            </span>
          </div>

          <div className="dash-lesson-details">
            <h3 className="dash-lesson-title">التركيب الخلوي وتضاعف الحمض النووي (DNA)</h3>
            <p className="dash-lesson-sub">المادة: الأحياء • الوحدة الثالثة: علم الجينات</p>

            <div className="dash-lesson-progress">
              <div className="dash-progress-text">
                <span>نسبة إكمال الدرس</span>
                <span className="progress-perc">72%</span>
              </div>
              <div className="dash-progress-track">
                <div className="dash-progress-fill" style={{ width: '72%' }} />
              </div>
            </div>
          </div>

          <div className="dash-lesson-actions">
            <button type="button" className="btn-primary dash-continue-btn">
              <Play size={18} fill="#040806" />
              <span>متابعة التعلم</span>
            </button>
            <span className="dash-next-topic">الدرس التالي: "الترجمة والتنسيق البروتيني"</span>
          </div>
        </div>

        {/* Card 2: Overall Progress Card */}
        <div className="dash-card progress-card">
          <div className="dash-card-header">
            <div className="dash-card-tag blue">
              <TrendingUp size={16} />
              <span>نسبة التقدم الأكاديمي</span>
            </div>
            <span className="dash-badge-glow">ممتاز 🔥</span>
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
                  style={{ strokeDashoffset: '40' }}
                />
              </svg>
              <div className="gauge-content">
                <span className="gauge-number">84%</span>
                <span className="gauge-label">إنجاز كلي</span>
              </div>
            </div>

            <div className="dash-subject-bars">
              <div className="subj-bar-item">
                <div className="subj-info">
                  <span>الأحياء</span>
                  <span>92%</span>
                </div>
                <div className="subj-track"><div className="subj-fill" style={{ width: '92%', background: '#00e676' }} /></div>
              </div>

              <div className="subj-bar-item">
                <div className="subj-info">
                  <span>الفيزياء</span>
                  <span>78%</span>
                </div>
                <div className="subj-track"><div className="subj-fill" style={{ width: '78%', background: '#38bdf8' }} /></div>
              </div>

              <div className="subj-bar-item">
                <div className="subj-info">
                  <span>الكيمياء</span>
                  <span>85%</span>
                </div>
                <div className="subj-track"><div className="subj-fill" style={{ width: '85%', background: '#c084fc' }} /></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3 Middle Section Grid: Learning Stats + Upcoming Exam */}
      <div className="dash-grid-mid">

        {/* Card 3: Learning Stats */}
        <div className="dash-card stats-card">
          <div className="dash-card-header">
            <div className="dash-card-tag amber">
              <BarChart2 size={16} />
              <span>إحصائيات التعلم</span>
            </div>
            <button type="button" className="dash-text-link">
              عرض التفاصيل <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="dash-stats-items-grid">
            <div className="stat-box-item">
              <div className="stat-box-icon green">
                <Clock size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">42 ساعة</span>
                <span className="stat-box-lbl">وقت الدراسة</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon blue">
                <FileText size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">340 سؤالاً</span>
                <span className="stat-box-lbl">تمت إجابته</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon amber">
                <Flame size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">7 أيام</span>
                <span className="stat-box-lbl">سلسلة الحماس</span>
              </div>
            </div>

            <div className="stat-box-item">
              <div className="stat-box-icon purple">
                <Award size={20} />
              </div>
              <div className="stat-box-info">
                <span className="stat-box-val">المرتبة #4</span>
                <span className="stat-box-lbl">ترتيب الدفعة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming Exam */}
        <div className="dash-card exam-card">
          <div className="dash-card-header">
            <div className="dash-card-tag purple">
              <Calendar size={16} />
              <span>الاختبار القادم</span>
            </div>
            <span className="exam-countdown-badge">بعد يومين ⏳</span>
          </div>

          <div className="dash-exam-body">
            <h3 className="dash-exam-title">اختبار الأحياء النصفي — الشامل</h3>
            <p className="dash-exam-meta">
              <span>🗓️ الأحد، 3 أغسطس 2026</span>
              <span>⏰ 04:00 مساءً</span>
            </p>
            <div className="dash-exam-pills">
              <span>🎯 25 سؤالاً</span>
              <span>⏱️ 45 دقيقة</span>
              <span>💯 100 درجة</span>
            </div>
          </div>

          <button type="button" className="btn-secondary dash-exam-btn">
            <span>استعد ومارس المراجعة</span>
            <ChevronLeft size={16} />
          </button>
        </div>

      </div>

      {/* 4 Bottom Section Grid: Weekly Schedule + Recent Activity */}
      <div className="dash-grid-bottom">

        {/* Card 5: Weekly Schedule */}
        <div className="dash-card schedule-card">
          <div className="dash-card-header">
            <div className="dash-card-tag green">
              <Calendar size={16} />
              <span>جدول الأسبوع</span>
            </div>
            <span className="schedule-week-lbl">الأسبوع 4 • الفصل الأول</span>
          </div>

          <div className="dash-schedule-list">
            {WEEK_DAYS.map((item, idx) => (
              <div
                key={idx}
                className={`schedule-row ${item.status === 'today' ? 'is-today' : ''}`}
              >
                <div className="sched-day-col">
                  <span className="sched-day-name">{item.day}</span>
                  {item.status === 'today' && <span className="today-badge">اليوم</span>}
                </div>

                <div className="sched-subj-col">
                  <span className="sched-subj-name">{item.subject}</span>
                </div>

                <div className="sched-time-col">
                  <span>{item.time}</span>
                </div>

                <div className="sched-status-col">
                  {item.status === 'done' && (
                    <span className="status-chip done"><CheckCircle2 size={14} /> مكتمل</span>
                  )}
                  {item.status === 'today' && (
                    <span className="status-chip active"><Play size={12} fill="currentColor" /> مباشر</span>
                  )}
                  {item.status === 'upcoming' && (
                    <span className="status-chip upcoming">قادم</span>
                  )}
                  {item.status === 'rest' && (
                    <span className="status-chip rest">عطلة</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Recent Activities */}
        <div className="dash-card activity-card">
          <div className="dash-card-header">
            <div className="dash-card-tag blue">
              <Award size={16} />
              <span>آخر النشاطات</span>
            </div>
          </div>

          <div className="dash-activity-timeline">
            {RECENT_ACTIVITIES.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="act-dot" style={{ background: act.color, boxShadow: `0 0 10px ${act.color}` }} />
                <div className="act-info">
                  <h4 className="act-title">{act.title}</h4>
                  <div className="act-meta">
                    <span className="act-time">{act.time}</span>
                    <span className="act-points" style={{ color: act.color }}>{act.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
