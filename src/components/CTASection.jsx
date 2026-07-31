import React from 'react';
import { Zap, ArrowLeft } from 'lucide-react';

export default function CTASection({ onOpenModal }) {
  return (
    <section className="cta-section" id="cta">
      <div className="container">
        <div className="cta-box">
          <p className="section-tag" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
            ⚡ ابدأ اليوم — مجاناً بالكامل
          </p>
          <h2 className="cta-title">
            مستقبلك لا ينتظر.{' '}
            <span className="text-green-gradient">ابدأ الآن.</span>
          </h2>
          <p className="cta-desc">
            سجّل اسمك الآن وكن من أوائل طلاب البكالوريا المصرية الذين يستمتعون بتجربة تعليمية لا مثيل لها.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={onOpenModal} style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>
              <span>سجّل مجاناً الآن</span>
              <Zap size={22} />
            </button>
            <button className="btn-secondary" onClick={onOpenModal} style={{ fontSize: '1.1rem', padding: '1.1rem 2.5rem' }}>
              <span>استكشف المسارات</span>
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
