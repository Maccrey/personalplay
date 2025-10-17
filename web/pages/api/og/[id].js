import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL(
    "https://fonts.gstatic.com/s/nanumgothic/v21/PN_3Rfi-oW3hYwmKDpxS7F_z-9LZxnthv3g.woff2"
  )
).then((res) => res.arrayBuffer());

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const title = searchParams.get("title") || "PersonaPlay 결과";
    const desc = searchParams.get("desc") || "";

    const fontData = await font;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            padding: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #000",
              borderRadius: 12,
              padding: 40,
              maxWidth: "90%",
            }}
          >
            <h1
              style={{
                fontSize: 60,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {title}
            </h1>
            {desc && (
              <p
                style={{
                  fontSize: 30,
                  textAlign: "center",
                  marginTop: 0,
                  opacity: 0.8,
                }}
              >
                {desc}
              </p>
            )}
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 24,
              opacity: 0.6,
            }}
          >
            PersonaPlay - 나를 발견하는 심리테스트
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "NanumGothic",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
