"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight } from "lucide-react";

const workflows = [
  {
    id: "architecture", label: "Architecture", number: "01",
    headline: "Clear boundaries make complex work maintainable.",
    description: "Across HRIS, parking, and operational platforms, I focus on who owns each rule, where an action is processed, and how services exchange trusted context.",
    stages: ["Entry point", "Identity", "Domain rules", "Outcome"],
    outcome: "Service ownership and secure access",
  },
  {
    id: "workflows", label: "Workflows", number: "02",
    headline: "Reliable actions beyond the happy path.",
    description: "Attendance sync, approvals, payroll, and integrations all need explicit validation, consistent updates, and a way to recover when a request is repeated or a dependency fails.",
    stages: ["Validate", "Process", "Retry safely", "Reconcile"],
    outcome: "Transactions, recovery, and consistency",
  },
  {
    id: "operations", label: "Operations", number: "03",
    headline: "Production should explain itself.",
    description: "I connect request IDs, structured logs, metrics, dashboards, and alerts so teams can trace a failure from a user report to the service and action behind it.",
    stages: ["Instrument", "Observe", "Investigate", "Improve"],
    outcome: "Visibility after release",
  },
] as const;

export function Hero() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const workflow = workflows[selected];

  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 sm:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px] bg-[radial-gradient(ellipse_at_72%_15%,rgba(251,191,36,0.12),transparent_52%)]" />
      <div className="container-x relative pb-16 sm:pb-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-7 flex flex-wrap items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.23em] text-zinc-400 sm:mb-9">
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-2 text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Open to opportunities
              </span>
              <span className="mono">Go backend engineer · Bandung, Indonesia</span>
            </div>
            <h1 className="max-w-[12ch] text-balance text-[clamp(3.5rem,8.3vw,7.7rem)] font-semibold leading-[0.91] tracking-[-0.075em] text-white">
              Complex rules.<br /><span className="text-amber-300">Calm systems.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-zinc-300 sm:mt-9 sm:text-lg sm:leading-9">
              I&apos;m Gera Anggara Putra. I build Go services for HRIS, payments, and operations where correctness, resilience, and clear production signals matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <a href="#projects" className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-[#17120b] transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
                Explore selected work <ArrowDownRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <a href="#contact" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.035] px-5 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
                Get in touch <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-xs text-zinc-500 sm:mt-16">
              <span><strong className="mr-2 font-medium text-zinc-200">3+ years</strong> building backend systems</span>
              <span><strong className="mr-2 font-medium text-zinc-200">10+ projects</strong> across product and client work</span>
            </div>
          </div>

          <div className="relative lg:pb-1">
            <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-[2.4rem] bg-amber-400/[0.05] blur-3xl" />
            <div className="overflow-hidden rounded-[1.6rem] border border-amber-200/20 bg-[#15130f]/95 shadow-[0_34px_100px_rgba(0,0,0,0.4)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.7)]" /><p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-200">How I build</p></div>
                <span className="mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-500">Across selected work</span>
              </div>
              <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2 scrollbar-hide" role="tablist" aria-label="Explore backend engineering approach">
                {workflows.map((item, index) => (
                  <button key={item.id} type="button" id={`workflow-tab-${item.id}`} role="tab" aria-selected={selected === index} aria-controls="workflow-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => {
                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                    event.preventDefault();
                    const next = (index + (event.key === "ArrowRight" ? 1 : workflows.length - 1)) % workflows.length;
                    setSelected(next);
                    document.getElementById(`workflow-tab-${workflows[next].id}`)?.focus();
                  }} className={`flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:text-sm ${selected === index ? "bg-amber-300 text-[#17120b]" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"}`}>
                    <span className="mono text-[0.6rem] opacity-60">{item.number}</span>{item.label}
                  </button>
                ))}
              </div>
              <div id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${workflow.id}`} className="min-h-[22rem] p-5 sm:p-7">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={workflow.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                    <p className="mono text-[0.62rem] uppercase tracking-[0.22em] text-amber-400/80">{workflow.outcome}</p>
                    <h2 className="mt-3 max-w-md text-balance text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{workflow.headline}</h2>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400">{workflow.description}</p>
                    <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {workflow.stages.map((stage, index) => (
                        <div key={stage} className="min-h-20 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                          <div className="flex items-center justify-between"><span className="mono text-[0.6rem] text-amber-300">0{index + 1}</span>{index === 3 ? <Check size={13} className="text-emerald-300" aria-hidden="true" /> : <ChevronRight size={13} className="text-zinc-600" aria-hidden="true" />}</div>
                          <p className="mt-3 text-xs font-medium leading-4 text-zinc-200">{stage}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3 sm:px-7">
                <span className="mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500">Principles drawn from shipped systems</span>
                <a href="#projects" className="shrink-0 text-xs font-medium text-amber-200 hover:text-amber-100">See the work ↗</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
