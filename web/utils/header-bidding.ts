// Prebid 초기화 설정
export const initializePrebid = () => {
  const PREBID_CONFIG = {
    bidderTimeout: 1000,
    publisherDomain: window.location.origin,
    userSync: {
      filterSettings: {
        iframe: {
          bidders: "*",
          filter: "include",
        },
      },
    },
  };

  window.pbjs.setConfig(PREBID_CONFIG);
};
