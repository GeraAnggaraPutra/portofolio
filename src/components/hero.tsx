"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { ArrowDown, MoveUpRight } from "lucide-react";
import { stats } from "@/data/portfolio";

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
              {/* Request card — amber tint */}
              <div className="absolute inset-x-6 top-8 rounded-3xl border border-amber-500/50 bg-amber-900/30 p-5 max-sm:static max-sm:p-4 sm:inset-x-8 sm:top-10">
                <p className="mono text-xs uppercase tracking-[0.2em] text-amber-400">transaction</p>
                <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Distributed processing</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Atomic, idempotent, retry-safe.
                </p>
              </div>
              {/* Cache card — emerald tint */}
              <div className="absolute left-6 top-44 w-44 rounded-3xl border border-emerald-500/40 bg-emerald-900/25 p-4 max-sm:static max-sm:w-full sm:left-8 sm:top-48">
                <p className="mono text-xs text-emerald-400">cache · 0.2ms</p>
                <p className="mt-2 text-sm text-zinc-200">sub-ms reads, source-of-truth safe</p>
              </div>
              {/* Observability card — sky tint */}
              <div className="absolute bottom-8 right-6 w-52 rounded-3xl border border-sky-500/40 bg-sky-900/25 p-4 max-sm:static max-sm:w-full sm:bottom-12 sm:right-8">
                <p className="mono text-xs text-sky-400">observability</p>
                <p className="mt-2 text-sm text-zinc-200">trace IDs, structured logs, metrics</p>
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
