import type { Metadata } from "next";
import { clsx } from "clsx";
import { Footer } from "@/components/Footer";
import {
  AISLES,
  BRANDS,
  MAPPED_BRANDS,
  MAPPED_COMPANIES,
  UNCHECKED,
  company,
} from "@/data/brands";

export const metadata: Metadata = {
  title: "The map",
  description:
    "Every GS1 company prefix in this build, the licensee it belongs to, the listed parent above it, and whether it has been verified.",
};

export default function BrandsPage() {
  return (
    <main>
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="rule-heavy" />
          <div className="grid gap-6 pt-5 md:grid-cols-[6.5rem_1fr] md:gap-8">
            <span className="label-sm pt-2 text-ink-faint">Reference</span>
            <div className="max-w-3xl">
              <h1 className="condensed text-[2.6rem] font-extrabold leading-[0.92] tracking-[-0.02em] sm:text-[3.6rem]">
                The map.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
                {MAPPED_BRANDS} prefixes, {MAPPED_COMPANIES} listed parents. A
                prefix names a licensee; the second column is the work — carrying
                that licensee up to something a person can actually hold.
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
                {UNCHECKED} rows are marked unverified. That means the prefix is
                plausible but has not been read off a package or confirmed
                against a public GS1 record, and it stays marked until someone
                does it. A wrong prefix pays out the wrong company&apos;s stock,
                so the gaps are printed rather than tidied away.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 border border-rule-2 bg-stock-2 px-5 py-3">
            <span className="label text-ink-faint">Legend</span>
            <Legend mark="●" tone="laser" text="Tokenized share live today" />
            <Legend mark="○" text="Listed, waiting on a tokenized share" />
            <Legend mark="—" text="Private. No stock exists" />
            <Legend mark="?" text="Prefix unverified" />
          </div>

          {AISLES.map((aisle) => {
            const rows = BRANDS.filter((b) => b.aisle === aisle);
            if (rows.length === 0) return null;
            return (
              <div key={aisle} className="mb-8">
                <h2 className="condensed rule-mid pb-1 text-2xl font-extrabold">
                  {aisle}
                </h2>
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="rule-hair">
                      <th scope="col" className="label-sm py-2 text-ink-faint">
                        Brand
                      </th>
                      <th scope="col" className="label-sm py-2 text-ink-faint">
                        Prefix
                      </th>
                      <th
                        scope="col"
                        className="label-sm hidden py-2 text-ink-faint sm:table-cell"
                      >
                        Licensee
                      </th>
                      <th scope="col" className="label-sm py-2 text-ink-faint">
                        Listed parent
                      </th>
                      <th
                        scope="col"
                        className="label-sm py-2 text-right text-ink-faint"
                      >
                        Pays in
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((brand) => {
                      const owner = company(brand.company);
                      if (!owner) return null;
                      return (
                        <tr
                          key={`${brand.name}-${brand.prefix}`}
                          className="rule-hair align-baseline"
                        >
                          <td className="py-2.5 pr-3 text-[14px] font-semibold">
                            {brand.name}
                            {!brand.checked ? (
                              <span
                                className="label-sm ml-2 text-ink-faint"
                                title="Prefix unverified"
                              >
                                ?
                              </span>
                            ) : null}
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-[13px] tracking-[0.06em]">
                            {brand.prefix.replace(/^0/, "")}
                          </td>
                          <td className="hidden py-2.5 pr-3 text-[13px] text-ink-dim sm:table-cell">
                            {brand.licensee ?? "—"}
                          </td>
                          <td className="py-2.5 pr-3 text-[13px] text-ink-dim">
                            {owner.name}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={clsx(
                                "condensed text-[15px] font-extrabold",
                                owner.status === "live" && "text-laser",
                                owner.status === "private" && "text-ink-faint",
                              )}
                            >
                              {owner.status === "live" ? "● " : ""}
                              {owner.status === "listed" ? "○ " : ""}
                              {owner.ticker ?? "— private"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}

          <p className="max-w-2xl text-[13px] leading-relaxed text-ink-dim">
            Prefixes are written here the way a US shopper reads them, without
            the leading zero that turns a UPC-A into an EAN-13. Item references
            are never stored: the map only ever needs the front of the code.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Legend({
  mark,
  text,
  tone,
}: {
  mark: string;
  text: string;
  tone?: "laser";
}) {
  return (
    <span className="label-sm flex items-baseline gap-2 text-ink-faint">
      <span className={tone === "laser" ? "text-laser" : undefined}>{mark}</span>
      {text}
    </span>
  );
}
