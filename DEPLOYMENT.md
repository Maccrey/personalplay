# GitHub Pages + Firebase 배포 가이드

이 프로젝트는 **GitHub Pages**에 프론트엔드를 배포하고 **Firebase Firestore**를 데이터베이스로 사용합니다.

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [Firebase 설정](#firebase-설정)
3. [GitHub Pages 설정](#github-pages-설정)
4. [배포 프로세스](#배포-프로세스)
5. [로컬 개발](#로컬-개발)

---

## 아키텍처 개요

```
┌─────────────────────┐
│   GitHub Pages      │
│   (Static Frontend) │
│   - Next.js Export  │
│   - HTML/CSS/JS     │
└──────────┬──────────┘
           │
           │ Firebase SDK
           │ (Client-side)
           │
           ▼
┌─────────────────────┐
│    Firebase         │
│    - Firestore DB   │
│    - Analytics      │
└─────────────────────┘
```

### 주요 특징

- **Next.js Static Export**: API Routes 없이 순수 정적 사이트로 빌드
- **Firebase Firestore**: 테스트 데이터, 카테고리, 번역, 분석 데이터 저장
- **GitHub Actions**: 자동 빌드 및 배포
- **무료 호스팅**: GitHub Pages + Firebase 무료 플랜

---

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 이름: `personaplay-d005d` (또는 원하는 이름)

### 2. Firestore Database 활성화

1. Firebase Console → **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **프로덕션 모드**로 시작 (또는 테스트 모드)
4. 리전 선택: `asia-northeast3` (서울) 권장

### 3. 보안 규칙 설정

Firestore 보안 규칙을 다음과 같이 설정:

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

### 4. Firebase 웹 앱 등록

1. Firebase Console → **프로젝트 설정** → **일반**
2. **앱 추가** → **웹** 선택
3. 앱 닉네임 입력 후 등록
4. **Firebase SDK 스니펫** → **구성** 선택
5. `firebaseConfig` 객체 복사

### 5. Firebase 설정 업데이트

[web/lib/firebase.js](web/lib/firebase.js) 파일의 `firebaseConfig`를 업데이트:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 6. 서비스 계정 키 생성 (데이터 마이그레이션용)

1. Firebase Console → **프로젝트 설정** → **서비스 계정**
2. **새 비공개 키 생성** 클릭
3. JSON 파일 다운로드
4. `web/lib/firebase-admin.js` 파일에 서비스 계정 정보 추가

**⚠️ 보안 경고**: `firebase-admin.js` 파일은 절대 Git에 커밋하지 마세요!

### 7. 데이터 마이그레이션

로컬에서 테스트 데이터를 Firestore로 마이그레이션:

```bash
cd web
npm run migrate
```

출력 예시:
```
🚀 Starting Firestore migration...
📝 Uploading tests data...
✅ Test 1: 내가 연애할 때 캐릭터는?
...
✨ 60 tests uploaded successfully!
📁 Uploading categories data...
✨ 6 categories uploaded successfully!
🌍 Uploading translation data...
✨ 3 translation files uploaded successfully!
🎉 Migration completed successfully!
```

---

## GitHub Pages 설정

### 1. GitHub Repository Settings

1. GitHub 리포지토리 → **Settings** → **Pages**
2. **Source**: GitHub Actions 선택
3. 저장

### 2. Workflow 확인

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 파일이 자동으로 생성되었습니다.

워크플로우는 다음 작업을 수행합니다:
- `main` 브랜치에 푸시할 때 자동 실행
- Node.js 18 환경 설정
- 의존성 설치 (`npm ci`)
- Next.js 정적 빌드 (`npm run build`)
- GitHub Pages에 배포

### 3. 배포 확인

1. `main` 브랜치에 커밋 푸시
2. GitHub Actions 탭에서 워크플로우 실행 확인
3. 배포 완료 후 `https://<your-username>.github.io/<repo-name>/` 접속

---

## 배포 프로세스

### 자동 배포 (권장)

1. 코드 수정
2. Git 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "Update tests"
   git push origin main
   ```
3. GitHub Actions가 자동으로 빌드 및 배포

### 수동 배포

```bash
cd web
npm run build
# out/ 디렉토리가 생성됨
```

---

## 로컬 개발

### 1. 환경 설정

```bash
cd web
npm install
```

### 2. Firebase 설정

- `lib/firebase.js`에서 Firebase 설정 확인
- `lib/firebase-admin.js`에서 서비스 계정 키 확인 (마이그레이션용)

### 3. 데이터 마이그레이션 (최초 1회)

```bash
npm run migrate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 5. 프로덕션 빌드 테스트

```bash
npm run build
npx serve out
```

---

## 파일 구조

```
myself-test/
├── web/
│   ├── lib/
│   │   ├── firebase.js              # Firebase 클라이언트 설정
│   │   ├── firebase-admin.js        # Firebase Admin SDK (🔐 비공개)
│   │   └── firestore-client.js      # Firestore 유틸리티 함수
│   ├── pages/
│   │   ├── index.js                 # 홈페이지
│   │   ├── category/[id].js         # 카테고리 페이지
│   │   ├── test/[id].js             # 테스트 페이지
│   │   └── result/[id].js           # 결과 페이지
│   ├── scripts/
│   │   └── migrate-to-firestore.js  # 데이터 마이그레이션 스크립트
│   ├── data/
│   │   ├── tests.json               # 60개 테스트 (로컬 백업)
│   │   └── categories.json          # 6개 카테고리 (로컬 백업)
│   ├── locales/
│   │   ├── ko.json                  # 한국어 번역
│   │   ├── en.json                  # 영어 번역
│   │   └── ja.json                  # 일본어 번역
│   ├── next.config.js               # Next.js 설정 (output: 'export')
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Actions 배포 워크플로우
└── DEPLOYMENT.md                    # 이 문서
```

---

## 주요 변경 사항

### 이전 (Vercel)

- Next.js API Routes 사용
- SSR/SSG 혼합
- `/api/tests`, `/api/categories` 엔드포인트

### 현재 (GitHub Pages + Firebase)

- Next.js Static Export (`output: 'export'`)
- 순수 정적 사이트 (SSG only)
- Firebase Firestore로 데이터 직접 호출
- API Routes 제거

---

## 트러블슈팅

### 빌드 실패

```bash
# 캐시 삭제 후 재빌드
rm -rf .next out node_modules
npm install
npm run build
```

### Firebase 연결 실패

1. `lib/firebase.js`의 설정 확인
2. Firebase Console에서 웹 앱이 등록되어 있는지 확인
3. Firestore 보안 규칙 확인

### 데이터 마이그레이션 실패

1. `lib/firebase-admin.js`의 서비스 계정 키 확인
2. Firebase Console에서 Firestore가 활성화되어 있는지 확인

---

## 비용 및 제한

### GitHub Pages

- **무료 플랜**: 1GB 저장소, 월 100GB 대역폭
- **제한사항**: 정적 사이트만 가능

### Firebase

- **무료 플랜 (Spark)**:
  - Firestore: 50,000 읽기/일, 20,000 쓰기/일
  - 저장소: 1GB
  - 네트워크: 10GB/월

- **유료 플랜 (Blaze)**: 사용량 기반 과금

---

## 보안 권장사항

1. **Firebase 보안 규칙** 엄격하게 설정
2. **서비스 계정 키** 절대 공개 리포지토리에 커밋하지 않기
3. **환경 변수** 사용 권장 (GitHub Secrets)
4. **API 키 제한** (Firebase Console에서 설정 가능)

---

## 참고 자료

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Firebase Firestore 문서](https://firebase.google.com/docs/firestore)
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

**Made with ❤️ using Next.js 14 + Firebase**

**🤖 Built with [Claude Code](https://claude.com/claude-code)**
