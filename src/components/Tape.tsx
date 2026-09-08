import { clsx } from "clsx";
import { BRANDS, company } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

const FEATURED = [
  "Doritos",
  "Tide",
  "Coca-Cola",
  "Duracell",
  "Cheerios",
  "Kirkland Signature",
  "Oreo",
  "Dove",
  "Snickers",
  "Gatorade",
  "Kleenex",
  "Heinz Ketchup",
];

/**
 * The line that does the explaining before anyone has read a word of the page:
 * a shelf of things people own, each one followed by a ticker.
 */
export function Tape() {
  const items = FEATURED.map((name) => {
    const brand = BRANDS.find((b) => b.name === name);
    const owner = brand ? company(brand.company) : undefined;
    return brand && owner ? { brand, owner } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const run = [...items, ...items];

  return (
    <div className="marquee-mask overflow-hidden border-y border-rule-2 bg-stock-2 py-3">
      <div className="marquee-track">
        {run.map((item, i) => (
          <span
            key={`${item.brand.name}-${i}`}
            className="label flex shrink-0 items-center gap-3 px-5 text-ink-dim"
          >
            <span className="text-ink">{item.brand.name.toUpperCase()}</span>
            <span className="text-ink-faint">pays in</span>
            <span
              className={clsx(
                "font-bold",
                item.owner.status === "private" ? "text-ink-faint" : "text-laser",
              )}
            >
              {item.owner.ticker ? `+${item.owner.ticker}` : siteConfig.token.symbol}
            </span>
            <span className="text-ink-faint">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
