/**
 * Firebase Authentication configuration and helpers
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Check if Firebase config is loaded
console.log('Firebase config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
} else {
  app = getApps()[0];
  console.log('Using existing Firebase app');
}

// Get Auth instance
export const auth = getAuth(app);

// Ensure auth state persists across reloads in supported environments
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to set Firebase auth persistence:', error);
  });
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using redirect (works best on GitHub Pages)
 * @returns {Promise<void>}
 */
export async function signInWithGoogle() {
  // Prefer popup locally for a quicker auth flow, fall back to redirect if needed
  if (typeof window !== 'undefined') {
    try {
      console.log('Attempting Google sign-in with popup...');
      await signInWithPopup(auth, googleProvider);
      return;
    } catch (error) {
      // If popup is blocked or not supported, try redirect as a fallback
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment'
      ]);

      if (!fallbackCodes.has(error?.code)) {
        console.error('Popup sign-in failed:', error);
        throw error;
      }

      console.warn('Popup sign-in unavailable, falling back to redirect:', error?.code);
    }
  }

  try {
    console.log('Attempting Google sign-in with redirect...');
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google redirect:', error);
    throw error;
  }
}

/**
 * Get redirect result after sign-in redirect
 * @returns {Promise<UserCredential|null>}
 */
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get current user
 * @returns {User|null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function with user parameter
 * @returns {Function} Unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
