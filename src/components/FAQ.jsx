import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'هل المنصة مجانية بالكامل؟',
    a: 'نعم، منصة رؤية مجانية بالكامل في المرحلة الأولى. هدفنا إتاحة التعليم الاحترافي لجميع الطلاب بدون أي عوائق مالية.',
  },
  {
    q: 'هل المحتوى متوافق مع نظام البكالوريا المصري الجديد؟',
    a: 'بالتأكيد. تم تصميم جميع المواد والاختبارات لتطابق بدقة متطلبات وزارة التربية والتعليم لنظام البكالوريا الجديد.',
  },
  {
    q: 'ما الفرق بين المسارات الأكاديمية؟',
    a: 'كل مسار مصمم بمحتوى مخصص يختلف في مواده الدراسية وأسلوب الشرح وبنك الأسئلة ليناسب تخصصك المستهدف سواء كان طبياً أو هندسياً أو إنسانياً.',
  },
  {
    q: 'كيف تتابع المنصة مستوى تقدمي؟',
    a: 'تعمل رؤية على تحليل أدائك في كل اختبار وتقدم لك تقارير مفصلة تُظهر نقاط قوتك والمجالات التي تحتاج لمزيد من التركيز.',
  },
  {
    q: 'هل يمكنني الوصول للمنصة من الهاتف؟',
    a: 'نعم، رؤية متوافقة بالكامل مع جميع الأجهزة: الهاتف المحمول، التابلت، وأجهزة الكمبيوتر بتجربة سلسة لا تشوبها شائبة.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="faq-item"
      style={{ borderColor: open ? 'var(--green-neon)' : 'var(--border-subtle)' }}
    >
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        {open
          ? <ChevronUp size={22} color="var(--green-neon)" />
          : <ChevronDown size={22} color="var(--text-muted)" />}
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <section style={{ padding: '7rem 0', background: 'var(--bg-surface-1)' }} id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <HelpCircle size={18} />
            الأسئلة الشائعة
          </span>
          <h2 className="section-title">كل ما تريد معرفته عن رؤية</h2>
          <p className="section-description">أجوبة واضحة على أكثر الأسئلة التي يسألها طلاب البكالوريا.</p>
        </div>

        <div className="faq-box">
          {FAQS.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
        </div>
      </div>
    </section>
  );
}
