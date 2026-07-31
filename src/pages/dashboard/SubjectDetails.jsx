import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserSession } from '../../context/UserSessionContext';
import { PATH_SUBJECTS_CONFIG } from '../../config/subjects';
import { ArrowRight, Play, CheckCircle, Clock, FileText, Lock } from 'lucide-react';

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPath } = useUserSession();

  const activePathKey = selectedPath || 'medicine';
  const subjectsList = PATH_SUBJECTS_CONFIG[activePathKey] || PATH_SUBJECTS_CONFIG.medicine;

  const subject = subjectsList.find((s) => s.id === id) || subjectsList[0];

  const Icon = subject.icon;

  const SAMPLE_UNITS = [
    {
      unitTitle: 'الوحدة الأولى: الأساسيات والمفاهيم الجوهرية',
      lessons: [
        { id: 1, title: 'المقدمة العامة والمبادئ الرئيسية', duration: '25 دقيقة', completed: true },
        { id: 2, title: 'التفاعلات والتحليلات التطبيقية', duration: '35 دقيقة', completed: true },
        { id: 3, title: 'التطبيقات العملية وحل المسائل', duration: '40 دقيقة', completed: false, current: true },
      ]
    },
    {
      unitTitle: 'الوحدة الثانية: التخصص والتعمق الأكاديمي',
      lessons: [
        { id: 4, title: 'الدراسة التفصيلية للظواهر الحيوية', duration: '30 دقيقة', locked: true },
        { id: 5, title: 'الاختبار النصف سنوي للمادة', duration: '60 دقيقة', locked: true },
      ]
    }
  ];

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
          '--subj-color': subject.color,
          '--subj-glow': subject.glow,
          '--subj-accent': subject.accent,
        }}
      >
        <div className="banner-content">
          <div className="banner-icon-badge">
            <Icon size={36} />
          </div>
          <h1 className="banner-title">{subject.title}</h1>
          <p className="banner-desc">{subject.description}</p>
          <div className="banner-stats-row">
            <span>📚 {subject.lessonsCount} درسًا معتمدًا</span>
            <span>⚡ نسبة إنجازك: {subject.progress}%</span>
          </div>
        </div>
      </div>

      {/* Course Units & Lessons List */}
      <div className="units-list-section">
        <h2 className="units-heading">منهج المادة والدروس المتاحة</h2>
        <div className="units-accordion-group">
          {SAMPLE_UNITS.map((unit, uIdx) => (
            <div key={uIdx} className="unit-card">
              <h3 className="unit-title">{unit.unitTitle}</h3>
              <div className="lessons-group">
                {unit.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`lesson-row ${lesson.current ? 'is-current' : ''} ${lesson.locked ? 'is-locked' : ''}`}
                  >
                    <div className="lesson-left">
                      {lesson.completed && <CheckCircle size={20} className="icon-done" />}
                      {lesson.current && <Play size={20} className="icon-current" fill="currentColor" />}
                      {lesson.locked && <Lock size={20} className="icon-locked" />}
                      <span className="lesson-name">{lesson.title}</span>
                    </div>

                    <div className="lesson-right">
                      <span className="lesson-time"><Clock size={14} /> {lesson.duration}</span>
                      {lesson.current && (
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
