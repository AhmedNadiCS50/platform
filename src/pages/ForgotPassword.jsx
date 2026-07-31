import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowRight, CheckCircle } from 'lucide-react';
import LogoSvg from '../components/LogoSvg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // No backend — simulate success
    setSent(true);
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary login-submit-btn"
                  style={{ marginTop: '0.4rem' }}
                >
                  <span>إرسال الرابط</span>
                  <Send size={17} />
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
