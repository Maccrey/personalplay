export const AD_UNITS = {
  TOP_BANNER: {
    path: "/22639388115/top_banner",
    sizes: [
      [728, 90],
      [970, 90],
      [970, 250],
    ],
  },
  SIDEBAR: {
    path: "/22639388115/sidebar",
    sizes: [
      [300, 250],
      [300, 600],
    ],
  },
  IN_ARTICLE: {
    path: "/22639388115/in_article",
    sizes: [
      [336, 280],
      [300, 250],
    ],
  },
  BOTTOM_BANNER: {
    path: "/22639388115/bottom_banner",
    sizes: [
      [728, 90],
      [970, 90],
    ],
  },
};

export const PREBID_CONFIG = {
  bidderTimeout: 1000,
  bidders: {
    appnexus: {
      placementId: "19602547",
    },
    rubicon: {
      accountId: "14062",
      siteId: "70608",
      zoneId: "335918",
    },
  },
};
