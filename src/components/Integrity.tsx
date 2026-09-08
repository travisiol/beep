import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

const RULES = [
  {
    n: "01",
    title: "Live camera only.",
    body: "There is no upload button. The code has to be in front of the lens, on a physical package, in the moment. A screenshot, a saved photo or a barcode on a screen cannot even be submitted.",
  },
  {
    n: "02",
    title: "One code. One wallet. Once.",
    body: "A GTIN pays a given wallet a single time, ever. Rescanning the same shelf next week pays nothing, and neither does a second angle, a second phone or a second account on the same code.",
  },
  {
    n: "03",
    title: "The cap is the fraud model.",
    body: `A scan is worth $${siteConfig.reward.perScan.toFixed(2)} and a wallet tops out at $${siteConfig.reward.lifetimeCapFree} without holding anything. Standing in an aisle photographing stock you do not own is a long afternoon for pocket change — a ceiling stops more abuse than any detector, and it is a rule we can publish.`,
  },
  {
    n: "04",
    title: "We never see the purchase.",
    body: "A barcode is not a receipt. There is no merchant, no total, no date and no card — nothing about where you shop or what you paid ever reaches us, because the product does not need it to work.",
  },
];

export function Integrity() {
  return (
    <Section
      id="integrity"
      num="05"
      tone="glass"
      title={
        <>
          The reward is stock,
          <br />
          so the rules are boring.
        </>
      }
      lede="Anything that pays in shares gets attacked. The defence here is mostly arithmetic: make each scan small, make the ceiling low, make every code pay exactly once — and the cleverness stops being necessary."
    >
      <ol className="grid gap-px border border-rule-glass bg-rule-glass sm:grid-cols-2">
        {RULES.map((rule) => (
          <li key={rule.n} className="bg-glass-2 p-6">
            <span className="label-sm text-laser">{rule.n}</span>
            <h3 className="condensed mt-5 text-2xl font-extrabold leading-tight">
              {rule.title}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-stock-3/70">
              {rule.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-6 border border-rule-glass p-6">
        <p className="label text-stock-3/60">And the part we do not publish</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stock-3/75">
          Every frame is checked for the things that separate a package from a
          picture of one. Which things, and in what order, is not written down
          here. That is the point of it.
        </p>
      </div>
    </Section>
  );
}
