import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration Object using Vite environment variables.
 * Values are retrieved from import.meta.env prefixed with VITE_FIREBASE_*
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validates whether valid Firebase credentials have been provided.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.apiKey.trim() !== ''
);

if (!isFirebaseConfigured) {
  console.warn(
    '⚠️ [Firebase Config Warning]: VITE_FIREBASE_API_KEY is missing or set to a placeholder.\n' +
    'Please set your real Firebase credentials in your local .env file or in Vercel Environment Variables.'
  );
}

// Initialize Firebase App instance safely (prevents duplicate app initialization in HMR)
const app = getApps().length > 0
  ? getApp()
  : initializeApp(
      isFirebaseConfigured
        ? firebaseConfig
        : {
            ...firebaseConfig,
            apiKey: firebaseConfig.apiKey || 'placeholder-api-key',
          }
    );

// Initialize Firebase Authentication & Firestore services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
