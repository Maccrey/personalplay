import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Head from "next/head";
import ConsentBanner from "../components/ConsentBanner";
import Analytics from "../components/Analytics";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import * as analytics from "../lib/analytics";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // 초기 페이지뷰 추적
    analytics.pageview(router.pathname);

    // 라우트 변경 시 페이지뷰 추적
    const handleRouteChange = (url) => {
      analytics.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, router.pathname]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Head>
          {/* Favicons */}
          <link rel="icon" type="image/x-icon" href="/personalplay/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/personalplay/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/personalplay/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/personalplay/apple-touch-icon.png" />

          {/* Web App Manifest */}
          <link rel="manifest" href="/personalplay/site.webmanifest" />

          {/* Theme Color */}
          <meta name="theme-color" content="#8B5CF6" />
        </Head>
        <Analytics />
        <Component {...pageProps} />
        <ConsentBanner />
      </AuthProvider>
    </LanguageProvider>
  );
}
