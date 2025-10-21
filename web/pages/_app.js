import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Head from "next/head";
import ConsentBanner from "../components/ConsentBanner";
import Analytics from "../components/Analytics";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import { AdProvider, useAdContext } from "../contexts/AdContext";
import * as analytics from "../lib/analytics";

// 광고 허용 여부를 결정하는 컨트롤러 컴포넌트
function AdContentController({ pageProps }) {
  const { setIsAdAllowed } = useAdContext();

  useEffect(() => {
    // pageProps에 핵심 콘텐츠가 있는지 확인
    const hasContent = 
      pageProps.categories?.length > 0 ||
      (pageProps.category && pageProps.tests?.length > 0) ||
      !!pageProps.test ||
      !!pageProps.result;

    setIsAdAllowed(hasContent);
  }, [pageProps, setIsAdAllowed]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

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
            <meta name="theme-color" content="#8B5CF6" />
          </Head>
          <AdContentController pageProps={pageProps} />
          <Analytics />
          <Component {...pageProps} />
          <ConsentBanner />
        </AdProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
