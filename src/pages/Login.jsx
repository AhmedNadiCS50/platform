import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Zap, AlertCircle, Loader2 } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { loginWithEmailPassword, getArabicAuthErrorMessage } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await loginWithEmailPassword(form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      const arabicMsg = getArabicAuthErrorMessage(error.code);
      setErrorMessage(arabicMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Ambient lights */}
      <div className="login-light login-light-1" />
      <div className="login-light login-light-2" />

      <div className="login-wrapper">

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
            <h1 className="login-title">مرحبًا بعودتك 👋</h1>
            <p className="login-desc">سجل دخولك لمتابعة رحلتك التعليمية.</p>
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

            {/* Email */}
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">
                البريد الإلكتروني
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
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
              <div className="login-label-row">
                <label htmlFor="login-password" className="login-label">
                  كلمة المرور
                </label>
                <Link to="/forgot-password" className="login-forgot">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
            </div>

            {/* Remember Me */}
            <div className="login-remember">
              <label className="login-checkbox-label" htmlFor="login-remember">
                <input
                  id="login-remember"
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="login-checkbox-custom" />
                <span>تذكرني</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <Zap size={18} />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="login-divider">
            <span />
            <p>أو</p>
            <span />
          </div>

          {/* Register */}
          <p className="login-register-row">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="login-register-link">
              إنشاء حساب
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
