import { Section } from "@/components/ui/Section";
import { BRANDS, COMPANIES } from "@/data/brands";

/**
 * The FDA panel, borrowed wholesale — same rule weights, same right-aligned
 * percentage column, same asterisked footnote doing the real explaining. It is
 * the one piece of typography every shopper already knows how to read, which
 * makes it the right place to put the number this product exists to show.
 */
export function OwnershipFacts() {
  const counts = new Map<string, number>();
  for (const brand of BRANDS) {
    counts.set(brand.company, (counts.get(brand.company) ?? 0) + 1);
  }

  const rows = COMPANIES.filter((c) => counts.has(c.id))
    .map((c) => ({
      company: c,
      n: counts.get(c.id) ?? 0,
      share: Math.round(((counts.get(c.id) ?? 0) / BRANDS.length) * 100),
    }))
    .sort((a, b) => b.n - a.n);

  const ownable = rows.filter((r) => r.company.status !== "private");
  const unownable = rows.filter((r) => r.company.status === "private");
  const unownableShare = unownable.reduce((sum, r) => sum + r.share, 0);
  const live = rows.filter((r) => r.company.status === "live");

  return (
    <Section
      id="facts"
      num="04"
      title={
        <>
          Ownership Facts,
          <br />
          printed on the side.
        </>
      }
      lede="The one panel every shopper already knows how to read, pointed at the only ingredient nobody lists: who ends up with the money."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
        {/* The panel. Black on white, three rule weights, nothing else. */}
        <div className="sheet-flat max-w-md border-2 border-ink p-3 sm:p-4">
          <h3 className="condensed text-[2.6rem] font-extrabold leading-none tracking-[-0.02em]">
            Ownership Facts
          </h3>
          <div className="rule-hair mt-1" />
          <p className="pt-1 text-[13px] font-semibold">1 household scanned</p>
          <div className="flex items-baseline justify-between pb-1">
            <span className="text-[13px] font-bold">Serving size</span>
            <span className="text-[13px] font-bold">
              1 shelf ({BRANDS.length} items)
            </span>
          </div>

          <div className="rule-heavy" />
          <p className="pt-1 text-[11px] font-bold">Amount per household</p>
          <div className="flex items-end justify-between pb-1">
            <span className="condensed text-[1.7rem] font-extrabold leading-none">
              Companies
            </span>
            <span className="condensed text-[2.6rem] font-extrabold leading-none">
              {rows.length}
            </span>
          </div>

          <div className="rule-mid" />
          <p className="py-1 text-right text-[11px] font-bold">% of shelf</p>
          <div className="rule-hair" />

          <ul>
            {ownable.map((row) => (
              <li key={row.company.id}>
                <div className="rule-hair flex items-baseline justify-between gap-3 py-[5px]">
                  <span className="min-w-0 truncate text-[13px]">
                    <span className="font-bold">{row.company.name}</span>{" "}
                    <span className="font-mono text-[11px] text-ink-dim">
                      {row.company.ticker}
                    </span>
                  </span>
                  <span className="shrink-0 text-[13px] font-bold tabular-nums">
                    {row.share}%
                  </span>
                </div>
              </li>
            ))}
            <li>
              <div className="rule-hair flex items-baseline justify-between gap-3 py-[5px]">
                <span className="text-[13px] font-bold">
                  Not listed anywhere
                </span>
                <span className="shrink-0 text-[13px] font-bold tabular-nums">
                  {unownableShare}%
                </span>
              </div>
            </li>
          </ul>

          <div className="rule-heavy mt-1" />
          <p className="pt-2 text-[11px] leading-[1.45]">
            <span className="font-bold">*</span> % of shelf is the share of
            scanned items whose listed parent is this company. It is not a share
            of what you spent, and it is emphatically not a share of the company
            — that part you have to be paid.
          </p>
        </div>

        <div className="max-w-xl">
          <h3 className="condensed text-2xl font-extrabold leading-tight">
            Read it the way you read the back of a cereal box.
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
            A nutrition panel exists because the ingredients are not obvious from
            the front of the pack. Neither is this. The front says Tide, Bounty,
            Dawn, Crest, Gillette and Pampers — six brands, six aisles, six
            decisions. The back says Procter &amp; Gamble, once, with your money
            in it.
          </p>

          <div className="mt-8 grid gap-px border border-rule-2 bg-rule-2">
            <Note
              k="The one nobody guesses"
              v="Duracell resolves to Berkshire Hathaway. Not a licensing deal — Berkshire bought the company outright in 2016, so the batteries in your drawer are a BRK.B holding wearing a copper top."
            />
            <Note
              k="The one that cannot pay"
              v={`${unownable
                .map((r) => r.company.name)
                .join(" and ")} are private. There is no share to send, at any price, and the panel counts them at ${unownableShare}% rather than quietly leaving them out.`}
            />
            <Note
              k="The one that pays today"
              v={`Only ${live.length} of these ${rows.length} have a tokenized share on Robinhood Chain right now: ${live
                .map((r) => r.company.ticker)
                .join(", ")}. The rest are mapped and waiting on a listing.`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Note({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-stock-2 p-5">
      <p className="label text-laser">{k}</p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{v}</p>
    </div>
  );
}
