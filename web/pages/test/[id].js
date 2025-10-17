import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import useAdScripts from "@/hooks/useAdScripts";
import { trackEvent } from "@/utils/analytics";

const SAMPLE = {
  1: {
    title: "당신의 연애형 테스트",
    questions: [
      "데이트에 먼저 연락하나요?",
      "선물에 신경을 쓰나요?",
      "싸움 후 먼저 화해하나요?",
    ],
    results: [
      { key: "A", text: "불타는 도파민형" },
      { key: "B", text: "차분한 이성형" },
    ],
  },
};

export default function TestPage({ initialTest }) {
  const router = useRouter();
  const { id } = router.query;
  const [def, setDef] = useState(initialTest || null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (def) return; // server-side provided
    if (!id) return;
    fetch("/api/tests")
      .then((r) => r.json())
      .then((data) => {
        const t = data.tests.find((x) => x.id === id);
        setDef(t);
      });
  }, [id, def]);

  // Track test start
  useEffect(() => {
    if (def && id) {
      trackEvent("test_started", {
        test_id: id,
        test_title: def.title,
      });
    }
  }, [def, id]);

  if (!def)
    return <div style={{ padding: 20 }}>로딩 중 또는 테스트가 없습니다.</div>;

  function submit() {
    // 점수는 '예'(1)의 합으로 계산
    const score = answers.reduce((s, v) => s + (v ? 1 : 0), 0);
    const threshold = Math.ceil(def.questions.length / 2);
    const result = score >= threshold ? def.results[0] : def.results[1];

    // Track test completion
    trackEvent("test_completed", {
      test_id: id,
      test_title: def.title,
      score: score,
      total_questions: def.questions.length,
      result_key: result.key,
    });

    router.push(`/result/${id}?r=${result.key}`);
  }

  const isAdsReady = useAdScripts();

  return (
    <main style={{ padding: 20 }}>
      {isAdsReady && <AdUnit unitId="TOP_BANNER" />}
      <h2>{def.title}</h2>
      {def.questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <div>{q}</div>
          <button
            data-question-index={idx}
            data-answer="1"
            onClick={() => setAnswers((a) => [...a, 1])}
          >
            예
          </button>
          <button
            data-question-index={idx}
            data-answer="0"
            onClick={() => setAnswers((a) => [...a, 0])}
          >
            아니오
          </button>
        </div>
      ))}
      <button onClick={submit}>결과 보기</button>
      {isAdsReady && (
        <>
          <AdUnit unitId="SIDEBAR" />
          <AdUnit unitId="IN_ARTICLE" />
          <AdUnit unitId="BOTTOM_BANNER" />
        </>
      )}
    </main>
  );
}

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");
  const p = path.join(process.cwd(), "data", "tests.json");
  const raw = fs.readFileSync(p, "utf8");
  const obj = JSON.parse(raw);
  const paths = (obj.tests || []).map((t) => ({ params: { id: t.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { id } = context.params || {};
  const fs = require("fs");
  const path = require("path");
  try {
    const p = path.join(process.cwd(), "data", "tests.json");
    const raw = fs.readFileSync(p, "utf8");
    const obj = JSON.parse(raw);
    const t = obj.tests.find((x) => x.id === id) || null;
    return { props: { initialTest: t } };
  } catch (e) {
    return { props: { initialTest: null } };
  }
}
