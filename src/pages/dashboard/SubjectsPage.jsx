import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { PATH_SUBJECTS_CONFIG } from '../../config/subjects';
import { BookOpen, ChevronLeft, Search, Layers, PlayCircle } from 'lucide-react';

export default function SubjectsPage() {
  const navigate = useNavigate();
  const { selectedPath } = useUserSession();
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback to 'medicine' if no path selected
  const activePathKey = selectedPath || 'medicine';
  const subjectsList = PATH_SUBJECTS_CONFIG[activePathKey] || PATH_SUBJECTS_CONFIG.medicine;

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
    return map[activePathKey] || 'مسار الطب وعلوم الحياة';
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
          <h1 className="subjects-title">المواد الدراسية الخاصة بمسارك</h1>
          <p className="subjects-subtitle">
            تصفح مواد {getPathLabel()} واستكمل دروسك واختباراتك بدقة واحترافية.
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

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map((subject) => {
          const Icon = subject.icon;
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
                  📚 {subject.lessonsCount} درسًا
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
                  <span className="progress-value">{subject.progress}%</span>
                </div>
                <div className="progress-track-bg">
                  <div
                    className="progress-fill-bar"
                    style={{
                      width: `${subject.progress}%`,
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

    </div>
  );
}
