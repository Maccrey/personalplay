// Firebase 클라이언트 설정
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBvMaKQg7xWl1vCnDAkZ9m1hN-5yQP8mXg",
  authDomain: "personaplay-d005d.firebaseapp.com",
  projectId: "personaplay-d005d",
  storageBucket: "personaplay-d005d.firebasestorage.app",
  messagingSenderId: "1090384844598",
  appId: "1:1090384844598:web:8b9e0f0e7b5f3e5e8f5e8f",
  measurementId: "G-XXXXXXXXXX"
};

// Firebase 앱 초기화 (중복 초기화 방지)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firestore 인스턴스
export const db = getFirestore(app);

// Analytics (클라이언트 사이드에서만)
export const getAnalyticsInstance = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
