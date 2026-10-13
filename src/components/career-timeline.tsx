"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, X } from "lucide-react";
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
          <button onClick={onClose} className="shrink-0 rounded-full p-1.5 text-zinc-600 transition hover:bg-white/10 hover:text-white">
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

  // Receive postMessage from iframe when a career planet is clicked
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "career-select") return;
      const career = e.data.career as { name: string };
      const idx = stops.findIndex(s => s.name === career.name);
      if (idx >= 0) setSelected(prev => prev === idx ? null : idx);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <section id="experience" className="container-x py-24 sm:py-32">
      <Reveal>
        <SectionHeader
          eyebrow="Experience"
          title="Where I grew my craft"
          description="Three chapters in a solar system of eight — school, startup, and scale. Click a glowing planet to explore."
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

      {/* Three.js solar system — loaded via iframe so Three.js comes from CDN */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5">
        <iframe
          src="/solar-system.html"
          className="h-[480px] w-full border-0 sm:h-[600px]"
          title="Solar System Career Map"
          loading="lazy"
        />
      </div>

      {/* Career info card — driven by postMessage from iframe */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <InfoCard key={selected} stop={stops[selected]} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {stops.map((stop, i) => (
          <button key={stop.id}
            onClick={() => setSelected(prev => prev === i ? null : i)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200"
            style={{
              borderColor: selected === i ? `rgba(${stop.glowRgb},.5)` : `rgba(255,255,255,.07)`,
              background: selected === i ? `rgba(${stop.glowRgb},.1)` : "transparent",
              color: selected === i ? stop.color : "#71717a",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: stop.color, boxShadow: `0 0 6px ${stop.color}` }} />
            {stop.name}
          </button>
        ))}
      </div>
    </section>
  );
}
