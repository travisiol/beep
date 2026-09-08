# BEEP

**Scan what you already own.**

A receipt tells you where you paid. A barcode tells you who made it. The GS1
company prefix — the left half of every EAN-13 — is licensed to one brand owner
and printed by that owner on everything it makes. BEEP reads it, carries the
licensee up to its listed parent, and pays a sliver of that company's stock.

Doritos → Frito-Lay → **PEP**. Duracell → **BRK.B**. Snickers → Mars → nothing,
because Mars is private and no share exists at any price.

## Routes

| Route     | What it is                                                        |
| --------- | ----------------------------------------------------------------- |
| `/`       | The landing page: nine sections, lot-numbered like a printed panel |
| `/scan`   | The resolver — real, working, runs entirely in the browser         |
| `/brands` | The map: every prefix, licensee, listed parent and ticker          |

## What is real here

- **The resolver works.** `/scan` uses the browser's `BarcodeDetector` where it
  exists (Chrome, Edge) and a keypad everywhere else. It verifies the check
  digit, matches the company prefix by longest match, and reports an unknown
  prefix as unknown rather than guessing. Nothing is uploaded; no code is stored.
- **Every barcode on the site is a valid EAN-13.** `src/lib/ean13.ts` implements
  the real encoding — L/G/R code tables, the parity pattern that carries the
  first digit, correct check digit, 95 modules. Point a scanner at the screen
  and it reads the number back.
- **The page counts itself.** "56 brands mapped, 32 parents, 11 unverified" is
  derived from `src/data/brands.ts` at render time, not typed into the copy.

## What is not

- **Nothing pays.** No wallet has been credited, `$BEEP` is not deployed, and
  no chain is read anywhere in this codebase.
- **Item references in sample codes are filler.** Only the company prefix is
  real. The footer says so.
- **11 of 56 prefixes are unverified.** They carry `checked: false` and render
  with a `?` on `/brands`. Never flip one to `true` to tidy the table — a wrong
  prefix pays out a different company's stock.
- **The live-ticker list (COST, AMZN, AAPL) is taken on trust**, not read off
  Robinhood Chain.

## Art direction

The back of a package: uncoated stock, one ink, three rule weights, 10px legal
caps, and a barcode block in the corner. The scanner's red is the only saturated
colour on the site and means exactly one thing — *this has been resolved*. Never
use it for hover states or emphasis.

Two structural rules that are easy to break:

- Everything unlayered in `globals.css` outranks Tailwind's utilities. The
  element reset lives in `@layer base`, component classes in `@layer components`.
  A bare `* { border-color }` silently turns the 9px black panel rules to 16%
  grey and makes `border-ink` do nothing.
- Size `<Barcode>` by **width only**. Its viewBox is 113 modules wide by
  `height + 18` tall; pinning both axes crops the code to whichever is tighter
  and leaves it floating in its own box.

## Develop

```bash
npm run dev
```

Runs on port 3400. `npm run build` and `npx eslint .` both pass clean.
