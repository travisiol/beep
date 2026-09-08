import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { COMPANIES } from "@/data/brands";

export function Listings() {
  const live = COMPANIES.filter((c) => c.status === "live");
  const waiting = COMPANIES.filter((c) => c.status === "listed");

  return (
    <Section
      id="listings"
      num="06"
      title={
        <>
          Three pay today.
          <br />
          The pantry is waiting.
        </>
      }
      lede="A reward can only be paid in a stock that has been tokenized, and that list is short. Rather than dress it up: here is exactly what lands in a wallet this week, and here is everything mapped, resolving correctly, and waiting on somebody else to list it."
    >
      <div className="border border-rule-2 bg-stock-2">
        <div className="flex items-center justify-between border-b border-rule-2 px-5 py-3">
          <span className="label text-laser">Paying out now</span>
          <span className="label-sm text-ink-faint">
            Tokenized on Robinhood Chain
          </span>
        </div>
        <div className="grid gap-px bg-rule-2 sm:grid-cols-3">
          {live.map((c) => (
            <div key={c.id} className="bg-stock-2 px-5 py-6">
              <p className="condensed text-4xl font-extrabold leading-none text-laser">
                {c.ticker}
              </p>
              <p className="mt-3 text-[14px] font-semibold">{c.name}</p>
              <p className="label-sm mt-2 text-ink-faint">
                {c.id === "cost"
                  ? "Kirkland Signature"
                  : c.id === "amzn"
                    ? "365 · Amazon Basics"
                    : "Apple hardware"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border border-rule-2">
        <div className="flex items-center justify-between border-b border-rule-2 bg-stock-2 px-5 py-3">
          <span className="label">Mapped and waiting</span>
          <span className="label-sm text-ink-faint">
            {waiting.length} listed parents · resolves, cannot pay yet
          </span>
        </div>
        <div className="marquee-mask overflow-hidden bg-stock-2 py-4">
          <div className="marquee-track marquee-track-slow">
            {[...waiting, ...waiting].map((c, i) => (
              <span
                key={`${c.id}-${i}`}
                className="flex shrink-0 items-baseline gap-2 px-5"
              >
                <span className="condensed text-xl font-extrabold text-ink-dim">
                  {c.ticker}
                </span>
                <span className="label-sm text-ink-faint">{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-2">
        {COMPANIES.filter((c) => c.status === "private").map((c) => (
          <div key={c.id} className="bg-stock-3/50 p-5">
            <div className="flex items-baseline justify-between">
              <p className="condensed text-2xl font-extrabold leading-none">
                {c.name}
              </p>
              <span className={clsx("label-sm text-ink-faint")}>No ticker</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">
              {c.note}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
