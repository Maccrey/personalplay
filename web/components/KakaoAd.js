import { useEffect, useRef } from "react";

export default function KakaoAd({ unitId, width, height }) {
  const adInsRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
      }}
    >
      <ins
        ref={adInsRef}
        className="kakao_ad_area"
        style={{ display: 'block', width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
        data-ad-unit={unitId}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  );
}
