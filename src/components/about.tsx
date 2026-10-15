import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const principles = [
  {
    number: "01",
    title: "Rules have an owner.",
    detail: "Reference data and policy live in Master Service; operational events and results live in Transaction Service.",
  },
  {
    number: "02",
    title: "Retries need a plan.",
    detail: "Signed requests, idempotency, and transactional updates protect workflows from duplicate or partial outcomes.",
  },
  {
    number: "03",
    title: "Production should explain itself.",
    detail: "Request IDs, structured logs, metrics, and dashboards turn incidents into questions the team can answer.",
  },
];

export function About() {
  return (
    <section id="about" className="container-x border-t border-white/[0.07] py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
        <Reveal>
          <div>
            <p className="mono mb-5 text-xs font-medium uppercase tracking-[0.22em] text-amber-400">About the engineer</p>
            <h2 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">Backend first.<br /><span className="text-zinc-500">People and outcomes always.</span></h2>
            <div className="mt-7 max-w-xl space-y-5 text-base leading-8 text-zinc-400">
              <p>I started coding Go a few months after graduating high school in 2023. At PLABS.ID, I moved from intern to software engineer while building systems for client operations.</p>
              <p>Today I work on backend services at Nusapala across HRIS, parking membership, asset tracking, and observability. My focus is the part users rarely see: rules that stay correct, integrations that recover, and behavior the team can investigate.</p>
            </div>
            <Link href="/projects/unara-people" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-amber-200 transition-colors hover:text-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">See these principles in UNARA People <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#15130f]/90">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">Working principles</p>
              <span className="mono text-[0.6rem] text-zinc-600">GO / SYSTEMS</span>
            </div>
            <ol className="divide-y divide-white/[0.07]">
              {principles.map((item) => (
                <li key={item.number} className="grid grid-cols-[2rem_1fr] gap-4 px-6 py-6 sm:gap-5">
                  <span className="mono pt-1 text-xs text-amber-300">{item.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
