import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./[id].module.css";
import { trackEvent } from "../../utils/analytics";

export default function ResultPage() {
  const router = useRouter();
  const { id, r } = router.query;
  const [res, setRes] = useState(null);
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    if (!id || !r) return;
    fetch("/api/tests")
      .then((r) => r.json())
      .then((data) => {
        const t = data.tests.find((x) => x.id === id);
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

  if (!res) return <div className={styles.loading}>결과 로딩 중...</div>;

  const ogImageUrl = `/api/og/${id}?title=${encodeURIComponent(
    res?.title || ""
  )}&desc=${encodeURIComponent(res?.desc || "")}`;

  return (
    <main className={styles.container}>
      <Head>
        <title>{res?.title || "결과"}</title>
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

      <div className={styles.topAd} data-ad-slot="top" data-ads-slot-visible>
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

      <div className={styles.card}>
        <h1 className={styles.title}>{res?.title}</h1>
        <p className={styles.description}>{res?.desc}</p>

        <div className={styles.inArticleAd} data-ad-slot="in-article">
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

        <div className={styles.share}>
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
            className={styles.shareButton}
          >
            결과 공유하기
          </button>
        </div>
      </div>

      <div className={styles.bottomAd} data-ad-slot="bottom">
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

      <div className={styles.stickyAd} data-ad-slot="sticky">
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
  );
}
