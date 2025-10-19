/**
 * Firebase Authentication configuration and helpers
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
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

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google (tries popup first, falls back to redirect)
 * @returns {Promise<UserCredential|void>}
 */
export async function signInWithGoogle() {
  try {
    // Try popup first (works better on GitHub Pages)
    console.log('Attempting Google sign-in with popup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', result.user.email);
    return result;
  } catch (error) {
    console.error('Error signing in with Google popup:', error);

    // If popup fails, try redirect as fallback
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Popup blocked, trying redirect...');
      try {
        await signInWithRedirect(auth, googleProvider);
        // User will be redirected, no return value
      } catch (redirectError) {
        console.error('Error signing in with redirect:', redirectError);
        throw redirectError;
      }
    } else {
      throw error;
    }
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
