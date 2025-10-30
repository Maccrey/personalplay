import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Analytics from "../components/Analytics";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import { AdProvider } from "../contexts/AdContext";

export default function App({ Component, pageProps }) {
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
            strategy="afterInteractive"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async
          />
        </AdProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
