import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { useUserSession } from '../context/UserSessionContext';
import { SPECIALIZATIONS_CONFIG } from '../config/specializations';
import { saveOnboardingData } from '../services/firestoreService';

export default function SelectSpecialization() {
  const navigate = useNavigate();
  const { currentUser, selectedPath, selectedGrade, selectedSpecialization, setSelectedSpecialization } = useUserSession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user landed here without choosing a path
  useEffect(() => {
    if (!selectedPath) navigate('/select-path', { replace: true });
  }, [selectedPath, navigate]);

  const config = SPECIALIZATIONS_CONFIG[selectedPath] ?? null;

  const handleContinue = async () => {
    if (!selectedSpecialization) return;
    setSaving(true);
    setError('');
    try {
      if (currentUser) {
        await saveOnboardingData(currentUser.uid, {
          grade: selectedGrade,
          path: selectedPath,
          specialization: selectedSpecialization,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
      setError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
      setSaving(false);
    }
  };

  if (!config) return null;

  const { pathLabel, specializations } = config;
  // Use the color of the first specialization as the path theme
  const themeColor = specializations[0]?.color ?? 'var(--green-neon)';
  const themeGlow  = specializations[0]?.glow  ?? 'rgba(0,230,118,0.3)';

  return (
    <div className="onboard-page">
      {/* Ambient lights */}
      <div className="login-light login-light-1" />
      <div className="login-light login-light-2" />

      <div className="onboard-wrapper" style={{ maxWidth: '700px' }}>

        {/* Logo */}
        <a href="/" className="login-logo" aria-label="الرئيسية">
          <div className="logo-emblem" style={{ width: 48, height: 48 }}>
            <LogoSvg width={30} height={30} />
          </div>
          <span className="brand-name-ar" style={{ fontSize: '1.2rem' }}>رؤيــة</span>
        </a>

        {/* Step indicator — 3 steps */}
        <div className="onboard-steps">
          {/* Step 1 — done */}
          <div className="onboard-step">
            <span className="onboard-step-dot"
              style={{ background: 'var(--green-neon)', boxShadow: '0 0 8px var(--green-neon)' }} />
            <span style={{ color: 'var(--text-muted)' }}>الصف الدراسي</span>
          </div>
          <div className="onboard-step-line" style={{ background: 'var(--border-active)' }} />
          {/* Step 2 — done */}
          <div className="onboard-step">
            <span className="onboard-step-dot"
              style={{ background: 'var(--green-neon)', boxShadow: '0 0 8px var(--green-neon)' }} />
            <span style={{ color: 'var(--text-muted)' }}>المسار</span>
          </div>
          <div className="onboard-step-line" style={{ background: 'var(--border-active)' }} />
          {/* Step 3 — active */}
          <div className="onboard-step active">
            <span className="onboard-step-dot" />
            <span>التخصص</span>
          </div>
        </div>

        {/* Header */}
        <div className="onboard-header">
          {/* Path badge */}
          <div className="spec-path-badge" style={{ borderColor: themeColor, color: themeColor, background: themeGlow.replace('0.3', '0.08') }}>
            {pathLabel}
          </div>
          <h1 className="onboard-title" style={{ marginTop: '0.9rem' }}>اختر مادة التخصص</h1>
          <p className="onboard-desc">اختر المادة التي تريد التعمق فيها ضمن مسارك.</p>
        </div>

        {/* Specialization cards */}
        <div className="spec-cards-grid">
          {specializations.map(({ id, icon: Icon, emoji, label, description, color, glow, accent }) => {
            const isSelected = selectedSpecialization === id;
            return (
              <button
                key={id}
                type="button"
                className={`spec-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedSpecialization(id)}
                aria-pressed={isSelected}
                style={{
                  '--spec-color':  color,
                  '--spec-glow':   glow,
                  '--spec-accent': accent,
                }}
              >
                {/* Running shimmer on top when selected */}
                {isSelected && (
                  <div className="path-card-shimmer"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                )}

                {/* Checkmark */}
                <div className={`grade-card-check ${isSelected ? 'visible' : ''}`} style={{ color }}>
                  <CheckCircle size={20} />
                </div>

                {/* Emoji */}
                <div className="path-card-emoji spec-emoji">{emoji}</div>

                {/* Icon box */}
                <div
                  className="path-card-icon-wrap"
                  style={{
                    background:   isSelected ? accent : 'rgba(255,255,255,0.04)',
                    borderColor:  isSelected ? color  : 'var(--border-subtle)',
                    color:        isSelected ? color  : 'var(--text-subtle)',
                    boxShadow:    isSelected ? `0 0 22px ${glow}` : 'none',
                  }}
                >
                  <Icon size={28} />
                </div>

                {/* Text */}
                <h2 className="path-card-title" style={{ color: isSelected ? color : 'var(--white-pure)' }}>
                  {label}
                </h2>
                <p className="path-card-desc">{description}</p>

                {/* Bottom glow strip */}
                <div className="path-card-glow-strip"
                  style={{ background: color, opacity: isSelected ? 1 : 0 }} />
              </button>
            );
          })}
        </div>

        {/* No path warning — fallback (should not normally appear) */}
        {!selectedPath && (
          <div className="spec-warn">
            <AlertTriangle size={18} />
            <span>يرجى اختيار المسار أولاً.</span>
          </div>
        )}

        {/* Firestore save error */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              direction: 'rtl',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Continue */}
        <button
          type="button"
          className={`btn-primary grade-continue-btn ${(!selectedSpecialization || saving) ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedSpecialization || saving}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <span>متابعة</span>
              <ArrowLeft size={18} />
            </>
          )}
        </button>

      </div>
    </div>
  );
}
