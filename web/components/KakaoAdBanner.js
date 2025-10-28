
import { useEffect } from 'react';
import useMobileDetect from '@/hooks/useMobileDetect';

const KakaoAdBanner = () => {
  const { isMobile } = useMobileDetect();

  const adUnit = isMobile ? "DAN-SB97uaxvv0AS2uSp" : "DAN-5mEps5uhWVWanR29";
  const adWidth = isMobile ? "320" : "728";
  const adHeight = isMobile ? "100" : "90";

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={adWidth}
        data-ad-height={adHeight}
      ></ins>
    </div>
  );
};

export default KakaoAdBanner;
