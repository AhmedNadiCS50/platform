import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, ArrowRight, CheckCircle2, XCircle, AlertTriangle,
  Bookmark, Award, RotateCcw, BookOpen, ChevronLeft, ChevronRight,
  Send, BarChart2, CheckCircle, HelpCircle, FileText, Sparkles, AlertCircle
} from 'lucide-react';
import './QuizPage.css';

/* ─── Sample Quiz Data ───────────────────────────────────────────────────── */
const QUIZ_DATA = {
  id: 'biology-quiz-1',
  title: 'الاختبار التقييمي: الكيمياء الحيوية والوراثة',
  subject: 'الأحياء والوراثة',
  durationMinutes: 15,
  totalMarks: 30,
  questions: [
    {
      id: 1,
      type: 'mcq',
      marks: 3,
      topic: 'الوراثة و الحمض النووي (DNA)',
      text: 'ما هي القاعدة النيتروجينية التي ترتبط مع "الأدينين" (Adenine) في جزيء الحمض النووي الريبوزي منقوص الأكسجين (DNA)؟',
      options: [
        { key: 'أ', text: 'الثايمين (Thymine)' },
        { key: 'ب', text: 'اليوراسيل (Uracil)' },
        { key: 'ج', text: 'الجوانين (Guanine)' },
        { key: 'د', text: 'السايتوسين (Cytosine)' },
      ],
      correctKey: 'أ',
      explanation: 'يرتبط الأدينين (A) بالثايمين (T) برابطتين هيدروجينيتين في جزيء الـ DNA، بينما يوجد اليوراسيل فقط في الـ RNA.',
    },
    {
      id: 2,
      type: 'mcq',
      marks: 3,
      topic: 'التفاعلات والإنزيمات',
      text: 'أين تحدث عملية البناء الضوئي بالتحديد داخل الخلية النباتية؟',
      options: [
        { key: 'أ', text: 'الميتوكندريا (Mitochondria)' },
        { key: 'ب', text: 'البلاستيدات الخضراء (Chloroplasts)' },
        { key: 'ج', text: 'جهاز جولجي (Golgi Apparatus)' },
        { key: 'د', text: 'الشبكة الاندوبلازمية (Endoplasmic Reticulum)' },
      ],
      correctKey: 'ب',
      explanation: 'تحتوي البلاستيدات الخضراء على صبغة الكلوروفيل وهي المقر الرئيسي لامتصاص الضوء وإتمام عملية البناء الضوئي.',
    },
    {
      id: 3,
      type: 'essay',
      marks: 6,
      topic: 'الوظائف الحيوية',
      text: 'اشرح بالتفصيل دور الإنزيمات كعوامل محفزة للتفاعلات البيوكيميائية، ووضّح كيف تؤثر درجة الحرارة على نشاط الإنزيم.',
      modelAnswer:
        'الإنزيمات هي محفزات حيوية بروتينية تزيد من سرعة التفاعلات الكيميائية عن طريق تقليل طاقة التنشيط دون أن تُستهلك. تزيد درجة الحرارة من النشاط الإنزيمي حتى تصل لدرجة الحرارة المثلى (الدرجة القصوى)، ولكن الارتفاع المفرط يسبب مسخ البروتين (Denaturation) وفقدان الشكل الفراغي للموقع النشط.',
      explanation:
        'يتضمن الجواب التوضيحي خفض طاقة التنشيط + مفهوم درجة الحرارة المثلى + التغيير في تركيب البروتين (المسخ).',
    },
    {
      id: 4,
      type: 'mcq',
      marks: 3,
      topic: 'الوراثة و الحمض النووي (DNA)',
      text: 'أيٌّ مما يلي يُعد المسئول الأول عن نقل الصفات الوراثية من الآباء إلى الأبناء؟',
      options: [
        { key: 'أ', text: 'الكروموسومات والجينات' },
        { key: 'ب', text: 'السيتوبلازم' },
        { key: 'ج', text: 'الغشاء الخلوي' },
        { key: 'د', text: 'الريبوسومات' },
      ],
      correctKey: 'أ',
      explanation: 'تحمل الكروموسومات الجينات المصنوعة من الـ DNA والتي تخزن الشفرة الوراثية وتنتقل عبر الأمشاج.',
    },
    {
      id: 5,
      type: 'mcq',
      marks: 3,
      topic: 'التفاعلات والإنزيمات',
      text: 'ما هو المكون الرئيسي للإنزيمات من الناحية الكيميائية؟',
      options: [
        { key: 'أ', text: 'الدهون والأحماض الدهنية' },
        { key: 'ب', text: 'البروتينات والأحماض الأمينية' },
        { key: 'ج', text: 'السكريات الأحادية' },
        { key: 'د', text: 'الفيتامينات فقط' },
      ],
      correctKey: 'ب',
      explanation: 'جميع الإنزيمات تقريباً عبارة عن بروتينات كروية تتكون من سلاسل ببتيدية متطوية من الأحماض الأمينية.',
    },
    {
      id: 6,
      type: 'essay',
      marks: 6,
      topic: 'الوراثة و الحمض النووي (DNA)',
      text: 'قارن بين تركيب جزيء الـ DNA وجزيء الـ RNA من حيث عدد السلاسل، القواعد النيتروجينية، ونوع السكر.',
      modelAnswer:
        'الـ DNA يتكون من شريطين حلزونيين مزدوجين، يحتوي على سكر دكسي ريبوز، وقواعده هي (A, T, C, G).\nالـ RNA يتكون من شريط فردي واحد، يحتوي على سكر ريبوز، وقواعده هي (A, U, C, G) حيث يستبدل الثايمين باليوراسيل.',
      explanation: 'المقارنة يجب أن تشمل 3 عناصر رئيسية: عدد الشُّرُط، نوع السكر، وتغيير قاعدة اليوراسيل مكان الثايمين.',
    },
    {
      id: 7,
      type: 'mcq',
      marks: 3,
      topic: 'الوظائف الحيوية',
      text: 'ما هو مصدر الطاقة المباشر المُستخدم في الأنشطة الخلوية داخل جسم الإنسان؟',
      options: [
        { key: 'أ', text: 'جزيء ATP (أدينوسين ثلاثي الفوسفات)' },
        { key: 'ب', text: 'الجلوكوز المباشر' },
        { key: 'ج', text: 'الجليكوجين المخزن' },
        { key: 'د', text: 'الأحماض الأمينية' },
      ],
      correctKey: 'أ',
      explanation: 'يُعتبر ATP بمثابة "عملة الطاقة" المباشرة التي تستخدمها الخلية للقيام بجميع وظائفها الحيوية.',
    },
    {
      id: 8,
      type: 'mcq',
      marks: 3,
      topic: 'التفاعلات والإنزيمات',
      text: 'ماذا يحدث لقيمة الرقم الهيدروجيني (pH) في المعدة لتحفيز عمل إنزيم الببسين؟',
      options: [
        { key: 'أ', text: 'تكون حمضية قوية (حوالي 1.5 - 2)' },
        { key: 'ب', text: 'تكون متعادلة (7.0)' },
        { key: 'ج', text: 'تكون قلوية (8.5)' },
        { key: 'د', text: 'لا تتأثر بالرقم الهيدروجيني' },
      ],
      correctKey: 'أ',
      explanation: 'يعمل إنزيم الببسين الهاضم للبروتينات بكفاءة عالية في وسط حمضي قوي تفرزه إفرازات المعدة (HCl).',
    },
  ],
};

import { useUserSession } from '../../context/UserSessionContext';
import { getQuizById, saveQuizSubmission } from '../../services/contentService';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUserSession();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading]   = useState(true);

  // State initialization
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: 'أ' | essay string }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [qId]: boolean }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultsFilter, setResultsFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'essay'

  useEffect(() => {
    let isMounted = true;
    async function loadQuiz() {
      setLoading(true);
      const data = await getQuizById(id);
      if (isMounted) {
        setQuizData(data);
        setTimeLeftSeconds((data.durationMinutes || 15) * 60);
        setLoading(false);
      }
    }
    loadQuiz();
    return () => { isMounted = false; };
  }, [id]);

  // Countdown timer logic
  useEffect(() => {
    if (isSubmitted || loading || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, loading, quizData]);

  const handleConfirmSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);

    if (quizData && currentUser?.uid) {
      const res = calculateResults();
      saveQuizSubmission(currentUser.uid, quizData.id, res);
    }
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);

    if (quizData && currentUser?.uid) {
      const res = calculateResults();
      saveQuizSubmission(currentUser.uid, quizData.id, res);
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionKey) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionKey,
    }));
  };

  const handleEssayChange = (qId, text) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  const toggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };



  const activeQuiz = quizData || QUIZ_DATA;
  const currentQ = activeQuiz.questions[currentIdx] || activeQuiz.questions[0];
  const totalQuestions = activeQuiz.questions.length;

  const countAnswered = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && String(userAnswers[k]).trim() !== ''
  ).length;

  // Calculation of score after submit
  const calculateResults = () => {
    let earnedMarks = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let essayCount = 0;
    const topicStats = {};

    activeQuiz.questions.forEach((q) => {
      totalMarks += q.marks;
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += q.marks;

      if (q.type === 'mcq') {
        const uAns = userAnswers[q.id];
        if (uAns === q.correctKey) {
          earnedMarks += q.marks;
          correctCount += 1;
          topicStats[q.topic].correct += q.marks;
        } else {
          incorrectCount += 1;
        }
      } else if (q.type === 'essay') {
        essayCount += 1;
        const essayAns = userAnswers[q.id] || '';
        if (essayAns.trim().length > 15) {
          earnedMarks += q.marks;
          correctCount += 1;
          topicStats[q.topic].correct += q.marks;
        }
      }
    });

    const percentage = Math.round((earnedMarks / totalMarks) * 100);

    return {
      earnedMarks,
      totalMarks,
      percentage,
      correctCount,
      incorrectCount,
      essayCount,
      topicStats,
    };
  };

  const results = isSubmitted ? calculateResults() : null;

  /* ──────────────────────────────────────────────────────────────────────────
     RENDER POST-SUBMIT RESULTS SCREEN
  ────────────────────────────────────────────────────────────────────────── */
  if (isSubmitted && results) {
    const isPassed = results.percentage >= 60;

    return (
      <div className="quiz-page-container">
        {/* Results Top Header */}
        <header className="quiz-header">
          <div className="quiz-header-left">
            <button
              type="button"
              className="quiz-back-btn"
              onClick={() => navigate('/dashboard/subjects')}
            >
              <ArrowRight size={18} />
              <span>العودة للمواد</span>
            </button>
            <div className="quiz-header-info">
              <h1 className="quiz-header-title">نتائج الاختبار وتحليل الأداء</h1>
              <span className="quiz-header-subtitle">{QUIZ_DATA.title}</span>
            </div>
          </div>

          <div className="quiz-header-right">
            <button
              type="button"
              className="btn-finish-quiz"
              onClick={() => {
                setIsSubmitted(false);
                setUserAnswers({});
                setFlaggedQuestions({});
                setTimeLeftSeconds(QUIZ_DATA.durationMinutes * 60);
                setCurrentIdx(0);
              }}
            >
              <RotateCcw size={16} />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </header>

        {/* Results Container */}
        <div className="results-container">
          {/* Hero Score Card */}
          <div className="results-score-card">
            <div className="results-badge-icon">
              {isPassed ? <Award size={44} /> : <AlertTriangle size={44} />}
            </div>
            <div className="results-score-number">
              {results.percentage}% <span>({results.earnedMarks} / {results.totalMarks} درجة)</span>
            </div>
            <h2 className="results-status-title">
              {results.percentage >= 90
                ? 'أداء متميز وجدير بالتقدير! 🏆'
                : results.percentage >= 75
                ? 'نتيجة جيدة جداً، استمر في التقدم! ✨'
                : isPassed
                ? 'لقد اجتزت الاختبار بنجاح 👍'
                : 'تحتاج لمزيد من المراجعة والتركيز 📚'}
            </h2>
            <p className="results-status-subtitle">
              تم تحليل إجاباتك بالتفصيل أدناه. يمكنك مراجعة الإجابات الصحيحة والنموذجية لجميع الأسئلة للتعلم والتطوير.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="results-metrics-grid">
            <div className="results-metric-card">
              <div className="metric-icon-box green">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span className="metric-info-val">{results.correctCount} / {totalQuestions}</span>
                <span className="metric-info-lbl">الإجابات الصحيحة</span>
              </div>
            </div>

            <div className="results-metric-card">
              <div className="metric-icon-box red">
                <XCircle size={24} />
              </div>
              <div>
                <span className="metric-info-val">{results.incorrectCount}</span>
                <span className="metric-info-lbl">الإجابات الخاطئة</span>
              </div>
            </div>

            <div className="results-metric-card">
              <div className="metric-icon-box blue">
                <Clock size={24} />
              </div>
              <div>
                <span className="metric-info-val">
                  {formatTimer(QUIZ_DATA.durationMinutes * 60 - timeLeftSeconds)}
                </span>
                <span className="metric-info-lbl">الوقت المستغرق</span>
              </div>
            </div>

            <div className="results-metric-card">
              <div className="metric-icon-box purple">
                <FileText size={24} />
              </div>
              <div>
                <span className="metric-info-val">{results.essayCount}</span>
                <span className="metric-info-lbl">أسئلة مقالية (مراجعة)</span>
              </div>
            </div>
          </div>

          {/* Performance Analysis by Topic (تحليل الأداء حسب الموضوع) */}
          <div className="results-analysis-section">
            <h3 className="analysis-section-title">
              <BarChart2 size={20} />
              تحليل مستوى الإتقان حسب المحاور العلمية
            </h3>

            <div className="analysis-topics-list">
              {Object.entries(results.topicStats).map(([topic, stat]) => {
                const topicPct = Math.round((stat.correct / stat.total) * 100);
                const fillClass = topicPct >= 80 ? 'high' : topicPct >= 50 ? 'medium' : 'low';
                return (
                  <div key={topic} className="topic-analysis-item">
                    <div className="topic-analysis-head">
                      <span>{topic}</span>
                      <span>{topicPct}% ({stat.correct}/{stat.total} نقطة)</span>
                    </div>
                    <div className="topic-analysis-bar">
                      <div
                        className={`topic-analysis-fill ${fillClass}`}
                        style={{ width: `${topicPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question & Answer Review (مراجعة الأسئلة والإجابات الصحيحة والخاطئة) */}
          <div className="results-answers-section">
            <h3 className="analysis-section-title">
              <Sparkles size={20} />
              مراجعة التفاصيل والإجابات النموذجية
            </h3>

            {/* Filter Tabs */}
            <div className="answers-filter-tabs">
              <button
                type="button"
                className={`filter-chip-btn ${resultsFilter === 'all' ? 'active' : ''}`}
                onClick={() => setResultsFilter('all')}
              >
                جميع الأسئلة ({totalQuestions})
              </button>
              <button
                type="button"
                className={`filter-chip-btn ${resultsFilter === 'correct' ? 'active' : ''}`}
                onClick={() => setResultsFilter('correct')}
              >
                الإجابات الصحيحة ✅ ({results.correctCount})
              </button>
              <button
                type="button"
                className={`filter-chip-btn ${resultsFilter === 'incorrect' ? 'active' : ''}`}
                onClick={() => setResultsFilter('incorrect')}
              >
                الإجابات الخاطئة ❌ ({results.incorrectCount})
              </button>
              <button
                type="button"
                className={`filter-chip-btn ${resultsFilter === 'essay' ? 'active' : ''}`}
                onClick={() => setResultsFilter('essay')}
              >
                الأسئلة المقالية 📝 ({results.essayCount})
              </button>
            </div>

            {/* Questions List */}
            {QUIZ_DATA.questions
              .filter((q) => {
                if (resultsFilter === 'correct') {
                  return q.type === 'mcq' && userAnswers[q.id] === q.correctKey;
                }
                if (resultsFilter === 'incorrect') {
                  return q.type === 'mcq' && userAnswers[q.id] !== q.correctKey;
                }
                if (resultsFilter === 'essay') {
                  return q.type === 'essay';
                }
                return true;
              })
              .map((q, idx) => {
                const uAns = userAnswers[q.id];
                const isMcqCorrect = q.type === 'mcq' && uAns === q.correctKey;

                return (
                  <div
                    key={q.id}
                    className={`answer-review-card ${
                      q.type === 'essay'
                        ? 'essay-item'
                        : isMcqCorrect
                        ? 'correct'
                        : 'incorrect'
                    }`}
                  >
                    <div className="review-card-head">
                      <span
                        className={`review-card-status ${
                          q.type === 'essay'
                            ? 'essay'
                            : isMcqCorrect
                            ? 'correct'
                            : 'incorrect'
                        }`}
                      >
                        {q.type === 'essay'
                          ? 'سؤال مقالي'
                          : isMcqCorrect
                          ? 'إجابة صحيحة ✅'
                          : 'إجابة خاطئة ❌'}
                      </span>
                      <span className="question-marks">{q.marks} درجات</span>
                    </div>

                    <h4 className="review-question-text">
                      س{q.id}: {q.text}
                    </h4>

                    {/* MCQ Options Review */}
                    {q.type === 'mcq' && (
                      <div className="review-choices-box">
                        {q.options.map((opt) => {
                          const isUserSelected = uAns === opt.key;
                          const isCorrect = opt.key === q.correctKey;

                          let choiceClass = 'review-choice-item';
                          if (isCorrect) choiceClass += ' is-correct-answer';
                          else if (isUserSelected && !isCorrect) choiceClass += ' user-wrong';

                          return (
                            <div key={opt.key} className={choiceClass}>
                              <strong style={{ marginLeft: '0.4rem' }}>({opt.key})</strong>
                              <span>{opt.text}</span>
                              {isUserSelected && (
                                <span style={{ marginRight: 'auto', fontSize: '0.8rem' }}>
                                  (إجابتك)
                                </span>
                              )}
                              {isCorrect && (
                                <span style={{ marginRight: 'auto', fontSize: '0.8rem' }}>
                                  (الإجابة الصحيحة ✔️)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Essay Review */}
                    {q.type === 'essay' && (
                      <div className="essay-model-answer-box">
                        <span className="essay-box-title">إجابتك المكتوبة:</span>
                        <p className="explanation-text" style={{ fontStyle: 'italic' }}>
                          "{uAns || 'لم يتم إدخال إجابة'}"
                        </p>

                        <span className="essay-box-title" style={{ marginTop: '0.6rem' }}>
                          الإجابة النموذجية المعتمدة:
                        </span>
                        <p className="explanation-text" style={{ whiteSpace: 'pre-line' }}>
                          {q.modelAnswer}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="review-explanation-box">
                        <span className="explanation-title">💡 الشرح والتفسير العلمي:</span>
                        <p className="explanation-text">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Results Action Buttons */}
          <div className="results-action-buttons">
            <button
              type="button"
              className="quiz-action-btn primary"
              onClick={() => navigate('/dashboard/subjects')}
            >
              <BookOpen size={18} />
              العودة إلى المواد والدروس
            </button>
            <button
              type="button"
              className="quiz-action-btn"
              onClick={() => {
                setIsSubmitted(false);
                setUserAnswers({});
                setFlaggedQuestions({});
                setTimeLeftSeconds(QUIZ_DATA.durationMinutes * 60);
                setCurrentIdx(0);
              }}
            >
              <RotateCcw size={18} />
              إعادة محاولة الاختبار
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     RENDER ACTIVE QUIZ TAKING SCREEN
  ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="quiz-page-container">
      {/* Quiz Top Header */}
      <header className="quiz-header">
        <div className="quiz-header-left">
          <Link to="/dashboard/subjects" className="quiz-back-btn">
            <ArrowRight size={18} />
            <span>خروج</span>
          </Link>
          <div className="quiz-header-info">
            <h1 className="quiz-header-title">{QUIZ_DATA.title}</h1>
            <span className="quiz-header-subtitle">{QUIZ_DATA.subject}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="quiz-header-center">
          <div className={`quiz-timer-badge ${timeLeftSeconds < 180 ? 'warning' : ''}`}>
            <Clock size={18} />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>
        </div>

        {/* Finish quiz button */}
        <div className="quiz-header-right">
          <button
            type="button"
            className="btn-finish-quiz"
            onClick={() => setShowConfirmModal(true)}
          >
            <CheckCircle size={17} />
            <span>إنهاء الاختبار</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="quiz-main-body">

        {/* Left Column: Active Question */}
        <div className="quiz-question-container">
          {/* Progress Header */}
          <div className="quiz-progress-top">
            <div className="quiz-progress-labels">
              <span className="quiz-progress-count">
                السؤال {currentIdx + 1} من {totalQuestions}
              </span>
              <span>المجيب عليها: {countAnswered} من {totalQuestions}</span>
            </div>
            <div className="quiz-progress-track-bar">
              <div
                className="quiz-progress-fill-bar"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="quiz-question-card">
            <div className="question-card-header">
              <span className={`question-type-badge ${currentQ.type}`}>
                {currentQ.type === 'mcq' ? 'اختيار من متعدد' : 'سؤال مقالي'}
              </span>

              <div className="question-header-actions">
                <button
                  type="button"
                  className={`flag-btn ${flaggedQuestions[currentQ.id] ? 'flagged' : ''}`}
                  onClick={() => toggleFlag(currentQ.id)}
                >
                  <Bookmark size={14} />
                  <span>
                    {flaggedQuestions[currentQ.id] ? 'تم التحديد للمراجعة' : 'تحديد للمراجعة'}
                  </span>
                </button>
                <span className="question-marks">({currentQ.marks} درجات)</span>
              </div>
            </div>

            <h2 className="question-title-text">{currentQ.text}</h2>

            {/* MCQ Options UI */}
            {currentQ.type === 'mcq' && (
              <div className="mcq-options-grid">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`mcq-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    >
                      <div className="mcq-option-key">{opt.key}</div>
                      <span className="mcq-option-text">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Essay Input Textarea UI */}
            {currentQ.type === 'essay' && (
              <div className="essay-input-wrap">
                <textarea
                  className="essay-textarea"
                  placeholder="اكتب إجابتك بالتفصيل هنا... يمكنك صياغة الشرح والتحليل بأسلوبك العلمي الخاص."
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleEssayChange(currentQ.id, e.target.value)}
                />
                <div className="essay-meta-info">
                  <span>💡 يوصى بالإجابة بوضوح واختصار دون إطالة غير مبررة.</span>
                  <span>عدد الحروف: {(userAnswers[currentQ.id] || '').length}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Navigation */}
          <div className="quiz-nav-footer">
            <button
              type="button"
              className="quiz-action-btn"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            >
              <ChevronRight size={18} />
              السؤال السابق
            </button>

            {currentIdx < totalQuestions - 1 ? (
              <button
                type="button"
                className="quiz-action-btn primary"
                onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
              >
                السؤال التالي
                <ChevronLeft size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="quiz-action-btn primary"
                onClick={() => setShowConfirmModal(true)}
              >
                تسليم وإرسال الاختبار
                <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigation Palette */}
        <aside className="quiz-sidebar">
          <div className="quiz-sidebar-card">
            <div className="sidebar-title">
              <span>خريطة الأسئلة</span>
              <span className="sidebar-badge">{countAnswered}/{totalQuestions} منجز</span>
            </div>

            {/* Legend */}
            <div className="sidebar-legend-grid">
              <div className="legend-item">
                <div className="legend-dot answered" />
                <span>مُجاب</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot current" />
                <span>الحالي</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot flagged" />
                <span>مُحدد للمراجعة</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot unanswered" />
                <span>غير مُجاب</span>
              </div>
            </div>

            {/* Questions Grid Buttons */}
            <div className="questions-grid-palette">
              {QUIZ_DATA.questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAns = Boolean(userAnswers[q.id] && String(userAnswers[q.id]).trim() !== '');
                const isFlag = Boolean(flaggedQuestions[q.id]);

                let btnClass = 'palette-btn';
                if (isCurrent) btnClass += ' active';
                if (isAns) btnClass += ' answered';
                if (isFlag) btnClass += ' flagged';

                return (
                  <button
                    key={q.id}
                    type="button"
                    className={btnClass}
                    onClick={() => setCurrentIdx(idx)}
                    title={`السؤال ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="quiz-modal-overlay">
          <div className="quiz-modal-card">
            <div className="quiz-modal-icon">
              <AlertCircle size={36} />
            </div>
            <h3 className="quiz-modal-title">هل أنت متاكد من إنهاء الاختبار؟</h3>
            <p className="quiz-modal-desc">
              لقد أجبت على {countAnswered} من أصل {totalQuestions} أسئلة.
              {totalQuestions - countAnswered > 0 && (
                <span style={{ color: '#ef4444', display: 'block', marginTop: '0.4rem', fontWeight: 'bold' }}>
                  تنبيه: لديك {totalQuestions - countAnswered} أسئلة لم تُجب عليها بعد!
                </span>
              )}
            </p>
            <div className="quiz-modal-actions">
              <button
                type="button"
                className="quiz-modal-btn cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                متابعة الحل
              </button>
              <button
                type="button"
                className="quiz-modal-btn confirm"
                onClick={handleConfirmSubmit}
              >
                تأكيد وتسليم الإجابات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
