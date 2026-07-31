import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { getSubjectsByPath } from '../../services/contentService';
import { BookOpen, ChevronLeft, Search, Layers, Loader2, AlertCircle } from 'lucide-react';

export default function SubjectsPage() {
  const navigate = useNavigate();
  const { userProfile, selectedPath } = useUserSession();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Strict path determination from user's Firestore profile
  const activePathKey = userProfile?.path || selectedPath;

  useEffect(() => {
    let isMounted = true;
    async function loadSubjects() {
      if (!activePathKey) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getSubjectsByPath(activePathKey);
      if (isMounted) {
        setSubjectsList(data);
        setLoading(false);
      }
    }
    loadSubjects();
    return () => { isMounted = false; };
  }, [activePathKey]);

  const filteredSubjects = subjectsList.filter((sub) =>
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPathLabel = () => {
    const map = {
      medicine: 'مسار الطب وعلوم الحياة',
      engineering: 'مسار الهندسة وعلوم الحاسب',
      arts: 'مسار الآداب والفنون',
      business: 'مسار إدارة الأعمال',
    };
    return map[activePathKey] || 'مسارك الأكاديمي';
  };

  return (
    <div className="subjects-page-container">

      {/* Header */}
      <div className="subjects-page-header">
        <div className="header-info">
          <div className="subjects-badge">
            <BookOpen size={16} />
            <span>المواد الأكاديمية</span>
          </div>
          <h1 className="subjects-title">المواد الدراسية المخصصة لك</h1>
          <p className="subjects-subtitle">
            تصفح مواد {getPathLabel()} المفلترة بناءً على صفك ومسارك وتخصصك.
          </p>
        </div>

        <div className="header-actions">
          <div className="subjects-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="ابحث عن مادة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="subjects-search-input"
            />
          </div>
          <div className="path-chip-badge">
            <Layers size={15} />
            <span>{filteredSubjects.length} مواد نشطة</span>
          </div>
        </div>
      </div>

      {/* Subjects Grid & Empty State */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--green-neon)', gap: '0.8rem', alignItems: 'center' }}>
          <Loader2 size={24} className="spin-icon" />
          <span>جاري تحميل المواد المخصصة لك من Firestore...</span>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface-2)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '600px',
            margin: '2rem auto',
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-neon)' }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading-ar)', fontSize: '1.25rem', color: 'var(--white-pure)', fontWeight: 800 }}>
            لا توجد مواد مضافة حالياً لمسارك واختياراتك
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            لم نجد مواد مخصصة تطابق المسار ({getPathLabel()}) في قاعدة البيانات حالياً.
          </p>
        </div>
      ) : (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => {
            const Icon = subject.icon || BookOpen;
            return (
              <div
                key={subject.id}
                className="subject-card"
                style={{
                  '--card-color': subject.color,
                  '--card-glow': subject.glow,
                  '--card-accent': subject.accent,
                }}
              >
                {/* Top Accent Strip */}
                <div className="card-top-strip" style={{ background: subject.color }} />

                {/* Card Header: Icon + Badge */}
                <div className="subject-card-header">
                  <div className="subject-icon-box">
                    <Icon size={28} />
                  </div>
                  <span className="subject-lessons-chip">
                    📚 {subject.lessonsCount || 0} درسًا
                  </span>
                </div>

                {/* Subject Info */}
                <div className="subject-card-body">
                  <h3 className="subject-name">{subject.title}</h3>
                  <p className="subject-desc">{subject.description}</p>
                </div>

                {/* Progress Bar Section */}
                <div className="subject-progress-section">
                  <div className="progress-info-row">
                    <span className="progress-label">نسبة الإنجاز</span>
                    <span className="progress-value">{subject.progress || 0}%</span>
                  </div>
                  <div className="progress-track-bg">
                    <div
                      className="progress-fill-bar"
                      style={{
                        width: `${subject.progress || 0}%`,
                        background: subject.color,
                        boxShadow: `0 0 10px ${subject.color}`,
                      }}
                    />
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="subject-card-footer">
                  <button
                    type="button"
                    className="btn-primary subject-continue-btn"
                    onClick={() => navigate(`/dashboard/subjects/${subject.id}`)}
                  >
                    <span>متابعة التعلم</span>
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
