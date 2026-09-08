import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { modules } from "@/lib/ean13";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori draws no SVG components of ours, so the barcode is rebuilt here out of
 * divs — same encoder, same 95 modules, the left half in red because that is
 * the half the whole product is about.
 */
export default async function Image() {
  const bits = modules("0049000004632").split("");
  const moduleWidth = 9;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#eae7e0",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#0b0b0c",
          }}
        >
          SCAN WHAT YOU ALREADY OWN
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", height: 190 }}>
          {bits.map((bit, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: moduleWidth,
                height: 190,
                background:
                  bit === "1" ? (i < 45 ? "#ff2b12" : "#0b0b0c") : "transparent",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#0b0b0c",
              lineHeight: 1,
            }}
          >
            Scan the box.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#0b0b0c",
              lineHeight: 1.05,
            }}
          >
            Own the company.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 24,
              color: "rgba(11,11,12,0.66)",
            }}
          >
            The left half of every barcode is a company. {siteConfig.name} pays
            you a sliver of it.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
