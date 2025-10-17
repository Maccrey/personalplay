declare global {
  interface Window {
    googletag: any;
    pbjs: any;
    gptLoaded: boolean;
    prebidLoaded: boolean;
    adsInitialized: boolean;
  }
}

export {};
