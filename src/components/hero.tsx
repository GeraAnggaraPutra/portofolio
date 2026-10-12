"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowDown, MoveUpRight } from "lucide-react";
import { stats } from "@/data/portfolio";

const LOG_LINES = [
  { level: "INFO", msg: 'tx=00e91a3d status=committed rows=1', color: "text-emerald-400" },
  { level: "INFO", msg: 'cache HIT key=user:4821 ttl=58s', color: "text-sky-400" },
  { level: "WARN", msg: 'retry attempt=2 tx=00f13c2a', color: "text-amber-400" },
  { level: "INFO", msg: 'span payroll.calculate dur=12ms', color: "text-emerald-400" },
  { level: "INFO", msg: 'tx=00e91b88 status=committed', color: "text-emerald-400" },
  { level: "INFO", msg: 'cache MISS key=report:2025 fill=true', color: "text-zinc-400" },
];

const LATENCIES = ["0.1", "0.2", "0.3", "0.2", "0.4", "0.1", "0.2"];
const TX_IDS = ["00e91a3d", "00f13c2a", "00e91b88", "00a7dc41"];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const wordVariants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const cardX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const cardY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  // Magnetic CTA
  const btnRef = useRef<HTMLDivElement>(null);
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 200, damping: 20 });
  const btnSpringY = useSpring(btnY, { stiffness: 200, damping: 20 });

  // Counting stats
  const statsRef = useRef<HTMLDListElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const [counts, setCounts] = useState(stats.map(() => 0));

  // Live preview card state
  const [txPhase, setTxPhase] = useState<"processing" | "committed">("committed");
  const [txId, setTxId] = useState(0);
  const [latencyIdx, setLatencyIdx] = useState(1);
  const [logHead, setLogHead] = useState(0);

  useEffect(() => {
    if (!statsInView) return;
    const duration = 800;
    const interval = 30;
    const ticks = Math.round(duration / interval);
    const timers: ReturnType<typeof setInterval>[] = [];
    stats.forEach((stat, i) => {
      const match = stat.value.match(/^(\d+)/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      let tick = 0;
      const t = setInterval(() => {
        tick++;
        setCounts((prev) => {
          const next = [...prev];
          next[i] = Math.round((target * tick) / ticks);
          return next;
        });
        if (tick >= ticks) clearInterval(t);
      }, interval);
      timers.push(t);
    });
    return () => timers.forEach(clearInterval);
  }, [statsInView]);

  // Cycle live preview card data
  useEffect(() => {
    const txTimer = setInterval(() => {
      setTxPhase("processing");
      setTimeout(() => {
        setTxPhase("committed");
        setTxId((i) => (i + 1) % TX_IDS.length);
      }, 1200);
    }, 3500);
    const latTimer = setInterval(() => setLatencyIdx((i) => (i + 1) % LATENCIES.length), 1800);
    const logTimer = setInterval(() => setLogHead((i) => (i + 1) % LOG_LINES.length), 2200);
    return () => { clearInterval(txTimer); clearInterval(latTimer); clearInterval(logTimer); };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pt-24 sm:pt-28"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="absolute inset-0 -z-10" />

      <div className="container-x grid min-h-[calc(100vh-6rem)] items-center gap-10 pb-14 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -inset-x-8 rounded-3xl bg-[#0d0c0a]/40 blur-2xl" />
          <div className="relative">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="text-balance text-4xl font-semibold leading-[0.98] text-white min-[380px]:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl"
            >
              {["Backend", "systems,", "made", "visible."].map((word) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-4 inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 min-[380px]:text-base sm:text-lg"
            >
              3+ years shipping Go services across HRIS, payments, logistics, and
              distributed systems. I care about transactions, caching, and making
              production behavior visible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-7"
            >
              <div
                ref={btnRef}
                onMouseMove={(e) => {
                  const rect = btnRef.current!.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  btnX.set((e.clientX - centerX) * 0.35);
                  btnY.set((e.clientY - centerY) * 0.35);
                }}
                onMouseLeave={() => { btnX.set(0); btnY.set(0); }}
                className="inline-block"
              >
                <motion.a
                  href="#projects"
                  style={{ x: btnSpringX, y: btnSpringY }}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#0d0c0a] transition hover:bg-amber-50"
                >
                  View selected work
                  <MoveUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              </div>
            </motion.div>

            <motion.dl
              ref={statsRef}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 grid max-w-xl grid-cols-3 gap-3 sm:mt-8"
            >
              {stats.map((stat, i) => {
                const match = stat.value.match(/^(\d+)(.*)$/);
                const displayValue = match ? `${counts[i]}${match[2]}` : stat.value;
                return (
                  <div key={stat.label} className={`rounded-3xl border p-3 sm:p-4 ${
                    i === 0 ? "border-amber-500/50 bg-amber-900/30" :
                    i === 1 ? "border-sky-500/35 bg-sky-900/20" :
                             "border-emerald-500/35 bg-emerald-900/20"
                  }`}>
                    <dt className={`text-2xl font-semibold ${
                      i === 0 ? "text-amber-300" : i === 1 ? "text-sky-300" : "text-emerald-300"
                    }`}>{displayValue}</dt>
                    <dd className="mt-1 text-xs leading-5 text-zinc-500">{stat.label}</dd>
                  </div>
                );
              })}
            </motion.dl>
          </div>
        </div>

        {/* Right side — system preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: cardX, y: cardY }}
          className="relative mx-auto aspect-[0.96] w-full max-w-[31rem] max-sm:h-[28rem] max-sm:aspect-auto max-lg:mt-2"
        >
          <div className="scanline absolute inset-0 flex flex-col rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-[#161410] to-[#0d0c0a] p-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/[0.07] pb-4">
              <span className="size-3 rounded-full bg-[#ff5f57]/80" />
              <span className="size-3 rounded-full bg-[#febc2e]/80" />
              <span className="size-3 rounded-full bg-[#28c840]/80" />
              <span className="mono ml-3 text-xs text-zinc-600">system.preview</span>
            </div>
            <div className="relative mt-4 flex-1 overflow-hidden rounded-b-[1.4rem] max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:p-3">
              {/* Transaction card — amber tint, live cycling */}
              <div className="absolute inset-x-6 top-8 rounded-3xl border border-amber-500/50 bg-amber-900/30 p-5 max-sm:static max-sm:p-4 sm:inset-x-8 sm:top-10">
                <div className="flex items-center justify-between">
                  <p className="mono text-xs uppercase tracking-[0.2em] text-amber-400">transaction</p>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={txPhase}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className={`mono flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-widest ${
                        txPhase === "processing"
                          ? "border border-amber-500/40 bg-amber-900/40 text-amber-300"
                          : "border border-emerald-500/40 bg-emerald-900/30 text-emerald-300"
                      }`}
                    >
                      {txPhase === "processing" ? (
                        <><span className="inline-block size-1.5 rounded-full bg-amber-400 animate-pulse" />processing</>
                      ) : (
                        <><span className="inline-block size-1.5 rounded-full bg-emerald-400" />committed</>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Distributed processing</p>
                <p className="mono mt-2 text-[0.65rem] text-zinc-500">
                  tx=<span className="text-amber-400/80">{TX_IDS[txId]}</span>
                </p>
              </div>
              {/* Cache card — emerald, live latency */}
              <div className="absolute left-6 top-44 w-44 rounded-3xl border border-emerald-500/40 bg-emerald-900/25 p-4 max-sm:static max-sm:w-full sm:left-8 sm:top-48">
                <div className="flex items-center gap-1.5">
                  <p className="mono text-xs text-emerald-400">cache ·</p>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={latencyIdx}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="mono text-xs text-emerald-300 font-semibold"
                    >
                      {LATENCIES[latencyIdx]}ms
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-2 text-sm text-zinc-200">sub-ms reads, source-of-truth safe</p>
              </div>
              {/* Observability card — sky, live log stream */}
              <div className="absolute bottom-8 right-6 w-52 overflow-hidden rounded-3xl border border-sky-500/40 bg-sky-900/25 p-4 max-sm:static max-sm:w-full sm:bottom-12 sm:right-8">
                <p className="mono text-xs text-sky-400">observability</p>
                <div className="mt-2 space-y-1 overflow-hidden">
                  {[0, 1].map((offset) => {
                    const line = LOG_LINES[(logHead + offset) % LOG_LINES.length];
                    return (
                      <AnimatePresence key={`${logHead}-${offset}`} mode="wait">
                        <motion.p
                          key={`${logHead}-${offset}`}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: offset === 0 ? 1 : 0.45 }}
                          transition={{ duration: 0.3, delay: offset * 0.05 }}
                          className={`mono truncate text-[0.58rem] leading-4 ${line.color}`}
                        >
                          <span className="text-zinc-600">{line.level} </span>{line.msg}
                        </motion.p>
                      </AnimatePresence>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <a
        href="#system"
        aria-label="Scroll to system section"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/[0.08] p-3 text-zinc-500 transition hover:border-white/20 hover:text-zinc-300 md:block"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
}
