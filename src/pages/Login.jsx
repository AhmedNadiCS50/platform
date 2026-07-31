import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Zap } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend — UI only
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
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
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
                />
                <span className="login-checkbox-custom" />
                <span>تذكرني</span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary login-submit-btn">
              <span>تسجيل الدخول</span>
              <Zap size={18} />
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
