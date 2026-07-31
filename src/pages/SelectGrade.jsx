import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { useUserSession } from '../context/UserSessionContext';

const GRADES = [
  {
    id: 'grade-1',
    label: 'الصف الأول الثانوي',
    subtitle: 'السنة الأولى — بناء الأساس',
    icon: BookOpen,
    description: 'ابدأ رحلتك بتعلم المفاهيم الأساسية لنظام البكالوريا المصري الجديد.',
    tag: 'الأول ثانوي',
  },
  {
    id: 'grade-2',
    label: 'الصف الثاني الثانوي',
    subtitle: 'السنة الثانية — التعمق والاحتراف',
    icon: GraduationCap,
    description: 'واصل مسيرتك واستعد للامتحانات بمستوى أعلى وأكثر تخصصاً.',
    tag: 'الثاني ثانوي',
  },
];

export default function SelectGrade() {
  const navigate = useNavigate();
  const { selectedGrade, setSelectedGrade } = useUserSession();

  const handleContinue = () => {
    if (!selectedGrade) return;
    navigate('/select-path');
  };

  return (
    <div className="onboard-page">
      {/* Ambient lights */}
      <div className="login-light login-light-1" />
      <div className="login-light login-light-2" />

      <div className="onboard-wrapper">

        {/* Logo */}
        <a href="/" className="login-logo" aria-label="الرئيسية">
          <div className="logo-emblem" style={{ width: 48, height: 48 }}>
            <LogoSvg width={30} height={30} />
          </div>
          <span className="brand-name-ar" style={{ fontSize: '1.2rem' }}>رؤيــة</span>
        </a>

        {/* Step indicator */}
        <div className="onboard-steps">
          <div className="onboard-step active">
            <span className="onboard-step-dot" />
            <span>الصف الدراسي</span>
          </div>
          <div className="onboard-step-line" />
          <div className="onboard-step">
            <span className="onboard-step-dot" />
            <span>المسار</span>
          </div>
        </div>

        {/* Header */}
        <div className="onboard-header">
          <h1 className="onboard-title">اختر صفك الدراسي</h1>
          <p className="onboard-desc">اختر الصف الذي تدرس فيه.</p>
        </div>

        {/* Grade cards */}
        <div className="grade-cards-grid">
          {GRADES.map(({ id, label, subtitle, icon: Icon, description, tag }) => {
            const isSelected = selectedGrade === id;
            return (
              <button
                key={id}
                type="button"
                className={`grade-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedGrade(id)}
                aria-pressed={isSelected}
              >
                {/* Selected checkmark */}
                <div className={`grade-card-check ${isSelected ? 'visible' : ''}`}>
                  <CheckCircle size={20} />
                </div>

                {/* Icon area */}
                <div className={`grade-card-icon-wrap ${isSelected ? 'selected' : ''}`}>
                  <Icon size={34} />
                </div>

                {/* Tag */}
                <span className="grade-card-tag">{tag}</span>

                {/* Text */}
                <h2 className="grade-card-title">{label}</h2>
                <p className="grade-card-subtitle">{subtitle}</p>
                <p className="grade-card-desc">{description}</p>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          type="button"
          className={`btn-primary grade-continue-btn ${!selectedGrade ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedGrade}
          aria-disabled={!selectedGrade}
        >
          <span>متابعة</span>
          <ArrowLeft size={18} />
        </button>

      </div>
    </div>
  );
}
