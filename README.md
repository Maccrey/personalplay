# Maccre - 다국어 심리테스트 플랫폼

재미있고 전문적인 다국어 심리테스트 플랫폼 (한국어/영어/일본어 지원)

## 🌐 주요 특징

- **🧪 88개의 전문 심리테스트** - 연애, 성격, 학습, 트렌드, 취미 등 6개 카테고리
- **🌍 다국어 지원** - 한국어, 영어, 일본어 자동 감지 및 전환
- **📱 모바일 최적화** - 반응형 디자인과 빠른 로딩
- **🎨 SNS 공유 최적화** - OG 태그 및 이미지 자동 생성
- **🔍 SEO 최적화** - Multilingual SEO, hreflang 태그, sitemap
- **💰 카카오 AdFit 연동** - GDPR/CCPA 준수 쿠키 동의 기반 광고 제어
- **📊 Analytics** - Firebase를 통한 사용자 행동 추적 및 통계
- **👥 실시간 방문자 카운터** - 오늘/전체 방문자 수 실시간 표시
- **⚡ Next.js 14** - Static Export로 최적화된 성능
- **🔥 Firebase + GitHub Pages** - 무료 호스팅 및 데이터베이스

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 16.x 이상
- npm 또는 yarn
- Firebase 프로젝트 (무료)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd myself-test

# 의존성 설치
cd web
npm install
```

### Firebase 설정

1. **Firebase 콘솔 접속** → 프로젝트 설정 → **내 앱**(</>)에서 SDK 구성 객체를 복사합니다.
2. `web/.env.local` 파일을 생성하고 아래 값으로 채웁니다.
   ```bash
   cd web
   cp .env.example .env.local
   ```
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=... # 선택
   ```
3. GitHub Actions 배포를 사용한다면 같은 값을 Repository Secrets (`Settings → Secrets and variables → Actions`)에 등록합니다.
4. 초기 데이터 업로드:
   ```bash
   npm run migrate
   ```
   Firestore와 번역 컬렉션이 모두 채워져야 프런트엔드가 정상 동작합니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
# 정적 파일이 out/ 디렉토리에 생성됨
```

## 🧹 저장소 정리 (2024)

- Playwright 기반 E2E 테스트 코드와 결과 디렉터리를 제거해 유지보수 범위를 단순화했습니다.
- `web/out/`, `web/node_modules/`, `firebase-debug.log` 등 빌드/로그 산출물을 리포지토리에서 비우고 `.gitignore` 규칙으로 관리합니다.
- Firebase 설정, GitHub Secrets, 번역 워크플로 안내를 README로 통합해 참조 위치를 하나로 정리했습니다.
- `translate_tests.py`를 경로 기반으로 리팩터링하여 절대 경로 의존성을 제거하고 다국어 생성 옵션을 추가했습니다.
- 연애 & 관계 카테고리를 30개 테스트로 확장하고 `scripts/add_love_tests.py`로 다국어 데이터와 로케일 번들을 일괄 업데이트했습니다.

## 📁 프로젝트 구조

```
myself-test/
├── web/                          # Next.js 애플리케이션
│   ├── lib/
│   │   ├── firebase.js           # Firebase 클라이언트 설정
│   │   ├── firebase-admin.js     # Firebase Admin SDK (🔐 비공개)
│   │   └── firestore-client.js   # Firestore 유틸리티 함수
│   ├── pages/
│   │   ├── test/[id].js          # 테스트 페이지
│   │   ├── result/[id].js        # 결과 페이지
│   │   ├── category/[id].js      # 카테고리 페이지
│   │   ├── _app.js               # 앱 래퍼 (LanguageProvider)
│   │   └── index.js              # 홈페이지
│   ├── scripts/
│   │   └── migrate-to-firestore.js  # 데이터 마이그레이션 스크립트
│   ├── components/
│   │   ├── LanguageSwitcher.js   # 언어 전환 버튼
│   │   ├── SEOHead.js            # 다국어 SEO 헤더
│   │   ├── ConsentBanner.js      # 쿠키 동의 배너
│   │   └── AdUnit.js             # 광고 유닛
│   ├── contexts/
│   │   └── LanguageContext.js    # 언어 상태 관리
│   ├── hooks/
│   │   ├── useTranslation.js     # 번역 훅
│   │   └── useAdScripts.js       # 광고 스크립트 훅
│   ├── utils/
│   │   ├── i18n.js               # 다국어 유틸리티
│   │   ├── analytics.js          # Analytics 유틸
│   │   └── consent.js            # 동의 관리
│   ├── locales/
│   │   ├── ko.json               # 한국어 번역 (88개 테스트 포함)
│   │   ├── en.json               # 영어 번역 (88개 테스트 포함)
│   │   └── ja.json               # 일본어 번역 (88개 테스트 포함)
│   ├── data/
│   │   ├── tests.json            # 88개 테스트 데이터 (로컬 백업)
│   │   └── categories.json       # 6개 카테고리 데이터 (로컬 백업)
│   ├── public/
│   │   └── robots.txt            # 검색엔진 최적화
│   ├── styles/
│   │   └── globals.css           # 글로벌 스타일
│   └── next.config.js            # Next.js 설정 (output: 'export')
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions 배포 워크플로우
├── DEPLOYMENT.md                 # 배포 가이드
└── README.md                     # 이 문서
```

## 🎮 사용 방법

### 1. 테스트 진행하기

1. 홈페이지에서 원하는 카테고리 선택
2. 테스트 선택 및 시작
3. 각 질문에 '예' 또는 '아니오'로 답변
4. 결과 확인 및 SNS 공유

### 2. 언어 변경하기

- 우측 상단 🌐 버튼 클릭
- 한국어(한), English(EN), 日本語(日) 중 선택
- 페이지 새로고침 후 선택한 언어로 표시

### 3. 새로운 테스트 추가하기

#### Step 1: tests.json에 테스트 추가

`web/data/tests.json`:

```json
{
  "id": "61",
  "title": "새로운 테스트 제목 (한국어)",
  "questions": [
    "첫 번째 질문?",
    "두 번째 질문?",
    "..."
  ],
  "results": [
    {
      "key": "A",
      "title": "결과 타입 A",
      "desc": "결과 설명"
    },
    {
      "key": "B",
      "title": "결과 타입 B",
      "desc": "결과 설명"
    }
  ]
}
```

#### Step 2: 번역 파일에 추가

`web/locales/ko.json`, `en.json`, `ja.json`의 `tests` 섹션에 추가:

```json
"61": {
  "title": "테스트 제목",
  "questions": [
    "질문 1",
    "질문 2"
  ],
  "results": {
    "A": {
      "title": "결과 A 제목",
      "desc": "결과 A 설명"
    },
    "B": {
      "title": "결과 B 제목",
      "desc": "결과 B 설명"
    }
  }
}
```

#### Step 3: 카테고리에 추가

`web/data/categories.json`의 해당 카테고리 `tests` 배열에 추가:

```json
{
  "id": "personality",
  "tests": ["2", "4", "5", "6", "7", "8", "34", "35", "36", "60", "61"]
}
```

#### Step 4: 아이콘 추가

`web/pages/category/[id].js`의 `getTestIcon` 함수에 추가:

```javascript
const icons = {
  // ... 기존 아이콘들
  60: "🧩",
  61: "🎯",  // 새 아이콘
};
```

## 📊 테스트 카테고리 현황

- 💕 **연애 & 관계**: 30개 테스트 (신규 23종 추가) — 첫인상 매력도, 연락 템포 궁합, 동거 준비 성향 등 최신 연애 트렌드를 반영한 콘텐츠.
- 🧠 **성격 & 심리**: 10개 — 스트레스, 자기이해, 심리 진단.
- 📚 **학습 & 교육**: 7개 — 학습 스타일, 동기, 자기조절 지수.
- 🌟 **라이프스타일**: 14개 — 소비, 건강, 루틴, 취향 분석.
- 🔥 **트렌드 & 밈**: 10개 — SNS·유행 적응도와 밈 감도 테스트.
- 🎭 **취미 & 엔터**: 10개 — 음악, 영화, 여행, 콘텐츠 소비 습관.

연애 & 관계 카테고리의 신규 테스트(IDs 100-122)는 한국어/영어/일본어 번역과 로컬라이징 번들을 동시에 업데이트해 글로벌 사용자도 즉시 참여할 수 있습니다.

## 🌍 다국어 지원

### 지원 언어

- 🇰🇷 **한국어 (ko)** - 기본 언어
- 🇺🇸 **English (en)** - 영어
- 🇯🇵 **日本語 (ja)** - 일본어

### 언어 감지 로직

1. **localStorage 우선**: 사용자가 이전에 선택한 언어
2. **브라우저 언어**: navigator.language 감지
3. **기본값**: 지원하지 않는 언어는 영어로 표시

### 번역 구조

```javascript
{
  "common": {
    "yes": "예",
    "no": "아니오"
  },
  "home": {
    "title": "PersonaPlay",
    "subtitle": "나를 알아가는 재미있는 심리테스트"
  },
  "tests": {
    "1": {
      "title": "내가 연애할 때 캐릭터는?",
      "questions": ["...", "..."],
      "results": {
        "A": {
          "title": "불타는 도파민형",
          "desc": "사랑은 전쟁이자 놀이!..."
        }
      }
    }
  }
}
```

## 🔍 SEO 최적화

### 구현된 SEO 기능

- ✅ **Multilingual Meta Tags** - og:locale, og:locale:alternate
- ✅ **Hreflang Tags** - 모든 페이지에 언어 대체 태그
- ✅ **Dynamic Sitemap** - 88개 테스트 + 6개 카테고리 포함
- ✅ **Robots.txt** - AI 크롤러 허용, 공격적 크롤러 차단
- ✅ **OG Images** - 동적 생성 (1200x630)
- ✅ **Structured Data** - JSON-LD 지원

### 도메인

**Production**: [https://maccre.com](https://maccre.com)

## 📈 Analytics 이벤트

### 추적 이벤트

- `test_started` - 테스트 시작
- `test_completed` - 테스트 완료 (점수, 결과 포함)
- `result_viewed` - 결과 페이지 조회
- `result_shared` - 공유 버튼 클릭
- `consent_given` / `consent_denied` - 쿠키 동의 상태

### 조회 방법

```bash
# 모든 이벤트
curl http://localhost:3000/api/track

# 특정 테스트
curl http://localhost:3000/api/track?test_id=60

# 최근 10개
curl http://localhost:3000/api/track?limit=10
```

## 💰 수익화

### 카카오 AdFit 운영

- ✅ 테스트 진행 화면의 질문/답변 사이에 카카오 광고 노출
- ✅ GDPR/CCPA 준수 동의 배너로 광고 허용 여부 제어
- ✅ `pp_consent` 커스텀 이벤트를 통해 동의 변경 시 실시간 반영

### 광고 슬롯 위치

- 테스트 페이지 질문 카드와 답변 버튼 사이 (카카오 AdFit)

## 🌐 번역 워크플로

1. 기준 데이터는 루트의 `tests_korean.json`이며, 번역본은 `tests_<lang>.json`으로 관리합니다.
2. `ANTHROPIC_API_KEY`를 환경 변수로 설정한 뒤 다음 명령으로 다국어 JSON을 생성합니다.
   ```bash
   python translate_tests.py --languages en ja --output-dir .
   ```
3. 생성된 결과를 검토한 후 `web/locales/<lang>.json`과 `web/data/tests.json`에 반영하고, 변경 사항은 `translation_log.txt`에 요약합니다.
4. 대규모 번역 업데이트는 별도 브랜치/PR로 분리해 리뷰와 배포를 안정적으로 진행합니다.
5. 연애 & 관계 테스트를 대량으로 확장할 때는 예시 스크립트인 `scripts/add_love_tests.py`를 참고하면 다국어 데이터 구조를 한 번에 추가할 수 있습니다.

## 🧪 테스트 & QA

- 유지보수 범위 단순화를 위해 Playwright 기반 자동화 테스트를 제거했습니다.
- 배포 전에 아래 수동 시나리오를 필수로 확인하세요.
  - 홈 → 카테고리 → 테스트 → 결과 페이지 전체 흐름
  - 언어 스위처(ko/en/ja) 동작 및 번역 누락 여부
  - 동의 배너 표시/거부 시 Analytics 및 광고 상태 변화
  - 방문자 카운터 숫자와 Firebase write 오류 (브라우저 콘솔에서 확인)
- 버그 리포트 시 브라우저/장치 정보와 함께 `npm run dev` 로그, 콘솔 메시지를 첨부하면 원인 파악이 빠릅니다.

## 🔒 보안 & 개인정보

- **쿠키**: localStorage 사용 (언어 설정, 동의 상태만 저장)
- **개인정보**: 수집하지 않음
- **Analytics**: 익명 통계만 수집
- **GDPR/CCPA**: 사용자 동의 기반 광고 표시

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (Static Export)
- **Language**: JavaScript (React)
- **Styling**: CSS Modules + Global CSS
- **State Management**: React Context API
- **Database**: Firebase Firestore
- **i18n**: Custom hook + JSON translations
- **Analytics**: Firebase Analytics
- **Testing**: Manual QA checklist (필수 사용자 여정 점검)
- **Deployment**: GitHub Pages + GitHub Actions

## 🚀 배포

### GitHub Pages 자동 배포

1. `main` 브랜치에 푸시하면 자동 배포
2. GitHub Actions에서 빌드 진행 확인
3. 배포 완료 후 `https://<username>.github.io/<repo>/` 접속

### 수동 배포

```bash
cd web
npm run build
# out/ 디렉토리의 정적 파일을 호스팅
```

### Firebase 설정

위의 **Firebase 설정** 절차를 마치고 동일한 값을 GitHub Secrets에도 등록해야 자동 배포가 성공합니다.

**⚠️ 보안 주의**: `lib/firebase-admin.js` 파일은 절대 Git에 커밋하지 마세요!

## 🐛 문제 해결

### 빌드 오류

```bash
rm -rf .next
npm run build
```

### 포트 충돌

```bash
PORT=3001 npm run dev
```

### 언어 전환 안됨

```javascript
// 브라우저 콘솔에서 초기화
localStorage.removeItem('language');
window.location.reload();
```

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 🤝 기여

이슈 및 PR 환영합니다!

## 📞 문의

프로젝트 관련 문의는 이슈로 등록해주세요.

---

**Made with ❤️ using Next.js 14**

**🤖 Built with [Claude Code](https://claude.com/claude-code)**
