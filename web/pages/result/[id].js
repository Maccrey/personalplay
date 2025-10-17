import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "../../utils/analytics";

export default function ResultPage() {
  const router = useRouter();
  const { id, r } = router.query;
  const [res, setRes] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    if (!id || !r) return;
    fetch("/api/tests")
      .then((r) => r.json())
      .then((data) => {
        const t = data.tests.find((x) => x.id === id);
        setTestInfo(t);
        const rr = t?.results.find((x) => x.key === r);
        setRes(rr);

        // Track result page view
        if (rr) {
          trackEvent("result_viewed", {
            test_id: id,
            result_key: r,
            result_title: rr.title,
          });
        }
      });
  }, [id, r]);

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
        <p>결과 로딩 중...</p>
      </div>
    );
  }

  const ogImageUrl = `/api/og/${id}?title=${encodeURIComponent(
    res?.title || ""
  )}&desc=${encodeURIComponent(res?.desc || "")}`;

  return (
    <>
      <Head>
        <title>{res?.title || "결과"} - PersonaPlay</title>
        <meta property="og:title" content={res?.title || "PersonaPlay 결과"} />
        <meta property="og:description" content={res?.desc || ""} />
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
            <div className="ads-disabled">광고 동의 필요</div>
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
              {testInfo?.title || '테스트 결과'}
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
              {res?.title}
            </h1>

            {/* Result Description */}
            <p style={{
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              {res?.desc}
            </p>

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
                <div className="ads-disabled">광고 동의 필요</div>
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
                    result_title: res?.title,
                    share_method: navigator.share ? "native_share" : "clipboard",
                  });

                  if (navigator.share) {
                    navigator.share({
                      title: res?.title,
                      text: res?.desc,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => alert("링크가 복사되었습니다!"))
                      .catch(() => alert("링크 복사에 실패했습니다."));
                  }
                }}
                className="btn btn-primary"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)'
                }}
              >
                결과 공유하기 🔗
              </button>

              <Link href="/" className="btn btn-secondary" style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                다른 테스트 하기
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
            <div className="ads-disabled">광고 동의 필요</div>
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
            <div className="ads-disabled">광고 동의 필요</div>
          )}
        </div>
      </main>
    </>
  );
}
