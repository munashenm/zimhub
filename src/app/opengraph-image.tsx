import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZimHub — Zimbabwe's trusted online marketplace";
export const size = { width: 1200, height: 630 };
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
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #14532d 0%, #166534 45%, #052e16 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          ZimHub
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {"Zimbabwe's trusted online marketplace"}
          </div>
          <div style={{ fontSize: 28, opacity: 0.9, maxWidth: 820 }}>
            Buy & sell safely with verified sellers · EcoCash · Paynow · Nationwide
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.85 }}>www.zimhub.co.zw</div>
      </div>
    ),
    { ...size }
  );
}
