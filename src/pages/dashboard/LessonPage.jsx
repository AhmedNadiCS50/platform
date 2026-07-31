import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { getLessonById } from '../../services/lessonService';
import { useLessons } from '../../hooks/useLessons';
import { useProgress } from '../../hooks/useProgress';
import './LessonPage.css';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Download, ChevronLeft, ChevronRight, MessageCircle, CheckCircle, Clock, FileText, ClipboardList,
  BookOpen, Star, Award, Loader2, Send, X, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── YouTube Embed Component ─────────────────────────────────── */
function YouTubeEmbed({ videoId, title }) {
  if (!videoId) {
    return (
      <div
        className="lesson-video-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e0c',
          color: 'var(--text-muted)',
          borderRadius: 'var(--radius-xl)',
          minHeight: '300px',
        }}
      >
        <span>عذراً، هذا الفيديو غير متوفر حالياً.</span>
      </div>
    );
  }

  return (
    <div
      className="lesson-video-container"
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 230, 118, 0.15)',
      }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

/* ─── Comment Component ────────────────────────────────────────── */
function CommentItem({ comment }) {
  return (
    <div className="lesson-comment-item">
      <div
        className="comment-avatar"
        style={{
          background: `${comment.color || '#00e676'}22`,
          border: `1.5px solid ${comment.color || '#00e676'}55`,
        }}
      >
        <span style={{ color: comment.color || '#00e676' }}>{comment.initials || 'ط'}</span>
      </div>
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-role">{comment.role || 'طالب'}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
}

/* ─── Homework Sample ───────────────────────────────────────────── */
const HOMEWORK = {
  title: 'الواجب التطبيقي للدرس',
  dueDate: 'خلال 48 ساعة',
  description: 'قم بإجابة الأسئلة التالية وتطبيق المفاهيم الواردة في مادة الدرس.',
  questions: [
    'اشرح المفاهيم الرئيسية التي وردت في الشرح بأسلوبك الخاص.',
    'اذكر ثلاث تطبيقات عملية للموضوع في الحياة اليومية.',
  ],
};

/* ─── Main LessonPage ─────────────────────────────────────────── */
export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useUserSession();

  const [lesson,        setLesson]        = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [activeTab,     setActiveTab]     = useState('desc');
  const [sidebarOpen,   setSidebarOpen]   = useState(true);

  // Homework & Comments State
  const [commentText,     setCommentText]     = useState('');
  const [comments,        setComments]        = useState([]);
  const [downloading,     setDownloading]     = useState(false);
  const [submittedHw,     setSubmittedHw]     = useState(false);

  // Progress Hook
  const completedLessons = userProfile?.completedLessons || [];
  const { markLessonComplete, saveLastOpened, marking } = useProgress(currentUser?.uid);

  // Fetch all lessons for sidebar navigation
  const { lessons: allLessons, loading: loadingAllLessons } = useLessons(lesson?.subjectId, completedLessons);

  // Load active lesson
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoadingLesson(true);
      try {
        const data = await getLessonById(id);
        if (isMounted) {
          setLesson(data);
          if (data) saveLastOpened(data);
        }
      } catch (err) {
        console.error('[LessonPage] Error loading lesson:', err);
      } finally {
        if (isMounted) setLoadingLesson(false);
      }
    }
    load();
  }, [id, saveLastOpened]);

  // Derived current lesson completion
  const isCompleted = completedLessons.includes(id);

  // Find index and next/prev lessons
  const currentIdx = allLessons.findIndex(l => l.id === id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  /* ── Handlers ── */
  const handleCompleteClick = async () => {
    if (!lesson || !currentUser?.uid) return;

    await markLessonComplete(
      lesson.id,
      lesson.subjectId,
      allLessons,
      { title: lesson.title, thumbnail: lesson.thumbnail }
    );

    // If there is a next lesson unlocked, offer navigation
    if (nextLesson && nextLesson.unlocked) {
      navigate(`/dashboard/lesson/${nextLesson.id}`);
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: userProfile?.fullName || currentUser?.displayName || 'طالب رؤية',
        initials: (userProfile?.fullName || 'ط')[0],
        role: 'طالب',
        text: commentText.trim(),
        color: '#00e676',
      },
    ]);
    setCommentText('');
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1800);
  };

  const navigateToLesson = (lessonItem) => {
    if (!lessonItem || !lessonItem.unlocked) return;
    navigate(`/dashboard/lesson/${lessonItem.id}`);
  };

  if (loadingLesson || loadingAllLessons) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
        <Loader2 size={26} className="spin-icon" />
        <span>جاري تحميل تفاصيل الدرس ومحاذاة المحتوى من Firestore...</span>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={40} style={{ margin: '0 auto 1rem', display: 'block', color: '#ef4444' }} />
        <h3>الدرس غير موجود أو تم إخفاؤه</h3>
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate('/dashboard/subjects')}
          style={{ marginTop: '1rem', display: 'inline-flex' }}
        >
          <ChevronRight size={18} />
          العودة للمواد
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Breadcrumb */}
      <nav className="lesson-breadcrumb" aria-label="breadcrumb">
        <Link to="/dashboard/subjects" className="breadcrumb-link">المواد</Link>
        <ChevronLeft size={14} className="breadcrumb-sep" />
        {lesson.subjectId && (
          <>
            <Link to={`/dashboard/subjects/${lesson.subjectId}`} className="breadcrumb-link">تفاصيل المادة</Link>
            <ChevronLeft size={14} className="breadcrumb-sep" />
          </>
        )}
        <span className="breadcrumb-current">{lesson.title}</span>
      </nav>

      {/* Main Layout */}
      <div className={`lesson-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        {/* Main Column */}
        <div className="lesson-main-col">

          {/* YouTube Embed Player */}
          <YouTubeEmbed videoId={lesson.youtubeVideoId} title={lesson.title} />

          {/* Title & Meta */}
          <div className="lesson-info-header">
            <div className="lesson-title-row">
              <h1 className="lesson-title">{lesson.title}</h1>
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen((s) => !s)}
                aria-label="تبديل الشريط الجانبي"
              >
                <BookOpen size={18} />
                <span>{sidebarOpen ? 'إخفاء القائمة' : 'عرض القائمة'}</span>
              </button>
            </div>

            <div className="lesson-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span className="lesson-meta-chip">
                <Clock size={14} />
                {lesson.duration || '—'}
              </span>
              <span className="lesson-meta-chip green">
                <Award size={14} />
                درس معتمد
              </span>
              {isCompleted ? (
                <span className="lesson-meta-chip completed" style={{ background: 'rgba(0, 230, 118, 0.15)', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.4)' }}>
                  <CheckCircle size={14} />
                  تم إكمال الدرس ✅
                </span>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCompleteClick}
                  disabled={marking}
                  style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}
                >
                  {marking ? <Loader2 size={15} className="spin-icon" /> : <CheckCircle size={15} />}
                  <span>إكمال الدرس وفتح التالي</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="lesson-tabs">
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              <FileText size={16} />
              الوصف والملحقات
            </button>
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'homework' ? 'active' : ''}`}
              onClick={() => setActiveTab('homework')}
            >
              <ClipboardList size={16} />
              الواجب
            </button>
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <MessageCircle size={16} />
              التعليقات
              <span className="tab-count">{comments.length}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="lesson-tab-content">

            {activeTab === 'desc' && (
              <div className="lesson-desc-panel">
                <div className="lesson-desc-card">
                  <h2 className="desc-heading">عن هذا الدرس</h2>
                  <p className="desc-body">
                    {lesson.description ||
                      'في هذا الدرس الشامل المتزامن من قناة المادة المعتمَدة، ستستعرض المفاهيم الأساسية والتطبيقات العملية خطوة بخطوة لضمان التفوّق المستمر.'}
                  </p>
                </div>

                <div className="lesson-objectives-card">
                  <h3 className="objectives-heading">أهداف تعلمية</h3>
                  <ul className="objectives-list">
                    {[
                      'استيعاب الشرح المرئي وتطبيق المفاهيم العلمية',
                      'القدرة على حل التمارين التفاعلية والواجبات المرتبطة',
                      'إكمال الدرس لفتح الدرس التالي وتنمية نسبة تقدمك في المادة',
                    ].map((obj, i) => (
                      <li key={i} className="objective-item">
                        <CheckCircle size={16} className="obj-icon" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lesson-pdf-card">
                  <div className="pdf-icon-wrap">
                    <FileText size={28} />
                  </div>
                  <div className="pdf-info">
                    <span className="pdf-title">ملخص وتدريبات الدرس - PDF</span>
                    <span className="pdf-size">ملف معتمد · PDF</span>
                  </div>
                  <button
                    type="button"
                    className={`btn-download-pdf ${downloading ? 'loading' : ''}`}
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <Loader2 size={16} className="spin-icon" />
                        <span>جاري التحميل…</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>تحميل PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'homework' && (
              <div className="lesson-homework-panel">
                {submittedHw ? (
                  <div className="homework-submitted">
                    <div className="submitted-icon">
                      <CheckCircle size={48} />
                    </div>
                    <h3>تم تسليم الواجب بنجاح! 🎉</h3>
                    <p>سيتم مراجعة إجابتك من قِبل المدرس وستصلك النتيجة قريباً.</p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setSubmittedHw(false)}
                    >
                      عرض الواجب مجدداً
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="homework-header-card">
                      <div className="hw-header-top">
                        <div className="hw-icon-wrap">
                          <ClipboardList size={24} />
                        </div>
                        <div>
                          <h2 className="hw-title">{HOMEWORK.title}</h2>
                          <span className="hw-due">
                            <Clock size={13} />
                            موعد التسليم: {HOMEWORK.dueDate}
                          </span>
                        </div>
                      </div>
                      <p className="hw-desc">{HOMEWORK.description}</p>
                    </div>

                    <div className="hw-questions">
                      {HOMEWORK.questions.map((q, i) => (
                        <div key={i} className="hw-question-card">
                          <span className="hw-q-num">س{i + 1}</span>
                          <p className="hw-q-text">{q}</p>
                          <textarea
                            className="hw-answer-input"
                            placeholder="اكتب إجابتك هنا…"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="hw-submit-row">
                      <div className="hw-note">
                        <AlertCircle size={15} />
                        <span>تأكد من مراجعة إجاباتك قبل التسليم النهائي.</span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary hw-submit-btn"
                        onClick={() => setSubmittedHw(true)}
                      >
                        <Send size={16} />
                        تسليم الواجب
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="lesson-comments-panel">
                <div className="comment-compose">
                  <div className="comment-avatar self-avatar">
                    <span>{(userProfile?.fullName || 'ط')[0]}</span>
                  </div>
                  <div className="compose-input-wrap">
                    <textarea
                      className="compose-textarea"
                      placeholder="شاركنا رأيك أو سؤالك عن هذا الدرس…"
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="compose-actions">
                      <button
                        type="button"
                        className="btn-send-comment"
                        onClick={handleSendComment}
                        disabled={!commentText.trim()}
                      >
                        <Send size={15} />
                        إرسال
                      </button>
                    </div>
                  </div>
                </div>

                <div className="comments-list">
                  <span className="comments-count">{comments.length} تعليق</span>
                  {comments.map((c) => (
                    <CommentItem key={c.id} comment={c} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Navigation */}
          <div className="lesson-nav-row">
            <button
              type="button"
              className="lesson-nav-btn prev-btn"
              disabled={!prevLesson || !prevLesson.unlocked}
              onClick={() => navigateToLesson(prevLesson)}
            >
              <ChevronRight size={18} />
              <div className="nav-btn-text">
                <span className="nav-btn-label">الدرس السابق</span>
                <span className="nav-btn-title">{prevLesson?.title || '—'}</span>
              </div>
            </button>

            <div className="lesson-nav-progress">
              <span className="nav-progress-text">
                {currentIdx >= 0 ? currentIdx + 1 : 1} / {allLessons.length || 1}
              </span>
              <div className="nav-progress-bar">
                <div
                  className="nav-progress-fill"
                  style={{
                    width: `${allLessons.length > 0 ? ((currentIdx + 1) / allLessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="lesson-nav-btn next-btn"
              disabled={!nextLesson || !nextLesson.unlocked}
              onClick={() => navigateToLesson(nextLesson)}
            >
              <div className="nav-btn-text">
                <span className="nav-btn-label">الدرس التالي</span>
                <span className="nav-btn-title">{nextLesson?.title || '—'}</span>
              </div>
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`lesson-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="lesson-sidebar-inner">
            <div className="lesson-sidebar-head">
              <h2 className="sidebar-heading">قائمة دروس المادة</h2>
              <button
                type="button"
                className="sidebar-close-btn"
                onClick={() => setSidebarOpen(false)}
                aria-label="إغلاق الشريط الجانبي"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-lessons-list">
              {allLessons.map((l) => {
                const isActive = l.id === id;
                const isLocked = !l.unlocked;
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={`sidebar-lesson-item ${isActive ? 'is-active' : ''} ${isLocked ? 'is-locked' : ''} ${l.completed ? 'is-done' : ''}`}
                    onClick={() => navigateToLesson(l)}
                    disabled={isLocked}
                  >
                    <div className="sidebar-lesson-icon">
                      {isLocked ? (
                        <CheckCircle size={14} style={{ opacity: 0.3 }} />
                      ) : l.completed ? (
                        <CheckCircle size={14} className="icon-done" />
                      ) : isActive ? (
                        <Play size={14} fill="currentColor" />
                      ) : (
                        <Play size={14} />
                      )}
                    </div>
                    <div className="sidebar-lesson-info">
                      <span className="sidebar-lesson-title">
                        {l.order ? `${l.order}. ` : ''}{l.title}
                      </span>
                      <span className="sidebar-lesson-dur">
                        <Clock size={11} />
                        {l.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
