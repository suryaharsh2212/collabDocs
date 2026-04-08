/**
 * Firebase v9 Configuration & Helpers
 *
 * Initializes Firebase app from VITE_ env vars.
 * Exports auth, Firestore, and auth helper functions.
 *
 * SECURITY NOTE: These are client-side credentials — they are safe to expose.
 * Security is enforced by Firestore Security Rules on the server side.
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  linkWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

/** Firebase Auth instance */
export const auth = getAuth(app);

/** Google Auth Provider (for sign-in with popup) */
export const googleProvider = new GoogleAuthProvider();

/** Firestore database instance */
export const db = getFirestore(app);

/**
 * Sign in with Google popup.
 * If the current user is anonymous, attempts to link the anonymous account
 * with the Google credential so that the anonymous UID is preserved.
 *
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') return null;
    throw err;
  }
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  return firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Fires immediately with the current user (or null).
 *
 * @param {function(import('firebase/auth').User|null): void} callback
 * @returns {function} Unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Sign in anonymously.
 * Used as a fallback for guests who haven't signed in with Google.
 *
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInAnon() {
  return signInAnonymously(auth);
}

export default app;
