import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The mark, flattened to what survives at 16px: bars, and the one red line. */
export default function Icon() {
  const bars = [6, 3, 9, 3, 4, 6, 3, 3, 8];
  let x = 8;
  const rects = bars.map((w, i) => {
    const rect = { x, w, ink: i % 2 === 0 };
    x += w;
    return rect;
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#eae7e0",
        }}
      >
        {rects
          .filter((r) => r.ink)
          .map((r) => (
            <div
              key={r.x}
              style={{
                position: "absolute",
                left: r.x,
                top: 10,
                width: r.w,
                height: 44,
                background: "#0b0b0c",
                display: "flex",
              }}
            />
          ))}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 30,
            width: 56,
            height: 5,
            background: "#ff2b12",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
