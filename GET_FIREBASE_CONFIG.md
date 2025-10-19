# Firebase 웹 앱 설정 가져오기

GitHub Pages에서 Firebase가 작동하려면 실제 Firebase 웹 앱 설정이 필요합니다.

## 📋 단계별 가이드

### 1단계: Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: **personaplay-d005d**

### 2단계: 웹 앱 설정 확인

#### 방법 A: 기존 웹 앱이 있는 경우

1. Firebase Console 홈에서 **⚙️ 프로젝트 설정** 클릭
2. **일반** 탭으로 이동
3. 아래로 스크롤하여 **내 앱** 섹션 찾기
4. 웹 앱 (</> 아이콘) 선택
5. **SDK 설정 및 구성** 클릭
6. **구성** 라디오 버튼 선택
7. `firebaseConfig` 객체 복사

#### 방법 B: 웹 앱이 없는 경우 (새로 만들기)

1. Firebase Console 홈에서 **⚙️ 프로젝트 설정** 클릭
2. **일반** 탭으로 이동
3. 아래로 스크롤하여 **내 앱** 섹션 찾기
4. **앱 추가** 버튼 클릭
5. **웹** (</>) 아이콘 선택
6. 앱 닉네임 입력 (예: "PersonaPlay Web")
7. **Firebase Hosting도 설정** 체크박스는 **체크하지 않음**
8. **앱 등록** 클릭
9. `firebaseConfig` 객체가 표시됨 - **복사**

### 3단계: firebaseConfig 예시

복사한 내용이 다음과 같은 형식이어야 합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                              // 실제 API 키
  authDomain: "personaplay-d005d.firebaseapp.com",
  projectId: "personaplay-d005d",
  storageBucket: "personaplay-d005d.firebasestorage.app",
  messagingSenderId: "1090384844598",
  appId: "1:1090384844598:web:abc123...",          // 실제 App ID
  measurementId: "G-ABC123XYZ"                      // 실제 Measurement ID (선택사항)
};
```

### 4단계: 설정 업데이트

복사한 `firebaseConfig`를 여기에 붙여넣어 주세요!

그러면 제가 `web/lib/firebase.js` 파일을 업데이트하겠습니다.

---

## 🔍 Firebase Console에서 복사한 설정을 붙여넣어 주세요

형식:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
\`\`\`

이 정보는 **공개 정보**이므로 GitHub에 커밋해도 안전합니다.
(API 키는 클라이언트 사이드용이며, Firestore 보안 규칙으로 보호됩니다)
