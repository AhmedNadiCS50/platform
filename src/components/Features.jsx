import React, { useState } from 'react';
import { Layers, BookOpen, FilePen, ListCheck, TrendingUp, Route } from 'lucide-react';

const FEATURES = [
  {
    icon: <BookOpen size={28} />,
    title: 'شرح منظم لكل مادة',
    desc: 'شرح استثنائي يركز على الفهم العميق ونواتج التعلم الحقيقية لنظام البكالوريا.',
  },
  {
    icon: <FilePen size={28} />,
    title: 'اختبارات مطابقة لنظام البكالوريا',
    desc: 'نماذج اختبارات تفاعلية مصممة وفق أحدث معايير التقييم للبكالوريا المصرية.',
  },
  {
    icon: <ListCheck size={28} />,
    title: 'تدريب الاختيار من متعدد والمقالي',
    desc: 'تدريب مكثف على التعامل مع الأسئلة الموضوعية والأسئلة المقالية التحليلية.',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'متابعة لمستواك وتقدمك',
    desc: 'تقارير تحليلات ذكية تظهر نقاط قوتك وترشدك للمجالات التي تحتاج لتطوير.',
  },
];

// Interactive Study Hours Calculator
function StudyCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [weeksLeft, setWeeksLeft] = useState(20);

  const totalHours = hoursPerDay * daysPerWeek * weeksLeft;
  const readiness = Math.min(100, Math.round((totalHours / 600) * 100));

  return (
    <div className="calculator-box">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="section-tag" style={{ marginBottom: '1rem' }}>
          🧮 حاسبة خطة الدراسة التفاعلية
        </span>
        <h3 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--white-pure)', fontWeight: 800 }}>
          احسب جاهزيتك للبكالوريا
        </h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          حرّك الأشرطة لتعرف مدى استعدادك للامتحانات
        </p>
      </div>

      <div className="calc-grid">
        <div>
          <div className="slider-group">
            <div className="slider-header">
              <span style={{ color: 'var(--text-muted)' }}>ساعات الدراسة يومياً</span>
              <span style={{ color: 'var(--green-neon)', fontSize: '1.2rem', fontWeight: 800 }}>{hoursPerDay} ساعات</span>
            </div>
            <input
              type="range" min={1} max={10} value={hoursPerDay}
              onChange={e => setHoursPerDay(+e.target.value)}
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span style={{ color: 'var(--text-muted)' }}>أيام الدراسة في الأسبوع</span>
              <span style={{ color: 'var(--green-neon)', fontSize: '1.2rem', fontWeight: 800 }}>{daysPerWeek} أيام</span>
            </div>
            <input
              type="range" min={1} max={7} value={daysPerWeek}
              onChange={e => setDaysPerWeek(+e.target.value)}
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span style={{ color: 'var(--text-muted)' }}>الأسابيع المتبقية للامتحان</span>
              <span style={{ color: 'var(--green-neon)', fontSize: '1.2rem', fontWeight: 800 }}>{weeksLeft} أسبوع</span>
            </div>
            <input
              type="range" min={1} max={40} value={weeksLeft}
              onChange={e => setWeeksLeft(+e.target.value)}
              className="range-slider"
            />
          </div>
        </div>

        <div className="calc-result-card">
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>إجمالي ساعات الدراسة</p>
          <div className="calc-score">{totalHours.toLocaleString()}</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>ساعة دراسية</p>

          {/* Circular Progress Indicator */}
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 1rem' }}>
            <svg viewBox="0 0 120 120" width={120} height={120}>
              <circle cx={60} cy={60} r={50} fill="none" stroke="var(--bg-surface-3)" strokeWidth={10} />
              <circle
                cx={60} cy={60} r={50} fill="none"
                stroke="var(--green-neon)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - readiness / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ filter: 'drop-shadow(0 0 8px var(--green-neon))', transition: '0.6s ease' }}
              />
              <text x="50%" y="50%" textAnchor="middle" dy="0.3em"
                fill="var(--green-neon)" fontSize="22" fontWeight="900" fontFamily="Alexandria, Cairo, sans-serif">
                {readiness}%
              </text>
            </svg>
          </div>

          <p style={{ fontWeight: 700, fontSize: '1.05rem', color: readiness >= 80 ? 'var(--green-neon)' : readiness >= 50 ? '#facc15' : '#f87171' }}>
            {readiness >= 80 ? '🏆 جاهزية عالية جداً!' : readiness >= 50 ? '📈 على الطريق الصحيح' : '⚡ زد ساعات الدراسة'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="core-section" id="pathways">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Layers size={18} />
            القلب
          </span>
          <h2 className="section-title">كل ما تحتاجه للتميز في مكان واحد</h2>
          <p className="section-description">
            سواء كان حلمك دخول الطب أو الهندسة أو الآداب أو إدارة الأعمال، ستجد داخل رؤية كل ما تحتاجه.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-box">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
          <div className="feature-card" style={{ gridColumn: 'span 2' }}>
            <div className="feature-icon-box"><Route size={28} /></div>
            <h3 className="feature-title">محتوى مرتب حسب المسار الذي اخترته</h3>
            <p className="feature-desc">خطة دراسية مخصصة تناسب مسارك الأكاديمي المستهدف وتضمن استغلال وقتك بأقصى كفاءة ممكنة.</p>
          </div>
        </div>

        {/* Study Calculator */}
        <StudyCalculator />
      </div>
    </section>
  );
}
