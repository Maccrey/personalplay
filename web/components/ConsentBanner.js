import { useEffect, useState } from "react";
import styles from "./ConsentBanner.module.css";
import { setConsent, getConsent } from "../utils/consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setLocalConsent] = useState(getConsent());

  useEffect(() => {
    const c = getConsent();
    if (!c) setVisible(true);
    setLocalConsent(c);
  }, []);

  function allow() {
    setConsent({ ads: true });
    setLocalConsent({ ads: true });
    setVisible(false);
    // small event for analytics if needed
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_given", purpose: "ads" });
  }

  function deny() {
    setConsent({ ads: false });
    setLocalConsent({ ads: false });
    setVisible(false);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_denied", purpose: "ads" });
  }

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite">
      <div className={styles.inner}>
        <div className={styles.text}>
          이 사이트는 맞춤형 광고 제공을 위해 쿠키 사용 동의를 요청합니다. 광고
          동의를 거부하면 개인화된 광고가 표시되지 않습니다.
        </div>
        <div className={styles.buttons}>
          <button className={styles.deny} onClick={deny}>
            거부
          </button>
          <button className={styles.allow} onClick={allow}>
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
