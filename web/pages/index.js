import Link from "next/link";
import { useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import VisitorCounter from "@/components/VisitorCounter";
import { useTranslation } from "@/hooks/useTranslation";
import { getAllCategories } from "@/lib/tests-data";
import AuthButton from "@/components/AuthButton";
import KakaoAd from "@/components/KakaoAd";
import useMobileDetect from "@/hooks/useMobileDetect";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const { t, locale } = useTranslation();
  const isMobile = useMobileDetect();

  const adUnitId = isMobile ? "DAN-2zFdK8c07u2jF7YL" : "DAN-39Qufk252UXag4XA";
  const adWidth = isMobile ? 320 : 728;
  const adHeight = isMobile ? 100 : 90;

  useEffect(() => {
    getAllCategories(locale)
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, [locale]);

  return (
    <>
      <SEOHead
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
        canonical="/"
        ogType="website"
      />
      <main className="fade-in">
        {/* Hero Section */}
        <section
          style={{
            background: "var(--gradient-primary)",
            padding: "var(--spacing-2xl) var(--spacing-lg)",
            textAlign: "center",
            color: "white",
            marginBottom: "var(--spacing-2xl)",
          }}
        >
          <div className="container">
            <div
              className="home-top-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                flexWrap: 'wrap',
                width: '100%',
                marginBottom: 'var(--spacing-xl)'
              }}
            >
              <AuthButton />
              <LanguageSwitcher />
            </div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                marginBottom: "var(--spacing-md)",
                color: "white",
              }}
            >
              {t('home.title')}
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                marginBottom: "var(--spacing-xl)",
                color: "rgba(255, 255, 255, 0.95)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {t('home.subtitle')}
              <br />
              {t('home.description')}
            </p>

          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .home-top-nav {
                justify-content: center;
                margin-bottom: var(--spacing-lg);
              }
            }
          `}</style>
        </section>

        {/* Categories Grid */}
        <section
          className="container"
          style={{ paddingBottom: "var(--spacing-2xl)" }}
        >
          <KakaoAd unitId={adUnitId} width={adWidth} height={adHeight} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--spacing-lg)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    padding: "var(--spacing-xl)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = category.color;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "var(--radius-full)",
                      background: category.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--spacing-lg)",
                      fontSize: "3.5rem",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    {category.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "var(--spacing-sm)",
                      color: "var(--color-text)",
                      fontWeight: "700",
                    }}
                  >
                    {t(`categories.${category.id}.name`)}
                  </h3>

                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "1rem",
                      marginBottom: "var(--spacing-md)",
                      flex: 1,
                    }}
                  >
                    {t(`categories.${category.id}.description`)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      paddingTop: "var(--spacing-md)",
                      borderTop: "1px solid var(--color-border)",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {t('home.testsCount', { count: category.tests.length })}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: category.color,
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Kakao Ad */}
          <KakaoAd unitId={adUnitId} width={adWidth} height={adHeight} />

          {/* Stats Section */}
          <div
            style={{
              textAlign: "center",
              padding: "var(--spacing-2xl)",
              background: "var(--color-bg-tertiary)",
              borderRadius: "var(--radius-xl)",
              marginTop: "var(--spacing-2xl)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {t('home.totalTests')}
            </h3>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {t('home.testTypes')}<br />
              {t('home.testTypesDesc')}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: "var(--color-bg-tertiary)",
            padding: "var(--spacing-xl) var(--spacing-lg)",
            textAlign: "center",
            marginTop: "var(--spacing-2xl)",
          }}
        >
          <div className="container">
            {/* Visitor Counter */}
            <VisitorCounter />

            <p
              style={{
                color: "var(--color-text-tertiary)",
                fontSize: "0.875rem",
                marginBottom: "0",
              }}
            >
              {t('home.footer')}
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
