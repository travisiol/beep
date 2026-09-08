"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { BRANDS, company } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

const { reward, token } = siteConfig;

/**
 * The formula the app will actually run, with a handle on it. Nothing is
 * smoothed for the demo: the caps bite exactly where the copy says they do,
 * which is the point of letting anyone drag it.
 */
function payout(items: number, holder: boolean) {
  const cap = holder ? reward.lifetimeCapHolder : reward.lifetimeCapFree;
  const perDay = holder ? reward.scansPerDayHolder : reward.scansPerDayFree;
  const gross = items < 1 ? 0 : reward.welcome + (items - 1) * reward.perScan;
  const paid = Math.min(gross, cap);
  const payableItems =
    gross <= cap ? items : Math.floor((cap - reward.welcome) / reward.perScan) + 1;
  return {
    cap,
    perDay,
    paid,
    payableItems,
    capped: gross > cap,
    days: Math.max(1, Math.ceil(payableItems / perDay)),
  };
}

export function Estimator() {
  const [items, setItems] = useState(120);
  const [holder, setHolder] = useState(false);

  const result = useMemo(() => payout(items, holder), [items, holder]);

  // Which tickers a shelf that size tends to contain, taken from the map rather
  // than made up: walk the mapped brands and count the distinct parents.
  const tickers = useMemo(() => {
    const seen = new Map<string, number>();
    for (let i = 0; i < Math.min(result.payableItems, 400); i++) {
      const brand = BRANDS[i % BRANDS.length];
      const owner = company(brand.company);
      if (!owner) continue;
      seen.set(owner.ticker ?? "PRIVATE", (seen.get(owner.ticker ?? "PRIVATE") ?? 0) + 1);
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }, [result.payableItems]);

  return (
    <Section
      id="shelf"
      num="07"
      title={
        <>
          Drag it.
          <br />
          Count your house.
        </>
      }
      lede={`The average home carries a few hundred branded items. Every one of them has a code on it, and every code has an owner. Here is what an inventory is worth, under the exact rule the app runs.`}
    >
      <div className="grid gap-px border border-rule-2 bg-rule-2 lg:grid-cols-[1.1fr_1fr]">
        <div className="bg-stock-2 p-6 sm:p-8">
          <label htmlFor="items" className="label text-ink-faint">
            Branded items in your house
          </label>
          <output
            htmlFor="items"
            className="condensed mt-4 block text-[4.5rem] font-extrabold leading-none tabular-nums"
          >
            {items}
          </output>

          <input
            id="items"
            type="range"
            min={1}
            max={400}
            step={1}
            value={items}
            onChange={(e) => setItems(Number(e.target.value))}
            className="mt-6 w-full accent-[var(--laser)]"
          />
          <div className="label-sm mt-2 flex justify-between text-ink-faint">
            <span>1</span>
            <span>a full kitchen</span>
            <span>400</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHolder(false)}
              aria-pressed={!holder}
              className={clsx(
                "label border px-4 py-3 transition-colors",
                !holder
                  ? "border-ink bg-ink text-stock-2"
                  : "border-rule-2 text-ink-dim hover:border-ink",
              )}
            >
              Hold nothing
            </button>
            <button
              type="button"
              onClick={() => setHolder(true)}
              aria-pressed={holder}
              className={clsx(
                "label border px-4 py-3 transition-colors",
                holder
                  ? "border-ink bg-ink text-stock-2"
                  : "border-rule-2 text-ink-dim hover:border-ink",
              )}
            >
              Hold {token.symbol}
            </button>
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-ink-dim">
            ${reward.perScan.toFixed(2)} a code, your first pays $
            {reward.welcome.toFixed(2)}, {result.perDay} a day, $
            {result.cap} in total. Holding {token.symbol} moves the ceiling and
            nothing else — the rate is the same for everyone.
          </p>
        </div>

        {/* An inventory tag, not a till receipt: this counts things, not money spent. */}
        <div className="bg-stock-3/50 p-6 sm:p-8">
          <div className="flex items-baseline justify-between border-b-4 border-ink pb-2">
            <span className="condensed text-xl font-extrabold">
              Inventory tag
            </span>
            <span className="label-sm text-ink-faint">Illustrative</span>
          </div>

          <dl className="mt-4 divide-y divide-rule">
            <Line k="Items counted" v={String(items)} />
            <Line
              k="Codes that pay"
              v={String(result.payableItems)}
              note={result.capped ? "ceiling reached" : undefined}
            />
            <Line k="Days to scan" v={`${result.days}`} />
            <Line k="Distinct tickers" v={String(tickers.length)} />
          </dl>

          <div className="mt-6 border-t-4 border-ink pt-4">
            <p className="label text-ink-faint">Paid in stock</p>
            <p className="condensed mt-2 text-[3.4rem] font-extrabold leading-none text-laser">
              ${result.paid.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <p className="label-sm text-ink-faint">Mostly in</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {tickers.slice(0, 8).map(([ticker, n]) => (
                <li key={ticker} className="flex items-baseline gap-1.5">
                  <span className="condensed text-base font-extrabold">
                    {ticker}
                  </span>
                  <span className="label-sm text-ink-faint">{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="label-sm mt-6 leading-[1.7] text-ink-faint">
            Ticker mix is taken from the map in this build, walked in order. Your
            cupboard is not this tidy.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Line({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[13px] font-semibold">{k}</dt>
      <dd className="flex items-baseline gap-2">
        {note ? <span className="label-sm text-laser">{note}</span> : null}
        <span className="font-mono text-[15px] tabular-nums">{v}</span>
      </dd>
    </div>
  );
}
