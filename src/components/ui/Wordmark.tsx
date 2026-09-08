/**
 * The mark is the thing every package already has: a block of bars with the
 * name set tight underneath. The bars here are drawn, not encoded — a logo is
 * not a product, and printing a scannable code into a wordmark would put a real
 * GTIN on every page of the site. The one real code lives in the footer.
 */
export function Wordmark({ className }: { className?: string }) {
  const bars = [3, 1, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 1, 1, 4, 1, 2, 1, 3, 1];

  let x = 0;
  const rects: { x: number; w: number }[] = [];
  bars.forEach((w, i) => {
    if (i % 2 === 0) rects.push({ x, w });
    x += w + 1;
  });
  const width = x - 1;

  return (
    <svg
      viewBox={`0 0 ${width} 46`}
      className={className}
      fill="currentColor"
      role="img"
      aria-label="BEEP"
      preserveAspectRatio="xMinYMid meet"
    >
      {rects.map((r) => (
        <rect key={r.x} x={r.x} y={0} width={r.w} height={16} />
      ))}
      {/* Justified to the exact width of the bar block, the way a name is set
          under a code on a package — and so the mark cannot outgrow its own
          viewBox when the display face has not loaded yet. */}
      <text
        x={0}
        y={44}
        fontFamily="var(--font-display)"
        fontSize={34}
        fontWeight={900}
        textLength={width}
        lengthAdjust="spacing"
        style={{ fontVariationSettings: '"wdth" 88' }}
      >
        BEEP
      </text>
    </svg>
  );
}
