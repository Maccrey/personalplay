import "../styles/globals.css";
import ConsentBanner from "../components/ConsentBanner";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ConsentBanner />
    </>
  );
}
