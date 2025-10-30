import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Analytics from "../components/Analytics";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import { AdProvider } from "../contexts/AdContext";
import * as analytics from "../lib/analytics";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // 초기 페이지뷰 추적
    analytics.pageview(router.pathname);

    // 라우트 변경 시 페이지뷰 추적 및 광고 재초기화
    const handleRouteChange = (url) => {
      analytics.pageview(url);

      // Force-reload the Kakao Ad script on each navigation
      const oldScript = document.getElementById('kakao-ad-script');
      if (oldScript) {
        oldScript.remove();
      }

      const newScript = document.createElement('script');
      newScript.id = 'kakao-ad-script';
      newScript.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      newScript.async = true;
      document.head.appendChild(newScript);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, router.pathname]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <AdProvider>
          <Head>
            {/* Favicons */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

            {/* Web App Manifest */}
            <link rel="manifest" href="/site.webmanifest" />

            {/* Theme Color */}
            <meta name-color="#8B5CF6" />
          </Head>
          <Analytics />
          <Component {...pageProps} />
          <Script
            id="kakao-ad-script"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            strategy="afterInteractive"
            async
          />
        </AdProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
