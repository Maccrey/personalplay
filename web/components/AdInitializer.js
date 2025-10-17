import Script from "next/script";
import { useEffect } from "react";
import { initializePrebid } from "@/utils/header-bidding";

export default function AdInitializer() {
  useEffect(() => {
    // GPT 초기화
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    window.googletag.cmd.push(() => {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();
    });

    // Prebid 초기화
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];
    initializePrebid();
  }, []);

  return (
    <>
      <Script
        id="prebid-js"
        src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js"
        strategy="beforeInteractive"
        onLoad={() => {
          window.prebidLoaded = true;
        }}
      />
      <Script
        id="gpt-js"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        strategy="beforeInteractive"
        onLoad={() => {
          window.gptLoaded = true;
        }}
      />
    </>
  );
}
