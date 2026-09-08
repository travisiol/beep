import Link from "next/link";
import { Barcode } from "@/components/ui/Barcode";
import { Wordmark } from "@/components/ui/Wordmark";
import { navLinks } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="glass-panel">
      {/* Closing call, on the glass, with the one red line under it. */}
      <div className="border-b border-rule-glass px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="label text-laser">Early access · resolver live</p>
          <h2 className="condensed mt-6 max-w-3xl text-[2.6rem] font-extrabold leading-[0.92] tracking-[-0.02em] sm:text-[3.6rem] md:text-[4.4rem]">
            Your first code is
            <br />
            in the next room.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-stock-3/75">
            Pick up anything on the counter and turn it over. The block of bars
            on the back has been telling you who owns the brand since 1974 — it
            has just never paid you for reading it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/scan"
              className="label bg-laser px-6 py-4 text-stock-2 transition-transform hover:-translate-y-0.5"
            >
              Scan a code →
            </Link>
            <Link
              href="/brands"
              className="label border border-rule-glass px-6 py-4 text-stock-3/80 transition-colors hover:border-stock-2 hover:text-stock-2"
            >
              Read the map
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <Wordmark className="h-9 text-stock-2" />
            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-stock-3/60">
              {siteConfig.tagline}. Built on the one identifier every company
              already prints on everything it makes.
            </p>

            <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/#${link.id}`}
                  className="label-sm text-stock-3/55 transition-colors hover:text-stock-2"
                >
                  {link.num} {link.label}
                </a>
              ))}
              <Link
                href="/brands"
                className="label-sm text-stock-3/55 transition-colors hover:text-stock-2"
              >
                The map
              </Link>
              <Link
                href="/scan"
                className="label-sm text-stock-3/55 transition-colors hover:text-stock-2"
              >
                Resolver
              </Link>
            </nav>
          </div>

          <div className="md:text-right">
            <div className="inline-block bg-stock-2 p-3">
              <Barcode
                code={siteConfig.selfCode}
                height={54}
                className="h-auto w-[190px]"
              />
            </div>
            <p className="label-sm mt-3 text-stock-3/60">
              Prefix 02 · internal use · not a product
            </p>
            <p className="label-sm mt-2 text-stock-3/60">{siteConfig.handle}</p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-rule-glass pt-6">
          <p className="text-[11px] leading-[1.7] text-stock-3/60">
            {siteConfig.name} is not affiliated with, endorsed by, or partnered
            with any brand or company named on this site. Brand names and GS1
            company prefixes are cited as facts about published product
            identifiers, not as claims of any relationship — none of these
            companies have agreed to anything. The resolver is live; reward
            payouts are not, and no wallet has been paid. Rewards are planned as
            tokenized shares issued and custodied by a licensed third-party
            provider; availability varies by region and is not guaranteed.
            Tokenized shares are securities and can lose value.{" "}
            {siteConfig.token.symbol} is a utility token, is not deployed, and is
            not an investment in any company named here. Prefix data is compiled
            from packages and public records and is not audited; unverified
            entries are marked as such on the map. Item references in the sample
            codes are filler — only the company prefix is real. Nothing here is
            investment advice.
          </p>
          <p className="label-sm mt-8 text-center text-stock-3/55">
            ▮▯▮▮▯▮ End of side panel · Rev 01 · Printed 2026 ▮▯▮▮▯▮
          </p>
        </div>
      </div>
    </footer>
  );
}
