/**
 * User results management with Firestore
 * Stores and retrieves user test results
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

/**
 * Check if user has an existing result for a specific test and result key
 * @param {string} userId - User ID
 * @param {string} testId - Test ID
 * @param {string} resultKey - Result key
 * @returns {Promise<Object|null>} Existing result or null
 */
async function getExistingResult(userId, testId, resultKey) {
  try {
    const q = query(
      collection(db, 'userResults'),
      where('userId', '==', userId),
      where('testId', '==', testId),
      where('resultKey', '==', resultKey)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking existing result:', error);
    return null;
  }
}

/**
 * Save user test result to Firestore
 * Updates existing result if same test/result combination exists
 * @param {string} userId - User ID
 * @param {Object} resultData - Result data
 * @returns {Promise<string>} Result ID
 */
export async function saveUserResult(userId, resultData) {
  try {
    const {
      testId,
      resultKey,
      testTitle,
      resultTitle,
      locale = 'ko'
    } = resultData;

    // Check if this exact result already exists
    const existingResult = await getExistingResult(userId, testId, resultKey);

    let resultId;
    let userResult;

    if (existingResult) {
      // Update existing result
      resultId = existingResult.id;
      userResult = {
        userId,
        testId,
        resultKey,
        testTitle,
        resultTitle,
        locale,
        createdAt: existingResult.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    } else {
      // Create new result with consistent ID (no timestamp)
      resultId = `${userId}_${testId}_${resultKey}`;
      userResult = {
        userId,
        testId,
        resultKey,
        testTitle,
        resultTitle,
        locale,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    }

    await setDoc(doc(db, 'userResults', resultId), userResult);

    return resultId;
  } catch (error) {
    console.error('Error saving user result:', error);
    throw error;
  }
}

/**
 * Get all results for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user results
 */
export async function getUserResults(userId) {
  try {
    // Query without orderBy to avoid requiring a composite index
    const q = query(
      collection(db, 'userResults'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort by createdAt on the client side
    results.sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt ? b.createdAt.getTime() : 0;
      return timeB - timeA; // Descending order (newest first)
    });

    return results;
  } catch (error) {
    console.error('Error getting user results:', error);
    throw error;
  }
}

/**
 * Get a specific user result
 * @param {string} resultId - Result ID
 * @returns {Promise<Object|null>} Result data or null
 */
export async function getUserResult(resultId) {
  try {
    const docRef = doc(db, 'userResults', resultId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user result:', error);
    throw error;
  }
}

/**
 * Delete a user result
 * @param {string} resultId - Result ID
 * @returns {Promise<void>}
 */
export async function deleteUserResult(resultId) {
  try {
    await deleteDoc(doc(db, 'userResults', resultId));
  } catch (error) {
    console.error('Error deleting user result:', error);
    throw error;
  }
}

/**
 * Check if user has taken a specific test
 * @param {string} userId - User ID
 * @param {string} testId - Test ID
 * @returns {Promise<boolean>}
 */
export async function hasUserTakenTest(userId, testId) {
  try {
    const q = query(
      collection(db, 'userResults'),
      where('userId', '==', userId),
      where('testId', '==', testId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user test:', error);
    return false;
  }
}
