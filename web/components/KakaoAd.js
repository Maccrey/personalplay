
import { useEffect, useRef, useState } from "react";

export default function KakaoAd({ unitId, width, height }) {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adScaleX, setAdScaleX] = useState(1);
  const [adScaleY, setAdScaleY] = useState(1);
  const adWrapperRef = useRef(null);
  const adInsRef = useRef(null);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
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

    // Reload ad when unitId changes
    if (window.kakaoAsyncInit) {
      window.kakaoAsyncInit();
    }

    return () => {
      window.removeEventListener("resize", updateAdScale);
      window.removeEventListener("orientationchange", updateAdScale);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [adsEnabled, width, unitId]);

  if (!adsEnabled) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          margin: 'var(--spacing-xl) auto',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ color: '#999', fontSize: '14px' }}>Kakao Ad Placeholder ({width}x{height})</span>
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
          ref={adInsRef}
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
