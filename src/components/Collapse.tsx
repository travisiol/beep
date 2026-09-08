"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { BRANDS, COMPANIES, company } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

/**
 * The argument of the whole product, made visually: a shelf of names that
 * everyone reads as variety, flipped over to show how few owners are behind it.
 * Nothing here is styled to persuade — the repetition does it. Seeing PEP six
 * times in one grid is the entire point, so the flip is per-tile and staggered
 * rather than instant, to make the repeats land one at a time.
 */
export function Collapse() {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const armed = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && armed.current) {
            armed.current = false;
            setFlipped(true);
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const tiles = useMemo(
    () =>
      BRANDS.map((brand) => {
        const owner = company(brand.company);
        return { brand, owner };
      }).filter((t): t is { brand: (typeof BRANDS)[number]; owner: NonNullable<ReturnType<typeof company>> } =>
        Boolean(t.owner),
      ),
    [],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tiles) map.set(t.owner.id, (map.get(t.owner.id) ?? 0) + 1);
    return map;
  }, [tiles]);

  const owners = useMemo(
    () =>
      COMPANIES.filter((c) => counts.has(c.id)).sort(
        (a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0),
      ),
    [counts],
  );

  return (
    <Section
      id="collapse"
      num="03"
      title={
        <>
          {tiles.length} brands.
          <br />
          {owners.length} companies.
        </>
      }
      lede="Every name below is a different package on a different shelf, bought on a different day, in a different aisle. Turn them over and most of your house belongs to a dozen boardrooms."
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="label text-ink-faint">
          {flipped ? "Showing owners" : "Showing brands"}
        </p>
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="label border border-rule-2 px-4 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-stock-2"
        >
          {flipped ? "Show the brands again" : "Turn them over"}
        </button>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-2 gap-px border border-rule-2 bg-rule-2 sm:grid-cols-3 md:grid-cols-4"
      >
        {tiles.map(({ brand, owner }, i) => {
          const repeats = counts.get(owner.id) ?? 1;
          return (
            <div
              key={`${brand.name}-${brand.prefix}`}
              className="relative bg-stock-2 p-4"
              style={{
                transition: "background-color 200ms ease",
                transitionDelay: `${(i % 12) * 22}ms`,
              }}
            >
              <div
                className="relative h-[54px]"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                  transitionDelay: `${(i % 16) * 34}ms`,
                  transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
                }}
              >
                {/* Front: what the shopper sees on the shelf. */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="condensed text-[15px] font-bold leading-tight">
                    {brand.name}
                  </span>
                  <span className="label-sm text-ink-faint">{brand.aisle}</span>
                </div>

                {/* Back: what it actually is. */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                >
                  <span
                    className={clsx(
                      "condensed text-2xl font-extrabold leading-none",
                      owner.status === "private" ? "text-ink-faint" : "text-laser",
                    )}
                  >
                    {owner.ticker ?? "PRIVATE"}
                  </span>
                  <span className="label-sm text-ink-faint">
                    {repeats > 1 ? `× ${repeats} on this shelf` : "once here"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border border-rule-2 bg-stock-2 p-5">
        <p className="label text-ink-faint">Owners, by how much shelf they hold</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          {owners.map((owner) => {
            const n = counts.get(owner.id) ?? 0;
            return (
              <li key={owner.id} className="flex items-baseline gap-2">
                <span
                  className={clsx(
                    "condensed text-lg font-extrabold",
                    owner.status === "private" && "text-ink-faint",
                  )}
                >
                  {owner.ticker ?? owner.name}
                </span>
                <span className="label-sm text-ink-faint">{n}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 border-t border-rule pt-4 text-[13px] leading-relaxed text-ink-dim">
          Two of them cannot be owned at any price. Mars has been family-held
          since 1911 and Trader Joe&apos;s sits inside a German family trust —
          scan those and {siteConfig.token.symbol} is paid instead, because
          there is no share to send.
        </p>
      </div>
    </Section>
  );
}
