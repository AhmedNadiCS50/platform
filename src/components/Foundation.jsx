import React from 'react';
import { Shield, Activity, Users } from 'lucide-react';

const EDUCATORS = [
  { emoji: '👨‍🏫', name: 'أ. محمد السيد', subject: 'الرياضيات والفيزياء', track: 'هندسة' },
  { emoji: '👩‍🔬', name: 'د. سارة أحمد', subject: 'الأحياء والكيمياء', track: 'طب' },
  { emoji: '👨‍💼', name: 'أ. خالد عمر', subject: 'الاقتصاد والإدارة', track: 'أعمال' },
  { emoji: '👩‍🎓', name: 'د. منى حسن', subject: 'اللغة العربية والآداب', track: 'آداب' },
];

export default function Foundation() {
  return (
    <section className="foundation-section" id="foundation">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Shield size={18} />
            القاعدة
          </span>
          <h2 className="section-title">تكافؤ الفرص والتميز المستحق للجميع</h2>
        </div>

        {/* Two-Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div className="foundation-card">
            <h3 className="foundation-card-title">
              <Activity size={24} />
              مجانية بالكامل في المرحلة الأولى
            </h3>
            <p className="foundation-card-text">
              لهذا نوفر المنصة مجانيًا، حتى يتمكن جميع الطلاب من الاستفادة من محتوى تعليمي احترافي دون أي عوائق مالية أو جغرافية.
            </p>
          </div>

          <div className="foundation-card">
            <h3 className="foundation-card-title">
              <Users size={24} />
              موطن لأفضل المعلمين في مصر
            </h3>
            <p className="foundation-card-text">
              ستصبح رؤية قريباً موطناً لأفضل المعلمين المصريين، حيث يجتمع المحتوى المتميز والتكنولوجيا في مكان واحد.
            </p>
          </div>
        </div>

        {/* Educators Teaser Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading-ar)',
            fontSize: '1.5rem',
            color: 'var(--white-pure)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            نخبة المعلمين القادمون إلى رؤية
            <span style={{ color: 'var(--green-neon)', marginRight: '0.5rem' }}>قريباً...</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {EDUCATORS.map((edu, i) => (
              <div className="educator-card" key={i}>
                <div className="educator-avatar">
                  <span style={{ fontSize: '2.2rem' }}>{edu.emoji}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading-ar)', fontWeight: 800, color: 'var(--white-pure)', fontSize: '1.05rem' }}>
                  {edu.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.3rem 0' }}>
                  {edu.subject}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.8rem',
                  borderRadius: '50px',
                  background: 'rgba(0,230,118,0.12)',
                  color: 'var(--green-neon)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  {edu.track}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Banner */}
        <div className="foundation-banner">
          <p className="foundation-banner-quote text-green-gradient">
            "رؤية ليست مجرد منصة تعليمية... بل بداية جيل يتعلم بطريقة أذكى."
          </p>
        </div>
      </div>
    </section>
  );
}
