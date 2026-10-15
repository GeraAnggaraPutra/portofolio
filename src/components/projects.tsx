"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Stagger, StaggerItem } from "./reveal";
import { DetailModal } from "./detail-modal";
import { ProjectLinks } from "./project-links";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const closeModal = useCallback(() => setSelected(null), []);
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <section id="projects" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Selected work"
        title="Proof in the work."
        description="A closer look at the systems I helped ship, the problems behind them, and the decisions that made them reliable."
      />

      <article className="relative mb-10 overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[#17140e] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-9 lg:p-11">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full bg-amber-300/[0.09] blur-[90px]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="mono rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-amber-200">Featured case study</span>
              <span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">01 / HRIS platform</span>
            </div>
            <h3 className="mt-7 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl">UNARA <span className="text-amber-300">People.</span></h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">A multi-company HR platform spanning four Go repositories. My work connects secure API access, online and offline attendance, payroll accuracy, patrol operations, and production observability.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/projects/unara-people" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-[#17120b] transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Read the case study <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
              <ProjectLinks links={featured.links} projectTitle={featured.title} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5" aria-label="Four backend areas covered in the UNARA People case study">
            {[
              ["01", "API Gateway", "Access, routing, resilience"],
              ["02", "Master Service", "Rules and reference data"],
              ["03", "Transaction Service", "Operational workflows"],
              ["04", "Observability", "Metrics, logs, alerts"],
            ].map(([number, title, detail]) => (
              <div key={number} className="min-h-28 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <span className="mono text-[0.62rem] text-amber-300">{number} / 04</span>
                <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-zinc-100">More selected work</h3>
        <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">{remaining.length} projects</span>
      </div>

      <Stagger className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {remaining.slice(0, showAll ? undefined : 5).map((project, index) => (
          <StaggerItem key={project.title}>
            <motion.article
              onHoverStart={() => { if (!window.matchMedia("(pointer: coarse)").matches) setExpandedIdx(index); }}
              onHoverEnd={() => setExpandedIdx(null)}
              className="group relative py-6 sm:py-7"
            >
              {/* Left accent bar — amber, scales in on hover */}
              <div className="absolute left-0 top-4 h-[calc(100%-2rem)] w-0.5 origin-top scale-y-0 rounded-full bg-amber-500/70 transition-transform duration-200 group-hover:scale-y-100" />

              <button
                type="button"
                onClick={() => setSelected(project)}
                aria-label={`View ${project.title} details`}
                className="flex w-full cursor-pointer items-start gap-4 rounded-sm pl-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:pl-6"
              >
                {/* Index number */}
                <span className="mono mt-0.5 w-5 shrink-0 text-[0.65rem] text-zinc-700">
                  {String(index + 2).padStart(2, "0")}
                </span>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600">
                        {project.eyebrow}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white transition-colors group-hover:text-amber-100 sm:text-2xl">
                        {project.title}
                      </h3>
                    </div>

                    {/* Stack — desktop, first 4 separated by · */}
                    <p className="mono mt-1.5 hidden shrink-0 text-[0.62rem] text-zinc-600 sm:block">
                      {project.stack.slice(0, 4).join(" · ")}
                    </p>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400 sm:text-base">
                    {project.summary}
                  </p>

                  {/* Extra context appears on hover; the row opens details with one click or tap. */}
                  <AnimatePresence>
                    {expandedIdx === index && (
                      <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="mono text-[0.58rem] uppercase tracking-[0.18em] text-rose-400/70">
                              Problem
                            </p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                              {project.problem}
                            </p>
                          </div>
                          <div>
                            <p className="mono text-[0.58rem] uppercase tracking-[0.18em] text-emerald-400/70">
                              Move
                            </p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                              {project.impact}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Detail affordance */}
                <div className="mt-1.5 flex shrink-0 items-center gap-2">
                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-400"
                  />
                </div>
              </button>
              {(project.links?.length || project.github) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 pl-12 sm:pl-14">
                  {project.caseStudyHref && (
                    <Link
                      href={project.caseStudyHref}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-400/10 px-3 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                    >
                      Read case study <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  )}
                  <ProjectLinks links={project.links} projectTitle={project.title} />
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} on GitHub (new tab)`}
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-zinc-300 transition-colors hover:border-violet-400/45 hover:bg-violet-400/10 hover:text-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                    >
                      <Github size={15} aria-hidden="true" /> GitHub <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      {!showAll && remaining.length > 5 && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => setShowAll(true)} className="min-h-11 rounded-full border border-white/20 bg-white/[0.035] px-6 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Explore all {remaining.length} projects <span aria-hidden="true">↘</span></button>
        </div>
      )}

      {selected && (
        <DetailModal
          open={!!selected}
          title={selected.title}
          subtitle={selected.eyebrow}
          stack={selected.stack}
          bullets={selected.bullets}
          links={selected.links}
          github={selected.github}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
