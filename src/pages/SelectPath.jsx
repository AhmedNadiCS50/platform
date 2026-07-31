import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, HeartPulse, Cpu, Palette, Briefcase } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { useUserSession } from '../context/UserSessionContext';

const PATHS = [
  {
    id: 'medicine',
    emoji: '🩺',
    icon: HeartPulse,
    label: 'الطب وعلوم الحياة',
    description: 'استعد لمجالات الطب والصيدلة والتمريض وعلوم الأحياء بمنهج متخصص وشامل.',
    color: '#00e676',
    glow: 'rgba(0, 230, 118, 0.3)',
    accent: 'rgba(0, 230, 118, 0.1)',
  },
  {
    id: 'engineering',
    emoji: '💻',
    icon: Cpu,
    label: 'الهندسة وعلوم الحاسب',
    description: 'غُص في عالم الهندسة والبرمجة والرياضيات التطبيقية بأسلوب تفاعلي حديث.',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.3)',
    accent: 'rgba(56, 189, 248, 0.1)',
  },
  {
    id: 'arts',
    emoji: '🎨',
    icon: Palette,
    label: 'الآداب والفنون',
    description: 'طوّر مهاراتك في اللغات والأدب والفنون والإعلام بمحتوى ثري ومتنوع.',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.3)',
    accent: 'rgba(192, 132, 252, 0.1)',
  },
  {
    id: 'business',
    emoji: '💼',
    icon: Briefcase,
    label: 'إدارة الأعمال',
    description: 'ابنِ قاعدة متينة في الاقتصاد والمحاسبة وريادة الأعمال وعلوم الإدارة.',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.3)',
    accent: 'rgba(251, 191, 36, 0.1)',
  },
];

export default function SelectPath() {
  const navigate = useNavigate();
  const { selectedPath, setSelectedPath } = useUserSession();

  const handleContinue = () => {
    if (!selectedPath) return;
    navigate('/select-specialization');
  };

  return (
    <div className="onboard-page">
      {/* Ambient lights */}
      <div className="login-light login-light-1" />
      <div className="login-light login-light-2" />

      <div className="onboard-wrapper" style={{ maxWidth: '900px' }}>

        {/* Logo */}
        <a href="/" className="login-logo" aria-label="الرئيسية">
          <div className="logo-emblem" style={{ width: 48, height: 48 }}>
            <LogoSvg width={30} height={30} />
          </div>
          <span className="brand-name-ar" style={{ fontSize: '1.2rem' }}>رؤيــة</span>
        </a>

        {/* Step indicator */}
        <div className="onboard-steps">
          <div className="onboard-step">
            <span className="onboard-step-dot" style={{ background: 'var(--green-neon)', boxShadow: '0 0 8px var(--green-neon)' }} />
            <span style={{ color: 'var(--text-muted)' }}>الصف الدراسي</span>
          </div>
          <div className="onboard-step-line" style={{ background: 'var(--border-active)' }} />
          <div className="onboard-step active">
            <span className="onboard-step-dot" />
            <span>المسار</span>
          </div>
        </div>

        {/* Header */}
        <div className="onboard-header">
          <h1 className="onboard-title">اختر مسارك الدراسي</h1>
          <p className="onboard-desc">اختر المسار الذي يناسب أهدافك التعليمية.</p>
        </div>

        {/* Path cards grid */}
        <div className="path-cards-grid">
          {PATHS.map(({ id, emoji, icon: Icon, label, description, color, glow, accent }) => {
            const isSelected = selectedPath === id;
            return (
              <button
                key={id}
                type="button"
                className={`path-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPath(id)}
                aria-pressed={isSelected}
                style={{
                  '--path-color': color,
                  '--path-glow': glow,
                  '--path-accent': accent,
                }}
              >
                {/* Animated shimmer border on selected */}
                {isSelected && <div className="path-card-shimmer" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />}

                {/* Check badge */}
                <div className={`grade-card-check ${isSelected ? 'visible' : ''}`}
                  style={{ color }}
                >
                  <CheckCircle size={20} />
                </div>

                {/* Emoji */}
                <div className="path-card-emoji">{emoji}</div>

                {/* Icon box */}
                <div
                  className="path-card-icon-wrap"
                  style={{
                    background: isSelected ? accent : 'rgba(255,255,255,0.04)',
                    borderColor: isSelected ? color : 'var(--border-subtle)',
                    color: isSelected ? color : 'var(--text-subtle)',
                    boxShadow: isSelected ? `0 0 22px ${glow}` : 'none',
                  }}
                >
                  <Icon size={28} />
                </div>

                {/* Text */}
                <h2
                  className="path-card-title"
                  style={{ color: isSelected ? color : 'var(--white-pure)' }}
                >
                  {label}
                </h2>
                <p className="path-card-desc">{description}</p>

                {/* Bottom glow strip */}
                <div
                  className="path-card-glow-strip"
                  style={{ background: color, opacity: isSelected ? 1 : 0 }}
                />
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <button
          type="button"
          className={`btn-primary grade-continue-btn ${!selectedPath ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedPath}
        >
          <span>متابعة</span>
          <ArrowLeft size={18} />
        </button>

      </div>
    </div>
  );
}
