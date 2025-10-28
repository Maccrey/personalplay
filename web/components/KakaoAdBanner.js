import { useEffect, useRef } from 'react';
import useMobileDetect from '@/hooks/useMobileDetect';

const KakaoAdBanner = () => {
  const { isMobile } = useMobileDetect();

  const adUnit = isMobile ? "DAN-SB97uaxvv0AS2uSp" : "DAN-5mEps5uhWVWanR29";
  const adWidth = isMobile ? "320" : "728";
  const adHeight = isMobile ? "100" : "90";

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins
        key={adUnit} // Add key to force re-render
        className="kakao_ad_area"
        style={{ display: 'block' }} // Change to block
        data-ad-unit={adUnit}
        data-ad-width={adWidth}
        data-ad-height={adHeight}
      ></ins>
    </div>
  );
};

export default KakaoAdBanner;