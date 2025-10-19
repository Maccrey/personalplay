import Head from "next/head";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage = "https://maccre.com/og-image.png",
  ogType = "website",
  canonical,
}) {
  const { language } = useLanguage();
  const siteUrl = "https://maccre.com";
  const fullTitle = title?.includes("PersonaPlay") ? title : `${title} - PersonaPlay`;

  // Language to locale mapping
  const localeMap = {
    en: "en_US",
    ko: "ko_KR",
    ja: "ja_JP"
  };

  const currentLocale = localeMap[language] || "en_US";

  // Language names for meta tags
  const languageNames = {
    en: "English",
    ko: "Korean",
    ja: "Japanese"
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="PersonaPlay" />

      {/* Viewport for mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Hreflang tags for multilingual SEO */}
      {canonical && (
        <>
          <link rel="alternate" hrefLang="en" href={`${siteUrl}${canonical}`} />
          <link rel="alternate" hrefLang="ko" href={`${siteUrl}${canonical}`} />
          <link rel="alternate" hrefLang="ja" href={`${siteUrl}${canonical}`} />
          <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonical}`} />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="PersonaPlay" />
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="ko_KR" />
      <meta property="og:locale:alternate" content="ja_JP" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content={languageNames[language]} />
      <meta httpEquiv="content-language" content={language} />
      <meta name="revisit-after" content="7 days" />

      {/* PWA */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PersonaPlay" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PersonaPlay",
            "description": description,
            "url": siteUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
  );
}
