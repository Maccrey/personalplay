import "../styles/globals.css";
import Head from "next/head";
import ConsentBanner from "../components/ConsentBanner";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }) {
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
        <Component {...pageProps} />
        <ConsentBanner />
      </AuthProvider>
    </LanguageProvider>
  );
}
