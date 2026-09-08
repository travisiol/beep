/**
 * Every string that names the product lives here. One rename, one file.
 */
export const siteConfig = {
  name: "BEEP",
  tagline: "Scan what you already own",
  url: "https://beep.family",
  seoDescription:
    "The receipt tells you where you paid. The barcode tells you who made it. Scan the barcodes already in your house and each one hands you a sliver of the company behind it, as tokenized stock.",
  handle: "@beepfamily",

  /** The one rule the whole product runs on. */
  reward: {
    /** Paid per barcode never claimed by this wallet. */
    perScan: 0.25,
    /** Every wallet's first scan, once. */
    welcome: 2,
    scansPerDayFree: 20,
    scansPerDayHolder: 60,
    lifetimeCapFree: 20,
    lifetimeCapHolder: 100,
  },

  /** Illustrative household inventory, used by the estimator's copy. */
  averageHouseholdItems: 300,

  token: {
    symbol: "$BEEP",
    /** Not deployed. Nothing on this site reads a chain. */
    address: null as string | null,
    chain: "Robinhood Chain",
  },

  /** The site's own EAN-13. Real check digit, filler item reference. */
  selfCode: "0209248610358",
} as const;

export type SiteConfig = typeof siteConfig;
