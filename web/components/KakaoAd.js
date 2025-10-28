import { useEffect, useRef, useId } from "react";

export default function KakaoAd({ unitId, width, height }) {
  const adInsRef = useRef(null);
  const uniqueId = useId(); // To ensure re-initialization on navigation

  useEffect(() => {
    // When the component mounts or unitId changes, re-initialize the ad.
    const initializeAd = () => {
      if (adInsRef.current && window.adsbykakao) {
        try {
          // This tells the Kakao script to find and fill new ad slots.
          (window.adsbykakao = window.adsbykakao || []).push({});
        } catch (e) {
          console.error("Failed to load Kakao Ad:", e);
        }
      }
    };

    // The script might load after the component, so we delay slightly.
    const timer = setTimeout(initializeAd, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [unitId, uniqueId]); // Depend on unitId and uniqueId

  // In development, show a placeholder.
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: `${width}px`,
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

  // In production, render the actual ad unit.
  return (
    <div
      style={{
        width: '100%',
        margin: 'var(--spacing-xl) auto',
        display: 'flex',
        justifyContent: 'center',
        minHeight: `${height}px`,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Debugging background
      }}
    >
      <ins
        ref={adInsRef}
        className="kakao_ad_area"
        style={{ display: 'block', width: `${width}px`, height: `${height}px` }}
        data-ad-unit={unitId}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  );
}
