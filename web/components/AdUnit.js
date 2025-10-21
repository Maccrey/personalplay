import { useEffect, useRef } from "react";
import { AD_UNITS } from "@/config/ad-manager";
import { useAdContext } from "@/contexts/AdContext";
import { requestBids, trackAdMetrics } from "@/utils/header-bidding";

export default function AdUnit({ unitId }) {
  const adContainerRef = useRef(null);
  const { isAdAllowed } = useAdContext();

  useEffect(() => {
    if (!adContainerRef.current) return;

    // 전역 컨텍스트의 광고 허용 상태를 확인
    if (!isAdAllowed) {
      console.log(`Ad skipped for unitId: ${unitId} due to content check.`);
      return;
    }

    const adUnit = AD_UNITS[unitId];
    if (!adUnit) return;

    const loadAd = async () => {
      try {
        // 헤더비딩 요청
        const bids = await requestBids(unitId);

        // 최고 입찰가 추적
        if (bids && bids.length > 0) {
          trackAdMetrics(unitId, bids[0]);
        }

        // 광고 로드
        window.googletag.cmd.push(() => {
          const adSlot = window.googletag
            .defineSlot(adUnit.path, adUnit.sizes, adContainerRef.current.id)
            .addService(window.googletag.pubads());

          if (bids && bids.length > 0) {
            adSlot.setTargeting("hb_bidder", bids[0].bidder);
            adSlot.setTargeting("hb_pb", bids[0].pbMg);
          }

          window.googletag.display(adContainerRef.current.id);
        });
      } catch (error) {
        console.error("Failed to load ad:", error);
      }
    };

    loadAd();

    return () => {
      // 클린업: 광고 슬롯 제거
      window.googletag.cmd.push(() => {
        window.googletag.destroySlots();
      });
    };
  }, [unitId, isAdAllowed]);

  // 광고가 허용되지 않으면 컨테이너 자체를 렌더링하지 않음
  if (!isAdAllowed) {
    return null;
  }

  return (
    <div
      ref={adContainerRef}
      id={`ad-${unitId}-${Math.random().toString(36).slice(2)}`}
      className="ad-container"
    />
  );
}
