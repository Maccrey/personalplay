// 방문자 수 추적 및 조회
import { db } from './firebase';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 방문자 기록 (페이지 로드 시 1회 호출)
export async function recordVisit() {
  if (typeof window === 'undefined') return;

  // 세션 스토리지로 중복 방문 방지 (같은 세션에서는 1번만 카운트)
  const visitedKey = 'visited_today';
  const lastVisit = sessionStorage.getItem(visitedKey);
  const today = getTodayKey();

  if (lastVisit === today) {
    // 오늘 이미 방문 기록됨
    return;
  }

  try {
    const todayKey = getTodayKey();
    const todayDocRef = doc(db, 'visitors', todayKey);
    const totalDocRef = doc(db, 'visitors', 'total');

    // 오늘 방문자 수 증가
    await setDoc(
      todayDocRef,
      {
        count: increment(1),
        date: todayKey,
        lastUpdate: serverTimestamp()
      },
      { merge: true }
    );

    // 전체 방문자 수 증가
    await setDoc(
      totalDocRef,
      {
        count: increment(1),
        lastUpdate: serverTimestamp()
      },
      { merge: true }
    );

    // 세션 스토리지에 기록
    sessionStorage.setItem(visitedKey, today);
  } catch (error) {
    console.error('Failed to record visit:', error);
  }
}

// 방문자 통계 조회
export async function getVisitorStats() {
  try {
    const todayKey = getTodayKey();
    const todayDocRef = doc(db, 'visitors', todayKey);
    const totalDocRef = doc(db, 'visitors', 'total');

    const [todayDoc, totalDoc] = await Promise.all([
      getDoc(todayDocRef),
      getDoc(totalDocRef)
    ]);

    const todayCount = todayDoc.exists() ? todayDoc.data().count || 0 : 0;
    const totalCount = totalDoc.exists() ? totalDoc.data().count || 0 : 0;

    return {
      today: todayCount,
      total: totalCount
    };
  } catch (error) {
    console.error('Failed to get visitor stats:', error);
    return {
      today: 0,
      total: 0
    };
  }
}
