import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const TRACKS = {
  medical: {
    emoji: '🧬',
    title: 'مسار الطب والعلوم الحيوية',
    subtitle: 'إعداد متكامل لطلاب القطاع الطبي والعلوم الصحية.',
    badge: 'الكليات الطبية',
    subjects: ['الأحياء', 'الكيمياء', 'الفيزياء', 'الرياضيات'],
    checklist: [
      'تركيز مكثف على الأحياء والكيمياء التطبيقية.',
      'تدريب على التفكير العلمي وحل المشكلات البيولوجية.',
      'بنك أسئلة متخصص للتحضير لكليات الطب والصيدلة.',
    ],
  },
  engineering: {
    emoji: '📐',
    title: 'مسار الهندسة والتكنولوجيا',
    subtitle: 'تأسيس متين في الرياضيات التطبيقية والفيزياء.',
    badge: 'القطاع الهندسي',
    subjects: ['الرياضيات العليا', 'الفيزياء', 'علوم الحاسب', 'الإلكترونيات'],
    checklist: [
      'شرح متعمق للفيزياء والرياضيات العليا.',
      'تدريب على التحليل الهندسي والتطبيقات التكنولوجية.',
      'اختبارات تحاكي متطلبات قطاع الهندسة والذكاء الاصطناعي.',
    ],
  },
  business: {
    emoji: '📊',
    title: 'مسار إدارة الأعمال والاقتصاد',
    subtitle: 'بناء مهارات التحليل المالي والاقتصادي لرجال أعمال المستقبل.',
    badge: 'الأعمال والاقتصاد',
    subjects: ['الاقتصاد', 'الإحصاء', 'الإدارة', 'المحاسبة'],
    checklist: [
      'مناهج مبسطة في الإحصاء والاقتصاد والإدارة.',
      'تدريب على اتخاذ القرارات وحل دراسات الحالة.',
      'تأهيل متكامل لكليات التجارة وإدارة الأعمال الدولية.',
    ],
  },
  arts: {
    emoji: '🎨',
    title: 'مسار الآداب والفنون والعلوم الإنسانية',
    subtitle: 'تعزيز مهارات النقد والتفكير التحليلي واللغوي والإبداع.',
    badge: 'العلوم الإنسانية',
    subjects: ['اللغة العربية', 'اللغات الأجنبية', 'الفلسفة', 'الإعلام'],
    checklist: [
      'دراسة متعمقة للغات والعلوم الاجتماعية والإنسانية.',
      'تدريب على كتابة المقالات النقدية والتعبير الفلسفي.',
      'إعداد راقٍ لكليات الألسن والإعلام والفنون والآداب.',
    ],
  },
};

export default function TrackSelector() {
  const [active, setActive] = useState('medical');
  const t = TRACKS[active];

  return (
    <div className="container" style={{ marginBottom: '6rem' }}>
      <div style={{
        background: 'var(--bg-surface-2)',
        border: '1.5px solid var(--border-active)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        boxShadow: 'var(--shadow-luxury)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top glow bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--grad-green-neon)' }} />

        <h3 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--white-pure)', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 900 }}>
          استكشف مسارك الأكاديمي
        </h3>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          اختر مسارك ليتكيف المحتوى تلقائياً معك
        </p>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {Object.entries(TRACKS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: '50px',
                border: active === key ? '1.5px solid var(--green-neon)' : '1.5px solid var(--border-subtle)',
                background: active === key ? 'var(--grad-green-neon)' : 'transparent',
                color: active === key ? '#040806' : 'var(--text-muted)',
                fontFamily: 'var(--font-heading-ar)',
                fontSize: '1rem',
                fontWeight: active === key ? 900 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                boxShadow: active === key ? '0 6px 25px var(--green-shadow)' : 'none',
              }}
            >
              {val.emoji} {val.title.split(' ').slice(1, 3).join(' ')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{t.emoji}</span>
              <h4 style={{ fontFamily: 'var(--font-heading-ar)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--green-neon)' }}>
                {t.title}
              </h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.8rem', lineHeight: 1.9 }}>
              {t.subtitle}
            </p>

            {/* Subject Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.8rem' }}>
              {t.subjects.map((sub, i) => (
                <span key={i} style={{
                  padding: '0.35rem 1rem',
                  borderRadius: '50px',
                  background: 'rgba(0,230,118,0.1)',
                  border: '1px solid var(--border-active)',
                  color: 'var(--green-neon)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}>
                  {sub}
                </span>
              ))}
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {t.checklist.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', color: 'var(--white-pure)', fontSize: '1rem' }}>
                  <span style={{
                    minWidth: 24, height: 24,
                    borderRadius: '50%',
                    background: 'var(--grad-green-neon)',
                    color: '#040806',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '0.85rem',
                    boxShadow: '0 0 10px var(--green-shadow)',
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Preview Card */}
          <div style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '4rem' }}>{t.emoji}</span>
            <div style={{ marginTop: '1.2rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.45rem 1.2rem',
                borderRadius: '50px',
                background: 'rgba(0,230,118,0.15)',
                color: 'var(--green-neon)',
                fontSize: '0.9rem',
                fontWeight: 800,
                marginBottom: '1rem',
                boxShadow: '0 0 15px rgba(0,230,118,0.2)',
              }}>
                مسار {t.badge}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
              محتوى مصمم بشكل كامل ليناسب متطلبات <strong style={{ color: 'var(--white-pure)' }}>{t.badge}</strong>، مع اختبارات تدريبية مطابقة لنظام البكالوريا.
            </p>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {[
                { n: '+500', l: 'درس تفاعلي' },
                { n: '+200', l: 'اختبار تدريبي' },
                { n: '+1000', l: 'سؤال MCQ' },
                { n: '24/7', l: 'وصول مستمر' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ color: 'var(--green-neon)', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'var(--font-heading-ar)' }}>{s.n}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
