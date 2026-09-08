"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Barcode } from "@/components/ui/Barcode";
import { checkDigit, completeEan13, display, isValid, normalize } from "@/lib/ean13";
import { resolve, type Resolution } from "@/data/brands";
import { siteConfig } from "@/lib/site-config";

/**
 * The real resolver. It runs entirely in the browser: the camera stream never
 * leaves the device, no code is sent anywhere, and the map it looks things up
 * in is the same file the marketing copy is counted from.
 *
 * It does exactly what the product claims and nothing it does not — it resolves
 * a code to a company. It does not pay, and it says so on screen rather than
 * implying otherwise with a fake balance.
 */

type Detected = { rawValue: string };
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<Detected[]>;
}
type BarcodeDetectorCtor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorLike;

type CameraState = "idle" | "starting" | "on" | "unsupported" | "denied";

const SAMPLES = [
  { label: "Coca-Cola", code: completeEan13("004900000463") },
  { label: "Tide", code: completeEan13("003700012345") },
  { label: "Duracell", code: completeEan13("004133303028") },
  { label: "Snickers", code: completeEan13("004000044228") },
  { label: "Kirkland", code: completeEan13("009661912245") },
];

export function Resolver() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraState>("idle");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera((c) => (c === "on" || c === "starting" ? "idle" : c));
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  /**
   * `fromCamera` keeps a misread frame from wiping a good result off the panel.
   * A typed code that fails does clear it: leaving "Resolved ✓" on screen next
   * to a code we just rejected is the one thing this page cannot do.
   */
  const accept = useCallback((raw: string, fromCamera = false) => {
    const reject = (message: string) => {
      setError(message);
      if (!fromCamera) setCode(null);
      return false;
    };
    const full = normalize(raw);
    if (!full) {
      return reject("A barcode is 12 or 13 digits. That is not.");
    }
    if (!isValid(full)) {
      return reject(
        `Check digit fails — those twelve digits should end in ${checkDigit(
          full.slice(0, 12),
        )}, not ${full[12]}. Retype it, or the scan misread.`,
      );
    }
    setError(null);
    setCode(full);
    return true;
  }, []);

  const startCamera = useCallback(async () => {
    const ctor = (
      window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }
    ).BarcodeDetector;
    if (!ctor || !navigator.mediaDevices?.getUserMedia) {
      setCamera("unsupported");
      return;
    }
    setCamera("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCamera("on");

      const detector = new ctor({ formats: ["ean_13", "upc_a"] });
      timerRef.current = window.setInterval(async () => {
        const el = videoRef.current;
        if (!el || el.readyState < 2) return;
        try {
          const hits = await detector.detect(el);
          const hit = hits.find((h) => normalize(h.rawValue));
          if (hit && accept(hit.rawValue, true)) stopCamera();
        } catch {
          // A dropped frame is not an error worth showing anyone.
        }
      }, 220);
    } catch {
      setCamera("denied");
    }
  }, [accept, stopCamera]);

  const resolution = code ? resolve(code) : null;

  return (
    <div className="grid gap-px border border-rule-2 bg-rule-2 lg:grid-cols-[1fr_1.05fr]">
      {/* Input side */}
      <div className="min-w-0 bg-stock-2 p-6 sm:p-8">
        <h2 className="condensed text-3xl font-extrabold leading-none">
          Point it at something.
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">
          Or type the number printed under the bars. Both run the same lookup,
          on this device — nothing is uploaded and no code is recorded.
        </p>

        <div className="mt-7">
          {camera === "on" || camera === "starting" ? (
            <div className="relative overflow-hidden bg-glass">
              <video
                ref={videoRef}
                playsInline
                muted
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden
                className="laser-line absolute inset-x-6 top-1/2 h-[2px]"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                <span className="label text-stock-2">
                  {camera === "starting" ? "Starting…" : "Looking for a code"}
                </span>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="label border border-rule-glass px-3 py-2 text-stock-2"
                >
                  Stop
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="label w-full bg-ink px-6 py-5 text-stock-2 transition-colors hover:bg-laser"
            >
              Use the camera
            </button>
          )}

          {camera === "unsupported" ? (
            <p className="label-sm mt-3 leading-[1.7] text-ink-faint">
              This browser has no barcode detector — Chrome and Edge do, Safari
              and Firefox do not. Type the digits instead; the lookup is
              identical.
            </p>
          ) : null}
          {camera === "denied" ? (
            <p className="label-sm mt-3 leading-[1.7] text-ink-faint">
              Camera access was refused, which is a reasonable thing to do to a
              website. The keypad below works just as well.
            </p>
          ) : null}
        </div>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            accept(input);
          }}
        >
          <label htmlFor="gtin" className="label text-ink-faint">
            The number under the bars
          </label>
          <div className="mt-3 flex gap-2">
            <input
              id="gtin"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0 49000 00463 2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 border border-rule-2 bg-stock px-4 py-3 font-mono text-[15px] tracking-[0.08em] outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="label border border-ink bg-ink px-5 text-stock-2 transition-colors hover:bg-laser hover:border-laser"
            >
              Resolve
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 border-l-2 border-laser pl-3 text-[13px] leading-relaxed text-ink-dim">
            {error}
          </p>
        ) : null}

        <div className="mt-8 border-t border-rule pt-5">
          <p className="label-sm text-ink-faint">Or try one of these</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setInput(sample.code);
                  accept(sample.code);
                }}
                className="label border border-rule-2 px-3 py-2 text-ink-dim transition-colors hover:border-ink hover:text-ink"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result side */}
      <div className="min-w-0 bg-stock-3/50 p-6 sm:p-8">
        {code ? (
          <Result code={code} resolution={resolution} />
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-full min-h-[22rem] flex-col justify-between">
      <div>
        <p className="label text-ink-faint">Awaiting a code</p>
        <p className="condensed mt-5 max-w-sm text-3xl font-extrabold leading-tight">
          Every code carries the name of the company that printed it.
        </p>
      </div>
      <p className="text-[13px] leading-relaxed text-ink-dim">
        The check digit is verified first, then the company prefix is matched
        against the map, then the licensee is carried up to its listed parent.
        If any of those fail you will be told which one — an unknown prefix is
        reported as unknown, not guessed at.
      </p>
    </div>
  );
}

function Result({
  code,
  resolution,
}: {
  code: string;
  resolution: Resolution | null;
}) {
  const owner = resolution?.company;
  const brand = resolution?.brand;
  const live = owner?.status === "live";
  const priv = owner?.status === "private";

  return (
    <div style={{ animation: "pop 260ms ease-out both" }}>
      <div className="flex items-baseline justify-between">
        <p className="label text-laser">Resolved</p>
        <p className="label-sm text-ink-faint">Check digit ✓</p>
      </div>

      <div className="mt-5 bg-stock-2 p-4">
        <Barcode
          key={code}
          code={code}
          highlight={resolution ? 7 : 0}
          animate
          className="mx-auto h-auto w-full max-w-[420px]"
        />
      </div>

      {resolution && owner && brand ? (
        <>
          <dl className="mt-6 divide-y divide-rule border-t border-rule">
            <Row k="GTIN" v={display(code)} mono />
            <Row k="GS1 prefix" v={brand.prefix.replace(/^0/, "")} mono laser />
            <Row k="Brand" v={brand.name} />
            <Row k="Licensee" v={brand.licensee ?? owner.name} />
            <Row k={priv ? "Parent" : "Listed parent"} v={owner.name} />
            <Row
              k="Ticker"
              v={owner.ticker ?? "none — private company"}
              laser={!priv}
            />
          </dl>

          <div className="mt-6 border-t-4 border-ink pt-4">
            <p className="label text-ink-faint">
              {priv
                ? "Nothing to send"
                : live
                  ? "Would pay today"
                  : "Would pay on listing"}
            </p>
            <p className="condensed mt-2 text-[3rem] font-extrabold leading-none">
              {priv ? (
                <span>
                  ${siteConfig.reward.perScan.toFixed(2)} in{" "}
                  {siteConfig.token.symbol}
                </span>
              ) : (
                <span className={live ? "text-laser" : undefined}>
                  ${siteConfig.reward.perScan.toFixed(2)} in {owner.ticker}
                </span>
              )}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-dim">
              {priv
                ? owner.note
                : live
                  ? "A tokenized share of this one already exists on Robinhood Chain."
                  : `${owner.name} is listed, but no tokenized share exists yet. The code resolves; the payout waits.`}
            </p>
          </div>

          {resolution.ambiguous ? (
            <p className="mt-5 border-l-2 border-laser pl-3 text-[13px] leading-relaxed text-ink-dim">
              This prefix is shared. The 2023 Kellogg split left one legacy
              prefix serving two listed companies, so the prefix alone cannot
              say which — the app separates them by product, and the map admits
              the overlap rather than picking one and looking certain.
            </p>
          ) : null}

          {!brand.checked ? (
            <p className="mt-5 border-l-2 border-ink-faint pl-3 text-[13px] leading-relaxed text-ink-dim">
              This prefix has not been verified against a package or a GS1
              record yet. It is in the map, and it is marked unverified there.
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-6 border-t border-rule pt-5">
          <p className="condensed text-3xl font-extrabold leading-tight">
            Valid code. Unknown company.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">
            The check digit is right, so this is a real barcode — the prefix{" "}
            <span className="font-mono">{display(code).slice(0, 6)}</span> is
            just not in the map yet. GS1 licenses these to well over a million
            companies and this build carries a few dozen.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">
            The honest answer is the one on screen: unknown. Guessing a parent
            from a name would pay somebody the wrong company&apos;s stock.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({
  k,
  v,
  mono,
  laser,
}: {
  k: string;
  v: string;
  mono?: boolean;
  laser?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="label-sm text-ink-faint">{k}</dt>
      <dd
        className={clsx(
          "text-right text-[14px]",
          mono && "font-mono tracking-[0.06em]",
          laser && "text-laser",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
