# GitHub Secrets 설정 가이드

GitHub Pages 배포 시 Firebase 설정을 안전하게 사용하기 위해 GitHub Secrets를 설정합니다.

## 📋 단계별 가이드

### 1단계: Firebase Console에서 웹 앱 설정 가져오기

1. [Firebase Console](https://console.firebase.google.com/project/personaplay-d005d/settings/general) 접속
2. **일반** 탭 → 아래로 스크롤 → **내 앱** 섹션
3. 웹 앱 (</> 아이콘) 선택 또는 **앱 추가** 클릭
4. **SDK 설정 및 구성** → **구성** 선택
5. `firebaseConfig` 객체의 각 값을 복사

예시:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                              // ← 이 값 복사
  authDomain: "personaplay-d005d.firebaseapp.com",  // ← 이 값 복사
  projectId: "personaplay-d005d",                   // ← 이 값 복사
  storageBucket: "personaplay-d005d.appspot.com",   // ← 이 값 복사
  messagingSenderId: "1090384844598",               // ← 이 값 복사
  appId: "1:1090384844598:web:abc123...",          // ← 이 값 복사
  measurementId: "G-ABC123XYZ"                      // ← 이 값 복사 (선택사항)
};
```

### 2단계: GitHub Repository Secrets 설정

1. GitHub 리포지토리 페이지 접속
   - https://github.com/Maccrey/personalplay

2. **Settings** 탭 클릭

3. 왼쪽 사이드바에서 **Secrets and variables** → **Actions** 클릭

4. **New repository secret** 버튼 클릭

5. 다음 Secrets를 하나씩 추가:

#### Secret 1: NEXT_PUBLIC_FIREBASE_API_KEY
- **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Secret**: Firebase의 `apiKey` 값 붙여넣기
- **Add secret** 클릭

#### Secret 2: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Secret**: Firebase의 `authDomain` 값 붙여넣기
- **Add secret** 클릭

#### Secret 3: NEXT_PUBLIC_FIREBASE_PROJECT_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Secret**: Firebase의 `projectId` 값 붙여넣기
- **Add secret** 클릭

#### Secret 4: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Secret**: Firebase의 `storageBucket` 값 붙여넣기
- **Add secret** 클릭

#### Secret 5: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Secret**: Firebase의 `messagingSenderId` 값 붙여넣기
- **Add secret** 클릭

#### Secret 6: NEXT_PUBLIC_FIREBASE_APP_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Secret**: Firebase의 `appId` 값 붙여넣기
- **Add secret** 클릭

#### Secret 7: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (선택사항)
- **Name**: `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- **Secret**: Firebase의 `measurementId` 값 붙여넿기
- **Add secret** 클릭

### 3단계: Secrets 확인

설정 완료 후 다음 7개의 Secrets가 표시되어야 합니다:

```
Repository secrets
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### 4단계: 코드 푸시 및 배포

Secrets 설정이 완료되면:

```bash
git add .
git commit -m "chore: configure Firebase environment variables"
git push origin main
```

푸시하면 GitHub Actions가 자동으로:
1. Secrets를 환경 변수로 로드
2. Next.js 빌드 시 Firebase 설정에 주입
3. GitHub Pages에 배포

### 5단계: 배포 확인

1. GitHub 리포지토리 → **Actions** 탭
2. 최신 워크플로우 실행 확인
3. 성공하면 GitHub Pages에서 방문자 카운터 작동 확인

---

## 🔍 트러블슈팅

### Secret이 적용되지 않는 경우

1. Secret 이름 확인 (대소문자 구분)
2. GitHub Actions 워크플로우 재실행
3. 브라우저 캐시 삭제 (Ctrl+Shift+R)

### 로컬 개발 환경

로컬에서는 `web/.env.local` 파일 사용:

```bash
cd web
cp .env.example .env.local
# .env.local 파일을 편집하여 Firebase 설정 입력
```

---

## ⚠️ 보안 참고사항

- **Firebase API 키는 공개 정보**입니다 (클라이언트 사이드용)
- 보안은 **Firestore 보안 규칙**으로 관리됩니다
- GitHub Secrets는 로그에 표시되지 않습니다
- `.env.local` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다

---

## 📞 빠른 설정 링크

- Firebase Console: https://console.firebase.google.com/project/personaplay-d005d/settings/general
- GitHub Secrets: https://github.com/Maccrey/personalplay/settings/secrets/actions

설정 완료 후 배포하면 방문자 카운터가 정상 작동합니다! 🎉
