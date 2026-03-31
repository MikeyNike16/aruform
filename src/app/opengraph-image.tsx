import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#000",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          aruform
        </div>
        <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9 }}>
          existential journaling
        </div>
        <div style={{ fontSize: 24, marginTop: 28, opacity: 0.7 }}>
          Reflect deeply, track emotional patterns, and understand who you&apos;re becoming.
        </div>
        <div style={{ marginTop: 44, fontSize: 18, opacity: 0.6 }}>
          aruform.com
        </div>
      </div>
    ),
    size
  );
}
