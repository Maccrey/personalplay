import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/tests").then((r) => r.json()),
    ]).then(([catData, testData]) => {
      const cat = catData.categories.find((c) => c.id === id);
      if (cat) {
        setCategory(cat);
        const categoryTests = testData.tests.filter((t) =>
          cat.tests.includes(t.id)
        );
        setTests(categoryTests);
      }
    });
  }, [id]);

  if (!category) {
    return (
      <div
        className="container"
        style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}
      >
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} - PersonaPlay</title>
        <meta
          name="description"
          content={`${category.description} - PersonaPlay`}
        />
      </Head>

      <main className="fade-in">
        {/* Header */}
        <header
          style={{
            background: "var(--color-bg)",
            borderBottom: "1px solid var(--color-border)",
            padding: "var(--spacing-md) 0",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textDecoration: "none",
              }}
            >
              PersonaPlay
            </Link>
          </div>
        </header>

        {/* Category Header */}
        <section
          style={{
            background: category.color,
            padding: "var(--spacing-2xl) var(--spacing-lg)",
            textAlign: "center",
            color: "white",
          }}
        >
          <div className="container">
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {category.icon}
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "var(--spacing-md)",
                color: "white",
              }}
            >
              {category.name}
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "rgba(255, 255, 255, 0.95)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {category.description}
            </p>
          </div>
        </section>

        {/* Tests Grid */}
        <section
          className="container"
          style={{ padding: "var(--spacing-2xl) var(--spacing-lg)" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/test/${test.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "var(--radius-lg)",
                      background: category.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--spacing-md)",
                      fontSize: "2.5rem",
                    }}
                  >
                    {getTestIcon(test.id)}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      marginBottom: "var(--spacing-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    {test.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      marginTop: "auto",
                      paddingTop: "var(--spacing-md)",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {test.questions?.length || 0}개 질문
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: category.color,
                        marginLeft: "auto",
                      }}
                    >
                      시작하기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Button */}
          <div style={{ textAlign: "center", marginTop: "var(--spacing-2xl)" }}>
            <Link href="/" className="btn btn-secondary">
              다른 카테고리 보기
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function getTestIcon(id) {
  const icons = {
    1: "💕",
    2: "👥",
    3: "💼",
    4: "🌴",
    5: "😂",
    6: "🐾",
    7: "📱",
    8: "😌",
    9: "☕",
    10: "✈️",
    11: "💰",
    12: "🍽️",
    13: "💪",
    14: "😴",
    15: "📚",
    16: "🎵",
    17: "🧹",
    18: "🐶",
    19: "👗",
    20: "🎮",
    21: "🎬",
    22: "💝",
    23: "📖",
    24: "💑",
    25: "🎓",
    26: "🧠",
    27: "🔄",
    28: "📊",
    29: "🎯",
    30: "💡",
    31: "💔",
    32: "❤️",
    33: "🤝",
    34: "✍️",
    35: "🧬",
    36: "🌟",
  };
  return icons[id] || "✨";
}
