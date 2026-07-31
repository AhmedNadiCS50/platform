import React from 'react';
import { Sparkles, Palette, Zap, Award, ShieldCheck } from 'lucide-react';

const PILLARS = [
  { icon: <Palette size={32} />, title: 'فخامة في التصميم', desc: 'واجهة بصرية مبهرة ومريحة للعين تمنحك إحساسًا بالتميز والتركيز الذهني المطلق.' },
  { icon: <Zap size={32} />, title: 'بساطة في الاستخدام', desc: 'تصفح سلس يتيح لك الوصول لدروسك واختباراتك بنقرة واحدة دون أي تشتت.' },
  { icon: <Award size={32} />, title: 'ثقة في المحتوى', desc: 'مادة علمية دقيقة ومطابقة لأحدث المواصفات الرسمية لوزارة التربية والتعليم.' },
  { icon: <ShieldCheck size={32} />, title: 'أمان يرافق رحلتك', desc: 'بيئة آمنة تضمن سرية بياناتك ومتابعة مستمرة تدعمك طوال عامين دراسيين.' },
];

export default function Experience() {
  return (
    <section className="experience-section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={18} />
            التجربة
          </span>
          <h2 className="section-title">تجربة تعليمية فائقة الفخامة والبساطة</h2>
        </div>

        {/* Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.8rem', marginBottom: '4rem' }}>
          {PILLARS.map((p, i) => (
            <div key={i} className="pillar-card">
              <div className="pillar-icon-wrapper">{p.icon}</div>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Summary Box */}
        <div style={{
          background: 'rgba(4, 8, 6, 0.8)',
          border: '1.5px solid var(--border-active)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          boxShadow: '0 0 40px rgba(0, 230, 118, 0.12)',
        }}>
          <p style={{ fontSize: '1.3rem', color: 'var(--white-pure)', lineHeight: 2, fontWeight: 500 }}>
            كل صفحة داخل <strong className="text-green-gradient">رؤية</strong> صُممت لتمنحك تجربة تعليمية حديثة، تساعدك على التركيز، وتنظم وقتك، وتقربك من هدفك خطوة بعد خطوة.
          </p>
        </div>
      </div>
    </section>
  );
}
