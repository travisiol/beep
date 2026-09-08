import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

const { reward, token } = siteConfig;

const TIERS = [
  {
    name: "Paper",
    hold: "Free · hold nothing",
    rate: `$${reward.perScan.toFixed(2)}`,
    perDay: `${reward.scansPerDayFree} a day`,
    cap: `$${reward.lifetimeCapFree}`,
    extra: "—",
    note: "The kitchen counter and the bathroom cabinet.",
    featured: false,
  },
  {
    name: "Poly",
    hold: `Hold 100K ${token.symbol} · 0.01% of supply`,
    rate: `$${reward.perScan.toFixed(2)}`,
    perDay: `${reward.scansPerDayHolder} a day`,
    cap: `$${reward.lifetimeCapHolder}`,
    extra: "Priority resolve",
    note: "Enough ceiling for the whole house, garage included.",
    featured: true,
  },
  {
    name: "Foil",
    hold: `Hold 500K ${token.symbol} · 0.05% of supply`,
    rate: `$${reward.perScan.toFixed(2)}`,
    perDay: `${reward.scansPerDayHolder} a day`,
    cap: `$${reward.lifetimeCapHolder}`,
    extra: "Request a prefix · public shelf",
    note: "Missing brand? Foil holders send it to the front of the map.",
    featured: false,
  },
];

export function Tiers() {
  return (
    <Section
      id="tiers"
      num="08"
      title={
        <>
          Same rate for everyone.
          <br />
          Only the ceiling moves.
        </>
      }
      lede={`Holding ${token.symbol} does not pay you more per code, and there is no tier where a scan is worth more than anyone else's. It raises how much of your own house you are allowed to finish counting.`}
    >
      <div className="grid gap-px border border-rule-2 bg-rule-2 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={clsx(
              "flex flex-col p-6",
              tier.featured ? "bg-ink text-stock-2" : "bg-stock-2",
            )}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="condensed text-3xl font-extrabold leading-none">
                {tier.name}
              </h3>
              {tier.featured ? (
                <span className="label-sm text-laser">Most people</span>
              ) : null}
            </div>
            <p
              className={clsx(
                "label-sm mt-3",
                tier.featured ? "text-stock-3/60" : "text-ink-faint",
              )}
            >
              {tier.hold}
            </p>

            <dl
              className={clsx(
                "mt-6 divide-y",
                tier.featured ? "divide-rule-glass" : "divide-rule",
              )}
            >
              <Row k="Per code" v={tier.rate} featured={tier.featured} />
              <Row k="Limit" v={tier.perDay} featured={tier.featured} />
              <Row k="Lifetime" v={tier.cap} featured={tier.featured} laser />
              <Row k="Extra" v={tier.extra} featured={tier.featured} />
            </dl>

            <p
              className={clsx(
                "mt-6 text-[13px] leading-relaxed",
                tier.featured ? "text-stock-3/70" : "text-ink-dim",
              )}
            >
              {tier.note}
            </p>
          </div>
        ))}
      </div>

      <p className="label-sm mt-4 leading-[1.7] text-ink-faint">
        Every wallet&apos;s first code pays ${reward.welcome.toFixed(2)} on any
        tier. {token.symbol} is not deployed and holdings are not yet checked
        against anything.
      </p>
    </Section>
  );
}

function Row({
  k,
  v,
  featured,
  laser,
}: {
  k: string;
  v: string;
  featured: boolean;
  laser?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <dt
        className={clsx(
          "label-sm",
          featured ? "text-stock-3/55" : "text-ink-faint",
        )}
      >
        {k}
      </dt>
      <dd
        className={clsx(
          "text-right text-[14px] font-semibold",
          laser && "text-laser",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
