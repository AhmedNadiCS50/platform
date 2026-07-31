import React from 'react';
import { Brain, Quote } from 'lucide-react';

const STATS = [
  { num: '4', label: 'مسارات أكاديمية متخصصة' },
  { num: '2', label: 'سنوات إعداد متكاملة' },
  { num: '∞', label: 'امتحانات تدريبية' },
];

export default function Opening() {
  return (
    <section className="opening-section" id="opening">
      <div className="container">

        <div className="section-header">
          <span className="section-tag">
            <Brain size={18} />
            الافتتاحية
          </span>
          <h2 className="section-title">التعليم يتغير... والمستقبل يحتاج طريقة جديدة</h2>
        </div>

        <div className="opening-grid">
          <div>
            <p className="opening-body-text">
              لهذا جاءت <strong style={{ color: 'var(--green-neon)' }}>رؤية (VISION)</strong>، منصة تعليمية صُممت من البداية لتواكب نظام البكالوريا المصري الجديد، وتوفر للطلاب تجربة تعليمية واضحة، منظمة، وعصرية.
            </p>
            <p className="opening-body-text">
              نحن ندرك حجم التحدي وأهمية التكيف الذكي مع التحولات التعليمية الحديثة. لذلك صممنا كل ركن في رؤية ليكون بوصلتك ونقطة ارتكازك الصلبة طوال العامين.
            </p>

            {/* Inline Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginTop: '2.5rem' }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.4rem',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)',
                }}>
                  <div className="text-green-gradient font-heading" style={{ fontSize: '2.2rem', fontWeight: 900 }}>{s.num}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="opening-card" style={{ position: 'relative', overflow: 'visible' }}>
            {/* Glow top bar */}
            <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '3px', background: 'var(--grad-green-neon)', borderRadius: '36px 36px 0 0' }} />
            <div style={{ color: 'rgba(0,230,118,0.2)', fontSize: '4rem', position: 'absolute', top: '1rem', right: '1.5rem' }}>
              <Quote size={56} />
            </div>
            <p className="opening-quote" style={{ marginTop: '3rem', position: 'relative', zIndex: 2 }}>
              "لسنا مجرد منصة لعرض الدروس، بل شريكك في كل خطوة حتى تصل إلى هدفك."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
