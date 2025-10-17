import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import AdUnit from "@/components/AdUnit";
import useAdScripts from "@/hooks/useAdScripts";
import { trackEvent } from "@/utils/analytics";

export default function TestPage({ initialTest }) {
  const router = useRouter();
  const { id } = router.query;
  const [def, setDef] = useState(initialTest || null);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    if (def) return; // server-side provided
    if (!id) return;
    fetch("/api/tests")
      .then((r) => r.json())
      .then((data) => {
        const t = data.tests.find((x) => x.id === id);
        setDef(t);
      });
  }, [id, def]);

  // Track test start
  useEffect(() => {
    if (def && id) {
      trackEvent("test_started", {
        test_id: id,
        test_title: def.title,
      });
    }
  }, [def, id]);

  if (!def) {
    return (
      <div className="container" style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}>
        <p>로딩 중 또는 테스트가 없습니다.</p>
      </div>
    );
  }

  function handleAnswer(value) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < def.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // All questions answered, calculate result
      const score = newAnswers.reduce((s, v) => s + (v ? 1 : 0), 0);
      const threshold = Math.ceil(def.questions.length / 2);
      const result = score >= threshold ? def.results[0] : def.results[1];

      // Track test completion
      trackEvent("test_completed", {
        test_id: id,
        test_title: def.title,
        score: score,
        total_questions: def.questions.length,
        result_key: result.key,
      });

      router.push(`/result/${id}?r=${result.key}`);
    }
  }

  const isAdsReady = useAdScripts();
  const progress = ((currentQ + 1) / def.questions.length) * 100;

  return (
    <>
      <Head>
        <title>{def.title} - PersonaPlay</title>
        <meta name="description" content={`${def.title} - 나를 알아가는 재미있는 심리테스트`} />
      </Head>

      <main className="fade-in">
        {/* Header */}
        <header style={{
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--spacing-md) 0'
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Link href="/" style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none'
            }}>
              PersonaPlay
            </Link>
          </div>
        </header>

        {isAdsReady && (
          <div className="container" style={{ marginTop: 'var(--spacing-lg)' }}>
            <AdUnit unitId="TOP_BANNER" />
          </div>
        )}

        {/* Test Container */}
        <div className="container" style={{
          maxWidth: '720px',
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
          minHeight: '60vh'
        }}>
          {/* Progress Bar */}
          <div style={{
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <h1 style={{
                fontSize: '1.5rem',
                margin: 0
              }}>
                {def.title}
              </h1>
              <span style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-tertiary)',
                fontWeight: '600'
              }}>
                {currentQ + 1} / {def.questions.length}
              </span>
            </div>
            <div style={{
              height: '8px',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'var(--gradient-primary)',
                width: `${progress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question Card */}
          <div className="card" style={{
            marginBottom: 'var(--spacing-xl)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
          }}>
            <p style={{
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: 'var(--color-text)',
              marginBottom: 0,
              fontWeight: '500'
            }}>
              {def.questions[currentQ]}
            </p>
          </div>

          {/* Answer Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <button
              className="btn"
              data-question-index={currentQ}
              data-answer="1"
              onClick={() => handleAnswer(1)}
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              예
            </button>
            <button
              className="btn"
              data-question-index={currentQ}
              data-answer="0"
              onClick={() => handleAnswer(0)}
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              아니오
            </button>
          </div>

          {isAdsReady && (
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <AdUnit unitId="IN_ARTICLE" />
            </div>
          )}
        </div>

        {isAdsReady && (
          <div className="container">
            <AdUnit unitId="SIDEBAR" />
            <AdUnit unitId="BOTTOM_BANNER" />
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");
  const p = path.join(process.cwd(), "data", "tests.json");
  const raw = fs.readFileSync(p, "utf8");
  const obj = JSON.parse(raw);
  const paths = (obj.tests || []).map((t) => ({ params: { id: t.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { id } = context.params || {};
  const fs = require("fs");
  const path = require("path");
  try {
    const p = path.join(process.cwd(), "data", "tests.json");
    const raw = fs.readFileSync(p, "utf8");
    const obj = JSON.parse(raw);
    const t = obj.tests.find((x) => x.id === id) || null;
    return { props: { initialTest: t } };
  } catch (e) {
    return { props: { initialTest: null } };
  }
}
