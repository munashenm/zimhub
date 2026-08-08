import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#166534",
          color: "white",
          fontSize: 220,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        Z
      </div>
    ),
    { ...size }
  );
}
