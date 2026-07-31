import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { getLessonById, getLessonComments, addLessonComment, toggleLessonCompletion, saveLastOpenedLesson } from '../../services/contentService';
import './LessonPage.css';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Download, ChevronLeft, MessageCircle, CheckCircle, Clock, FileText, ClipboardList,
  BookOpen, Star, Award, Loader2
} from 'lucide-react';

/* ─── Sample Data ─────────────────────────────────────────────── */
const SAMPLE_UNITS = [
  {
    id: 'u1',
    unitTitle: 'الوحدة الأولى: الأساسيات والمفاهيم الجوهرية',
    lessons: [
      { id: '1', title: 'المقدمة العامة والمبادئ الرئيسية للحياة', duration: '25 دقيقة', completed: true },
      { id: '2', title: 'التفاعلات والتحليلات التطبيقية للـ DNA', duration: '35 دقيقة', completed: true },
      { id: '3', title: 'التطبيقات العملية وحل المسائل البيوكيميائية', duration: '40 دقيقة', completed: false, current: true },
    ],
  },
  {
    id: 'u2',
    unitTitle: 'الوحدة الثانية: التخصص والتعمق الأكاديمي',
    lessons: [
      { id: '4', title: 'الدراسة التفصيلية للظواهر الحيوية', duration: '30 دقيقة', locked: true },
      { id: '5', title: 'مراجعة شاملة للوحدة الثانية', duration: '45 دقيقة', locked: true },
      { id: '6', title: 'الاختبار النصف سنوي للمادة', duration: '60 دقيقة', locked: true },
    ],
  },
];

const LESSONS_FLAT = SAMPLE_UNITS.flatMap((u) => u.lessons);

/* ─── Video Player Component ──────────────────────────────────── */
function VideoPlayer({ lessonTitle }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(32);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const handlePlayPause = () => {
    setPlaying((p) => !p);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(100, pos * 100)));
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => console.log(err));
      setFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setFullscreen(false);
    }
  };

  const currentTime = `${Math.floor((progress * 18) / 100)}:${String(
    Math.floor(((progress * 18 * 60) / 100) % 60)
  ).padStart(2, '0')}`;
  const totalTime = '18:00';

  return (
    <div
      ref={playerRef}
      className="lesson-video-container"
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
      }}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="lesson-player-placeholder">
        <div className="lesson-player-gradient" />
        <div className="lesson-player-scanlines" />
      </div>

      <div className="lesson-player-center" onClick={handlePlayPause}>
        <div className={`lesson-play-ring ${playing ? 'playing' : ''}`}>
          {playing ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" />}
        </div>
      </div>

      <div className={`lesson-player-topbar ${showControls ? 'visible' : ''}`}>
        <span className="lesson-player-title">{lessonTitle}</span>
        <span className="lesson-player-badge">HD</span>
      </div>

      <div className={`lesson-player-controls ${showControls ? 'visible' : ''}`}>
        <div className="lesson-progress-track" onClick={handleProgressClick}>
          <div className="lesson-progress-fill" style={{ width: `${progress}%` }}>
            <div className="lesson-progress-thumb" />
          </div>
        </div>

        <div className="lesson-controls-row">
          <div className="lesson-controls-left">
            <button
              type="button"
              className="lesson-ctrl-btn"
              onClick={handlePlayPause}
              aria-label={playing ? 'إيقاف' : 'تشغيل'}
            >
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button
              type="button"
              className="lesson-ctrl-btn"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'تفعيل الصوت' : 'كتم الصوت'}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="lesson-time-display">
              {currentTime} / {totalTime}
            </span>
          </div>
          <div className="lesson-controls-right">
            <button
              type="button"
              className="lesson-ctrl-btn"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Comment ─────────────────────────────────────────────────── */
function Comment({ comment, onLike }) {
  return (
    <div className="lesson-comment-item">
      <div className="comment-avatar" style={{ background: `${comment.color || '#00e676'}22`, border: `1.5px solid ${comment.color || '#00e676'}55` }}>
        <span style={{ color: comment.color || '#00e676' }}>{comment.initials}</span>
      </div>
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-role">{comment.role}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
}

/* ─── Main LessonPage ─────────────────────────────────────────── */
export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useUserSession();

  const [activeTab, setActiveTab] = useState('desc');
  const [collapsedUnits, setCollapsedUnits] = useState({});
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [lesData, comData] = await Promise.all([
        getLessonById(id),
        getLessonComments(id),
      ]);
      if (isMounted) {
        setLesson(lesData);
        setComments(comData);
        setLoading(false);

        if (lesData && currentUser?.uid) {
          saveLastOpenedLesson(currentUser.uid, lesData);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id, currentUser?.uid]);

  const toggleUnit = (unitId) =>
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));

  const handleLike = (cid) =>
    setComments((prev) =>
      prev.map((c) => (c.id === cid ? { ...c, liked: !c.liked } : c))
    );

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'أنت',
        initials: 'أ',
        role: 'طالب',
        time: 'الآن',
        text: commentText.trim(),
        likes: 0,
        liked: false,
        color: '#00e676',
      },
    ]);
    setCommentText('');
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleSubmitHomework = () => {
    setSubmitted(true);
  };

  const navigateToLesson = (lessonId, isLocked) => {
    if (isLocked) return;
    navigate(`/dashboard/lesson/${lessonId}`);
  };

  if (loading || !lesson) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
        <Loader2 size={26} className="spin-icon" />
        <span>جاري تحميل تفاصيل الدرس والتعليقات من Firestore...</span>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Breadcrumb */}
      <nav className="lesson-breadcrumb" aria-label="breadcrumb">
        <Link to="/dashboard/subjects" className="breadcrumb-link">المواد</Link>
        <ChevronLeft size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">{lesson.title}</span>
      </nav>

      {/* Main Layout */}
      <div className={`lesson-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        {/* Main Column */}
        <div className="lesson-main-col">
          <VideoPlayer lessonTitle={lesson.title} />

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
                <span>{sidebarOpen ? 'إخفاء الدروس' : 'عرض الدروس'}</span>
              </button>
            </div>

            <div className="lesson-meta-row">
              <span className="lesson-meta-chip">
                <Clock size={14} />
                {lesson.duration}
              </span>
              <span className="lesson-meta-chip">
                <Star size={14} />
                4.9
              </span>
              <span className="lesson-meta-chip green">
                <Award size={14} />
                درس معتمد
              </span>
              {lesson.completed && (
                <span className="lesson-meta-chip completed">
                  <CheckCircle size={14} />
                  مكتمل
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="lesson-tabs">
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
              id="tab-desc"
            >
              <FileText size={16} />
              الوصف
            </button>
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'homework' ? 'active' : ''}`}
              onClick={() => setActiveTab('homework')}
              id="tab-homework"
            >
              <ClipboardList size={16} />
              الواجب
            </button>
            <button
              type="button"
              className={`lesson-tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
              id="tab-comments"
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
                    في هذا الدرس الشامل، ستتعلم التطبيقات العملية لحل المسائل الحسابية والتحليلية
                    المرتبطة بالمادة. يركز الدرس على الأساليب التي أثبتت فعاليتها في الاختبارات
                    الوطنية وسيمدّك بالأدوات اللازمة للتفكير العلمي السليم وتحليل البيانات.
                  </p>
                  <p className="desc-body">
                    ستتناول أمثلة حقيقية من البيئة المحيطة، وستتدرب على تطبيق المعادلات والقوانين
                    في سياقات متعددة تساعدك على الفهم العميق وليس مجرد الحفظ السطحي.
                  </p>
                </div>

                <div className="lesson-objectives-card">
                  <h3 className="objectives-heading">أهداف تعلمية</h3>
                  <ul className="objectives-list">
                    {[
                      'فهم الأساس النظري للظاهرة الرئيسية وتطبيقاتها',
                      'حل مسائل معقدة خطوة بخطوة بالمنهجية الصحيحة',
                      'تحليل البيانات وتمثيلها بيانياً بدقة علمية',
                      'الربط بين ما تعلمته ومواقف الحياة الواقعية',
                      'التحضير الفعّال لأسئلة الاختبار بكل أنواعها',
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
                    <span className="pdf-title">ملزمة الدرس الثالث - PDF</span>
                    <span className="pdf-size">3.2 MB · 24 صفحة</span>
                  </div>
                  <button
                    type="button"
                    id="btn-download-pdf"
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
                {submitted ? (
                  <div className="homework-submitted">
                    <div className="submitted-icon">
                      <CheckCircle size={48} />
                    </div>
                    <h3>تم تسليم الواجب بنجاح! 🎉</h3>
                    <p>سيتم مراجعة إجابتك من قِبل المدرس وستصلك النتيجة قريباً.</p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setSubmitted(false)}
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
                            id={`hw-answer-${i}`}
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
                        id="btn-submit-homework"
                        className="btn-primary hw-submit-btn"
                        onClick={handleSubmitHomework}
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
                    <span>أ</span>
                  </div>
                  <div className="compose-input-wrap">
                    <textarea
                      id="comment-input"
                      className="compose-textarea"
                      placeholder="شاركنا رأيك أو سؤالك عن هذا الدرس…"
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="compose-actions">
                      <button
                        type="button"
                        id="btn-send-comment"
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
                    <Comment key={c.id} comment={c} onLike={handleLike} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Navigation */}
          <div className="lesson-nav-row">
            <button
              type="button"
              id="btn-prev-lesson"
              className="lesson-nav-btn prev-btn"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigateToLesson(prevLesson.id, prevLesson.locked)}
            >
              <ChevronRight size={18} />
              <div className="nav-btn-text">
                <span className="nav-btn-label">الدرس السابق</span>
                <span className="nav-btn-title">{prevLesson?.title || '—'}</span>
              </div>
            </button>

            <div className="lesson-nav-progress">
              <span className="nav-progress-text">
                {Math.max(currentIdx + 1, 1)} / {LESSONS_FLAT.length}
              </span>
              <div className="nav-progress-bar">
                <div
                  className="nav-progress-fill"
                  style={{ width: `${((currentIdx + 1) / LESSONS_FLAT.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              id="btn-next-lesson"
              className="lesson-nav-btn next-btn"
              disabled={!nextLesson || nextLesson.locked}
              onClick={() => nextLesson && navigateToLesson(nextLesson.id, nextLesson.locked)}
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
              <h2 className="sidebar-heading">محتوى المادة</h2>
              <button
                type="button"
                className="sidebar-close-btn"
                onClick={() => setSidebarOpen(false)}
                aria-label="إغلاق الشريط الجانبي"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-units">
              {SAMPLE_UNITS.map((unit) => {
                const isCollapsed = collapsedUnits[unit.id];
                const doneCount = unit.lessons.filter((l) => l.completed).length;
                return (
                  <div key={unit.id} className="sidebar-unit">
                    <button
                      type="button"
                      className="sidebar-unit-header"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="unit-header-left">
                        <span className="unit-header-title">{unit.unitTitle}</span>
                        <span className="unit-progress-chip">
                          {doneCount}/{unit.lessons.length}
                        </span>
                      </div>
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>

                    {!isCollapsed && (
                      <div className="sidebar-lessons-list">
                        {unit.lessons.map((l) => {
                          const isCurrent = l.id === (lesson?.id || '3');
                          return (
                            <button
                              key={l.id}
                              type="button"
                              className={`sidebar-lesson-item ${isCurrent ? 'is-active' : ''} ${l.locked ? 'is-locked' : ''} ${l.completed ? 'is-done' : ''}`}
                              onClick={() => navigateToLesson(l.id, l.locked)}
                              disabled={l.locked}
                            >
                              <div className="sidebar-lesson-icon">
                                {l.locked ? (
                                  <Lock size={14} />
                                ) : l.completed ? (
                                  <CheckCircle size={14} />
                                ) : isCurrent ? (
                                  <Play size={14} fill="currentColor" />
                                ) : (
                                  <Play size={14} />
                                )}
                              </div>
                              <div className="sidebar-lesson-info">
                                <span className="sidebar-lesson-title">{l.title}</span>
                                <span className="sidebar-lesson-dur">
                                  <Clock size={11} />
                                  {l.duration}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
