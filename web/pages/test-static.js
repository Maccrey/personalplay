import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { trackEvent } from "@/utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthButton from "@/components/AuthButton";
import KakaoAd from "@/components/KakaoAd";
import { useTranslation } from "@/hooks/useTranslation";
import useMobileDetect from "@/hooks/useMobileDetect";
import { getTestById } from "@/lib/tests-data";

// This is a test page to debug issues with dynamic routes.
export default function TestStaticPage({ initialTest }) {
  const router = useRouter();
  const { id } = router.query; // This will be undefined, but the page uses initialTest
  const { t } = useTranslation();
  const [def, setDef] = useState(initialTest || null);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const isMobile = useMobileDetect();

  const adUnitId = isMobile ? "DAN-7yebP80ZaDE3EnP7" : "DAN-Cj8ewHs8YSOJTAWw";
  const adWidth = isMobile ? 320 : 728;
  const adHeight = isMobile ? 100 : 90;

  useEffect(() => {
    if (def) return; // server-side provided
    getTestById('1').then((test) => setDef(test));
  }, [def]);

  if (!def) {
    return (
      <div className="container" style={{ padding: "var(--spacing-2xl)", textAlign: "center" }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const testTitle = t(`tests.1.title`);
  const testQuestions = def.questions?.map((_, idx) => t(`tests.1.questions.${idx}`)) || [];
  const currentQuestion = testQuestions[currentQ] || def.questions?.[currentQ] || "";

  function handleAnswer(value) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < def.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const score = newAnswers.reduce((s, v) => s + (v ? 1 : 0), 0);
      const threshold = Math.ceil(def.questions.length / 2);
      const result = score >= threshold ? def.results[0] : def.results[1];
      router.push(`/result/1?r=${result.key}`);
    }
  }

  const progress = ((currentQ + 1) / def.questions.length) * 100;

  return (
    <>
      <Head>
        <title>{testTitle} - PersonaPlay</title>
        <meta name="description" content={`${testTitle} - ${t('home.subtitle')}`} />
      </Head>
      <main className="fade-in">
        <header className="page-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {/* Header content... */}
        </header>
        <div className="container" style={{ maxWidth: '720px', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
          <h1>{testTitle}</h1>
          <p>{currentQuestion}</p>
          <KakaoAd key={`${router.asPath}-${adUnitId}`} unitId={adUnitId} width={adWidth} height={adHeight} />
          <div>
            <button onClick={() => handleAnswer(1)}>{t('common.yes')}</button>
            <button onClick={() => handleAnswer(0)}>{t('common.no')}</button>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const id = '1'; // Hardcode ID for the static test page
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
