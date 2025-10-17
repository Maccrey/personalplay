import Script from "next/script";
import { useEffect } from "react";
import { initializePrebid } from "@/utils/header-bidding";

function checkScriptsLoaded() {
  if (typeof window === "undefined") return false;

  const gptLoaded =
    typeof window.googletag !== "undefined" &&
    typeof window.googletag.pubads === "function";
  const prebidLoaded =
    typeof window.pbjs !== "undefined" &&
    typeof window.pbjs.que !== "undefined";

  return gptLoaded && prebidLoaded;
}

export default function AdInitializer() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (checkScriptsLoaded()) {
        // GPT 초기화
        window.googletag.cmd.push(() => {
          window.googletag.pubads().enableSingleRequest();
          window.googletag.enableServices();
        });

        // Prebid 초기화
        window.pbjs.que.push(() => {
          initializePrebid();
        });

        // 로드 상태 업데이트
        window.adsInitialized = true;
        clearInterval(interval);
      }
    }, 100);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Script
        id="gpt-js"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        strategy="beforeInteractive"
      />
      <Script
        id="prebid-js"
        src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
