import type { Metadata } from "next";
import { Resolver } from "@/components/Resolver";
import { Footer } from "@/components/Footer";
import { MAPPED_BRANDS, MAPPED_COMPANIES } from "@/data/brands";

export const metadata: Metadata = {
  title: "Resolver",
  description:
    "Put any barcode in your house through the real resolver: check digit, GS1 company prefix, licensee, listed parent. Runs in the browser, pays nobody.",
};

export default function ScanPage() {
  return (
    <main>
      <section className="px-5 pb-14 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="rule-heavy" />
          <div className="grid gap-6 pt-5 md:grid-cols-[6.5rem_1fr] md:gap-8">
            <span className="label-sm pt-2 text-ink-faint">Tool</span>
            <div className="max-w-3xl">
              <h1 className="condensed text-[2.6rem] font-extrabold leading-[0.92] tracking-[-0.02em] sm:text-[3.6rem]">
                The resolver.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
                This is the real one, not a mock-up of one. It verifies the check
                digit, pulls the GS1 company prefix and carries the licensee up
                to whatever is listed above it — {MAPPED_BRANDS} prefixes,{" "}
                {MAPPED_COMPANIES} parents, entirely in your browser.
              </p>
              <p className="label-sm mt-5 leading-[1.7] text-ink-faint">
                It resolves. It does not pay. Nothing here credits a wallet,
                because nothing has been paid to anyone yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Resolver />
        </div>
      </section>

      <Footer />
    </main>
  );
}
