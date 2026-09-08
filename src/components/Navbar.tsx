"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { navLinks } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { Wordmark } from "@/components/ui/Wordmark";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only the home page opens on the black scanner bed. Everywhere else the bar
  // sits on stock from the first pixel, so it has to stay dark there.
  const onDark = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        onDark
          ? "bg-transparent text-stock-2"
          : "border-b border-rule-2 bg-stock/95 text-ink",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} home`}>
          <Wordmark className="h-7" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks
            .filter((l) => l.inNav)
            .map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                className={clsx(
                  "label transition-colors",
                  onDark
                    ? "text-stock-3/70 hover:text-stock-2"
                    : "text-ink-dim hover:text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/brands"
            className={clsx(
              "label hidden border px-3 py-2 transition-colors sm:block",
              onDark
                ? "border-rule-glass text-stock-3/70 hover:border-stock-2 hover:text-stock-2"
                : "border-rule-2 text-ink-dim hover:border-ink hover:text-ink",
            )}
          >
            The map
          </Link>
          <Link
            href="/scan"
            className={clsx(
              "label px-4 py-2.5 text-stock-2 transition-colors",
              onDark ? "bg-laser" : "bg-ink hover:bg-laser",
            )}
          >
            Scan a code
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className={clsx(
              "label border px-3 py-2.5 md:hidden",
              onDark ? "border-rule-glass" : "border-rule-2",
            )}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-rule-2 bg-stock px-5 py-4 text-ink md:hidden">
          <ul className="grid gap-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-rule py-3"
                >
                  <span className="condensed text-lg font-bold">{link.label}</span>
                  <span className="label-sm text-ink-faint">{link.num}</span>
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/brands"
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3"
              >
                <span className="condensed text-lg font-bold">The map</span>
                <span className="label-sm text-ink-faint">ALL</span>
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
