import type { ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Section chrome borrowed from a printed panel: a heavy rule, the section's
 * number set as a lot code in the margin, and the title squeezed on Archivo's
 * width axis the way a packaging designer squeezes Helvetica to fit the box.
 */
export function Section({
  id,
  num,
  title,
  lede,
  children,
  className,
  tone = "stock",
}: {
  id: string;
  num: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "stock" | "glass";
}) {
  return (
    <section
      id={id}
      className={clsx(
        "scroll-mt-16 px-5 py-16 sm:px-8 md:py-24",
        tone === "glass" && "glass-panel",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className={clsx("rule-heavy", tone === "glass" && "!border-b-stock-2")} />
        <header className="grid gap-5 pt-5 md:grid-cols-[6.5rem_1fr] md:gap-8">
          <span
            className={clsx(
              "label-sm pt-2",
              tone === "glass" ? "text-stock-3/70" : "text-ink-faint",
            )}
          >
            LOT {num}
          </span>
          <div className="max-w-3xl">
            <h2 className="condensed text-[2.1rem] font-extrabold leading-[0.92] tracking-[-0.02em] sm:text-[3rem] md:text-[3.9rem]">
              {title}
            </h2>
            {lede ? (
              <p
                className={clsx(
                  "mt-5 max-w-2xl text-[15px] leading-relaxed",
                  tone === "glass" ? "text-stock-3/75" : "text-ink-dim",
                )}
              >
                {lede}
              </p>
            ) : null}
          </div>
        </header>
        <div className="mt-10 md:grid md:grid-cols-[6.5rem_1fr] md:gap-8">
          <div aria-hidden />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Tiny caps with the mono face. The only label style on the site. */
export function Eyebrow({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "dim" | "laser";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "label block",
        tone === "dim" && "text-ink-faint",
        tone === "laser" && "text-laser",
        className,
      )}
    >
      {children}
    </span>
  );
}
