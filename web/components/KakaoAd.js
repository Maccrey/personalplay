
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function KakaoAd({ unitId, width, height }) {
  const { t } = useTranslation();
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [adScaleX, setAdScaleX] = useState(1);
  const [adScaleY, setAdScaleY] = useState(1);
  const adWrapperRef = useRef(null);

  useEffect(() => {
    function onConsentChange(e) {
      const c = e?.detail;
      const enabled = c?.ads === true;
      setAdsEnabled(enabled === true);
    }

    try {
      const raw = localStorage.getItem("pp_consent");
      const obj = raw ? JSON.parse(raw) : null;
      const enabled = obj?.ads === true;
      setAdsEnabled(enabled === true);
    } catch (e) {}

    window.addEventListener("pp:consent:changed", onConsentChange);
    return () => window.removeEventListener("pp:consent:changed", onConsentChange);
  }, []);

  useEffect(() => {
    const desiredWidth = width;
    const maxScale = 2;

    function updateAdScale() {
      const wrapper = adWrapperRef.current;
      if (!wrapper) return;
      const availableWidth = wrapper.offsetWidth;
      if (!availableWidth) return;
      const nextScaleX = Math.min(Math.max(availableWidth / desiredWidth, 0.3), maxScale);
      const nextScaleY = nextScaleX <= 1 ? nextScaleX : 1;
      setAdScaleX(nextScaleX);
      setAdScaleY(nextScaleY);
    }

    if (!adsEnabled) {
      setAdScaleX(1);
      setAdScaleY(1);
      return;
    }

    updateAdScale();
    window.addEventListener("resize", updateAdScale);
    window.addEventListener("orientationchange", updateAdScale);
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined" && adWrapperRef.current) {
      resizeObserver = new ResizeObserver(updateAdScale);
      resizeObserver.observe(adWrapperRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateAdScale);
      window.removeEventListener("orientationchange", updateAdScale);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [adsEnabled, width]);

  if (!adsEnabled) {
    return (
      <div className="ads-disabled" style={{
          padding: 'var(--spacing-md)',
          textAlign: 'center',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-tertiary)',
          fontSize: '0.875rem'
        }}>
          {t('result.adsConsent')}
      </div>
    );
  }

  return (
    <div
      ref={adWrapperRef}
      style={{
        width: '100%',
        margin: 'var(--spacing-xl) auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: `${height * adScaleY}px`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${adScaleX}, ${adScaleY})`,
          transformOrigin: 'top center'
        }}
      >
        <ins
          className="kakao_ad_area"
          style={{ display: 'none', width: `${width}px`, height: `${height}px` }}
          data-ad-unit={unitId}
          data-ad-width={width}
          data-ad-height={height}
        />
      </div>
    </div>
  );
}
