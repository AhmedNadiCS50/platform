import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PATH_SUBJECTS_CONFIG } from '../config/subjects';

/**
 * ============================================================================
 * FIRESTORE CONTENT SERVICE — 100% Dynamic Firestore Queries
 * Reads and writes Subjects, Lessons, Quizzes, Progress, Comments & Submissions.
 * ============================================================================
 */

const SUBJECTS_COLLECTION    = 'subjects';
const LESSONS_COLLECTION     = 'lessons';
const QUIZZES_COLLECTION     = 'quizzes';
const COMMENTS_COLLECTION    = 'comments';
const SUBMISSIONS_COLLECTION = 'quiz_submissions';

/* ─── Initial Firestore Data Seeding ─────────────────────────────────────── */

const INITIAL_LESSONS = [
  {
    id: '1',
    subjectId: 'biology',
    unitId: 'u1',
    unitTitle: 'الوحدة الأولى: الأساسيات والمفاهيم الجوهرية',
    title: 'المقدمة العامة والمبادئ الرئيسية للحياة',
    description: 'دراسة شاملة للمكونات الأساسية للخلية والتركيبات البيولوجية الرئيسية.',
    duration: '25 دقيقة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    pdfUrl: '#',
    pdfTitle: 'ملزمة_الأحياء_المقدمة_الشاملة.pdf',
    homework: {
      title: 'واجب الدرس الأول: علم الأحياء',
      description: 'أجب عن التمارين من 1 إلى 5 في الصفحة 22 وحل الأسئلة المرفقة.',
      questions: [
        'اذكر ثلاث خصائص رئيسية تشترك فيها الكائنات الحية.',
        'وضح الفرق بين الخلية النباتية والخلية الحيوانية.',
      ],
      dueDate: 'الجمعة القادم',
    },
  },
  {
    id: '2',
    subjectId: 'biology',
    unitId: 'u1',
    unitTitle: 'الوحدة الأولى: الأساسيات والمفاهيم الجوهرية',
    title: 'التفاعلات والتحليلات التطبيقية للـ DNA',
    description: 'التعمق في تضاعف الـ DNA وآليات الإصلاح الخلوي والهندسة الوراثية.',
    duration: '35 دقيقة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    pdfUrl: '#',
    pdfTitle: 'ملزمة_تضاعف_الحمض_النووي.pdf',
    homework: {
      title: 'واجب الدرس الثاني: الوراثة والـ DNA',
      description: 'حل المسائل الوراثية المتكاملة في كراسة الأنشطة.',
      questions: ['اشرح خطوات تضاعف جزيء الـ DNA بالتفصيل.'],
      dueDate: 'الأحد القادم',
    },
  },
  {
    id: '3',
    subjectId: 'biology',
    unitId: 'u1',
    unitTitle: 'الوحدة الأولى: الأساسيات والمفاهيم الجوهرية',
    title: 'التطبيقات العملية وحل المسائل البيوكيميائية',
    description: 'حل تدريبات تطبيقية واختبارات قياسية حول الإنزيمات والأنشطة الحيوية.',
    duration: '40 دقيقة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    pdfUrl: '#',
    pdfTitle: 'تدريبات_التطبيقات_العملية.pdf',
    homework: null,
  },
];

const INITIAL_QUIZZES = [
  {
    id: 'biology-quiz-1',
    subjectId: 'biology',
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
        text: 'ما هي القاعدة النيتروجينية التي ترتبط مع "الأدينين" (Adenine) في جزيء الـ DNA؟',
        options: [
          { key: 'أ', text: 'الثايمين (Thymine)' },
          { key: 'ب', text: 'اليوراسيل (Uracil)' },
          { key: 'ج', text: 'الجوانين (Guanine)' },
          { key: 'د', text: 'السايتوسين (Cytosine)' },
        ],
        correctKey: 'أ',
        explanation: 'يرتبط الأدينين بالثايمين برابطتين هيدروجينيتين في جزيء الـ DNA.',
      },
      {
        id: 2,
        type: 'mcq',
        marks: 3,
        topic: 'التفاعلات والإنزيمات',
        text: 'أين تحدث عملية البناء الضوئي بالتحديد داخل الخلية النباتية؟',
        options: [
          { key: 'أ', text: 'الميتوكندريا' },
          { key: 'ب', text: 'البلاستيدات الخضراء' },
          { key: 'ج', text: 'جهاز جولجي' },
          { key: 'د', text: 'الشبكة الاندوبلازمية' },
        ],
        correctKey: 'ب',
        explanation: 'البلاستيدات الخضراء تحتوي على الكلوروفيل وتُعد مقراً رئيساً للبناء الضوئي.',
      },
      {
        id: 3,
        type: 'essay',
        marks: 6,
        topic: 'الوظائف الحيوية',
        text: 'اشرح بالتفصيل دور الإنزيمات كعوامل محفزة للتفاعلات البيوكيميائية.',
        modelAnswer: 'الإنزيمات محفزات حيوية بروتينية تزيد من سرعة التفاعلات بتخفيض طاقة التنشيط.',
        explanation: 'الجواب الشامل يتضمن مفهوم طاقة التنشيط ودور الموقع النشط للإنزيم.',
      },
    ],
  },
];

export async function ensureFirestoreSeeded() {
  try {
    const snap = await getDocs(collection(db, SUBJECTS_COLLECTION));
    if (!snap.empty) return; // Firestore already contains content

    // Seed Subjects into Firestore
    for (const [pathKey, subjects] of Object.entries(PATH_SUBJECTS_CONFIG)) {
      for (const subj of subjects) {
        const docId = `${pathKey}_${subj.id}`;
        await setDoc(doc(db, SUBJECTS_COLLECTION, docId), {
          ...subj,
          pathKey,
          id: subj.id,
          docId,
          createdAt: serverTimestamp(),
        });
      }
    }

    // Seed Initial Quizzes into Firestore
    for (const quiz of INITIAL_QUIZZES) {
      await setDoc(doc(db, QUIZZES_COLLECTION, quiz.id), {
        ...quiz,
        createdAt: serverTimestamp(),
      });
    }

    // Seed Initial Lessons into Firestore
    for (const lesson of INITIAL_LESSONS) {
      await setDoc(doc(db, LESSONS_COLLECTION, lesson.id), {
        ...lesson,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Firestore seeding info:', err);
  }
}

/* ─── 1. Filtered Subjects Service ───────────────────────────────────────── */

/**
 * Fetch subjects strictly matching the user's educational path.
 * @param {string} pathKey - User's selected path ('medicine', 'engineering', etc.)
 * @returns {Promise<Array>} - Array of subject objects from Firestore
 */
export async function getSubjectsByPath(pathKey) {
  if (!pathKey) return [];
  await ensureFirestoreSeeded();

  try {
    const q = query(
      collection(db, SUBJECTS_COLLECTION),
      where('pathKey', '==', pathKey)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error querying subjects from Firestore:', error);
    return [];
  }
}

/**
 * Fetch a single subject from Firestore by its ID and path.
 */
export async function getSubjectById(subjectId, pathKey) {
  if (!subjectId) return null;
  await ensureFirestoreSeeded();

  try {
    const docId = pathKey ? `${pathKey}_${subjectId}` : subjectId;
    const docRef = doc(db, SUBJECTS_COLLECTION, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }

    // Fallback search by id field in collection
    const q = query(
      collection(db, SUBJECTS_COLLECTION),
      where('id', '==', subjectId)
    );
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      const firstDoc = qSnap.docs[0];
      return { id: firstDoc.id, ...firstDoc.data() };
    }
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
  }

  return null;
}

/* ─── 2. Lessons Firestore Service ───────────────────────────────────────── */

export async function getSubjectLessons(subjectId) {
  if (!subjectId) return [];
  await ensureFirestoreSeeded();

  try {
    const q = query(
      collection(db, LESSONS_COLLECTION),
      where('subjectId', '==', subjectId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching lessons from Firestore:', error);
    return [];
  }
}

export async function getLessonById(lessonId) {
  if (!lessonId) return null;
  await ensureFirestoreSeeded();

  try {
    const docRef = doc(db, LESSONS_COLLECTION, String(lessonId));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.error('Error fetching lesson by ID from Firestore:', error);
  }

  return null;
}

/* ─── 3. Quizzes Firestore Service ───────────────────────────────────────── */

export async function getQuizById(quizId) {
  if (!quizId) return null;
  await ensureFirestoreSeeded();

  try {
    const docRef = doc(db, QUIZZES_COLLECTION, quizId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.error('Error fetching quiz from Firestore:', error);
  }

  return null;
}

export async function saveQuizSubmission(userId, quizId, submissionData) {
  if (!userId || !quizId) return;
  try {
    const subRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      userId,
      quizId,
      ...submissionData,
      submittedAt: serverTimestamp(),
    });

    // Update user's completed quizzes in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      completedQuizzes: arrayUnion({
        quizId,
        submissionId: subRef.id,
        score: submissionData.earnedMarks,
        totalMarks: submissionData.totalMarks,
        percentage: submissionData.percentage,
        date: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error saving quiz submission to Firestore:', error);
  }
}

/* ─── 4. Lesson Comments Service ─────────────────────────────────────────── */

export async function getLessonComments(lessonId) {
  if (!lessonId) return [];
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('lessonId', '==', String(lessonId))
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching comments from Firestore:', error);
    return [];
  }
}

export async function addLessonComment(lessonId, userId, authorName, text) {
  try {
    const newComment = {
      lessonId: String(lessonId),
      userId: userId || 'guest',
      author: authorName || 'طالب',
      initials: (authorName || 'ط').trim().substring(0, 2),
      role: 'طالب',
      time: 'الآن',
      text,
      likes: 0,
      liked: false,
      color: '#00e676',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), newComment);
    return { id: docRef.id, ...newComment };
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
    throw error;
  }
}

/* ─── 5. Lesson Progress & Last Opened Service ───────────────────────────── */

export async function saveLastOpenedLesson(userId, lesson) {
  if (!userId || !lesson) return;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastLesson: {
        id: lesson.id,
        title: lesson.title,
        subjectId: lesson.subjectId || 'biology',
        duration: lesson.duration || '30 دقيقة',
        openedAt: new Date().toISOString(),
      },
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving last opened lesson:', error);
  }
}

export async function toggleLessonCompletion(userId, lessonId, isCompleted) {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    if (isCompleted) {
      await updateDoc(userRef, {
        completedLessons: arrayUnion(String(lessonId)),
      });
    } else {
      await updateDoc(userRef, {
        completedLessons: arrayRemove(String(lessonId)),
      });
    }
  } catch (error) {
    console.error('Error updating lesson progress in Firestore:', error);
  }
}
