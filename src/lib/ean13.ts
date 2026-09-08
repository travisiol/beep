/**
 * EAN-13 / UPC-A, encoded properly.
 *
 * Every barcode drawn on this site is a real one: correct check digit, correct
 * parity pattern, 95 modules. Point a scanner at the screen and it reads the
 * number back. That is the whole premise of the product — the code is not read,
 * it is resolved — so the site does not get to fake its own barcodes.
 */

// Left half, odd parity.
const L = [
  "0001101", "0011001", "0010011", "0111101", "0100011",
  "0110001", "0101111", "0111011", "0110111", "0001011",
];

// Left half, even parity. Same bars as R, reversed.
const G = [
  "0100111", "0110011", "0011011", "0100001", "0011101",
  "0111001", "0000101", "0010001", "0001001", "0010111",
];

// Right half. The complement of L.
const R = [
  "1110010", "1100110", "1101100", "1000010", "1011100",
  "1001110", "1010000", "1000100", "1001000", "1110100",
];

/**
 * The first digit is not drawn as bars. It is encoded in which of the six
 * left-hand digits use even parity — which is why an EAN-13 fits in the space
 * of a UPC-A.
 */
const PARITY = [
  "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
  "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL",
];

const digits = (s: string) => s.replace(/\D/g, "");

/** Check digit for the first 12 digits of an EAN-13. */
export function checkDigit(first12: string): number {
  const d = digits(first12).slice(0, 12).padStart(12, "0");
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(d[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

/** Complete a partial code to a valid 13-digit EAN-13. */
export function completeEan13(partial: string): string {
  const first12 = digits(partial).slice(0, 12).padEnd(12, "0");
  return first12 + checkDigit(first12);
}

/**
 * UPC-A is EAN-13 with a leading zero, EAN-8 is its own thing. Everything in
 * this codebase works in 13-digit space so prefixes only have to be written once.
 */
export function normalize(raw: string): string | null {
  const d = digits(raw);
  if (d.length === 13) return d;
  if (d.length === 12) return "0" + d;
  return null;
}

export function isValid(raw: string): boolean {
  const code = normalize(raw);
  if (!code) return false;
  return checkDigit(code.slice(0, 12)) === Number(code[12]);
}

/** 95 modules: guard, six L/G digits, centre guard, six R digits, guard. */
export function modules(raw: string): string {
  const code = normalize(raw) ?? completeEan13(raw);
  const parity = PARITY[Number(code[0])];
  let out = "101";
  for (let i = 0; i < 6; i++) {
    const digit = Number(code[i + 1]);
    out += parity[i] === "L" ? L[digit] : G[digit];
  }
  out += "01010";
  for (let i = 0; i < 6; i++) {
    out += R[Number(code[i + 7])];
  }
  return out + "101";
}

/** Which modules belong to a guard bar — they run longer than the rest. */
export function isGuard(index: number): boolean {
  return index < 3 || (index >= 45 && index < 50) || index >= 92;
}

/** Human grouping under the bars: 0 049000 004632 */
export function groups(raw: string): [string, string, string] {
  const code = normalize(raw) ?? completeEan13(raw);
  return [code.slice(0, 1), code.slice(1, 7), code.slice(7)];
}

/** The way a US shopper would see it: drop the EAN-13's leading zero. */
export function display(raw: string): string {
  const code = normalize(raw) ?? completeEan13(raw);
  return code.startsWith("0") ? code.slice(1) : code;
}
