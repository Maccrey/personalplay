import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data.tests || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>PersonaPlay - 나를 알아가는 재미있는 심리테스트</title>
        <meta name="description" content="MBTI, 연애 성향, 스트레스 해소법 등 다양한 심리테스트로 나를 발견하세요!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="fade-in">
        {/* Hero Section */}
        <section style={{
          background: 'var(--gradient-primary)',
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
          textAlign: 'center',
          color: 'white',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <div className="container">
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              marginBottom: 'var(--spacing-md)',
              color: 'white'
            }}>
              PersonaPlay
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: 'var(--spacing-xl)',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              나를 알아가는 재미있는 심리테스트
              <br />
              지금 바로 나의 성격을 발견해보세요!
            </p>
          </div>
        </section>

        {/* Tests Grid */}
        <section className="container" style={{ paddingBottom: 'var(--spacing-2xl)' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
            fontSize: '2rem'
          }}>
            인기 테스트
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/test/${test.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '2rem'
                  }}>
                    {getTestIcon(test.id)}
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text)'
                  }}>
                    {test.title}
                  </h3>

                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.95rem',
                    marginBottom: 'var(--spacing-md)',
                    flex: 1
                  }}>
                    {getTestDescription(test.id)}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-tertiary)'
                    }}>
                      {test.questions?.length || 0}개 질문
                    </span>
                    <span className="gradient-text" style={{
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      시작하기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: 'var(--color-bg-tertiary)',
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          textAlign: 'center',
          marginTop: 'var(--spacing-2xl)'
        }}>
          <div className="container">
            <p style={{
              color: 'var(--color-text-tertiary)',
              fontSize: '0.875rem',
              marginBottom: '0'
            }}>
              © 2024 PersonaPlay. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

function getTestIcon(id) {
  const icons = {
    '1': '💕',
    '2': '👥',
    '3': '💼',
    '4': '🌴',
    '5': '😂',
    '6': '🐾',
    '7': '📱',
    '8': '😌',
    '9': '☕',
    '10': '✈️',
    '11': '💰',
    '12': '🍽️',
    '13': '💪',
    '14': '😴',
    '15': '📚',
    '16': '🎵',
    '17': '🧹',
    '18': '🐶',
    '19': '👗',
    '20': '🎮',
    '21': '🎬',
    '22': '💝',
    '23': '📖',
    '24': '💑',
    '25': '🎓',
    '26': '🧠',
    '27': '🔄',
    '28': '📊',
    '29': '🎯',
    '30': '💡',
    '31': '💔',
    '32': '❤️',
    '33': '🤝',
    '34': '✍️',
    '35': '🧬',
    '36': '🌟'
  };
  return icons[id] || '✨';
}

function getTestDescription(id) {
  const descriptions = {
    '1': '연애할 때 나는 어떤 캐릭터일까? 나의 연애 스타일을 알아보세요!',
    '2': '친구들 사이에서 나는 어떤 역할? 나의 우정 스타일을 확인하세요!',
    '3': '직장에서 나의 일하는 스타일은? 업무 성향을 파악해보세요!',
    '4': '여가 시간을 어떻게 보내나요? 나의 취향을 발견하세요!',
    '5': '밈으로 소통하는 당신! 밈 활용 능력을 테스트해보세요!',
    '6': 'MBTI를 동물로 표현하면? 나를 닮은 동물을 찾아보세요!',
    '7': 'SNS 사용 패턴으로 보는 나! 디지털 라이프스타일을 확인하세요!',
    '8': '스트레스를 어떻게 푸나요? 나만의 해소법을 알아보세요!',
    '9': '카페 음료로 보는 성격! 나를 표현하는 음료를 찾아보세요!',
    '10': '여행 스타일로 알아보는 나! 나의 여행 취향을 발견하세요!',
    '11': '나는 플렉스? 알뜰? 미니멀? 소비 습관을 분석해보세요!',
    '12': '미식가 vs 편의주의자? 나의 식습관을 확인하세요!',
    '13': '운동 마니아인지 아닌지? 나의 운동 성향을 알아보세요!',
    '14': '올빼미족? 종달새족? 나의 수면 패턴을 분석해보세요!',
    '15': '책벌레인가요? 나의 독서 스타일을 확인하세요!',
    '16': '음악 마니아인지 테스트! 나의 음악 취향을 알아보세요!',
    '17': '깔끔 대장? 자유로운 영혼? 청소 습관을 확인하세요!',
    '18': '진정한 집사인가요? 반려동물 스타일을 알아보세요!',
    '19': '패셔니스타 vs 무관심러? 나의 패션 감각을 확인하세요!',
    '20': '게이머 vs 비게이머? 나의 게임 성향을 알아보세요!',
    '21': '영화광인가요? 나의 영화 취향을 확인하세요!',
    '22': 'MBTI 기반 이상형 찾기! 나와 맞는 성격 유형을 알아보세요!',
    '23': 'MBTI로 나만의 효과적인 학습법을 찾아보세요!',
    '24': 'MBTI로 알아보는 연인과의 궁합도! 우리는 얼마나 잘 맞을까요?',
    '25': 'VARK 학습유형 검사! 시각/청각/읽기/체험 중 나는?',
    '26': 'Felder-Silverman 학습 스타일! 나의 학습 성향은?',
    '27': 'Kolb의 경험 학습유형! 확산/동화/수렴/적응 중 나는?',
    '28': '자기조절학습 능력 체크! 독립적 학습자인가요?',
    '29': '학습동기유형 검사! 내재적 vs 외재적 동기는?',
    '30': 'U&I 학습유형! 이해 중심 vs 정보 중심?',
    '31': 'Sexless 관계 검사! 우리 관계는 건강한가요?',
    '32': '사랑 유형 검사! 에로스/스토르게/루두스/프라그마/마니아/아가페',
    '33': '성인 애착 유형 검사! 안정/불안/회피/혼란 중 나는?',
    '34': '문장 완성 검사(SCT)! 투사적 기법으로 자기인식 높이기',
    '35': '간소화 MMPI 성격 검사! 다면적 인성 평가해보세요',
    '36': 'TCI 기질 및 성격 검사! 자극추구/위험회피/사회성/인내력 측정'
  };
  return descriptions[id] || '재미있는 심리테스트를 경험해보세요!';
}
