/**
 * The map. This file is the product.
 *
 * A GS1 company prefix is licensed to one brand owner, so the first digits of a
 * barcode already name a company — no OCR, no guessing at a smudged merchant
 * line. The work is the second hop: the licensee is usually a subsidiary, and
 * the thing you can actually own is its listed parent. Frito-Lay is not a
 * ticker. PepsiCo is.
 *
 * Honesty rule for this file: `checked` marks a prefix I have confirmed against
 * a real package or public GS1 record. `false` means plausible but unverified,
 * and the UI says so out loud rather than quietly rounding it up to fact. Never
 * flip a flag to true to make a table look tidier.
 */

export type CompanyStatus =
  /** Tokenized share exists on Robinhood Chain today. */
  | "live"
  /** Publicly listed, but no tokenized share yet. */
  | "listed"
  /** No stock exists. Nobody can own this, at any price. */
  | "private";

export type Company = {
  id: string;
  name: string;
  ticker: string | null;
  status: CompanyStatus;
  note?: string;
};

export type Brand = {
  name: string;
  /** GS1 company prefix in 13-digit space. US UPC prefixes keep their leading 0. */
  prefix: string;
  company: string;
  aisle: Aisle;
  checked: boolean;
  /** The entity that actually licenses the prefix, when it is not the parent. */
  licensee?: string;
};

export type Aisle =
  | "Snacks"
  | "Drinks"
  | "Breakfast"
  | "Cleaning"
  | "Bath"
  | "Household";

export const AISLES: Aisle[] = [
  "Snacks",
  "Drinks",
  "Breakfast",
  "Cleaning",
  "Bath",
  "Household",
];

export const COMPANIES: Company[] = [
  { id: "cost", name: "Costco Wholesale", ticker: "COST", status: "live" },
  { id: "amzn", name: "Amazon", ticker: "AMZN", status: "live" },
  { id: "aapl", name: "Apple", ticker: "AAPL", status: "live" },

  { id: "ko", name: "The Coca-Cola Company", ticker: "KO", status: "listed" },
  { id: "pep", name: "PepsiCo", ticker: "PEP", status: "listed" },
  { id: "pg", name: "Procter & Gamble", ticker: "PG", status: "listed" },
  { id: "mdlz", name: "Mondelez International", ticker: "MDLZ", status: "listed" },
  { id: "gis", name: "General Mills", ticker: "GIS", status: "listed" },
  { id: "khc", name: "Kraft Heinz", ticker: "KHC", status: "listed" },
  { id: "hsy", name: "The Hershey Company", ticker: "HSY", status: "listed" },
  { id: "cl", name: "Colgate-Palmolive", ticker: "CL", status: "listed" },
  { id: "kmb", name: "Kimberly-Clark", ticker: "KMB", status: "listed" },
  { id: "clx", name: "The Clorox Company", ticker: "CLX", status: "listed" },
  { id: "cpb", name: "The Campbell's Company", ticker: "CPB", status: "listed" },
  { id: "cag", name: "Conagra Brands", ticker: "CAG", status: "listed" },
  { id: "kdp", name: "Keurig Dr Pepper", ticker: "KDP", status: "listed" },
  { id: "k", name: "Kellanova", ticker: "K", status: "listed", note: "Snacks half of the 2023 Kellogg split" },
  { id: "klg", name: "WK Kellogg Co", ticker: "KLG", status: "listed", note: "North American cereal half" },
  { id: "kvue", name: "Kenvue", ticker: "KVUE", status: "listed", note: "Spun out of Johnson & Johnson, 2023" },
  { id: "chd", name: "Church & Dwight", ticker: "CHD", status: "listed" },
  { id: "post", name: "Post Holdings", ticker: "POST", status: "listed" },
  { id: "wmt", name: "Walmart", ticker: "WMT", status: "listed" },
  { id: "tgt", name: "Target", ticker: "TGT", status: "listed" },
  { id: "bud", name: "Anheuser-Busch InBev", ticker: "BUD", status: "listed" },
  { id: "tap", name: "Molson Coors", ticker: "TAP", status: "listed" },
  { id: "ul", name: "Unilever", ticker: "UL", status: "listed", note: "NYSE ADR" },
  { id: "nsrgy", name: "Nestlé", ticker: "NSRGY", status: "listed", note: "OTC ADR — thin, and not on any chain" },
  { id: "enr", name: "Energizer Holdings", ticker: "ENR", status: "listed" },
  { id: "sjm", name: "The J. M. Smucker Company", ticker: "SJM", status: "listed" },
  {
    id: "brk",
    name: "Berkshire Hathaway",
    ticker: "BRK.B",
    status: "listed",
    note: "Owns the brand outright — there is no separate stock to buy",
  },

  {
    id: "mars",
    name: "Mars, Incorporated",
    ticker: null,
    status: "private",
    note: "Family-held since 1911. No stock exists at any price.",
  },
  {
    id: "tjoe",
    name: "Trader Joe's",
    ticker: null,
    status: "private",
    note: "Held by the Albrecht family trust behind Aldi Nord.",
  },
];

export const BRANDS: Brand[] = [
  // Snacks
  { name: "Doritos", prefix: "0028400", company: "pep", aisle: "Snacks", checked: true, licensee: "Frito-Lay, Inc." },
  { name: "Lay's", prefix: "0028400", company: "pep", aisle: "Snacks", checked: true, licensee: "Frito-Lay, Inc." },
  { name: "Cheetos", prefix: "0028400", company: "pep", aisle: "Snacks", checked: true },
  { name: "Oreo", prefix: "0044000", company: "mdlz", aisle: "Snacks", checked: true, licensee: "Nabisco" },
  { name: "Ritz", prefix: "0044000", company: "mdlz", aisle: "Snacks", checked: true },
  { name: "Chips Ahoy!", prefix: "0044000", company: "mdlz", aisle: "Snacks", checked: true },
  { name: "Hershey's", prefix: "0034000", company: "hsy", aisle: "Snacks", checked: true },
  { name: "Reese's", prefix: "0034000", company: "hsy", aisle: "Snacks", checked: true },
  { name: "Snickers", prefix: "0040000", company: "mars", aisle: "Snacks", checked: true, licensee: "Mars Wrigley" },
  { name: "M&M's", prefix: "0040000", company: "mars", aisle: "Snacks", checked: true },
  { name: "Pringles", prefix: "0038000", company: "k", aisle: "Snacks", checked: true, licensee: "Kellogg Sales Co." },
  { name: "Cheez-It", prefix: "0024100", company: "k", aisle: "Snacks", checked: false },

  // Drinks
  { name: "Coca-Cola", prefix: "0049000", company: "ko", aisle: "Drinks", checked: true },
  { name: "Sprite", prefix: "0049000", company: "ko", aisle: "Drinks", checked: true },
  { name: "Smartwater", prefix: "0078618", company: "ko", aisle: "Drinks", checked: false },
  { name: "Pepsi", prefix: "0012000", company: "pep", aisle: "Drinks", checked: true },
  { name: "Gatorade", prefix: "0052000", company: "pep", aisle: "Drinks", checked: true, licensee: "Stokely-Van Camp, Inc." },
  { name: "Dr Pepper", prefix: "0078000", company: "kdp", aisle: "Drinks", checked: true },
  { name: "Snapple", prefix: "0076183", company: "kdp", aisle: "Drinks", checked: false },
  { name: "Budweiser", prefix: "0018200", company: "bud", aisle: "Drinks", checked: true },
  { name: "Coors", prefix: "0071990", company: "tap", aisle: "Drinks", checked: true },
  { name: "Nespresso", prefix: "0028000", company: "nsrgy", aisle: "Drinks", checked: false },

  // Breakfast
  { name: "Cheerios", prefix: "0016000", company: "gis", aisle: "Breakfast", checked: true },
  { name: "Nature Valley", prefix: "0016000", company: "gis", aisle: "Breakfast", checked: true },
  { name: "Frosted Flakes", prefix: "0038000", company: "klg", aisle: "Breakfast", checked: true, licensee: "Kellogg Sales Co." },
  { name: "Quaker Oats", prefix: "0030000", company: "pep", aisle: "Breakfast", checked: true, licensee: "The Quaker Oats Company" },
  { name: "Grape-Nuts", prefix: "0884912", company: "post", aisle: "Breakfast", checked: false },
  { name: "Jif", prefix: "0051500", company: "sjm", aisle: "Breakfast", checked: true, licensee: "The J. M. Smucker Company" },

  // Pantry / household staples
  { name: "Kraft Mac & Cheese", prefix: "0021000", company: "khc", aisle: "Household", checked: true },
  { name: "Heinz Ketchup", prefix: "0013000", company: "khc", aisle: "Household", checked: true },
  { name: "Campbell's Soup", prefix: "0051000", company: "cpb", aisle: "Household", checked: true },
  { name: "Hunt's", prefix: "0027000", company: "cag", aisle: "Household", checked: true },
  { name: "Duracell", prefix: "0041333", company: "brk", aisle: "Household", checked: true, licensee: "Duracell U.S. Operations" },
  { name: "Energizer", prefix: "0039800", company: "enr", aisle: "Household", checked: true },
  { name: "Kirkland Signature", prefix: "0096619", company: "cost", aisle: "Household", checked: true, licensee: "Costco Wholesale Corp." },
  { name: "Great Value", prefix: "0078742", company: "wmt", aisle: "Household", checked: true },
  { name: "365 by Whole Foods", prefix: "0099482", company: "amzn", aisle: "Household", checked: true },
  { name: "Good & Gather", prefix: "0085239", company: "tgt", aisle: "Household", checked: false },
  { name: "Trader Joe's", prefix: "0000758", company: "tjoe", aisle: "Household", checked: false },
  { name: "Amazon Basics", prefix: "0841710", company: "amzn", aisle: "Household", checked: false },
  { name: "Apple", prefix: "0190199", company: "aapl", aisle: "Household", checked: true },

  // Cleaning
  { name: "Tide", prefix: "0037000", company: "pg", aisle: "Cleaning", checked: true, licensee: "Procter & Gamble" },
  { name: "Bounty", prefix: "0037000", company: "pg", aisle: "Cleaning", checked: true },
  { name: "Dawn", prefix: "0037000", company: "pg", aisle: "Cleaning", checked: true },
  { name: "Clorox", prefix: "0044600", company: "clx", aisle: "Cleaning", checked: true },
  { name: "Glad", prefix: "0012587", company: "clx", aisle: "Cleaning", checked: false },
  { name: "Arm & Hammer", prefix: "0033200", company: "chd", aisle: "Cleaning", checked: true },
  { name: "Kleenex", prefix: "0036000", company: "kmb", aisle: "Cleaning", checked: true },
  { name: "Scott", prefix: "0036000", company: "kmb", aisle: "Cleaning", checked: true },

  // Bath
  { name: "Crest", prefix: "0037000", company: "pg", aisle: "Bath", checked: true },
  { name: "Gillette", prefix: "0047400", company: "pg", aisle: "Bath", checked: true },
  { name: "Pampers", prefix: "0037000", company: "pg", aisle: "Bath", checked: true },
  { name: "Colgate", prefix: "0035000", company: "cl", aisle: "Bath", checked: true },
  { name: "Dove", prefix: "0011111", company: "ul", aisle: "Bath", checked: true, licensee: "Conopco, Inc." },
  { name: "Band-Aid", prefix: "0381370", company: "kvue", aisle: "Bath", checked: false, licensee: "Johnson & Johnson Consumer" },
  { name: "Listerine", prefix: "0312547", company: "kvue", aisle: "Bath", checked: false },
];

const COMPANY_BY_ID = new Map(COMPANIES.map((c) => [c.id, c]));

export function company(id: string): Company | undefined {
  return COMPANY_BY_ID.get(id);
}

export type Resolution = {
  code: string;
  brand: Brand;
  company: Company;
  /**
   * True when the same prefix is licensed to brands that now sit under
   * different parents — the 2023 Kellogg split left one legacy prefix serving
   * both Kellanova and WK Kellogg. The prefix alone cannot separate them, and
   * the UI says so instead of picking one and looking certain.
   */
  ambiguous: boolean;
};

/**
 * Longest matching prefix wins, so a subsidiary's own prefix beats its parent's.
 * Returns null when the prefix is not in the map — which is the honest answer,
 * not a guess.
 */
export function resolve(code13: string): Resolution | null {
  let best: Brand | null = null;
  for (const brand of BRANDS) {
    if (!code13.startsWith(brand.prefix)) continue;
    if (!best || brand.prefix.length > best.prefix.length) best = brand;
  }
  if (!best) return null;
  const owner = company(best.company);
  if (!owner) return null;
  const sharing = new Set(
    BRANDS.filter((b) => b.prefix === best.prefix).map((b) => b.company),
  );
  return { code: code13, brand: best, company: owner, ambiguous: sharing.size > 1 };
}

/** Distinct owners behind a set of brands — the number that makes the point. */
export function ownersOf(brands: Brand[]): Company[] {
  const ids = new Set(brands.map((b) => b.company));
  return COMPANIES.filter((c) => ids.has(c.id));
}

export const MAPPED_BRANDS = BRANDS.length;
export const MAPPED_COMPANIES = new Set(BRANDS.map((b) => b.company)).size;
export const LIVE_COMPANIES = COMPANIES.filter((c) => c.status === "live");
export const UNCHECKED = BRANDS.filter((b) => !b.checked).length;
