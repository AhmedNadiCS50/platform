import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserDocument } from './firestoreService';

/**
 * Translates Firebase Auth error codes into clean Arabic messages.
 */
export function getArabicAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'البريد الإلكتروني المدخل غير صالح.';
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب. يرجى التواصل مع الدعم الفني.';
    case 'auth/user-not-found':
      return 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
    case 'auth/wrong-password':
      return 'كلمة المرور غير صحيحة.';
    case 'auth/invalid-credential':
      return 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.';
    case 'auth/email-already-in-use':
      return 'البريد الإلكتروني مستخدم بالفعل بحساب آخر.';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة جداً. يجب أن تحتوي على 6 أحرف على الأقل.';
    case 'auth/too-many-requests':
      return 'تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى المحاولة لاحقاً.';
    case 'auth/network-request-failed':
      return 'فشل الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت والتحقق مجدداً.';
    case 'auth/requires-recent-login':
      return 'يتطلب هذا الإجراء إعادة تسجيل الدخول لأسباب أمنية.';
    case 'auth/quota-exceeded':
      return 'تم تجاوز الحد المسموح للمحاولات. يرجى المحاولة لاحقاً.';
    default:
      return 'حدث خطأ أثناء إجراء العملية. يرجى المحاولة مرة أخرى.';
  }
}

/**
 * Register a new user with Email and Password.
 * Also creates a Firestore user document with basic profile data.
 * Grade, path, and specialization are saved separately during onboarding.
 */
export async function registerWithEmailPassword(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update Firebase Auth profile with display name
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Create initial Firestore user document
  await createUserDocument(user.uid, {
    fullName: displayName || '',
    email: user.email,
    grade: null,
    path: null,
    specialization: null,
  });

  // Send Email Verification
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.warn('Could not send verification email immediately:', error);
  }

  return user;
}

/**
 * Log in an existing user with Email and Password.
 */
export async function loginWithEmailPassword(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Send Password Reset Email.
 */
export async function sendPasswordResetLink(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Resend Email Verification to current user.
 */
export async function resendVerificationEmail(user = auth.currentUser) {
  if (user) {
    await sendEmailVerification(user);
  } else {
    throw new Error('No active user found to send verification email.');
  }
}

/**
 * Log out current authenticated user.
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Change password — re-authenticates with current password first, then updates.
 * @param {string} currentPassword - User's current password for re-auth
 * @param {string} newPassword - The new password to set
 */
export async function updateUserPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('لا يوجد مستخدم نشط.');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}
