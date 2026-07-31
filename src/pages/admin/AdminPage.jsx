import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import {
  getAllSubjects, getSubjectById, createSubject,
  updateSubject, deleteSubjectWithLessons, seedInitialSubjects,
} from '../../services/subjectService';
import { syncSubjectContent } from '../../services/youtubeService';
import {
  BookOpen, Globe, Calculator, Atom, Zap, ScrollText, Brain, Code2,
  FlaskConical, Plus, Edit3, Trash2, RefreshCw, X, Save, Loader2,
  LayoutDashboard, CheckCircle2, AlertCircle, Shield, ArrowRight,
} from 'lucide-react';
import './AdminPage.css';

/* ─── Icon Map ────────────────────────────────────────────────────────────── */
const ICON_MAP = {
  BookOpen, Globe, Calculator, Atom, Zap, ScrollText, Brain, Code2, FlaskConical,
};

function SubjectIcon({ iconName, color }) {
  const Icon = ICON_MAP[iconName] || BookOpen;
  return (
    <div
      className="admin-subject-icon"
      style={{
        background: `${color}18`,
        border: `1.5px solid ${color}44`,
        color,
      }}
    >
      <Icon size={22} />
    </div>
  );
}

/* ─── Grade / Track Labels ────────────────────────────────────────────────── */
const GRADE_LABELS = {
  'grade-1': 'الصف الأول',
  'grade-2': 'الصف الثاني',
  'grade-3': 'الصف الثالث',
  null: 'كل الصفوف',
};

const TRACK_LABELS = {
  common:      'مشترك',
  medicine:    'طب وعلوم الحياة',
  engineering: 'هندسة وحاسب',
  arts:        'إنسانيات وفنون',
  business:    'إدارة الأعمال',
};

/* ─── Empty Form Template ─────────────────────────────────────────────────── */
const EMPTY_FORM = {
  name:        '',
  grade:       'grade-1',
  track:       'common',
  contentType: 'playlist',
  playlistUrl: '',
  description: '',
  teacher:     'فريق رؤية التعليمي',
  color:       '#00e676',
  icon:        'BookOpen',
  published:   true,
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  AdminPage Component                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, isAdmin, loadingAuth } = useUserSession();

  const [subjects,      setSubjects]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // Modals
  const [formModal,     setFormModal]     = useState(false);
  const [editId,        setEditId]        = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [savingForm,    setSavingForm]    = useState(false);

  const [deleteModal,   setDeleteModal]   = useState(null); // subject to delete
  const [deletingId,    setDeletingId]    = useState(null);

  const [syncModal,     setSyncModal]     = useState(null); // subject to sync
  const [syncProgress,  setSyncProgress]  = useState({ current: 0, total: 0, title: '' });
  const [syncDone,      setSyncDone]      = useState(null); // { count }
  const [syncError,     setSyncError]     = useState(null);
  const [syncing,       setSyncing]       = useState(false);

  /* ── Load Subjects ── */
  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await seedInitialSubjects(); // no-op if already seeded
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('[AdminPage] Error loading subjects:', err);
      setError('تعذّر تحميل المواد. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loadingAuth) loadSubjects();
  }, [loadingAuth, loadSubjects]);

  /* ── Guard: Admin Only ── */
  if (loadingAuth) {
    return (
      <div className="admin-loading">
        <Loader2 size={24} className="spin-icon" />
        <span>جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          <Shield size={52} style={{ color: '#ef4444', margin: '0 auto 1rem', display: 'block' }} />
          <h3>الوصول مرفوض</h3>
          <p>هذه الصفحة مخصصة للمسؤولين فقط. تأكد من أن حسابك مرتبط بدور المسؤول (admin) في Firestore.</p>
          <button
            type="button"
            className="admin-add-btn"
            style={{ marginTop: '1.5rem' }}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowRight size={18} />
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  /* ── Compute Stats ── */
  const totalSubjects = subjects.length;
  const totalLessons  = subjects.reduce((s, sub) => s + (sub.lessonsCount || 0), 0);
  const syncedCount   = subjects.filter(s => s.syncedAt).length;
  const pendingSync   = totalSubjects - syncedCount;

  /* ── Form Handlers ── */
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setFormModal(true);
  };

  const openEditModal = (subject) => {
    setFormData({
      name:        subject.name        || '',
      grade:       subject.grade       || 'grade-1',
      track:       subject.track       || 'common',
      contentType: subject.contentType || 'playlist',
      playlistUrl: subject.playlistUrl || '',
      description: subject.description || '',
      teacher:     subject.teacher     || 'فريق رؤية التعليمي',
      color:       subject.color       || '#00e676',
      icon:        subject.icon        || 'BookOpen',
      published:   subject.published   ?? true,
    });
    setEditId(subject.id);
    setFormModal(true);
  };

  const handleSaveForm = async () => {
    if (!formData.name.trim() || !formData.playlistUrl.trim()) return;
    setSavingForm(true);
    try {
      if (editId) {
        await updateSubject(editId, {
          ...formData,
          grade: formData.track === 'common' ? formData.grade : null,
        });
      } else {
        await createSubject({
          ...formData,
          grade:        formData.track === 'common' ? formData.grade : null,
          syncedAt:     null,
          lessonsCount: 0,
        });
      }
      setFormModal(false);
      await loadSubjects();
    } catch (err) {
      console.error('[AdminPage] Error saving subject:', err);
      alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مجدداً.');
    } finally {
      setSavingForm(false);
    }
  };

  /* ── Delete Handlers ── */
  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeletingId(deleteModal.id);
    try {
      await deleteSubjectWithLessons(deleteModal.id);
      setDeleteModal(null);
      await loadSubjects();
    } catch (err) {
      console.error('[AdminPage] Error deleting subject:', err);
      alert('حدث خطأ أثناء الحذف.');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Sync Handlers ── */
  const openSyncModal = (subject) => {
    setSyncModal(subject);
    setSyncProgress({ current: 0, total: 0, title: '' });
    setSyncDone(null);
    setSyncError(null);
  };

  const handleSync = async () => {
    if (!syncModal || syncing) return;
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
      setSyncError('YouTube API Key غير موجود. أضف VITE_YOUTUBE_API_KEY في ملف .env وأعد تشغيل المشروع.');
      return;
    }
    setSyncing(true);
    setSyncDone(null);
    setSyncError(null);
    try {
      const result = await syncSubjectContent(
        syncModal.id,
        syncModal,
        apiKey,
        (progress) => setSyncProgress(progress),
      );
      setSyncDone(result);
      await loadSubjects(); // Refresh lessons count
    } catch (err) {
      console.error('[AdminPage] Sync error:', err);
      setSyncError(err.message || 'حدث خطأ أثناء المزامنة.');
    } finally {
      setSyncing(false);
    }
  };

  const syncPct = syncProgress.total > 0
    ? Math.round((syncProgress.current / syncProgress.total) * 100)
    : syncing ? 10 : 0;

  /* ─── Render ── */
  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-header-badge">
            <LayoutDashboard size={13} />
            <span>لوحة الإدارة</span>
          </div>
          <h1>إدارة المحتوى التعليمي</h1>
          <p>إضافة المواد والمزامنة مع YouTube — الطلاب يقرؤون من Firestore فقط</p>
        </div>
        <button type="button" className="admin-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          إضافة مادة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-icon green"><BookOpen size={22} /></div>
          <div>
            <span className="admin-stat-num">{totalSubjects}</span>
            <span className="admin-stat-lbl">إجمالي المواد</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue"><Code2 size={22} /></div>
          <div>
            <span className="admin-stat-num">{totalLessons}</span>
            <span className="admin-stat-lbl">إجمالي الدروس المتزامنة</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon amber"><CheckCircle2 size={22} /></div>
          <div>
            <span className="admin-stat-num">{syncedCount}</span>
            <span className="admin-stat-lbl">مواد مزامنة</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple"><RefreshCw size={22} /></div>
          <div>
            <span className="admin-stat-num">{pendingSync}</span>
            <span className="admin-stat-lbl">تنتظر المزامنة</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="admin-error-banner">❌ {error}</div>}

      {/* Subjects List */}
      <div className="admin-toolbar">
        <span className="admin-toolbar-title">المواد الدراسية ({totalSubjects})</span>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Loader2 size={24} className="spin-icon" />
          <span>جاري تحميل المواد من Firestore...</span>
        </div>
      ) : subjects.length === 0 ? (
        <div className="admin-empty-state">
          <AlertCircle size={52} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', display: 'block' }} />
          <h3>لا توجد مواد بعد</h3>
          <p>اضغط على "إضافة مادة جديدة" لإضافة أول مادة.</p>
        </div>
      ) : (
        <div className="admin-subjects-grid">
          {subjects.map((subject) => (
            <div key={subject.id} className="admin-subject-row">
              <SubjectIcon iconName={subject.icon} color={subject.color || '#00e676'} />

              <div className="admin-subject-info">
                <p className="admin-subject-name">{subject.name}</p>
                <div className="admin-subject-meta">
                  <span className="admin-meta-chip grade">
                    {GRADE_LABELS[subject.grade] || 'كل الصفوف'}
                  </span>
                  <span className="admin-meta-chip track">
                    {TRACK_LABELS[subject.track] || subject.track}
                  </span>
                  <span className="admin-meta-chip type">
                    {subject.contentType === 'playlist' ? '📋 Playlist' : '🎬 فيديو واحد'}
                  </span>
                </div>
              </div>

              <div className="admin-subject-lessons">
                <span>{subject.lessonsCount || 0}</span>
                <small>درسًا</small>
              </div>

              <div className={`admin-sync-status ${subject.syncedAt ? 'synced' : ''}`}>
                {subject.syncedAt
                  ? `✅ آخر مزامنة: ${new Date(subject.syncedAt.toDate?.() || subject.syncedAt).toLocaleDateString('ar-EG')}`
                  : '⏳ لم يتم المزامنة بعد'}
              </div>

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="admin-action-btn sync"
                  onClick={() => openSyncModal(subject)}
                  title="مزامنة Playlist"
                >
                  <RefreshCw size={15} />
                  مزامنة
                </button>
                <button
                  type="button"
                  className="admin-action-btn edit"
                  onClick={() => openEditModal(subject)}
                  title="تعديل المادة"
                >
                  <Edit3 size={15} />
                  تعديل
                </button>
                <button
                  type="button"
                  className="admin-action-btn delete"
                  onClick={() => setDeleteModal(subject)}
                  title="حذف المادة"
                >
                  <Trash2 size={15} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════ Add / Edit Subject Modal ════════════ */}
      {formModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setFormModal(false); }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editId ? 'تعديل المادة' : 'إضافة مادة جديدة'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setFormModal(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="admin-form-grid">
              {/* Name */}
              <div className="admin-form-group full">
                <label className="admin-form-label">اسم المادة *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="مثال: الكيمياء، البرمجة، اللغة العربية..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Track */}
              <div className="admin-form-group">
                <label className="admin-form-label">المسار</label>
                <select
                  className="admin-form-select"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                >
                  <option value="common">مشترك (لكل الطلاب في الصف)</option>
                  <option value="medicine">طب وعلوم الحياة</option>
                  <option value="engineering">هندسة وعلوم الحاسب</option>
                  <option value="arts">إنسانيات وفنون</option>
                  <option value="business">إدارة الأعمال</option>
                </select>
              </div>

              {/* Grade (only if common) */}
              {formData.track === 'common' && (
                <div className="admin-form-group">
                  <label className="admin-form-label">الصف الدراسي</label>
                  <select
                    className="admin-form-select"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  >
                    <option value="grade-1">الصف الأول الثانوي</option>
                    <option value="grade-2">الصف الثاني الثانوي</option>
                    <option value="grade-3">الصف الثالث الثانوي</option>
                  </select>
                </div>
              )}

              {/* Content Type */}
              <div className="admin-form-group">
                <label className="admin-form-label">نوع المحتوى</label>
                <select
                  className="admin-form-select"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                >
                  <option value="playlist">Playlist (قائمة تشغيل)</option>
                  <option value="video">فيديو واحد</option>
                </select>
              </div>

              {/* YouTube URL */}
              <div className="admin-form-group full">
                <label className="admin-form-label">
                  {formData.contentType === 'playlist' ? 'رابط Playlist *' : 'رابط الفيديو *'}
                </label>
                <input
                  type="url"
                  className="admin-form-input"
                  placeholder={formData.contentType === 'playlist'
                    ? 'https://youtube.com/playlist?list=PL...'
                    : 'https://youtu.be/VIDEO_ID'}
                  value={formData.playlistUrl}
                  onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                  dir="ltr"
                />
              </div>

              {/* Teacher */}
              <div className="admin-form-group">
                <label className="admin-form-label">اسم المدرس</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                />
              </div>

              {/* Icon */}
              <div className="admin-form-group">
                <label className="admin-form-label">الأيقونة</label>
                <select
                  className="admin-form-select"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Color */}
              <div className="admin-form-group">
                <label className="admin-form-label">لون المادة</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{ width: 44, height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    dir="ltr"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group full">
                <label className="admin-form-label">الوصف</label>
                <textarea
                  className="admin-form-textarea"
                  placeholder="وصف مختصر للمادة..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Published Toggle */}
              <div className="admin-form-group">
                <label className="admin-form-label">الحالة</label>
                <select
                  className="admin-form-select"
                  value={formData.published ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, published: e.target.value === 'true' })}
                >
                  <option value="true">✅ منشورة — تظهر للطلاب</option>
                  <option value="false">🔒 مخفية — لا تظهر للطلاب</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setFormModal(false)}>
                إلغاء
              </button>
              <button
                type="button"
                className="admin-btn-save"
                onClick={handleSaveForm}
                disabled={savingForm || !formData.name.trim() || !formData.playlistUrl.trim()}
              >
                {savingForm ? <Loader2 size={17} className="spin-icon" /> : <Save size={17} />}
                {editId ? 'حفظ التعديلات' : 'إضافة المادة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ Delete Confirmation Modal ════════════ */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div className="admin-modal delete-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">تأكيد الحذف</h3>
              <button type="button" className="admin-modal-close" onClick={() => setDeleteModal(null)}>
                <X size={22} />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>
                هل أنت متأكد من حذف مادة <strong>"{deleteModal.name}"</strong>؟
              </p>
              <p>
                سيتم حذف المادة و <strong>{deleteModal.lessonsCount || 0} دروس</strong> مرتبطة بها من Firestore.
              </p>
              <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                ⚠️ هذا الإجراء لا يمكن التراجع عنه. لن يتأثر تقدم الطلاب المحفوظ مسبقاً.
              </p>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setDeleteModal(null)}>
                إلغاء
              </button>
              <button
                type="button"
                className="admin-btn-delete"
                onClick={handleDelete}
                disabled={!!deletingId}
              >
                {deletingId ? <Loader2 size={17} className="spin-icon" /> : <Trash2 size={17} />}
                نعم، احذف المادة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ Sync Progress Modal ════════════ */}
      {syncModal && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !syncing) setSyncModal(null);
        }}>
          <div className="admin-modal sync-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">مزامنة: {syncModal.name}</h3>
              <button type="button" className="admin-modal-close" onClick={() => { if (!syncing) setSyncModal(null); }}>
                <X size={22} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              سيتم جلب جميع الفيديوهات من YouTube وحفظها في Firestore.
              الطلاب يقرؤون من Firestore فقط — لن تُستهلك API Quota أثناء تصفح الطلاب.
            </p>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', direction: 'ltr', wordBreak: 'break-all' }}>
              🔗 {syncModal.playlistUrl}
            </div>

            {(syncing || syncDone || syncError) && (
              <div className="sync-progress-section">
                {syncing && (
                  <>
                    <p className="sync-status-text">
                      <Loader2 size={14} className="spin-icon" style={{ display: 'inline', marginLeft: '0.4rem' }} />
                      {syncProgress.title || 'جاري المزامنة...'}
                    </p>
                    <div className="sync-progress-bar-bg">
                      <div className="sync-progress-bar-fill" style={{ width: `${syncPct}%` }} />
                    </div>
                    <p className="sync-progress-fraction">
                      {syncProgress.current} / {syncProgress.total || '?'} فيديو
                    </p>
                  </>
                )}
                {syncDone && (
                  <div className="sync-result-box">
                    <h4>✅ تمت المزامنة بنجاح!</h4>
                    <p>تم حفظ {syncDone.count} درس في Firestore.</p>
                  </div>
                )}
                {syncError && (
                  <div className="sync-error-box">
                    <strong>❌ خطأ في المزامنة:</strong>
                    <p style={{ margin: '0.4rem 0 0' }}>{syncError}</p>
                  </div>
                )}
              </div>
            )}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn-cancel"
                onClick={() => { if (!syncing) setSyncModal(null); }}
                disabled={syncing}
              >
                {syncDone || syncError ? 'إغلاق' : 'إلغاء'}
              </button>
              {!syncDone && (
                <button
                  type="button"
                  className="admin-btn-save"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing
                    ? <><Loader2 size={17} className="spin-icon" /> جاري المزامنة...</>
                    : <><RefreshCw size={17} /> بدء المزامنة</>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
