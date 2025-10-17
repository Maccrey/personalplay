# PersonaPlay (퍼소나플레이)

재미있고 중독성 있는 개인 성향 테스트 플랫폼

## 📋 프로젝트 개요

PersonaPlay는 10~30대 타겟의 SNS 공유 중심 성향 테스트 플랫폼입니다. MBTI, 밈, 트렌드를 반영한 재미있는 테스트를 통해 자신의 캐릭터를 발견하고 결과를 공유할 수 있습니다.

### 주요 특징

- 🎯 **10개의 다양한 테스트** - 연애, 친구, 직장, MBTI 동물, SNS 중독도 등
- 📱 **모바일 최적화** - 8-12개 문항으로 빠른 참여
- 🎨 **SNS 공유 최적화** - OG 태그 및 이미지 자동 생성
- 💰 **AdSense 준비 완료** - 4개 광고 슬롯 구조화
- 🔬 **A/B 테스트** - 광고 레이아웃 실험 가능
- 🔒 **GDPR/CCPA 준수** - 쿠키 동의 관리
- 📊 **Analytics** - 사용자 행동 추적 및 통계

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 16.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd myself-test

# 의존성 설치
cd web
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
myself-test/
├── web/                      # Next.js 애플리케이션
│   ├── pages/
│   │   ├── api/
│   │   │   ├── tests.js      # 테스트 데이터 API
│   │   │   ├── track.js      # Analytics API
│   │   │   └── og/[id].js    # OG 이미지 생성
│   │   ├── test/[id].js      # 테스트 페이지
│   │   ├── result/[id].js    # 결과 페이지
│   │   └── index.js          # 홈페이지
│   ├── components/
│   │   ├── ConsentBanner.js  # 쿠키 동의 배너
│   │   └── AdUnit.js         # 광고 유닛
│   ├── utils/
│   │   ├── analytics.js      # Analytics 유틸
│   │   └── consent.js        # 동의 관리
│   ├── data/
│   │   └── tests.json        # 10개 테스트 데이터
│   └── jsconfig.json         # Path alias 설정
├── prd.md                    # 프로젝트 요구사항 문서
├── tasklist.md               # 개발 태스크 목록
└── README.md                 # 이 문서
```

## 🎮 사용 방법

### 1. 테스트 실행하기

1. 홈페이지에서 원하는 테스트 선택
2. 각 질문에 '예' 또는 '아니오'로 답변
3. "결과 보기" 버튼 클릭
4. 결과 확인 및 SNS 공유

### 2. 새로운 테스트 추가하기

`web/data/tests.json` 파일에 새로운 테스트를 추가:

```json
{
  "id": "11",
  "title": "새로운 테스트 제목",
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

### 3. A/B 테스트 실행하기

URL에 쿼리 파라미터 추가:

- Variant A: `http://localhost:3000/result/1?r=A&ab=A`
- Variant B: `http://localhost:3000/result/1?r=A&ab=B`

Variant B는 sticky 광고가 숨김 처리됩니다.

### 4. Analytics 데이터 확인하기

```bash
# 모든 이벤트 조회
curl http://localhost:3000/api/track

# 특정 이벤트 타입만 조회
curl http://localhost:3000/api/track?event_type=test_started

# 특정 테스트 이벤트만 조회
curl http://localhost:3000/api/track?test_id=1

# 최근 10개 이벤트만 조회
curl http://localhost:3000/api/track?limit=10
```

## 📊 추적되는 이벤트

- `test_started` - 테스트 시작
- `test_completed` - 테스트 완료 (점수, 결과 포함)
- `result_viewed` - 결과 페이지 조회
- `result_shared` - 공유 버튼 클릭
- `ab_experiment_view` - A/B 테스트 노출
- `consent_given` / `consent_denied` - 쿠키 동의 상태

## 🎨 커스터마이징

### OG 이미지 수정

`web/pages/api/og/[id].js` 파일에서 이미지 스타일 변경 가능

### 광고 슬롯 수정

`web/pages/result/[id].js`에서 광고 위치 및 개수 조정 가능

### 스타일 수정

`web/pages/result/[id].module.css`에서 결과 페이지 스타일 변경

## 🧪 테스트

### E2E 테스트 실행

```bash
# Playwright 설치 (최초 1회)
npx playwright install

# 테스트 실행
npm run dev  # 다른 터미널에서 서버 실행
npx playwright test --reporter=line
```

### 테스트된 기능

- ✅ 테스트 엔진 (5개 테스트 케이스)
- ✅ OG meta & 광고 슬롯 (6개 테스트 케이스)
- ✅ A/B 테스트 (7개 테스트 케이스)
- ✅ CMP 동의 관리 (7개 테스트 케이스)
- ✅ Analytics (7개 테스트 케이스)
- ✅ 10개 콘텐츠 (7개 테스트 케이스)

**총 39개 E2E 테스트 통과 ✅**

## 📦 API 엔드포인트

### GET /api/tests

모든 테스트 목록 조회

**Response:**
```json
{
  "tests": [
    {
      "id": "1",
      "title": "테스트 제목",
      "questions": ["질문1", "질문2"],
      "results": [{"key": "A", "title": "결과", "desc": "설명"}]
    }
  ]
}
```

### GET /api/track

Analytics 이벤트 조회

**Query Parameters:**
- `event_type` - 이벤트 타입 필터
- `test_id` - 테스트 ID 필터
- `limit` - 결과 개수 제한

**Response:**
```json
{
  "events": [...],
  "stats": {
    "total_events": 100,
    "event_types": {
      "test_started": 50,
      "test_completed": 40
    },
    "tests": {
      "1": 30,
      "2": 20
    }
  },
  "total": 100
}
```

### POST /api/track

이벤트 전송

**Request Body:**
```json
{
  "event": "custom_event",
  "test_id": "1",
  "custom_field": "value"
}
```

### GET /api/og/[id]

OG 이미지 생성 (1200x630)

**Query Parameters:**
- `title` - 결과 제목
- `desc` - 결과 설명

## 🔐 쿠키 동의 관리

- 첫 방문 시 자동으로 동의 배너 표시
- `localStorage`에 `pp_consent` 키로 저장
- 동의 시: 광고 활성화
- 거부 시: "광고 동의 필요" 메시지 표시

### 동의 상태 강제 설정 (개발용)

브라우저 콘솔에서:

```javascript
// 동의
localStorage.setItem('pp_consent', JSON.stringify({ads: true}));

// 거부
localStorage.setItem('pp_consent', JSON.stringify({ads: false}));

// 초기화
localStorage.removeItem('pp_consent');
```

## 💰 AdSense 연동 (준비 완료)

### 현재 상태

- ✅ 4개 광고 슬롯 구조화 완료
- ✅ TEST 모드로 플레이스홀더 배치
- ✅ 동의 관리 시스템 완비
- ✅ A/B 테스트 인프라 구축

### AdSense 연동 방법

1. `web/pages/result/[id].js`에서 `data-ad-client` 값을 실제 AdSense ID로 변경
2. `data-ad-slot` 값을 실제 광고 슬롯 ID로 변경
3. `data-test="true"` 속성 제거
4. `<meta name="adtest" content="on" />` 제거

### 광고 슬롯 위치

- `top` - 결과 페이지 상단
- `in-article` - 결과 카드 하단
- `bottom` - 페이지 하단
- `sticky` - 화면 우측 하단 고정 (모바일에서 숨김)

## 📈 성능 최적화

- ✅ SSG (Static Site Generation) 사용
- ✅ 이미지 lazy loading 준비
- ✅ 광고 스크립트 지연 로딩
- ✅ Next.js 14 최신 버전

## 🐛 문제 해결

### 포트 충돌 시

```bash
# 다른 포트에서 실행
PORT=3001 npm run dev
```

### 빌드 오류 시

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 테스트 실패 시

```bash
# 서버가 실행 중인지 확인
curl http://localhost:3000/api/tests

# Playwright 재설치
npx playwright install --force
```

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 🤝 기여

이슈 및 PR은 언제든 환영합니다!

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
