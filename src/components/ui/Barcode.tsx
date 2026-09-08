import { completeEan13, groups, isGuard, modules, normalize } from "@/lib/ean13";

type Props = {
  code: string;
  /**
   * How many leading digits to print in laser red. The company prefix lands on
   * the left half of the bars almost exactly — digit 1 is carried by the parity
   * pattern and digits 2 through 7 are the six left-hand characters — so
   * highlighting 7 paints the half of the barcode that names the company.
   */
  highlight?: number;
  height?: number;
  showDigits?: boolean;
  /** Bars on a dark ground rather than on stock. */
  invert?: boolean;
  className?: string;
  /** Bars fly in one by one when the code has just been resolved. */
  animate?: boolean;
};

const QUIET_LEFT = 11;
const QUIET_RIGHT = 7;
const WIDTH = QUIET_LEFT + 95 + QUIET_RIGHT;

/*
 * The viewBox is 113 modules wide and `height + 18` tall, and the SVG keeps
 * that ratio ("meet"). A real EAN-13 is 37.3mm x 25.9mm, so the default 68
 * lands within a hair of the printed proportions. Size call sites by WIDTH
 * alone and let the height follow — pinning both crops the code down to
 * whichever axis is tighter and leaves it floating in its own box.
 */

/** Module range covered by the nth digit (1-indexed) of the 13-digit code. */
function modulesForDigit(n: number): [number, number] | null {
  if (n < 2 || n > 13) return null;
  const i = n - 2;
  const start = i < 6 ? 3 + i * 7 : 50 + (i - 6) * 7;
  return [start, start + 7];
}

export function Barcode({
  code,
  highlight = 0,
  height = 68,
  showDigits = true,
  invert = false,
  className,
  animate = false,
}: Props) {
  const full = normalize(code) ?? completeEan13(code);
  const bits = modules(full);
  const [lead, left, right] = groups(full);

  const guardHeight = height + 7;
  const textY = guardHeight + 9;
  const totalHeight = showDigits ? textY + 2 : guardHeight + 1;

  const hot = new Set<number>();
  for (let d = 1; d <= highlight; d++) {
    const range = modulesForDigit(d);
    if (!range) continue;
    for (let m = range[0]; m < range[1]; m++) hot.add(m);
  }

  const bar = invert ? "var(--stock-2)" : "var(--ink)";
  const digit = invert ? "var(--stock-2)" : "var(--ink)";

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${totalHeight}`}
      className={className}
      role="img"
      aria-label={`Barcode ${full}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {bits.split("").map((bit, i) =>
        bit === "1" ? (
          <rect
            key={i}
            x={QUIET_LEFT + i}
            y={0}
            width={1}
            height={isGuard(i) ? guardHeight : height}
            fill={hot.has(i) ? "var(--laser)" : bar}
            style={
              animate
                ? {
                    transformOrigin: "center top",
                    animation: `bar-in 260ms ease-out ${i * 3}ms both`,
                  }
                : undefined
            }
          />
        ) : null,
      )}
      {showDigits ? (
        <g
          fill={digit}
          fontFamily="var(--font-mono)"
          fontSize={10}
          letterSpacing={0.5}
        >
          <text x={4} y={textY} textAnchor="middle" fill={highlight >= 1 ? "var(--laser)" : digit}>
            {lead}
          </text>
          <text
            x={QUIET_LEFT + 24}
            y={textY}
            textAnchor="middle"
            fill={highlight >= 7 ? "var(--laser)" : digit}
          >
            {left}
          </text>
          <text x={QUIET_LEFT + 71} y={textY} textAnchor="middle">
            {right}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
