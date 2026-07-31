import React, { useState } from 'react';
import { Lightbulb, Zap, GraduationCap, Dna, Compass, LineChart, Palette, CheckCircle } from 'lucide-react';

const QUIZ_DATA = {
  question: 'ما هو المكون الرئيسي في خلية الدم الحمراء المسؤول عن نقل الأكسجين؟',
  options: [
    { id: 'a', text: 'الهيموجلوبين' },
    { id: 'b', text: 'الغلوبيولين' },
    { id: 'c', text: 'الفيبرينوجين' },
    { id: 'd', text: 'الألبومين' },
  ],
  correct: 'a',
};

function QuizSimulator() {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (id) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);
  };

  const reset = () => { setSelected(null); setAnswered(false); };

  return (
    <div className="quiz-sim-box">
      <div className="quiz-sim-header">
        <span>🧬 تجربة امتحان مباشر — مسار الطب</span>
        {answered && (
          <button onClick={reset} style={{ background: 'none', border: '1px solid var(--border-active)', color: 'var(--green-neon)', borderRadius: '20px', padding: '0.2rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-body-ar)' }}>
            سؤال جديد
          </button>
        )}
      </div>

      <p className="quiz-question">{QUIZ_DATA.question}</p>

      <div className="quiz-options">
        {QUIZ_DATA.options.map(opt => {
          let cls = 'quiz-option-btn';
          if (answered && opt.id === QUIZ_DATA.correct) cls += ' correct';
          return (
            <button
              key={opt.id}
              className={cls}
              onClick={() => handleSelect(opt.id)}
              style={answered && selected === opt.id && opt.id !== QUIZ_DATA.correct
                ? { borderColor: '#ef4444', color: '#fca5a5', background: 'rgba(239,68,68,0.12)' }
                : {}}
            >
              <span>{opt.text}</span>
              {answered && opt.id === QUIZ_DATA.correct && <CheckCircle size={16} color="var(--green-neon)" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <p style={{ marginTop: '1rem', fontSize: '0.92rem', color: selected === QUIZ_DATA.correct ? 'var(--green-neon)' : '#fca5a5', fontWeight: 700 }}>
          {selected === QUIZ_DATA.correct ? '✅ إجابة صحيحة! ممتاز.' : '❌ الإجابة الصحيحة هي: الهيموجلوبين.'}
        </p>
      )}
    </div>
  );
}

export default function Hero({ onOpenModal }) {
  return (
    <section className="hero-section" id="hero">
      <div className="container hero-grid">

        {/* Content Side */}
        <div className="hero-content">
          <div className="hero-badge">
            <Lightbulb size={18} />
            <span>المنصة الأولى المتخصصة في البكالوريا المصرية الجديدة</span>
          </div>

          <h1 className="hero-title">
            <span className="text-green-gradient">مستقبلك يبدأ من هنا.</span>
          </h1>

          <p className="hero-subtitle">
            منصة تعليمية احترافية مصممة خصيصًا لطلاب نظام البكالوريا المصري الجديد، لتساعدك على التعلم بثقة، والاستعداد للامتحانات بذكاء، وتحقيق أفضل النتائج في رحلة تمتد لعامين كاملين.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary" onClick={onOpenModal}>
              <span>ابدأ مجانًا</span>
              <Zap size={18} />
            </button>
            <button className="btn-secondary" onClick={onOpenModal}>
              <span>ادخل إلى المنصة</span>
              <GraduationCap size={18} />
            </button>
          </div>
        </div>

        {/* Interactive 3D Card */}
        <div className="hero-visual">
          <div className="glass-card-hero">
            <div className="hero-card-header">
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>البكالوريا 2026 / 2027</span>
              </div>
              <span className="text-green-gradient font-heading" style={{ fontWeight: 900, fontSize: '1rem' }}>VISION PRO</span>
            </div>

            {/* Live Quiz Preview */}
            <QuizSimulator />

            {/* Stats Row */}
            <div className="hero-stats-row">
              <div>
                <div className="stat-number">عامين</div>
                <div className="stat-label">إعداد شامل</div>
              </div>
              <div>
                <div className="stat-number">100%</div>
                <div className="stat-label">مطابق للنظام</div>
              </div>
              <div>
                <div className="stat-number">مجاني</div>
                <div className="stat-label">المرحلة الأولى</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
