"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Briefcase, GraduationCap, Maximize2, Pause, Play, X } from "lucide-react";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

/* ─── Data (mirror of solar-system.html) ────────────────────── */
const stops = [
  {
    id: "earth",
    name: "SMK Assalaam Bandung",
    role: "Rekayasa Perangkat Lunak",
    period: "Jun 2020 – Jun 2023",
    city: "Bandung",
    type: "education" as const,
    color: "#34d399",
    glowRgb: "52,211,153",
    summary:
      "Foundation years. Learned Laravel, PHP, and MySQL from scratch. Built the Car Rental System as first full-stack project with a team of two.",
    stack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap"],
  },
  {
    id: "jupiter",
    name: "PLABS.ID",
    role: "Intern → Junior SE → Software Engineer",
    period: "May 2023 – May 2025",
    city: "Bandung",
    type: "work" as const,
    color: "#38bdf8",
    glowRgb: "56,189,248",
    summary:
      "Progressed through three roles in two years. Delivered backend systems across HRIS, travel, inventory, and company platforms. Mentored vocational school interns to Go CRUD APIs with JWT auth in 3 months.",
    stack: ["Go", "PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "GCS", "FCM"],
  },
  {
    id: "neptune",
    name: "PT Nusapala Berkah Autonomous",
    role: "Backend Developer",
    period: "Jul 2025 – Present",
    city: "Jakarta",
    type: "work" as const,
    color: "#f59e0b",
    glowRgb: "245,158,11",
    summary:
      "Design and develop scalable Go backend services for HRIS and parking platforms. Own the full backend lifecycle from FSD to API design, transactions, unit tests, and Docker deployment.",
    stack: ["Go", "PostgreSQL", "MySQL", "Redis", "Docker", "Grafana", "Loki", "Prometheus"],
  },
];

/* ─── Info Card ──────────────────────────────────────────────── */
function InfoCard({ stop, onClose }: { stop: typeof stops[0]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = stop.type === "education" ? GraduationCap : Briefcase;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    ref.current.style.transform = `perspective(900px) rotateX(${((y/rect.height)-.5)*-5}deg) rotateY(${((x/rect.width)-.5)*7}deg)`;
    const g = ref.current.querySelector<HTMLDivElement>(".icg");
    if (g) g.style.background = `radial-gradient(300px at ${x}px ${y}px, rgba(${stop.glowRgb},.09), transparent 70%)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    const g = ref.current.querySelector<HTMLDivElement>(".icg");
    if (g) g.style.background = "transparent";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: .97 }}
      transition={{ duration: .4, ease: [.22, 1, .36, 1] }}
      className="mt-5 px-4 sm:px-0"
    >
      <div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border bg-white/[.03] p-7"
        style={{
          borderColor: `rgba(${stop.glowRgb},.25)`,
          boxShadow: `0 0 60px rgba(${stop.glowRgb},.08), inset 0 0 40px rgba(${stop.glowRgb},.03)`,
          willChange: "transform", transition: "transform .15s ease-out",
        }}
      >
        <div className="icg pointer-events-none absolute inset-0 rounded-3xl transition-all duration-200" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: `rgba(${stop.glowRgb},.15)`, border: `1.5px solid rgba(${stop.glowRgb},.4)` }}>
              <Icon size={18} style={{ color: stop.color }} />
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
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const sendToScene = (type: string, planet?: string) => {
    frameRef.current?.contentWindow?.postMessage({ type, planet }, window.location.origin);
  };

  const selectStop = (index: number) => {
    setSelected(index);
    sendToScene("career-focus", stops[index].id);
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          description="A journey from first lines of code to production systems. Pick a chapter, then drag the universe around you."
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

      <div className="relative overflow-hidden rounded-[2rem] border border-amber-200/10 bg-[#050912] shadow-[0_35px_120px_rgba(0,0,0,.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-[#030711]/95 via-[#030711]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#030711]/90 to-transparent" />
        <div className="pointer-events-none absolute left-5 top-5 z-20 sm:left-8 sm:top-7">
          <p className="mono text-[.6rem] uppercase tracking-[.3em] text-amber-300/70">Interactive career atlas</p>
          <p className="mt-1 max-w-[18rem] text-lg font-semibold leading-snug text-white sm:max-w-none sm:text-2xl">Explore the journey <span className="text-amber-300">among the stars.</span></p>
        </div>
        <div className="absolute bottom-5 right-4 z-20 flex gap-2 sm:bottom-auto sm:right-7 sm:top-7">
          <button type="button" onClick={() => { sendToScene("career-reset"); setSelected(null); }} aria-label="Show full solar system" title="Show full solar system" className="grid size-9 place-items-center rounded-full border border-white/15 bg-[#09111e]/85 text-zinc-200 backdrop-blur transition hover:border-amber-300/50 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300"><Maximize2 size={15} /></button>
          <button type="button" onClick={() => { sendToScene("career-play", !playing ? "on" : "off"); setPlaying(!playing); }} aria-label={playing ? "Pause animation" : "Resume animation"} title={playing ? "Pause animation" : "Resume animation"} className="grid size-9 place-items-center rounded-full border border-white/15 bg-[#09111e]/85 text-zinc-200 backdrop-blur transition hover:border-amber-300/50 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300">{playing ? <Pause size={15} /> : <Play size={15} />}</button>
        </div>
        <iframe
          ref={frameRef}
          src="/solar-system.html"
          className="h-[440px] w-full border-0 sm:h-[650px]"
          title="Solar System Career Map"
          loading="lazy"
          onLoad={() => { if (selected !== null) sendToScene("career-focus", stops[selected].id); if (!playing) sendToScene("career-play", "off"); const rect = frameRef.current?.getBoundingClientRect(); if (rect) frameRef.current?.contentWindow?.postMessage({ type: "career-visible", visible: rect.bottom > 0 && rect.top < window.innerHeight }, window.location.origin); }}
        />
        <div className="pointer-events-none absolute bottom-5 left-5 z-20 sm:bottom-7 sm:left-8">
          <p className="mono text-[.6rem] uppercase tracking-[.2em] text-zinc-400">Drag to orbit <span className="mx-2 text-amber-300/60">·</span><span className="hidden sm:inline">Ctrl + scroll to zoom</span><span className="sm:hidden">Pick a chapter below</span></p>
        </div>
      </div>

      {/* Career info card — driven by postMessage from iframe */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <InfoCard key={selected} stop={stops[selected]} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <div className="mt-5 grid gap-3 md:grid-cols-3" aria-label="Career chapters">
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
    </section>
  );
}
