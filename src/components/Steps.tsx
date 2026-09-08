import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

const STEPS = [
  {
    n: "01",
    title: "Aim",
    kicker: "Live camera only",
    body: "Open the app and point it at the barcode on something you already own. There is no upload button and no camera roll — the code has to be in front of you, on the box, now.",
  },
  {
    n: "02",
    title: "Resolve",
    kicker: "No guessing involved",
    body: "The check digit is verified, the company prefix is looked up, and the licensee is carried up to whatever is listed above it. If the prefix is not in the map, you are told that, not given a best guess.",
  },
  {
    n: "03",
    title: "Own",
    kicker: "Fractional, tokenized",
    body: "A tokenized fractional share of the parent lands in your wallet, issued and custodied by a licensed third party. One barcode pays once, to one wallet, ever.",
  },
];

export function Steps() {
  return (
    <Section
      id="how"
      num="02"
      title={
        <>
          Three steps.
          <br />
          Nothing to buy.
        </>
      }
      lede="You are not signing up for a loyalty scheme and you are not spending anything. You are taking an inventory of a house you already paid for."
    >
      <ol className="grid gap-px border border-rule-2 bg-rule-2 md:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="flex flex-col bg-stock-2 p-6">
            <div className="flex items-baseline justify-between">
              <span className="label-sm text-ink-faint">{step.n}</span>
              <span className="label-sm text-laser">{step.kicker}</span>
            </div>
            <h3 className="condensed mt-8 text-4xl font-extrabold leading-none">
              {step.title}
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 border border-rule-2 bg-stock-3/40 px-5 py-4">
        <span className="label text-ink-faint">The whole rule</span>
        <span className="font-mono text-[13px]">
          ${siteConfig.reward.perScan.toFixed(2)} per barcode you have never
          scanned · first one pays ${siteConfig.reward.welcome.toFixed(2)} ·{" "}
          {siteConfig.reward.scansPerDayFree} a day · $
          {siteConfig.reward.lifetimeCapFree} lifetime, or $
          {siteConfig.reward.lifetimeCapHolder} holding {siteConfig.token.symbol}
        </span>
      </div>
    </Section>
  );
}
