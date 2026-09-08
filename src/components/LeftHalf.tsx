import { Section } from "@/components/ui/Section";
import { Barcode } from "@/components/ui/Barcode";
import { completeEan13 } from "@/lib/ean13";
import {
  LIVE_COMPANIES,
  MAPPED_BRANDS,
  MAPPED_COMPANIES,
  UNCHECKED,
} from "@/data/brands";

// Coca-Cola's US prefix, with a filler item reference.
const SPECIMEN = completeEan13("004900000463");

/*
 * Bar geometry, so the brackets under the diagram point at the right things
 * rather than approximately at them. The SVG is 113 modules wide: 11 of quiet
 * zone, 95 of code, 7 of quiet zone.
 */
const W = 113;
const pct = (module: number) => `${((11 + module) / W) * 100}%`;

export function LeftHalf() {
  return (
    <Section
      id="left-half"
      num="01"
      title={
        <>
          The left half of a barcode
          <br />
          is a company.
        </>
      }
      lede="Not a guess about a company. The company itself: GS1 licenses that block of digits to one brand owner, and the owner prints it on everything it makes. A receipt has to be read. This has to be looked up."
    >
      <div className="sheet p-5 sm:p-8">
        <div className="relative">
          <div className="flex justify-center">
            <Barcode
              code={SPECIMEN}
              highlight={7}
              className="h-auto w-full max-w-[520px]"
            />
          </div>

          {/* Brackets, positioned on the real module coordinates. */}
          <div className="relative mx-auto mt-3 hidden h-24 max-w-[520px] sm:block">
            <Bracket from={3} to={45} tone="laser" />
            <Bracket from={50} to={92} tone="ink" />

            <div
              className="absolute top-6"
              style={{ left: pct(3), width: `${((45 - 3) / W) * 100}%` }}
            >
              <p className="label text-laser">The company</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-dim">
                049000 is licensed to The Coca-Cola Company. It is on every can,
                bottle and case they make.
              </p>
            </div>

            <div
              className="absolute top-6"
              style={{ left: pct(50), width: `${((92 - 50) / W) * 100}%` }}
            >
              <p className="label">The product</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-dim">
                Assigned by Coca-Cola, to Coca-Cola&apos;s own rules. Which flavour
                and what size is none of our business.
              </p>
            </div>
          </div>

          {/* Same two facts, stacked, once the brackets stop fitting. */}
          <div className="mt-6 grid gap-4 sm:hidden">
            <div>
              <p className="label text-laser">The company</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-dim">
                049000 is licensed to The Coca-Cola Company — on every can they
                make.
              </p>
            </div>
            <div>
              <p className="label">The product</p>
              <p className="mt-2 text-[13px] leading-snug text-ink-dim">
                Assigned by Coca-Cola, to Coca-Cola&apos;s own rules. Which flavour
                is none of our business.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-px border-t border-rule-2 bg-rule-2 sm:grid-cols-3">
          <Fact
            title="Not read. Resolved."
            body="There is no handwriting to interpret and no merchant line to match. Thirteen digits go in, one licensee comes out, and the same code gives the same answer every time."
          />
          <Fact
            title="The company printed it."
            body="A GS1 prefix is not our label for a brand. It is the brand's registered identifier for itself, printed by the brand, at its own expense."
          />
          <Fact
            title="The second hop is the work."
            body="Frito-Lay is not a ticker. PepsiCo is. The prefix names a licensee; the map carries it up to whatever is listed above it — sometimes three owners up."
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px border border-rule-2 bg-rule-2 sm:grid-cols-4">
        <Stat k={MAPPED_BRANDS} label="brands mapped" />
        <Stat k={MAPPED_COMPANIES} label="parents behind them" />
        <Stat k={LIVE_COMPANIES.length} label="paying today" tone="laser" />
        <Stat k={UNCHECKED} label="prefixes unverified" />
      </dl>
      <p className="label-sm mt-3 text-ink-faint">
        Counted from the map in this build, not from a pitch deck.
      </p>
    </Section>
  );
}

function Bracket({
  from,
  to,
  tone,
}: {
  from: number;
  to: number;
  tone: "laser" | "ink";
}) {
  const color = tone === "laser" ? "var(--laser)" : "var(--ink)";
  return (
    <div
      aria-hidden
      className="absolute top-0 h-3"
      style={{
        left: pct(from),
        width: `${((to - from) / W) * 100}%`,
        borderLeft: `1px solid ${color}`,
        borderRight: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
      }}
    />
  );
}

function Fact({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-stock-2 p-5">
      <h3 className="condensed text-lg font-bold">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{body}</p>
    </div>
  );
}

function Stat({
  k,
  label,
  tone,
}: {
  k: number;
  label: string;
  tone?: "laser";
}) {
  return (
    <div className="bg-stock-2 p-5">
      <dd
        className={`condensed text-4xl font-extrabold leading-none ${
          tone === "laser" ? "text-laser" : ""
        }`}
      >
        {k}
      </dd>
      <dt className="label-sm mt-3 text-ink-faint">{label}</dt>
    </div>
  );
}
