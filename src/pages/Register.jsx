import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { registerWithEmailPassword, getArabicAuthErrorMessage } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordMismatch(false);
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordMismatch(true);
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await registerWithEmailPassword(form.email, form.password, form.fullName);
      navigate('/select-grade');
    } catch (error) {
      console.error('[Register] Registration error:', error);
      const arabicMsg = getArabicAuthErrorMessage(error?.code);
      setErrorMessage(arabicMsg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(form.password);
  const strengthLabels = ['', 'ضعيفة', 'مقبولة', 'جيدة', 'قوية'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e', '#00e676'];

  return (
    <div className="login-page">
      {/* Ambient lights */}
      <div className="login-light login-light-1" />
      <div className="login-light login-light-2" />

      <div className="login-wrapper" style={{ maxWidth: '520px' }}>

        {/* Logo */}
        <Link to="/" className="login-logo" aria-label="الرئيسية">
          <div className="logo-emblem" style={{ width: 48, height: 48 }}>
            <LogoSvg width={30} height={30} />
          </div>
          <span className="brand-name-ar" style={{ fontSize: '1.2rem' }}>رؤيــة</span>
        </Link>

        {/* Card */}
        <div className="login-card">

          {/* Shimmer top border */}
          <div className="login-card-shimmer" />

          {/* Header */}
          <div className="login-card-header">
            <h1 className="login-title">أهلاً بك في رؤية ✨</h1>
            <p className="login-desc">أنشئ حسابك وابدأ رحلتك التعليمية الآن.</p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div
              className="reg-error-msg"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="login-field">
              <label htmlFor="reg-fullName" className="login-label">
                الاسم بالكامل
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="reg-fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="أدخل اسمك الكامل"
                  className="login-input"
                  style={{ textAlign: 'right', direction: 'rtl' }}
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-field">
              <label htmlFor="reg-email" className="login-label">
                البريد الإلكتروني
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="login-input"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="reg-password" className="login-label">
                كلمة المرور
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="login-input"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password && (
                <div className="reg-strength-wrap">
                  <div className="reg-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="reg-strength-bar"
                        style={{
                          background: strength >= i ? strengthColors[strength] : 'var(--border-subtle)',
                          boxShadow: strength >= i ? `0 0 8px ${strengthColors[strength]}80` : 'none',
                          transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="reg-strength-label"
                    style={{ color: strengthColors[strength] }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="login-field">
              <label htmlFor="reg-confirm" className="login-label">
                تأكيد كلمة المرور
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`login-input ${passwordMismatch ? 'reg-input-error' : ''}`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'إخفاء كلمة التأكيد' : 'إظهار كلمة التأكيد'}
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary login-submit-btn"
              style={{ marginTop: '0.6rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <span>إنشاء الحساب</span>
                  <Sparkles size={18} />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="login-divider">
            <span />
            <p>لديك حساب بالفعل؟</p>
            <span />
          </div>

          {/* Login link */}
          <p className="login-register-row">
            <Link to="/login" className="login-register-link">
              تسجيل الدخول
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
