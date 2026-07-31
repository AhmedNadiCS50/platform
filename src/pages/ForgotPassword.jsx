import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { sendPasswordResetLink, getArabicAuthErrorMessage } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى أدخل بريدك الإلكتروني.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await sendPasswordResetLink(email);
      setSent(true);
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

      <div className="login-wrapper" style={{ maxWidth: '460px' }}>

        {/* Logo */}
        <Link to="/" className="login-logo" aria-label="الرئيسية">
          <div className="logo-emblem" style={{ width: 48, height: 48 }}>
            <LogoSvg width={30} height={30} />
          </div>
          <span className="brand-name-ar" style={{ fontSize: '1.2rem' }}>رؤيــة</span>
        </Link>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-shimmer" />

          {!sent ? (
            <>
              {/* Header */}
              <div className="login-card-header">
                {/* Icon badge */}
                <div className="fp-icon-badge">
                  <Mail size={28} />
                </div>
                <h1 className="login-title" style={{ marginTop: '1.2rem' }}>
                  نسيت كلمة المرور؟
                </h1>
                <p className="login-desc">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
                </p>
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
                <div className="login-field">
                  <label htmlFor="fp-email" className="login-label">
                    البريد الإلكتروني
                  </label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      id="fp-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="example@email.com"
                      className="login-input"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary login-submit-btn"
                  style={{ marginTop: '0.4rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="spin-icon" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <span>إرسال الرابط</span>
                      <Send size={17} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="fp-success">
              <div className="fp-success-icon">
                <CheckCircle size={38} />
              </div>
              <h2 className="fp-success-title">تم الإرسال! ✅</h2>
              <p className="fp-success-desc">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى
                <span className="fp-email-highlight"> {email}</span>.
                <br />
                يُرجى مراجعة بريدك الإلكتروني.
              </p>
              <button
                type="button"
                className="btn-primary login-submit-btn"
                style={{ marginTop: '1.8rem' }}
                onClick={() => { setEmail(''); setSent(false); }}
              >
                <span>إرسال مجدداً</span>
                <Send size={17} />
              </button>
            </div>
          )}

          {/* Back to login link */}
          <div className="fp-back-wrap">
            <Link to="/login" className="fp-back-link">
              <ArrowRight size={16} />
              <span>العودة لتسجيل الدخول</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
