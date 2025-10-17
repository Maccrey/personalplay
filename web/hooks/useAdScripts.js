import { useState, useEffect } from "react";
import { initializePrebid } from "@/utils/header-bidding";

export default function useAdScripts() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAds = () => {
      try {
        // GPT 서비스 초기화
        window.googletag.cmd.push(() => {
          window.googletag.pubads().enableSingleRequest();
          window.googletag.enableServices();
          console.log("GPT services initialized");
        });

        // Prebid 초기화
        initializePrebid();
        console.log("Prebid initialized");

        if (isMounted) {
          setIsInitialized(true);
          console.log("Ad services initialized");
        }
      } catch (error) {
        console.error("Failed to initialize ad services:", error);
        if (isMounted) {
          setIsInitialized(false);
        }
      }
    };

    // 스크립트가 로드되었는지 확인
    const checkScriptsLoaded = () => {
      if (window.googletag && window.pbjs) {
        initializeAds();
      } else {
        setTimeout(checkScriptsLoaded, 100);
      }
    };

    checkScriptsLoaded();

    return () => {
      isMounted = false;
    };
  }, []);

  return isInitialized;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
