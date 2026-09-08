"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Barcode } from "@/components/ui/Barcode";
import { completeEan13, display } from "@/lib/ean13";
import { BRANDS, resolve } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

/**
 * Five things off a real shelf. The item references are filler — the part that
 * has to be true is the company prefix, and that comes out of the map.
 */
const REEL = [
  { brand: "Doritos", item: "64527", pack: "Nacho Cheese · 9.25 oz" },
  { brand: "Dove", item: "13787", pack: "Beauty bar · 4 ct" },
  { brand: "Duracell", item: "03028", pack: "Coppertop AA · 8 ct" },
  { brand: "Kirkland Signature", item: "12245", pack: "Organic eggs · 24 ct" },
  { brand: "Snickers", item: "44228", pack: "Single bar · 1.86 oz" },
] as const;

const SWEEP_MS = 1500;
const HOLD_MS = 3600;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const toResolved = window.setTimeout(() => setResolved(true), SWEEP_MS);
    const toNext = window.setTimeout(() => {
      setResolved(false);
      setIndex((i) => (i + 1) % REEL.length);
    }, SWEEP_MS + HOLD_MS);
    return () => {
      window.clearTimeout(toResolved);
      window.clearTimeout(toNext);
    };
  }, [index]);

  const current = REEL[index];

  const scan = useMemo(() => {
    const brand = BRANDS.find((b) => b.name === current.brand);
    if (!brand) return null;
    const code = completeEan13(brand.prefix + current.item);
    return { brand, code, resolution: resolve(code) };
  }, [current]);

  if (!scan?.resolution) return null;

  const { company: owner, brand } = scan.resolution;
  const live = owner.status === "live";
  const priv = owner.status === "private";

  return (
    <section className="glass-panel relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 md:pb-24 md:pt-32">
      {/* The glass of a checkout scanner: dark, faintly gridded, nothing shiny. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--rule-glass) 1px, transparent 1px), linear-gradient(90deg, var(--rule-glass) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
        <div>
          <p className="label text-laser">
            {siteConfig.token.chain} · Early access
          </p>

          <h1 className="condensed mt-6 text-[3.1rem] font-extrabold leading-[0.9] tracking-[-0.025em] sm:text-[4.4rem] md:text-[5.1rem]">
            Scan the box.
            <br />
            Own the company
            <br />
            that made it.
          </h1>

          <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-stock-3/80">
            A receipt tells you where you paid. A barcode tells you who made it —
            the left half of every code on your shelf is a company, printed there
            by the company itself. Point a camera at it and a sliver of that
            company&apos;s stock lands in your wallet.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/scan"
              className="label bg-laser px-6 py-4 text-stock-2 transition-transform hover:-translate-y-0.5"
            >
              Scan a code →
            </Link>
            <a
              href="#how"
              className="label border border-rule-glass px-6 py-4 text-stock-3/80 transition-colors hover:border-stock-2 hover:text-stock-2"
            >
              How it works
            </a>
          </div>

          <p className="label-sm mt-8 max-w-md leading-[1.7] text-stock-3/60">
            The scanner on this site is real and resolves live. Rewards are not:
            nothing has been paid to anyone yet.
          </p>
        </div>

        {/* The scanner bed. White label, one red line, black glass. */}
        <div className="relative">
          <div className="border border-rule-glass bg-glass-2 p-3 sm:p-4">
            <div className="flex items-center justify-between border-b border-rule-glass px-1 pb-3">
              <span className="label text-stock-3/60">Scanner · bed 01</span>
              <span className="label flex items-center gap-2 text-laser">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-laser"
                  style={{ animation: "blink 1.1s steps(1) infinite" }}
                />
                {resolved ? "Resolved" : "Reading"}
              </span>
            </div>

            {/* The label itself: stock-coloured, because that is what a package is. */}
            <div className="relative mt-3 overflow-hidden bg-stock-2 px-5 py-6">
              <div className="flex items-baseline justify-between">
                <span className="label-sm text-ink-faint">{brand.name}</span>
                <span className="label-sm text-ink-faint">{current.pack}</span>
              </div>

              <div className="mt-4 flex justify-center">
                <Barcode
                  key={scan.code}
                  code={scan.code}
                  highlight={resolved ? 7 : 0}
                  animate
                  className="h-auto w-full max-w-[300px]"
                />
              </div>

              {!resolved ? (
                <div
                  aria-hidden
                  className="laser-line absolute inset-x-0 top-6 h-[2px]"
                  style={{
                    ["--sweep-distance" as string]: "250px",
                    animation: `sweep ${SWEEP_MS}ms ease-in-out infinite`,
                  }}
                />
              ) : null}
            </div>

            {/* Readout. Four rows, because there are exactly four hops. */}
            <dl className="mt-3 divide-y divide-rule-glass border-t border-rule-glass">
              <Row label="GTIN" value={display(scan.code)} mono />
              <Row
                label="GS1 prefix"
                value={brand.prefix.replace(/^0/, "")}
                tone={resolved ? "laser" : "idle"}
                mono
              />
              <Row
                label="Licensee"
                value={brand.licensee ?? owner.name}
                tone={resolved ? "on" : "idle"}
              />
              <Row
                label={priv ? "Parent" : "Listed parent"}
                value={owner.name}
                tone={resolved ? "on" : "idle"}
              />
            </dl>

            <div
              className={clsx(
                "mt-3 flex items-center justify-between gap-3 px-1 py-3",
                resolved ? "opacity-100" : "opacity-25",
              )}
              style={resolved ? { animation: "pop 320ms ease-out both" } : undefined}
            >
              <div>
                <p className="label-sm text-stock-3/55">
                  {priv ? "No stock exists" : live ? "Pays today" : "Pays on listing"}
                </p>
                <p className="condensed mt-2 text-3xl font-extrabold leading-none">
                  {priv ? (
                    <span className="text-stock-3/70">
                      {siteConfig.token.symbol} instead
                    </span>
                  ) : (
                    <span className={live ? "text-laser" : "text-stock-2"}>
                      +{owner.ticker}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="label-sm text-stock-3/55">Reward</p>
                <p className="mt-2 font-mono text-2xl leading-none">
                  ${siteConfig.reward.perScan.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <p className="label-sm mt-4 leading-[1.7] text-stock-3/60">
            {priv
              ? `${owner.name} is private — ${owner.note}`
              : live
                ? "Tokenized share already live on Robinhood Chain."
                : "Listed on a US exchange. Waiting on a tokenized share."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
  tone = "on",
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "on" | "idle" | "laser";
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-1 py-2.5">
      <dt className="label-sm text-stock-3/60">{label}</dt>
      <dd
        className={clsx(
          "truncate text-right text-[13px]",
          mono && "font-mono tracking-[0.06em]",
          tone === "laser" && "text-laser",
          tone === "idle" && "text-stock-3/55",
          tone === "on" && "text-stock-2",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
