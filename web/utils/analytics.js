export function trackEvent(name, payload = {}) {
  // 간단한 로컬 로그 기반 추적기. 나중에 GA4/서버 엔드포인트로 교체 가능
  if (typeof window !== "undefined") {
    try {
      console.log("[analytics] event", name, payload);
      // window.dataLayer push 예시
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...payload });
      // 서버로 이벤트 전송 (비동기)
      try {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: name, ...payload }),
        }).catch(() => {});
      } catch (e) {}
    } catch (e) {
      // noop
    }
  }
}
