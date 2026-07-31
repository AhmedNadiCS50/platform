/**
 * subjectService.js
 * ============================================================================
 * Firestore CRUD operations for the `subjects` collection.
 * Students use getSubjectsByGradeAndTrack().
 * Admins use getAllSubjects() + create/update/delete operations.
 * ============================================================================
 */

import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { INITIAL_SUBJECTS, SEED_SENTINEL_ID } from '../config/seedData';

const SUBJECTS_COLLECTION = 'subjects';
const LESSONS_COLLECTION  = 'lessons';

/* ─── Student Queries ─────────────────────────────────────────────────────── */

/**
 * Fetches subjects relevant to a student based on their grade and track.
 * Returns: common subjects for the grade + track-specific subjects.
 * @param {string} grade - 'grade-1' | 'grade-2' | 'grade-3'
 * @param {string} track - 'medicine' | 'engineering' | 'arts' | 'business'
 * @returns {Promise<object[]>}
 */
export async function getSubjectsByGradeAndTrack(grade, track) {
  const queries = [];

  // Q1: Common subjects for this grade
  if (grade) {
    queries.push(
      getDocs(query(
        collection(db, SUBJECTS_COLLECTION),
        where('track', '==', 'common'),
        where('grade', '==', grade),
        where('published', '==', true),
      ))
    );
  }

  // Q2: Track-specific subjects (all grades, published)
  if (track && track !== 'common') {
    queries.push(
      getDocs(query(
        collection(db, SUBJECTS_COLLECTION),
        where('track', '==', track),
        where('published', '==', true),
      ))
    );
  }

  const snapshots = await Promise.all(queries);

  const subjects = [];
  const seen = new Set();

  for (const snap of snapshots) {
    for (const docSnap of snap.docs) {
      if (seen.has(docSnap.id)) continue;
      seen.add(docSnap.id);
      subjects.push({ id: docSnap.id, ...docSnap.data() });
    }
  }

  // Sort: common subjects by order, then track subjects by order
  subjects.sort((a, b) => {
    if (a.track === 'common' && b.track !== 'common') return -1;
    if (a.track !== 'common' && b.track === 'common') return 1;
    return (a.order || 99) - (b.order || 99);
  });

  return subjects;
}

/**
 * Fetches a single subject by its Firestore document ID.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getSubjectById(id) {
  if (!id) return null;
  const snap = await getDoc(doc(db, SUBJECTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/* ─── Admin Queries ───────────────────────────────────────────────────────── */

/**
 * Fetches ALL subjects (published or not) — for admin panel use only.
 * @returns {Promise<object[]>}
 */
export async function getAllSubjects() {
  const snap = await getDocs(collection(db, SUBJECTS_COLLECTION));
  const subjects = snap.docs
    .filter(d => d.id !== SEED_SENTINEL_ID) // Exclude sentinel doc
    .map(d => ({ id: d.id, ...d.data() }));

  subjects.sort((a, b) => {
    // Sort by grade first, then by order
    const gradeOrder = { 'grade-1': 1, 'grade-2': 2, 'grade-3': 3, null: 9 };
    const gA = gradeOrder[a.grade] ?? 9;
    const gB = gradeOrder[b.grade] ?? 9;
    if (gA !== gB) return gA - gB;
    return (a.order || 99) - (b.order || 99);
  });

  return subjects;
}

/**
 * Creates a new subject in Firestore.
 * @param {object} data - Subject data (without id, createdAt, updatedAt)
 * @returns {Promise<string>} - The new document ID
 */
export async function createSubject(data) {
  // Generate a clean document ID from name
  const rawId = `${(data.grade || 'all')}-${data.track}-${data.name}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 60);
  const id = `${rawId}-${Date.now()}`;

  const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
  await setDoc(subjectRef, {
    ...data,
    published: data.published ?? true,
    syncedAt: null,
    lessonsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return id;
}

/**
 * Updates an existing subject document.
 * @param {string} id
 * @param {object} updates
 */
export async function updateSubject(id, updates) {
  const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
  await updateDoc(subjectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a subject AND all its associated lesson documents.
 * Does NOT delete student progress (completedLessons in users collection).
 * @param {string} subjectId
 */
export async function deleteSubjectWithLessons(subjectId) {
  // 1. Fetch all lessons for this subject
  const lessonsSnap = await getDocs(query(
    collection(db, LESSONS_COLLECTION),
    where('subjectId', '==', subjectId),
  ));

  // 2. Delete in batches
  const BATCH_SIZE = 400;
  const lessonDocs = lessonsSnap.docs;

  for (let i = 0; i < lessonDocs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    lessonDocs.slice(i, i + BATCH_SIZE).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  // 3. Delete subject document
  await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
}

/* ─── Initial Data Seeding ────────────────────────────────────────────────── */

/**
 * Seeds initial subjects into Firestore if not already seeded.
 * Uses a sentinel document to prevent re-seeding.
 * Safe to call on every admin panel load.
 */
export async function seedInitialSubjects() {
  // Check sentinel
  const sentinelRef = doc(db, SUBJECTS_COLLECTION, SEED_SENTINEL_ID);
  const sentinelSnap = await getDoc(sentinelRef);
  if (sentinelSnap.exists()) return; // Already seeded

  const batch = writeBatch(db);

  for (const subject of INITIAL_SUBJECTS) {
    const { id, ...rest } = subject;
    const subjectRef = doc(db, SUBJECTS_COLLECTION, id);
    batch.set(subjectRef, {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Write sentinel to prevent re-seeding
  batch.set(sentinelRef, { seededAt: serverTimestamp(), version: 1 });

  await batch.commit();
  console.info(`[Vision] Seeded ${INITIAL_SUBJECTS.length} initial subjects into Firestore.`);
}
