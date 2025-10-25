import fs from "fs";
import path from "path";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "../../utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthButton from "@/components/AuthButton";
import SaveResultButton from "@/components/SaveResultButton";
import { useTranslation } from "@/hooks/useTranslation";
import { getTestById } from "../../lib/tests-data";

export default function ResultPage() {
  const router = useRouter();
  const { id, r } = router.query;
  const { t, locale } = useTranslation();
  const [res, setRes] = useState(null);
  const [testInfo, setTestInfo] = useState(null);

  useEffect(() => {
    if (!id || !r) return;

    // Fetch test data from JSON files
    getTestById(id, locale).then((testData) => {
      if (testData) {
        setTestInfo(testData);

        // Results are now an object, not an array
        const result = testData.results?.[r];
        if (result) {
          setRes({ ...result, key: r });

          // Track result page view
          trackEvent("result_viewed", {
            test_id: id,
            result_key: r,
            result_title: result.title,
          });
        }
      }
    }).catch((error) => {
      console.error("Error fetching test:", error);
    });
  }, [id, r, locale]);

  if (!res) {
    return (
      <div className="container" style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  // Get translated content
  const testTitle = t(`tests.${id}.title`);
  const resultTitle = t(`tests.${id}.results.${r}.title`);
  const resultSummary = t(`tests.${id}.results.${r}.summary`);
  const resultDesc = t(`tests.${id}.results.${r}.description`);
  const characteristics = t(`tests.${id}.results.${r}.characteristics`) || [];
  const strengths = t(`tests.${id}.results.${r}.strengths`) || [];
  const weaknesses = t(`tests.${id}.results.${r}.weaknesses`) || [];
  const advice = t(`tests.${id}.results.${r}.advice`);

  const ogImageUrl = `/api/og/${id}?title=${encodeURIComponent(
    resultTitle || ""
  )}&desc=${encodeURIComponent(resultSummary || "")}`;

  return (
    <>
      <Head>
        <title>{resultTitle} - PersonaPlay</title>
        <meta property="og:title" content={resultTitle} />
        <meta property="og:description" content={resultSummary} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)'
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <AuthButton />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Result Container */}
        <div className="container" style={{
          maxWidth: '720px',
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
          minHeight: '60vh'
        }}>
          {/* Result Card */}
          <div className="card" style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
          }}>
            {/* Test Title */}
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--spacing-md)',
              fontWeight: '600'
            }}>
              {testTitle}
            </div>

            {/* Result Icon/Badge */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--spacing-lg)',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              🎉
            </div>

            {/* Result Title */}
            <h1 style={{
              fontSize: '2rem',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-text)',
              fontWeight: '700'
            }}>
              {resultTitle}
            </h1>

            {/* Result Summary */}
            <p style={{
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-md)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-md)',
              fontWeight: '600'
            }}>
              {resultSummary}
            </p>

            {/* Result Description */}
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '600px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              {resultDesc}
            </p>

            {/* Characteristics Section */}
            {Array.isArray(characteristics) && characteristics.length > 0 && (
              <div style={{
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-primary)'
                }}>
                  {t('result.characteristics')}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {characteristics.map((char, idx) => (
                    <li key={idx} style={{
                      marginBottom: 'var(--spacing-sm)',
                      paddingLeft: 'var(--spacing-md)',
                      position: 'relative',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--color-primary)'
                      }}>✓</span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths Section */}
            {Array.isArray(strengths) && strengths.length > 0 && (
              <div style={{
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'rgba(76, 175, 80, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(76, 175, 80, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-md)',
                  color: '#4CAF50'
                }}>
                  {t('result.strengths')}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {strengths.map((strength, idx) => (
                    <li key={idx} style={{
                      marginBottom: 'var(--spacing-sm)',
                      paddingLeft: 'var(--spacing-md)',
                      position: 'relative',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50'
                      }}>💪</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses Section */}
            {Array.isArray(weaknesses) && weaknesses.length > 0 && (
              <div style={{
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'rgba(255, 152, 0, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 152, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-md)',
                  color: '#FF9800'
                }}>
                  {t('result.weaknesses')}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {weaknesses.map((weakness, idx) => (
                    <li key={idx} style={{
                      marginBottom: 'var(--spacing-sm)',
                      paddingLeft: 'var(--spacing-md)',
                      position: 'relative',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#FF9800'
                      }}>⚠️</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advice Section */}
            {advice && (
              <div style={{
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'rgba(156, 39, 176, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(156, 39, 176, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-md)',
                  color: '#9C27B0'
                }}>
                  {t('result.advice')}
                </h3>
                <p style={{
                  margin: 0,
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.8'
                }}>
                  {advice}
                </p>
              </div>
            )}

            {/* Save Result Button */}
            <SaveResultButton
              testId={id}
              resultKey={r}
              testTitle={testTitle}
              resultTitle={resultTitle}
            />

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  // Track share event
                  trackEvent("result_shared", {
                    test_id: id,
                    result_key: r,
                    result_title: resultTitle,
                    share_method: navigator.share ? "native_share" : "clipboard",
                  });

                  if (navigator.share) {
                    navigator.share({
                      title: resultTitle,
                      text: resultDesc,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => alert(t('result.shareResult')))
                      .catch(() => alert("Failed to copy link"));
                  }
                }}
                className="btn btn-primary"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)'
                }}
              >
                {t('result.shareResult')}
              </button>

              <Link href="/" className="btn btn-secondary" style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                {t('common.home')}
              </Link>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

// Static Site Generation - 빌드 시 모든 결과 페이지 생성
export async function getStaticPaths() {
  let testIds = [];

  try {
    const dataPath = path.join(process.cwd(), "public", "data", "tests-ko.json");
    const fileContents = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(fileContents);
    testIds = Object.keys(parsed?.tests || {});
  } catch (error) {
    console.error("Failed to load test IDs for static paths:", error);
  }

  if (testIds.length === 0) {
    testIds = Array.from({ length: 60 }, (_, i) => String(i + 1));
  }

  return {
    paths: testIds.map((id) => ({
      params: { id },
    })),
    fallback: false, // Static export와 호환을 위해 모든 경로를 빌드 시 생성
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      testId: params.id,
    },
  };
}
