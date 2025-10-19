import { trackEvent as trackToFirestore } from "@/lib/firestore-client";

export function trackEvent(name, payload = {}) {
  // Firebase + dataLayer 기반 추적
  if (typeof window !== "undefined") {
    try {
      console.log("[analytics] event", name, payload);
      // window.dataLayer push
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...payload });

      // Firebase로 이벤트 전송 (비동기)
      trackToFirestore({
        event: name,
        ...payload
      }).catch(() => {});
    } catch (e) {
      // noop
    }
  }
}
