import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAllTests } from "../../lib/firestore-client";

// 코드 에디터를 dynamic import로 클라이언트 사이드에서만 로드
const JsonEditor = dynamic(() => import("../../components/JsonEditor"), {
  ssr: false,
});

export default function TestsAdmin() {
  const [tests, setTests] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllTests()
      .then((testsData) => setTests({ tests: testsData }))
      .catch((err) => setError(err.message));
  }, []);

  const handleSave = async (newValue) => {
    try {
      const res = await fetch("/api/tests/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValue),
      });

      if (!res.ok) throw new Error("저장 실패");

      alert("저장되었습니다");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!tests) return <div>Loading...</div>;

  return (
    <div className="admin-page">
      <h1>테스트 콘텐츠 관리</h1>
      <JsonEditor value={tests} onSave={handleSave} />
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
      `}</style>
    </div>
  );
}
