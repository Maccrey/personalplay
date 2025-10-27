
import { useEffect, useRef, useState, useId } from "react";

export default function KakaoAd({ unitId, width, height }) {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adScaleX, setAdScaleX] = useState(1);
  const [adScaleY, setAdScaleY] = useState(1);
  const adWrapperRef = useRef(null);
  const adInsRef = useRef(null);
  const uniqueId = useId(); // Generate a unique ID for each ad instance

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

    // Initialize/Reload ad when unitId changes or component mounts
    const initializeAd = () => {
      if (adInsRef.current && window.adsbykakao) {
        try {
          (window.adsbykakao = window.adsbykakao || []).push({});
        } catch (e) {
          console.error("Failed to load Kakao Ad:", e);
        }
      }
    };

    // Give the script a moment to load and then initialize the ad
    const timer = setTimeout(initializeAd, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateAdScale);
      window.removeEventListener("orientationchange", updateAdScale);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      // No explicit destroy method for Kakao Adfit, but removing the element should suffice
    };
  }, [adsEnabled, width, unitId, uniqueId]);

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
        minHeight: `${height}px`, // Ensure minimum height
        height: `${height * adScaleY}px`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${adScaleX}, ${adScaleY})`,
          transformOrigin: 'top center',
          minWidth: `${width * 0.3}px`, // Prevent ad from becoming too small
        }}
      >
        <ins
          ref={adInsRef}
          id={`kakao-ad-${uniqueId}`}
          className="kakao_ad_area"
          style={{ display: 'block', width: `${width}px`, height: `${height}px` }} // Changed display to block
          data-ad-unit={unitId}
          data-ad-width={width}
          data-ad-height={height}
        />
      </div>
    </div>
  );
}
