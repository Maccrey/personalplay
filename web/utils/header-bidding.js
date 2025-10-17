import { AD_UNITS, PREBID_CONFIG } from "@/config/ad-manager";

export function initializePrebid() {
  window.pbjs = window.pbjs || {};
  window.pbjs.que = window.pbjs.que || [];

  window.pbjs.que.push(() => {
    window.pbjs.setConfig({
      debug: process.env.NODE_ENV === "development",
      bidderTimeout: PREBID_CONFIG.bidderTimeout,
      userSync: {
        filterSettings: {
          iframe: {
            bidders: "*",
            filter: "include",
          },
        },
      },
    });
  });
}

export function requestBids(adUnitPath) {
  const adUnit = AD_UNITS[adUnitPath];
  if (!adUnit) return Promise.reject("Invalid ad unit");

  return new Promise((resolve) => {
    window.pbjs.que.push(() => {
      window.pbjs.requestBids({
        adUnitCodes: [adUnit.path],
        bidsBackHandler: () => {
          const highestCpmBids = window.pbjs.getHighestCpmBids(adUnit.path);
          resolve(highestCpmBids);
        },
      });
    });
  });
}

export function refreshBids(adUnitPath) {
  window.pbjs.que.push(() => {
    window.googletag.pubads().refresh();
    requestBids(adUnitPath);
  });
}

export function trackAdMetrics(adUnitPath, bid) {
  if (!bid) return;

  // GA4 이벤트 발송
  window.gtag("event", "ad_bid", {
    ad_unit: adUnitPath,
    bidder: bid.bidder,
    cpm: bid.cpm,
    currency: bid.currency,
    ttl: bid.ttl,
  });
}
