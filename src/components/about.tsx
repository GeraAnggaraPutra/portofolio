"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "./reveal";

type Seg = { t: string; c: string };

// Helpers for JSON syntax coloring
const k  = (s: string): Seg => ({ t: `"${s}"`, c: "text-sky-300/80" });          // key
const sv = (s: string, c = "text-zinc-200"): Seg => ({ t: `"${s}"`, c });         // string value
const nv = (n: number): Seg => ({ t: String(n), c: "text-violet-300" });           // number value
const sep: Seg  = { t: ", ", c: "text-zinc-700" };
const col: Seg  = { t: ":", c: "text-zinc-700" };
const ob: Seg   = { t: "{", c: "text-zinc-500" };
const cb: Seg   = { t: "}", c: "text-zinc-500" };

// field(key, value) returns [key, colon, value, sep]
const f = (key: string, val: Seg, last = false): Seg[] =>
  last ? [k(key), col, val] : [k(key), col, val, sep];

const lines: Seg[][] = [
  // command
  [{ t: "$ ", c: "text-zinc-600" }, { t: "go run main.go", c: "text-zinc-300" }],

  // server started
  [ob, ...f("level", sv("info", "text-emerald-400")),
       ...f("msg",   sv("server started")),
       ...f("addr",  sv(":8080", "text-sky-300")),
       ...f("pid",   nv(42891), true), cb],

  // redis ready
  [ob, ...f("level",   sv("info", "text-emerald-400")),
       ...f("msg",     sv("redis ready")),
       ...f("pool",    nv(10)),
       ...f("timeout", sv("5s"), true), cb],

  // GET payroll
  [ob, ...f("status", { t: "200", c: "text-emerald-400" }),
       ...f("method", sv("GET", "text-sky-300")),
       ...f("path",   sv("/payroll/calculate", "text-zinc-300")),
       ...f("ms",     nv(38), true), cb],

  // tx committed
  [ob, ...f("level", sv("info", "text-emerald-400")),
       ...f("msg",   sv("tx committed")),
       ...f("key",   sv("pay_2025_07", "text-amber-400")),
       ...f("rows",  nv(1), true), cb],

  // POST attendance
  [ob, ...f("status", { t: "200", c: "text-emerald-400" }),
       ...f("method", sv("POST", "text-amber-300")),
       ...f("path",   sv("/attendance/sync", "text-zinc-300")),
       ...f("ms",     nv(21), true), cb],

  // GET membership
  [ob, ...f("status", { t: "200", c: "text-emerald-400" }),
       ...f("method", sv("GET", "text-sky-300")),
       ...f("path",   sv("/membership/status", "text-zinc-300")),
       ...f("ms",     nv(12), true), cb],

  // metrics
  [ob, ...f("level",   sv("info", "text-emerald-400")),
       ...f("msg",     sv("metrics scraped")),
       ...f("grafana", sv("ok", "text-emerald-400")),
       ...f("loki",    sv("ok", "text-emerald-400"), true), cb],
];

const totalChars = lines.reduce(
  (sum, segs) => sum + segs.reduce((s, seg) => s + seg.t.length, 0),
  0
);

function TerminalBody() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTyped(t => Math.min(t + 5, totalChars)), 25);
    return () => clearInterval(id);
  }, [inView]);

  const done = typed >= totalChars;

  // Render lines with typing slicing
  let remaining = typed;
  const renderedLines: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const segs = lines[i];
    const lineLen = segs.reduce((s, seg) => s + seg.t.length, 0);

    if (remaining <= 0) break;

    const charsForLine = Math.min(remaining, lineLen);
    remaining -= charsForLine;

    let segRemaining = charsForLine;
    const isActiveLine = !done && remaining === 0 && charsForLine < lineLen;
    const renderedSegs: React.ReactNode[] = [];

    for (let j = 0; j < segs.length; j++) {
      const seg = segs[j];
      if (segRemaining <= 0) break;

      const take = Math.min(segRemaining, seg.t.length);
      segRemaining -= take;
      const showCursor = isActiveLine && segRemaining === 0 && (take < seg.t.length || j === segs.length - 1);

      renderedSegs.push(
        <span key={j} className={seg.c}>
          {seg.t.slice(0, take)}
          {showCursor && (
            <span className="animate-pulse text-amber-400/90">|</span>
          )}
        </span>
      );

      if (take < seg.t.length) break;
    }

    renderedLines.push(
      <div
        key={i}
        className="flex flex-wrap items-baseline font-mono text-[0.72rem] leading-[1.8] sm:text-[0.75rem]"
      >
        {renderedSegs}
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-2 p-5">
      {renderedLines}
      {done && (
        <div className="flex items-center gap-1 font-mono text-[0.72rem]">
          <span className="text-zinc-600">$ </span>
          <span className="inline-block h-[0.8em] w-[0.45em] animate-pulse bg-amber-400/70" />
        </div>
      )}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="container-x py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">

        <Reveal>
          <div>
            <p className="mono mb-5 text-xs font-medium uppercase tracking-[0.22em] text-amber-400/80">
              About
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Backend-first, learning in the open.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-[1.85] text-zinc-400/90">
              <p>
                Started coding <span className="text-amber-300/80 font-medium">Go</span> a few months after graduating high school in 2023.
                Within a year at PLABS.ID, moved from intern to software engineer —
                shipping real systems for real clients across travel, inventory, budget
                control, and company platforms.
              </p>
              <p>
                Now doing backend engineering full-time at{" "}
                <span className="text-zinc-200 font-medium">Nusapala</span> — handling HRIS
                payroll workflows, parking membership APIs, asset tracking, and
                observability. I write Go services that need to be{" "}
                <span className="text-zinc-200 font-medium">correct</span> before they
                need to be clever.
              </p>
              <p>
                Open to backend engineering roles — ideally teams that care about{" "}
                <span className="text-emerald-400/70 font-medium">system reliability</span>,
                code review culture, and shipping things that actually work
                in production.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-2"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-emerald-300">Open to opportunities</span>
            </motion.div>
          </div>
        </Reveal>

        {/* Terminal */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-[#0c0b09]/95">
            {/* macOS title bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.015] px-4 py-3">
              <span className="size-[11px] rounded-full bg-[#ff5f57]" />
              <span className="size-[11px] rounded-full bg-[#febc2e]" />
              <span className="size-[11px] rounded-full bg-[#28c840]" />
              <span className="mono ml-3 text-xs text-zinc-600">gera@backend  ~/api</span>
            </div>

            <TerminalBody />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
