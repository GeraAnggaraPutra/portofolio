"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Briefcase, Maximize2, Minimize2, Pause, Play, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

/* ─── Data (mirror of solar-system.html) ────────────────────── */
const stops = [
  {
    id: "neptune", name: "PT Nusapala Berkah Autonomous", role: "Backend Developer",
    period: "Jul 2025 – Present", city: "Jakarta", color: "#f59e0b", glowRgb: "245,158,11",
    summary: "I build Go services for web and mobile teams. I turn functional specifications into API contracts, database transactions and unit tests for the business rules behind each endpoint.",
    details: [
      ["UNARA People", "I independently engineered the backend for the SaaS administration tools, web HR workspace and employee app. The gateway validates access, Master holds company rules, Transaction processes attendance, requests, approvals and payroll, and Report serves results and payslips. For attendance sync and payroll, I use transactions and retry-safe processing to keep a repeated request from applying the same change twice."],
      ["MyNusapala", "I refactored parking membership APIs from Laravel to Go, restructuring queries and request handling to improve response times. I integrated Xendit and Midtrans for membership payments and GoPay linking, and routed requests to the appropriate parking location while keeping local records in sync."],
      ["Engineering practice", "I document REST APIs in Swagger and maintain reusable Go templates with routing, middleware, unit tests and Docker Compose environments. I review code and mentor colleagues on Go implementation. When an operation fails, I trace requests through logs, metrics and database queries."],
    ],
    stack: ["Go", "PostgreSQL", "Redis", "Swagger", "Docker", "Prometheus", "Grafana", "Loki"],
  },
  {
    id: "jupiter", name: "PLABS.ID", role: "Software Engineer",
    period: "May 2023 – May 2025", city: "Bandung", color: "#38bdf8", glowRgb: "56,189,248",
    summary: "At PT Padjadjaran Teknologi Informasi, I progressed from intern to Software Engineer. My client work included Tawada’s internal travel and budget requests, with divisional approvals and Epicor synchronization, and a warehouse system that tracked shipments and supported RFID stock counts.",
    details: [
      ["Software Engineer · Feb 2024 – May 2025", "I designed schemas and tuned queries across PostgreSQL, MySQL, Microsoft SQL Server and Oracle. I wrote scheduled jobs in Go, used goroutines for concurrent work and Redis to cache repeated reads. I also built Next.js API routes for a conference tool, documented APIs in Postman and integrated Firebase Cloud Messaging and Google Cloud Storage."],
      ["Working across teams", "I clarified requirements with project managers, agreed on API payloads with frontend engineers, and worked through deployment and usability questions with DevOps and designers. We tracked delivery in Lark."],
      ["Junior Software Engineer · Sep 2023 – Feb 2024", "I designed PostgreSQL tables and built Go REST APIs, tracked sprint work in Jira, reviewed code and maintained technical documentation. I mentored vocational students through their first backend project. Within three months they could build CRUD APIs with JWT authentication."],
      ["Software Engineer Intern · May 2023 – Sep 2023", "I learned Go through hands-on API and database work, debugging requests and refining queries. I also maintained Laravel backends, which gave me experience reading and changing an existing application alongside writing new Go code."],
    ],
    stack: ["Go", "PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "Next.js", "Postman"],
  },
];

/* ─── Info Card ──────────────────────────────────────────────── */
function InfoCard({ stop, onClose }: { stop: typeof stops[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: .97 }}
      transition={{ duration: .4, ease: [.22, 1, .36, 1] }}
      className="mt-5 px-4 sm:px-0"
    >
      <div
        className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border bg-white/[.03] p-7"
        style={{
          borderColor: `rgba(${stop.glowRgb},.25)`,
          boxShadow: `0 0 60px rgba(${stop.glowRgb},.08), inset 0 0 40px rgba(${stop.glowRgb},.03)`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: `rgba(${stop.glowRgb},.15)`, border: `1.5px solid rgba(${stop.glowRgb},.4)` }}>
              <Briefcase size={18} style={{ color: stop.color }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{stop.name}</h3>
              <p className="text-sm font-medium" style={{ color: stop.color }}>{stop.role}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close career details" className="shrink-0 rounded-full p-1.5 text-zinc-600 transition hover:bg-white/10 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="mono rounded-full border px-3 py-1 text-[.65rem] uppercase tracking-[.16em]"
            style={{ borderColor: `rgba(${stop.glowRgb},.35)`, color: stop.color }}>{stop.period}</span>
          <span className="mono rounded-full border border-white/10 px-3 py-1 text-[.65rem] uppercase tracking-[.16em] text-zinc-500">{stop.city}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{stop.summary}</p>
        <div className="mt-6 space-y-5">
          {stop.details.map(([title, body]) => (
            <div key={title}>
              <h4 className="font-semibold text-zinc-100">{title}</h4>
              <p className="mt-1 text-sm leading-7 text-zinc-300">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {stop.stack.map((s, i) => (
            <motion.span key={s}
              initial={{ opacity: 0, scale: .7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .08 + i * .035, type: "spring", stiffness: 300, damping: 22 }}
              className="mono rounded-full px-2.5 py-0.5 text-[.65rem] uppercase tracking-wider"
              style={{ border: `1px solid rgba(${stop.glowRgb},.3)`, background: `rgba(${stop.glowRgb},.07)`, color: "rgba(255,255,255,.78)" }}
            >{s}</motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export function CareerTimeline() {
  const [selected, setSelected] = useState<number | null>(0);
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const sendToScene = (type: string, planet?: string) => {
    frameRef.current?.contentWindow?.postMessage({ type, planet }, window.location.origin);
  };

  const selectStop = (index: number) => {
    setSelected(index);
    sendToScene("career-focus", stops[index].id);
  };

  const toggleFullscreen = async () => {
    if (expanded) {
      if (document.fullscreenElement === mapRef.current) await document.exitFullscreen();
      setExpanded(false);
      return;
    }
    if (window.matchMedia("(pointer: coarse), (max-width: 640px)").matches) {
      setExpanded(true);
      return;
    }
    try {
      if (!mapRef.current?.requestFullscreen) throw new Error("Fullscreen API unavailable");
      await mapRef.current.requestFullscreen();
    } catch {
      // iOS Safari and embedded browsers may not expose element fullscreen.
    }
    setExpanded(true);
  };

  // Receive postMessage from iframe when a career planet is clicked
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === "career-scroll" && typeof e.data.deltaY === "number") {
        window.scrollBy({ top: Math.max(-1200, Math.min(1200, e.data.deltaY)), behavior: "instant" });
        return;
      }
      if (e.data?.type !== "career-select") return;
      const career = e.data.career as { name: string };
      const idx = stops.findIndex(s => s.name === career.name);
      if (idx >= 0) setSelected(idx);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setExpanded(document.fullscreenElement === mapRef.current);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement !== mapRef.current) setExpanded(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      sendToScene("career-play", "off");
    }
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      frame.contentWindow?.postMessage({ type: "career-visible", visible: entry.isIntersecting }, window.location.origin);
    }, { threshold: 0.01 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="container-x py-24 sm:py-32">
      <Reveal>
        <SectionHeader
          eyebrow="Experience"
          title="Where I grew my craft"
          description="Explore my backend work at two companies. Select an employer to read about the products, decisions and responsibilities behind each role."
        />
      </Reveal>

      {/* Stats */}
      <div className="mb-8 flex items-center justify-center gap-12">
        {[{ v: "3+", l: "Years" }, { v: "2", l: "Companies" }, { v: "10+", l: "Projects" }].map(({ v, l }, i) => (
          <motion.div key={l} className="text-center"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .1, duration: .5, ease: [.22, 1, .36, 1] }}
          >
            <p className="text-2xl font-bold text-white">{v}</p>
            <p className="mono mt-0.5 text-[.6rem] uppercase tracking-[.18em] text-zinc-600">{l}</p>
          </motion.div>
        ))}
      </div>

      <div ref={mapRef} className={`overflow-hidden border border-amber-200/10 bg-[#050912] shadow-[0_35px_120px_rgba(0,0,0,.45)] ${expanded ? "fixed inset-0 z-[100] rounded-none" : "relative rounded-[2rem]"}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-[#030711]/95 via-[#030711]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#030711]/90 to-transparent" />
        <div className="pointer-events-none absolute left-5 top-5 z-20 sm:left-8 sm:top-7">
          <p className="mono text-[.6rem] uppercase tracking-[.3em] text-amber-300/70">Interactive career atlas</p>
          <p className="mt-1 max-w-[18rem] text-lg font-semibold leading-snug text-white sm:max-w-none sm:text-2xl">Explore the journey <span className="text-amber-300">among the stars.</span></p>
        </div>
        <div className="absolute bottom-4 left-4 z-20 flex gap-2 sm:bottom-7 sm:left-auto sm:right-7">
          <button type="button" onClick={() => sendToScene("career-zoom", "in")} aria-label="Zoom in" title="Zoom in" className="grid size-10 place-items-center rounded-full border border-white/20 bg-[#09111e]/90 text-white backdrop-blur transition hover:border-amber-300/60 hover:bg-[#162439] focus-visible:outline-2 focus-visible:outline-amber-300"><ZoomIn size={18} /></button>
          <button type="button" onClick={() => sendToScene("career-zoom", "out")} aria-label="Zoom out" title="Zoom out" className="grid size-10 place-items-center rounded-full border border-white/20 bg-[#09111e]/90 text-white backdrop-blur transition hover:border-amber-300/60 hover:bg-[#162439] focus-visible:outline-2 focus-visible:outline-amber-300"><ZoomOut size={18} /></button>
        </div>
        <div className="absolute bottom-4 right-4 z-20 flex gap-2 sm:bottom-auto sm:right-7 sm:top-7">
          <button type="button" onClick={() => { sendToScene("career-reset"); setSelected(null); }} aria-label="Show full solar system" title="Show full solar system" className="grid size-10 place-items-center rounded-full border border-white/15 bg-[#09111e]/90 text-zinc-200 backdrop-blur transition hover:border-amber-300/50 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300"><RotateCcw size={17} /></button>
          <button type="button" onClick={() => { sendToScene("career-play", !playing ? "on" : "off"); setPlaying(!playing); }} aria-label={playing ? "Pause animation" : "Resume animation"} title={playing ? "Pause animation" : "Resume animation"} className="grid size-10 place-items-center rounded-full border border-white/15 bg-[#09111e]/90 text-zinc-200 backdrop-blur transition hover:border-amber-300/50 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300">{playing ? <Pause size={17} /> : <Play size={17} />}</button>
          <button type="button" onClick={toggleFullscreen} aria-label={expanded ? "Exit fullscreen" : "Open fullscreen"} title={expanded ? "Exit fullscreen" : "Open fullscreen"} className="grid size-10 place-items-center rounded-full border border-amber-300/35 bg-[#09111e]/90 text-amber-200 backdrop-blur transition hover:border-amber-300 hover:bg-[#162439] focus-visible:outline-2 focus-visible:outline-amber-300">{expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
        </div>
        <iframe
          ref={frameRef}
          src="/solar-system.html"
          className={expanded ? "h-full w-full border-0" : "h-[440px] w-full border-0 sm:h-[650px]"}
          title="Solar System Career Map"
          loading="lazy"
          onLoad={() => { if (selected !== null) sendToScene("career-focus", stops[selected].id); if (!playing) sendToScene("career-play", "off"); const rect = frameRef.current?.getBoundingClientRect(); if (rect) frameRef.current?.contentWindow?.postMessage({ type: "career-visible", visible: rect.bottom > 0 && rect.top < window.innerHeight }, window.location.origin); }}
        />
        <div className="pointer-events-none absolute bottom-7 left-8 z-20 hidden sm:block">
          <p className="mono text-[.6rem] uppercase tracking-[.2em] text-zinc-400">Drag to orbit <span className="mx-2 text-amber-300/60">·</span> Ctrl + scroll to zoom</p>
        </div>
      </div>
      <p className="mono mt-3 text-center text-[.62rem] uppercase tracking-[.16em] text-zinc-500 sm:hidden">Pinch or use + / − to zoom · Drag to orbit</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2" aria-label="Career chapters">
        {stops.map((stop, i) => (
          <button key={stop.id}
            type="button"
            onClick={() => selectStop(i)}
            aria-pressed={selected === i}
            className="group flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-amber-300"
            style={{
              borderColor: selected === i ? `rgba(${stop.glowRgb},.5)` : `rgba(255,255,255,.07)`,
              background: selected === i ? `rgba(${stop.glowRgb},.1)` : "rgba(255,255,255,.025)",
            }}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full border" style={{ color: stop.color, borderColor: `rgba(${stop.glowRgb},.45)`, background: `rgba(${stop.glowRgb},.12)` }}>{i + 1}</span>
            <span className="min-w-0 flex-1"><span className="mono block text-[.6rem] uppercase tracking-[.16em] text-zinc-500">{stop.period}</span><span className="mt-1 block truncate text-sm font-medium text-white">{stop.name}</span></span>
            <ArrowUpRight size={16} className="shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </button>
        ))}
      </div>
      {/* Career info card — driven by postMessage from iframe */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <InfoCard key={selected} stop={stops[selected]} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

    </section>
  );
}
