import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { loadTestsData } from "@/lib/tests-data";

// 코드 에디터를 dynamic import로 클라이언트 사이드에서만 로드
const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
});

const LOCALES = [
  { code: "ko", label: "한국어 (기본)" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

export default function TestsAdmin() {
  const [locale, setLocale] = useState("ko");
  const [testsData, setTestsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setStatusMessage(null);

      try {
        const data = await loadTestsData(locale);
        if (!cancelled) {
          setTestsData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const handleSave = useCallback(
    (newValue) => {
      try {
        setTestsData(newValue);
        setError(null);

        if (typeof window === "undefined") {
          return;
        }

        const jsonContent = JSON.stringify(newValue, null, 2);
        const fileName = `tests-${locale}.json`;
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setStatusMessage(`${fileName} 파일이 다운로드되었습니다. public/data 디렉터리에 교체해 주세요.`);
      } catch (err) {
        console.error("Failed to prepare download:", err);
        setError("파일 다운로드 중 문제가 발생했습니다.");
      }
    },
    [locale]
  );

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (loading || !testsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>테스트 콘텐츠 관리</h1>

      <p className="helper-text">
        각 언어별 JSON 데이터를 수정한 뒤 저장을 누르면 새 파일이 다운로드됩니다. 변경분을
        `public/data/tests-언어코드.json` 경로와 루트 번역 리소스에 반영해 주세요.
      </p>

      <div className="locale-switcher">
        {LOCALES.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            className={locale === item.code ? "active" : ""}
          >
            {item.label}
          </button>
        ))}
      </div>

      {statusMessage && <div className="status">{statusMessage}</div>}

      <JsonEditor key={locale} value={testsData} onSave={handleSave} />
      <style jsx>{`
        .admin-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .error {
          color: red;
          padding: 1rem;
        }
        .helper-text {
          margin-bottom: 1rem;
          color: #555;
          line-height: 1.6;
        }
        .locale-switcher {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .locale-switcher button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .locale-switcher button.active {
          border-color: #0070f3;
          color: #0070f3;
          background: rgba(0, 112, 243, 0.08);
        }
        .status {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: #f0f8ff;
          border: 1px solid #90caf9;
          border-radius: 6px;
          color: #0d47a1;
        }
      `}</style>
    </div>
  );
}
