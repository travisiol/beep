"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { MAPPED_BRANDS, UNCHECKED } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

const QUESTIONS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Do I actually get stock?",
    a: "You get a tokenized fractional share of the listed parent, issued and custodied by a licensed third party — the same instrument, in the same wallet, whoever you are. It is a security: it moves, and it can go down. Availability depends on where you live.",
  },
  {
    q: "Do I have to buy anything first?",
    a: "No. That is the difference between this and every rewards programme you have been offered. Nothing is purchased, nothing is spent and no card is linked — the items are already in your house and this pays you to write down what is in it.",
  },
  {
    q: "What if the company is private?",
    a: `Then you are told so, plainly, and paid in ${siteConfig.token.symbol} instead. Mars has been family-held since 1911 and no amount of scanning Snickers will produce a share of it, because none exists.`,
  },
  {
    q: "Where does the money come from?",
    a: `No brand pays us. There is no partnership, no affiliate arrangement and no rebate — nobody named on this site has agreed to anything, and none of them know we exist. Rewards come out of a treasury funded by the ${siteConfig.token.symbol} launch and the trading fees on it. That is a finite pot, which is exactly why a scan is worth $${siteConfig.reward.perScan.toFixed(2)} and a wallet tops out at $${siteConfig.reward.lifetimeCapHolder}.`,
  },
  {
    q: "What stops me scanning a whole supermarket?",
    a: `The ceiling, mostly. Every code pays one wallet once, a scan is worth $${siteConfig.reward.perScan.toFixed(2)}, and the day is capped — so an afternoon in an aisle photographing stock you do not own earns less than the bus fare. The camera checks come after that, and we do not publish them.`,
  },
  {
    q: "Is the prefix map right?",
    a: `Partly, and it says which parts. ${MAPPED_BRANDS - UNCHECKED} of ${MAPPED_BRANDS} prefixes have been checked against a package or a public GS1 record; the other ${UNCHECKED} are marked unverified and stay marked until somebody checks them. A wrong prefix pays the wrong company's stock, so the map would rather admit a gap than round one up.`,
    link: { href: "/brands", label: "Read the whole map" },
  },
  {
    q: "Is this live?",
    a: "The resolver is. It is the real one, it runs in your browser, and you can put any code in your kitchen through it right now. The payouts are not: no wallet has been paid, no tokenized share has been issued on our behalf, and the token is not deployed.",
    link: { href: "/scan", label: "Try the resolver" },
  },
];

export function Questions() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="questions"
      num="09"
      title="The obvious ones."
      lede="Asked in the order people actually ask them."
    >
      <ul className="border-t border-rule-2">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className="border-b border-rule-2">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-baseline gap-4 py-5 text-left"
                >
                  <span className="label-sm shrink-0 text-ink-faint">
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="condensed flex-1 text-xl font-bold leading-snug sm:text-2xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="label shrink-0 text-laser"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 180ms ease",
                    }}
                  >
                    +
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <div className="pb-6 sm:pl-[3.6rem]">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-ink-dim">
                    {item.a}
                  </p>
                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="label mt-4 inline-block border-b border-laser pb-1 text-laser"
                    >
                      {item.link.label} →
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
