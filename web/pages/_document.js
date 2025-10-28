import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* 초기 설정 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.googletag = window.googletag || {};
                window.googletag.cmd = window.googletag.cmd || [];
                window.pbjs = window.pbjs || {};
                window.pbjs.que = window.pbjs.que || [];
              `,
            }}
          />
          {/* Prebid.js */}
          <script
            src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js"
            onLoad="window.prebidLoaded = true;"
          />
          {/* Google Publisher Tag */}
          <script
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
            onLoad="window.gptLoaded = true;"
          />
          {/* Kakao AdFit */}
          <script
            type="text/javascript"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
