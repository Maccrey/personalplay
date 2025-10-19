// Analytics tracking - currently using only dataLayer (Google Analytics)
// Firestore analytics disabled to avoid permission errors

export function trackEvent(name, payload = {}) {
  // dataLayer 기반 추적 (Google Analytics)
  if (typeof window !== "undefined") {
    try {
      console.log("[analytics] event", name, payload);
      // window.dataLayer push for Google Analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...payload });

      // NOTE: Firestore analytics tracking is disabled
      // Can be re-enabled later if needed with proper Firestore rules
    } catch (e) {
      // Silent fail - analytics should not break the app
    }
  }
}
