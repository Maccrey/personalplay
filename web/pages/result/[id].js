import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "../../utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { getTestById } from "../../lib/tests-data";

export default function ResultPage() {
  const router = useRouter();
  const { id, r } = router.query;
  const { t, locale } = useTranslation();
  const [res, setRes] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [adsEnabled, setAdsEnabled] = useState(false);

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

  useEffect(() => {
    // A/B 토글 쿼리 파라미터 처리: ?ab=A 또는 ?ab=B
    const params = new URLSearchParams(window.location.search);
    const ab = params.get("ab");
    if (ab) {
      // 광고 토글 이벤트 추적
      trackEvent("ab_experiment_view", {
        experiment: "ads_layout",
        variant: ab,
        page: "result",
      });
      // 간단히 data-ad-slot 속성을 변경하여 노출 구성 바꿀 수 있음
      document.documentElement.setAttribute("data-ab-variant", ab);
    }
  }, []);

  useEffect(() => {
    // consent 변경 이벤트를 청취하여 광고 노출 상태 업데이트
    function onConsentChange(e) {
      const c = e?.detail;
      const enabled = c?.ads === true;
      setAdsEnabled(enabled === true);
    }

    // 초기 상태 반영
    try {
      const raw = localStorage.getItem("pp_consent");
      const obj = raw ? JSON.parse(raw) : null;
      const enabled = obj?.ads === true;
      setAdsEnabled(enabled === true);
    } catch (e) {}

    window.addEventListener("pp:consent:changed", onConsentChange);
    return () =>
      window.removeEventListener("pp:consent:changed", onConsentChange);
  }, []);

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
        {/* AdSense 메타태그 */}
        <meta name="adtest" content="on" /> {/* 개발 중 테스트 모드 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
      </Head>

      <main className="fade-in">
        {/* Language Switcher */}
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100,
          }}
        >
          <LanguageSwitcher />
        </div>

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

        {/* Top Ad */}
        <div className="container" style={{ marginTop: 'var(--spacing-lg)' }} data-ad-slot="top" data-ads-slot-visible>
          {adsEnabled ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-TEST"
              data-ad-slot="TEST-TOP"
              data-ad-format="auto"
              data-full-width-responsive="true"
              data-test="true"
              data-ad-visible="true"
            />
          ) : (
            <div className="ads-disabled">{t('result.adsConsent')}</div>
          )}
        </div>

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

            {/* In-Article Ad */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }} data-ad-slot="in-article">
              {adsEnabled ? (
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", textAlign: "center" }}
                  data-ad-client="ca-pub-TEST"
                  data-ad-slot="TEST-IN-ARTICLE"
                  data-ad-format="fluid"
                  data-ad-layout="in-article"
                  data-test="true"
                  data-ad-visible="true"
                />
              ) : (
                <div className="ads-disabled">{t('result.adsConsent')}</div>
              )}
            </div>

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

        {/* Bottom Ad */}
        <div className="container" style={{ marginBottom: 'var(--spacing-xl)' }} data-ad-slot="bottom">
          {adsEnabled ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-TEST"
              data-ad-slot="TEST-BOTTOM"
              data-ad-format="auto"
              data-full-width-responsive="true"
              data-test="true"
              data-ad-visible="true"
            />
          ) : (
            <div className="ads-disabled">{t('result.adsConsent')}</div>
          )}
        </div>

        {/* Sticky Ad */}
        <div style={{
          position: 'fixed',
          right: 'var(--spacing-md)',
          bottom: 'var(--spacing-md)',
          width: '160px',
          zIndex: 1000
        }} data-ad-slot="sticky">
          {adsEnabled ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-TEST"
              data-ad-slot="TEST-STICKY"
              data-ad-format="vertical"
              data-test="true"
              data-ad-visible="true"
            />
          ) : (
            <div className="ads-disabled">{t('result.adsConsent')}</div>
          )}
        </div>
      </main>
    </>
  );
}

// Static Site Generation - 빌드 시 모든 결과 페이지 생성
export async function getStaticPaths() {
  // 1-60번 테스트 ID
  const testIds = Array.from({ length: 60 }, (_, i) => String(i + 1));

  return {
    paths: testIds.map((id) => ({
      params: { id },
    })),
    fallback: 'blocking', // 새로운 테스트가 추가되면 동적으로 생성
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      testId: params.id,
    },
  };
}
