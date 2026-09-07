"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Stagger, StaggerItem } from "./reveal";
import { DetailModal } from "./detail-modal";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Selected work"
        title="Production stories, not generic project tiles."
        description="The projects are framed around the backend problem, the technical move, and the signal it gives to someone reviewing the work. Click any row for full detail."
      />

      <Stagger className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {projects.map((project, index) => (
          <StaggerItem key={project.title}>
            <motion.article
              onClick={() => {
                // Mobile: first tap expands, second tap opens modal
                if (window.matchMedia("(pointer: coarse)").matches) {
                  if (expandedIdx === index) { setSelected(project); setExpandedIdx(null); }
                  else setExpandedIdx(index);
                } else {
                  setSelected(project);
                }
              }}
              onHoverStart={() => { if (!window.matchMedia("(pointer: coarse)").matches) setExpandedIdx(index); }}
              onHoverEnd={() => { if (!window.matchMedia("(pointer: coarse)").matches) setExpandedIdx(null); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelected(project)}
              aria-label={`View ${project.title} details`}
              className="group relative cursor-pointer py-6 sm:py-7"
            >
              {/* Left accent bar — amber, scales in on hover */}
              <div className="absolute left-0 top-4 h-[calc(100%-2rem)] w-0.5 origin-top scale-y-0 rounded-full bg-amber-500/70 transition-transform duration-200 group-hover:scale-y-100" />

              <div className="flex items-start gap-4 pl-4 sm:pl-6">
                {/* Index number */}
                <span className="mono mt-0.5 w-5 shrink-0 text-[0.65rem] text-zinc-700">
                  {String(index + 1).padStart(2, "0")}
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

                  {/* Expand: hover on desktop, first tap on mobile */}
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

                {/* Right side: GitHub link (if any) + Arrow */}
                <div className="mt-1.5 flex shrink-0 items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View on GitHub"
                      className="text-zinc-600 transition hover:text-violet-400"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-400"
                  />
                </div>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      {selected && (
        <DetailModal
          open={!!selected}
          title={selected.title}
          subtitle={selected.eyebrow}
          stack={selected.stack}
          bullets={selected.bullets}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
