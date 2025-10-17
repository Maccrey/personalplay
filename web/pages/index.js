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
    '10': '✈️'
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
    '10': '여행 스타일로 알아보는 나! 나의 여행 취향을 발견하세요!'
  };
  return descriptions[id] || '재미있는 심리테스트를 경험해보세요!';
}
