import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

const REASONS = [
  'أول منصة متخصصة في نظام البكالوريا المصري الجديد.',
  'محتوى منظم حسب المسار الدراسي.',
  'شرح مبسط وعالي الجودة.',
  'اختبارات تحاكي الامتحانات الحقيقية.',
  'متابعة مستمرة لمستوى الطالب.',
  'تصميم عصري وسهل الاستخدام.',
  'مجانية بالكامل في المرحلة الحالية.',
  'مستقبلًا ستضم نخبة من أفضل المدرسين في مصر.',
];

export default function WhyVision() {
  return (
    <section className="why-section" id="why-us">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Star size={18} />
            المميزات التنافسية
          </span>
          <h2 className="section-title">لماذا رؤية؟</h2>
          <p className="section-description">ثمانية أسباب تجعل رؤية الاختيار الأذكى لطالب البكالوريا المصرية.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.3rem' }}>
          {REASONS.map((text, i) => (
            <div
              key={i}
              className="why-item"
              style={{ cursor: 'default' }}
            >
              <div className="why-check-badge">
                <CheckCircle2 size={18} />
              </div>
              <span className="why-text">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
