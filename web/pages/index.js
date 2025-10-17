import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "Pretendard, Arial" }}>
      <h1>PersonaPlay — 간단한 MVP</h1>
      <p>빠른 테스트 실행과 결과 페이지(OG + AdSense 플레이스홀더) 확인용.</p>
      <ul>
        <li>
          <Link href="/test/1">샘플 테스트 실행</Link>
        </li>
      </ul>
    </main>
  );
}
