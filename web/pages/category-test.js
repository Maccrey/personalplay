import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthButton from "@/components/AuthButton";
import KakaoAd from "@/components/KakaoAd";
import { useTranslation } from "@/hooks/useTranslation";
import useMobileDetect from "@/hooks/useMobileDetect";
import { getCategoryById } from "@/lib/tests-data";

// This is a test page to debug issues with dynamic routes.
export default function CategoryTestPage() {
  const router = useRouter();
  const id = 'love'; // Hardcoded category ID for testing
  const [category, setCategory] = useState(null);
  const [tests, setTests] = useState([]);
  const { t, locale } = useTranslation();
  const isMobile = useMobileDetect();

  const adUnitId = isMobile ? "DAN-6aDr6C3c3FqdDe9t" : "DAN-lm66z0vOnzVq5FzX";
  const adWidth = isMobile ? 320 : 728;
  const adHeight = isMobile ? 100 : 90;
  const bottomAdUnitId = isMobile ? "DAN-pshRbpDXYbRPPLcG" : "DAN-c7xWiCYKN6ZkDMLs";

  useEffect(() => {
    getCategoryById(id, locale).then((cat) => {
      if (cat) {
        setCategory(cat);
        setTests(cat.tests || []);
      }
    });
  }, [locale]); // Depend only on locale since id is static

  if (!category) {
    return (
      <div
        className="container"
        style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}
      >
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  function getTestIcon(id) {
    const icons = {
      1: "💕", 2: "👥", 3: "💼", 4: "🌴", 5: "😂", 6: "🐾", 7: "📱", 8: "😌",
      9: "☕", 10: "✈️", 11: "💰", 12: "🍽️", 13: "💪", 14: "😴", 15: "📚", 16: "🎵",
      17: "🧹", 18: "🐶", 19: "👗", 20: "🎮", 21: "🎬", 22: "💝", 23: "📖", 24: "💑",
      25: "🎓", 26: "🧠", 27: "🔄", 28: "📊", 29: "🎯", 30: "💡", 31: "💔", 32: "❤️",
      33: "🤝", 34: "✍️", 35: "🧬", 36: "🌟", 37: "💘", 38: "💞", 39: "⚡",
      40: "🗣️", 41: "🏃", 42: "📺", 43: "💬", 44: "😊", 45: "🎙️", 46: "🎨", 47: "🛍️",
      48: "💻", 49: "🔥", 50: "🎤", 51: "📹", 52: "👨‍🍳", 53: "📷", 54: "🎲", 55: "🎭",
      56: "📺", 57: "🛠️", 58: "⚽", 59: "🎸", 60: "🧩",
    };
    const numericId = Number(id);
    if (numericId >= 100 && numericId <= 122) {
      return "💖";
    }
    return icons[id] || "✨";
  }

  return (
    <>
      <Head>
        <title>{t(`seo.category.${category.id}.title`)}</title>
        <meta
          name="description"
          content={t(`seo.category.${category.id}.description`)}
        />
      </Head>

      <main className="fade-in">
        <header
          className="page-header"
          style={{
            background: "var(--color-bg)",
            borderBottom: "1px solid var(--color-border)",
            padding: "var(--spacing-md) 0",
          }}
        >
          <div
            className="container header-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/">PersonaPlay</Link>
            <div
              className="header-actions"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <AuthButton />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <section
          style={{
            background: category.color,
            padding: "var(--spacing-2xl) var(--spacing-lg)",
            textAlign: "center",
            color: "white",
          }}
        >
          <div className="container">
            <div style={{ fontSize: "4rem", marginBottom: "var(--spacing-md)" }}>
              {category.icon}
            </div>
            <h1>{t(`categories.${category.id}.name`)}</h1>
            <p>{t(`categories.${category.id}.description`)}</p>
          </div>
        </section>

        <section
          className="container"
          style={{ padding: "var(--spacing-2xl) var(--spacing-lg)" }}
        >
          <KakaoAd key={`${router.asPath}-${adUnitId}`} unitId={adUnitId} width={adWidth} height={adHeight} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {tests.map((test) => (
              <div key={test.id}>
                <Link href={`/test/${test.id}`}>
                  <div className="card">
                    <div style={{ fontSize: "2.5rem" }}>{getTestIcon(test.id)}</div>
                    <h3>{t(`tests.${test.id}.title`)}</h3>
                    <div>
                      <span>{test.questions?.length || 0}{t('test.questions')}</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <KakaoAd key={`${router.asPath}-${bottomAdUnitId}`} unitId={bottomAdUnitId} width={adWidth} height={adHeight} />

          <div style={{ textAlign: "center", marginTop: "var(--spacing-2xl)" }}>
            <Link href="/"> {t('test.viewOtherCategories')} </Link>
          </div>
        </section>
      </main>
    </>
  );
}
