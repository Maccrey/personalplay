import "../styles/globals.css";
import ConsentBanner from "../components/ConsentBanner";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
      <ConsentBanner />
    </LanguageProvider>
  );
}
