// Firestore 클라이언트 유틸리티 함수
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';

// 모든 테스트 가져오기
export async function getAllTests() {
  try {
    const testsCol = collection(db, 'tests');
    const testsSnapshot = await getDocs(testsCol);
    const tests = testsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return tests;
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

// 특정 테스트 가져오기
export async function getTestById(testId) {
  try {
    const testDoc = doc(db, 'tests', String(testId));
    const testSnapshot = await getDoc(testDoc);

    if (testSnapshot.exists()) {
      return {
        id: testSnapshot.id,
        ...testSnapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching test:', error);
    return null;
  }
}

// 모든 카테고리 가져오기
export async function getAllCategories() {
  try {
    const categoriesCol = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCol);
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// 특정 카테고리 가져오기
export async function getCategoryById(categoryId) {
  try {
    const categoryDoc = doc(db, 'categories', categoryId);
    const categorySnapshot = await getDoc(categoryDoc);

    if (categorySnapshot.exists()) {
      return {
        id: categorySnapshot.id,
        ...categorySnapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// 번역 데이터 가져오기
export async function getTranslations(locale = 'ko') {
  try {
    const translationDoc = doc(db, 'translations', locale);
    const translationSnapshot = await getDoc(translationDoc);

    if (translationSnapshot.exists()) {
      return translationSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return null;
  }
}

// Analytics 이벤트 트래킹
export async function trackEvent(eventData) {
  try {
    const eventsCol = collection(db, 'analytics');
    await addDoc(eventsCol, {
      ...eventData,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error tracking event:', error);
    return false;
  }
}

// Analytics 이벤트 가져오기 (조회용)
export async function getAnalytics(filters = {}) {
  try {
    const analyticsCol = collection(db, 'analytics');
    const analyticsSnapshot = await getDocs(analyticsCol);
    let events = analyticsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 필터링
    if (filters.test_id) {
      events = events.filter(e => e.test_id === filters.test_id);
    }
    if (filters.limit) {
      events = events.slice(0, filters.limit);
    }

    return events;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
}
