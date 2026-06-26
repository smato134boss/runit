import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Runly — Your neighbour will handle it";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1C1917",
          padding: "0 80px",
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Left orange accent bar */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 160,
            width: 5,
            height: 180,
            background: "#F97316",
            borderRadius: 3,
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 32 }}>
          {/* Wordmark */}
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              color: "#F97316",
              lineHeight: 1,
              letterSpacing: "-4px",
              marginBottom: 20,
            }}
          >
            Runly
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 46,
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.2,
              marginBottom: 36,
            }}
          >
            Your neighbour will handle it.
          </div>

          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.35)",
              borderRadius: 24,
              padding: "10px 22px",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#F97316",
              }}
            />
            <div
              style={{ fontSize: 18, fontWeight: 600, color: "#FB923C" }}
            >
              Live across Canada 🇨🇦
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 112,
            fontSize: 20,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          12,000+ tasks  ·  8,500+ runners  ·  4.9★ rating  ·  runly.ca
        </div>
      </div>
    ),
    size
  );
}
