# 빠른 시작 가이드 (5분 완성)

GitHub Pages + Firebase로 프로젝트를 배포하는 빠른 가이드입니다.

## 1단계: Firebase 프로젝트 생성 (2분)

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `personaplay`)
4. Google Analytics 활성화 (선택사항)
5. **프로젝트 만들기** 클릭

## 2단계: Firestore 활성화 (1분)

1. Firebase Console → **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **프로덕션 모드**로 시작
4. 리전 선택: `asia-northeast3` (서울)
5. **보안 규칙** 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{testId} {
      allow read: if true;
      allow write: if false;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
    match /translations/{locale} {
      allow read: if true;
      allow write: if false;
    }
    match /analytics/{eventId} {
      allow read: if false;
      allow write: if true;
    }
    match /visitors/{visitorId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 3단계: Firebase 웹 앱 등록 (1분)

1. Firebase Console → **프로젝트 설정** (⚙️) → **일반**
2. **앱 추가** → **웹** (</> 아이콘) 선택
3. 앱 닉네임 입력 (예: `PersonaPlay Web`)
4. **앱 등록** 클릭
5. **Firebase SDK 스니펫** → **구성** 선택
6. `firebaseConfig` 객체를 복사해두기

## 4단계: 프로젝트 설정 (1분)

### Firebase 클라이언트 설정

`web/lib/firebase.js` 파일을 열고 `firebaseConfig`를 업데이트:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 서비스 계정 키 생성 (데이터 마이그레이션용)

1. Firebase Console → **프로젝트 설정** → **서비스 계정**
2. **새 비공개 키 생성** 클릭
3. JSON 다운로드
4. `web/lib/firebase-admin.js` 파일에 내용 붙여넣기

**⚠️ 주의**: 이 파일은 절대 Git에 커밋하지 마세요!

## 5단계: 데이터 마이그레이션

```bash
cd web
npm install
npm run migrate
```

성공하면 다음과 같이 출력됩니다:

```
🚀 Starting Firestore migration...
✨ 60 tests uploaded successfully!
✨ 6 categories uploaded successfully!
✨ 3 translation files uploaded successfully!
🎉 Migration completed successfully!
```

## 6단계: 로컬 테스트

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 7단계: GitHub Pages 배포

### GitHub Repository 설정

1. GitHub에 리포지토리 생성
2. 로컬 프로젝트를 푸시:

```bash
git init
git add .
git commit -m "Initial commit with Firebase integration"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

### GitHub Pages 활성화

1. GitHub 리포지토리 → **Settings** → **Pages**
2. **Source**: GitHub Actions 선택
3. 저장

### 자동 배포 확인

1. **Actions** 탭에서 워크플로우 실행 확인
2. 완료되면 `https://<username>.github.io/<repo>/` 접속

---

## 완료! 🎉

이제 프로젝트가 배포되었습니다!

- **프론트엔드**: GitHub Pages
- **데이터베이스**: Firebase Firestore
- **자동 배포**: GitHub Actions

### 다음 단계

- 테스트 추가: [README.md](README.md#새로운-테스트-추가하기) 참조
- 번역 추가: `web/locales/*.json` 파일 수정
- 커스터마이징: 디자인 및 기능 추가

### 문제 해결

- Firebase 연결 오류: `lib/firebase.js` 설정 확인
- 빌드 실패: `npm run build` 로그 확인
- 데이터 마이그레이션 실패: Firebase 보안 규칙 확인

자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요!
