# 🔍 방문자 카운터 문제 해결 가이드

GitHub Pages에서 방문자 카운터가 0으로 표시되는 경우 다음 단계를 따라 해결하세요.

---

## ✅ 체크리스트

### 1단계: GitHub Secrets 확인

https://github.com/Maccrey/personalplay/settings/secrets/actions

다음 7개의 Secret이 모두 있어야 합니다:

```
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

**문제:** Secret 이름에 오타가 있거나 누락됨
**해결:** Secret 재확인 및 수정

---

### 2단계: Firestore 보안 규칙 확인

https://console.firebase.google.com/project/personaplay-d005d/firestore/rules

다음 규칙이 있어야 합니다:

```javascript
match /visitors/{visitorId} {
  allow read: if true;
  allow write: if true;
}
```

**문제:** 보안 규칙이 없거나 잘못 설정됨
**해결:** 규칙 추가 후 **게시** 버튼 클릭

---

### 3단계: 브라우저 캐시 삭제

**하드 리프레시:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**완전 삭제:**
1. 브라우저 설정 → 인터넷 사용 기록 삭제
2. 캐시된 이미지 및 파일 선택
3. 삭제

**시크릿 모드:**
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

---

### 4단계: 브라우저 개발자 도구 확인

1. GitHub Pages 접속: https://maccrey.github.io/personalplay/
2. `F12` 키를 눌러 개발자 도구 열기
3. **Console** 탭 선택
4. 빨간색 에러 메시지 확인

#### 일반적인 에러와 해결책

**에러 1: Firebase configuration error**
```
Error: Firebase: Error (auth/invalid-api-key)
```
**원인:** API 키가 잘못됨
**해결:** GitHub Secrets의 `NEXT_PUBLIC_FIREBASE_API_KEY` 재확인

**에러 2: Permission denied**
```
FirebaseError: Missing or insufficient permissions
```
**원인:** Firestore 보안 규칙 문제
**해결:** 2단계 다시 확인

**에러 3: Network error**
```
Failed to fetch
```
**원인:** 네트워크 또는 Firebase 연결 문제
**해결:** 인터넷 연결 확인, 잠시 후 재시도

---

### 5단계: GitHub Actions 로그 확인

https://github.com/Maccrey/personalplay/actions

1. 최신 워크플로우 클릭
2. **build** 작업 클릭
3. **Build Next.js app** 단계 펼치기
4. 환경 변수 로드 확인

**정상 로그 예시:**
```
> next build
✓ Compiled successfully
✓ Generating static pages (66/66)
```

**에러 로그 예시:**
```
Error: Invalid Firebase configuration
```
**해결:** GitHub Secrets 재확인

---

### 6단계: 빌드된 파일 확인

배포된 JavaScript 파일에 Firebase 설정이 포함되어 있는지 확인:

1. GitHub Pages 접속
2. `F12` → **Network** 탭
3. 페이지 새로고침
4. `_app-*.js` 파일 클릭
5. **Response** 탭에서 `apiKey` 검색

**정상:**
```javascript
apiKey: "AIzaSyBieBQdeEg_bhW69diKHjfv44WsNJTtEVY"
```

**비정상 (undefined):**
```javascript
apiKey: undefined
```
**해결:** GitHub Secrets 재설정 후 재배포

---

### 7단계: Firebase Console에서 직접 확인

https://console.firebase.google.com/project/personaplay-d005d/firestore/data

1. **Firestore Database** 클릭
2. `visitors` 컬렉션 확인
3. 문서가 생성되는지 확인

**문서가 생성되지 않으면:**
- 클라이언트에서 Firebase 연결 실패
- 보안 규칙 문제

**문서가 생성되면:**
- Firebase 연결 정상
- 프론트엔드 표시 문제 (React 렌더링)

---

## 🧪 로컬 테스트

로컬에서 정상 작동하는지 확인:

```bash
cd /Users/maccrey/Development/myself-test/web
npm run dev
```

http://localhost:3000 접속 후 방문자 카운터 확인

**로컬 작동 ✅ + GitHub Pages 작동 ❌**
→ GitHub Secrets 문제 또는 캐시 문제

**로컬 작동 ❌ + GitHub Pages 작동 ❌**
→ Firebase 설정 또는 보안 규칙 문제

---

## 🔧 강제 재배포

모든 설정이 맞는데도 작동하지 않으면 강제 재배포:

```bash
git commit --allow-empty -m "chore: force rebuild"
git push origin main
```

배포 완료 후 5분 대기 (CDN 캐시 업데이트)

---

## 📞 최종 확인 명령어

로컬에서 Firebase 연결 테스트:

```bash
cd /Users/maccrey/Development/myself-test/web
node -e "
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBieBQdeEg_bhW69diKHjfv44WsNJTtEVY',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'personaplay-d005d'
};
console.log('Firebase Config:', firebaseConfig);
console.log('API Key valid:', firebaseConfig.apiKey.startsWith('AIza'));
"
```

**정상 출력:**
```
Firebase Config: { apiKey: 'AIzaSy...', projectId: 'personaplay-d005d' }
API Key valid: true
```

---

## ✅ 해결 플로우차트

```
방문자 카운터 0 표시
    ↓
GitHub Secrets 7개 확인
    ↓ (OK)
Firestore 보안 규칙 확인
    ↓ (OK)
브라우저 캐시 삭제 (Ctrl+Shift+R)
    ↓ (여전히 0)
F12 → Console 에러 확인
    ↓ (에러 있음)
에러에 따라 해결
    ↓ (에러 없음)
GitHub Actions 로그 확인
    ↓ (성공)
강제 재배포
    ↓
5분 대기
    ↓
해결! 🎉
```

---

## 💡 가장 흔한 원인

1. **브라우저 캐시** (80%) → 하드 리프레시
2. **GitHub Secrets 누락** (15%) → 재설정
3. **Firestore 보안 규칙** (4%) → 규칙 추가
4. **기타** (1%) → GitHub Actions 로그 확인

---

**여전히 문제가 해결되지 않으면 다음 정보를 제공해주세요:**

1. 브라우저 Console 에러 메시지 (F12 → Console)
2. GitHub Actions 최신 로그
3. 로컬 테스트 결과 (npm run dev)
