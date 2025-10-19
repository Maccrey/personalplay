# Maccre - 다국어 심리테스트 플랫폼

재미있고 전문적인 다국어 심리테스트 플랫폼 (한국어/영어/일본어 지원)

## 🌐 주요 특징

- **🧪 60개의 전문 심리테스트** - ADHD, MBTI, 연애, 학습, 트렌드, 취미 등 6개 카테고리
- **🌍 다국어 지원** - 한국어, 영어, 일본어 자동 감지 및 전환
- **📱 모바일 최적화** - 반응형 디자인과 빠른 로딩
- **🎨 SNS 공유 최적화** - OG 태그 및 이미지 자동 생성
- **🔍 SEO 최적화** - Multilingual SEO, hreflang 태그, sitemap
- **💰 AdSense 준비 완료** - GDPR/CCPA 준수 쿠키 동의 관리
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

1. Firebase 프로젝트 생성 및 Firestore 활성화
2. `.env.local` 파일 생성:
   ```bash
   cd web
   cp .env.example .env.local
   # .env.local 파일을 편집하여 Firebase 설정 입력
   ```
3. 데이터 마이그레이션:
   ```bash
   npm run migrate
   ```

자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md) 참조

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
│   │   ├── ko.json               # 한국어 번역 (60개 테스트 포함)
│   │   ├── en.json               # 영어 번역 (60개 테스트 포함)
│   │   └── ja.json               # 일본어 번역 (60개 테스트 포함)
│   ├── data/
│   │   ├── tests.json            # 60개 테스트 데이터 (로컬 백업)
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

## 📊 60개 테스트 목록

### 💕 연애 & 관계 (9개)
1. 내가 연애할 때 캐릭터는?
22. MBTI별 이상형
24. MBTI별 연애 궁합
31. 섹스리스 관계 진단
32. 사랑 유형 (6가지)
33. 성인 애착 유형 (ECR)
37. 여자친구 이별 확률
38. 남자친구 이별 확률
39. 에겐남 테토녀 검사기

### 🧠 성격 & 심리 (10개)
2. 친구관계 테스트
4. 휴가 성향
5. 밈 성향
6. MBTI 동물상
7. SNS 중독도
8. 스트레스 해소법
34. 문장완성 검사 (SCT)
35. 간이 MMPI
36. TCI 기질 & 성격
**60. ADHD 자가진단 테스트** ✨ NEW

### 📚 학습 & 교육 (7개)
23. MBTI별 학습법
25. VARK 학습 유형
26. Felder-Silverman 학습 스타일
27. Kolb 경험학습 유형
28. 자기조절학습
29. 학습 동기 유형
30. U&I 학습유형

### 🌟 라이프스타일 (14개)
3. 직장 성격
9. 카페 음료 성격
10. 여행 스타일
11. 소비 습관
12. 식습관
13. 운동 성향
14. 수면 패턴
15. 독서 스타일
16. 음악 취향
17. 청소 습관
18. 반려동물 육아 스타일
19. 패션 감각
20. 게임 성향
21. 영화 취향

### 🔥 트렌드 & 밈 (10개)
40. 유행어 마스터
41. 챌린지 참여도
42. 숏폼 콘텐츠 중독
43. 온라인 커뮤니티 활동
44. 이모티콘 사용 스타일
45. 스트리밍 시청 패턴
46. 밈 크리에이터 잠재력
47. 온라인 쇼핑 트렌드 민감도
48. 디지털 노마드 성향
49. Z세대 트렌드 이해도

### 🎭 취미 & 엔터 (10개)
50. K-POP 팬 레벨
51. 드라마 정주행 성향
52. 요리 실력 & 관심도
53. 사진/영상 촬영 열정
54. 보드게임/방탈출 매니아도
55. 공연/전시 문화생활
56. 애니메이션 오타쿠 레벨
57. DIY & 수공예 열정
58. 스포츠 관람 & 응원
59. 악기 연주 & 음악 창작

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
- ✅ **Dynamic Sitemap** - 60개 테스트 + 6개 카테고리 포함
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

### AdSense 준비 상태

- ✅ 4개 광고 슬롯 (TOP, IN-ARTICLE, BOTTOM, STICKY)
- ✅ GDPR/CCPA 준수 동의 관리
- ✅ 동의 거부 시 광고 비활성화
- ✅ A/B 테스트 인프라

### 광고 슬롯 위치

1. **TOP** - 결과 페이지 상단
2. **IN-ARTICLE** - 결과 설명 하단
3. **BOTTOM** - 페이지 하단
4. **STICKY** - 우측 하단 고정 (모바일 숨김)

## 🧪 테스트

### E2E 테스트

```bash
# Playwright 설치
npx playwright install

# 테스트 실행
npm run dev  # 서버 실행
npx playwright test
```

### 테스트 커버리지

- ✅ 테스트 엔진
- ✅ 다국어 전환
- ✅ OG 메타 태그
- ✅ 광고 슬롯
- ✅ 동의 관리
- ✅ Analytics

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
- **Testing**: Playwright E2E
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

Firebase 프로젝트 생성 및 설정은 [DEPLOYMENT.md](DEPLOYMENT.md) 참조

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
