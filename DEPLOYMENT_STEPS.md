# 🚀 배포 절차 (단계별 가이드)

GitHub Pages에 Firebase 기반 프로젝트를 배포하는 완전한 가이드입니다.

---

## ✅ 사전 준비 사항

- [x] Firebase 프로젝트: `personaplay-d005d` (이미 생성됨)
- [x] GitHub 리포지토리: `Maccrey/personalplay` (이미 생성됨)
- [x] 코드 푸시 완료 (최신 커밋 반영)

---

## 📋 배포 절차

### 1단계: Firebase 웹 앱 설정 가져오기 (2분)

#### 1-1. Firebase Console 접속
https://console.firebase.google.com/project/personaplay-d005d/settings/general

#### 1-2. 웹 앱 설정 확인/생성

**기존 웹 앱이 있는 경우:**
1. **일반** 탭 → 아래로 스크롤 → **내 앱** 섹션
2. 웹 앱 (</> 아이콘) 클릭
3. **SDK 설정 및 구성** 클릭
4. **구성** 라디오 버튼 선택

**웹 앱이 없는 경우:**
1. **앱 추가** 버튼 클릭
2. **웹** (</>) 선택
3. 앱 닉네임: `PersonaPlay Web` 입력
4. **Firebase Hosting도 설정** 체크 해제
5. **앱 등록** 클릭

#### 1-3. firebaseConfig 복사

다음과 같은 형식으로 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "personaplay-d005d.firebaseapp.com",
  projectId: "personaplay-d005d",
  storageBucket: "personaplay-d005d.appspot.com",
  messagingSenderId: "1090384844598",
  appId: "1:1090384844598:web:...",
  measurementId: "G-..."
};
```

각 값을 메모장에 복사해두세요!

---

### 2단계: GitHub Secrets 설정 (3분)

#### 2-1. GitHub Settings 접속
https://github.com/Maccrey/personalplay/settings/secrets/actions

#### 2-2. Secrets 추가

**New repository secret** 버튼을 클릭하여 다음 7개 Secret을 추가합니다:

##### Secret 1
- Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
- Secret: Firebase의 `apiKey` 값
- **Add secret** 클릭

##### Secret 2
- Name: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- Secret: Firebase의 `authDomain` 값
- **Add secret** 클릭

##### Secret 3
- Name: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Secret: Firebase의 `projectId` 값
- **Add secret** 클릭

##### Secret 4
- Name: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- Secret: Firebase의 `storageBucket` 값
- **Add secret** 클릭

##### Secret 5
- Name: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- Secret: Firebase의 `messagingSenderId` 값
- **Add secret** 클릭

##### Secret 6
- Name: `NEXT_PUBLIC_FIREBASE_APP_ID`
- Secret: Firebase의 `appId` 값
- **Add secret** 클릭

##### Secret 7 (선택사항)
- Name: `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- Secret: Firebase의 `measurementId` 값
- **Add secret** 클릭

#### 2-3. Secrets 확인

설정 완료 후 다음과 같이 7개 Secrets가 표시되어야 합니다:

```
Repository secrets (7)
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

---

### 3단계: Firestore 보안 규칙 설정 (2분)

#### 3-1. Firestore Console 접속
https://console.firebase.google.com/project/personaplay-d005d/firestore/rules

#### 3-2. 규칙 업데이트

다음 규칙을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 테스트 데이터: 읽기만 가능
    match /tests/{testId} {
      allow read: if true;
      allow write: if false;
    }

    // 카테고리 데이터: 읽기만 가능
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }

    // 번역 데이터: 읽기만 가능
    match /translations/{locale} {
      allow read: if true;
      allow write: if false;
    }

    // Analytics: 쓰기만 가능 (익명)
    match /analytics/{eventId} {
      allow read: if false;
      allow write: if true;
    }

    // 방문자 통계: 읽기/쓰기 모두 가능 (익명)
    match /visitors/{visitorId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**게시** 버튼 클릭

---

### 4단계: 재배포 트리거 (1분)

GitHub Secrets 설정 후 재배포가 필요합니다.

#### 방법 A: 빈 커밋 푸시

```bash
git commit --allow-empty -m "chore: trigger redeploy with Firebase secrets"
git push origin main
```

#### 방법 B: GitHub Actions에서 수동 실행

1. https://github.com/Maccrey/personalplay/actions
2. **Deploy to GitHub Pages** 워크플로우 선택
3. **Run workflow** → **Run workflow** 클릭

---

### 5단계: 배포 확인 (2분)

#### 5-1. GitHub Actions 상태 확인
https://github.com/Maccrey/personalplay/actions

- 최신 워크플로우 실행이 녹색 체크 표시 ✅ 되면 성공

#### 5-2. GitHub Pages 접속

GitHub Pages URL로 접속:
- https://maccrey.github.io/personalplay/

#### 5-3. 방문자 카운터 확인

페이지 하단에서 다음이 표시되어야 합니다:

```
📅 오늘 방문자: 1
👥 전체 방문자: 1
© 2025 PersonaPlay. All rights reserved.
```

방문자 수가 증가하면 **성공**입니다! 🎉

---

## 🔍 트러블슈팅

### 문제 1: 방문자 수가 0으로 표시됨

**원인:** Firebase Secrets가 제대로 설정되지 않음

**해결:**
1. GitHub Secrets 7개가 모두 설정되었는지 확인
2. Secret 이름에 오타가 없는지 확인 (대소문자 구분)
3. 재배포 (4단계 반복)

### 문제 2: 콘솔에 Firebase 에러

**원인:** Firestore 보안 규칙 미설정

**해결:**
1. 3단계 다시 실행 (Firestore 보안 규칙 설정)
2. 브라우저 새로고침 (Ctrl+Shift+R)

### 문제 3: 빌드 실패

**원인:** 환경 변수가 빌드 시 로드되지 않음

**해결:**
1. GitHub Actions 로그 확인
2. Secrets 재확인
3. 워크플로우 수동 재실행

### 문제 4: 여전히 © 2024로 표시됨

**원인:** 브라우저 캐시

**해결:**
1. 하드 리프레시 (Ctrl+Shift+R)
2. 시크릿 모드로 접속
3. 5분 대기 (CDN 캐시 업데이트)

---

## 📊 배포 완료 체크리스트

- [ ] Firebase 웹 앱 설정 복사 완료
- [ ] GitHub Secrets 7개 등록 완료
- [ ] Firestore 보안 규칙 설정 완료
- [ ] 재배포 트리거 완료
- [ ] GitHub Actions 배포 성공 확인
- [ ] GitHub Pages 접속 가능
- [ ] 방문자 카운터 작동 확인
- [ ] © 2025 표시 확인

모든 항목에 체크하면 배포 완료! 🎉

---

## 📞 추가 도움말

- Firebase Console: https://console.firebase.google.com/project/personaplay-d005d
- GitHub Actions: https://github.com/Maccrey/personalplay/actions
- GitHub Secrets: https://github.com/Maccrey/personalplay/settings/secrets/actions
- 상세 가이드: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

---

**배포 시간:** 약 10분
**난이도:** ⭐⭐ (중)
**비용:** 무료 (Firebase + GitHub Pages)
