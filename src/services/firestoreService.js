import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Collection reference constant — avoids magic strings throughout the codebase.
 */
const USERS_COLLECTION = 'users';

/**
 * Create a new user document in Firestore after successful registration.
 * @param {string} uid - Firebase Auth UID
 * @param {object} data - User profile data
 */
export async function createUserDocument(uid, data) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(userRef, {
    uid,
    fullName: data.fullName || '',
    email: data.email || '',
    grade: data.grade || null,
    path: data.path || null,
    specialization: data.specialization || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetch a user document from Firestore by UID.
 * @param {string} uid - Firebase Auth UID
 * @returns {object|null} - User data object or null if not found
 */
export async function getUserDocument(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() };
}

/**
 * Update specific fields in a user document.
 * Automatically updates the `updatedAt` timestamp.
 * @param {string} uid - Firebase Auth UID
 * @param {object} updates - Fields to update
 */
export async function updateUserDocument(uid, updates) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update only the onboarding fields (grade, path, specialization) in Firestore.
 * Called after the user completes the onboarding flow.
 * @param {string} uid - Firebase Auth UID
 * @param {object} onboardingData - { grade, path, specialization }
 */
export async function saveOnboardingData(uid, { grade, path, specialization }) {
  await updateUserDocument(uid, { grade, path, specialization });
}
