"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { experiences, type Experience } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { DetailModal } from "./detail-modal";

export function ExperienceTimeline() {
  const [selected, setSelected] = useState<Experience | null>(null);

  return (
    <section id="experience" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Experience"
        title="Where the work happened."
        description="Each role added a layer — from learning the basics to owning complex systems end to end. Click any card to see full responsibilities."
      />

      <div className="relative mt-2">
        {/* Vertical line — desktop only, amber gradient */}
        <div className="absolute left-[1.125rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-amber-500/50 via-amber-600/15 to-transparent sm:block" />

        <div className="flex flex-col gap-6">
          {experiences.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
              className="relative sm:pl-14"
            >
              {/* Timeline dot — desktop, amber */}
              <span className="absolute left-0 top-6 hidden sm:flex size-[2.25rem] items-center justify-center rounded-full border border-amber-500/30 bg-[#100f0c] shadow-[0_0_16px_rgba(245,158,11,0.12)]">
                <span className="size-2 rounded-full bg-amber-500/70" />
              </span>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelected(item)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(item)}
                aria-label={`View ${item.role} at ${item.company} details`}
                className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.04] sm:rounded-[1.75rem] sm:p-7"
              >
                {/* Mobile accent bar — amber */}
                <div className="absolute left-0 top-6 h-12 w-0.5 rounded-full bg-gradient-to-b from-amber-500/50 to-transparent sm:hidden" />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-amber-400/70">
                      {item.period}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                      {item.company}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 text-zinc-600 sm:mt-1">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-xs">{item.location}</span>
                  </div>
                </div>

                <div className="my-4 h-px bg-white/[0.05]" />

                <p className="text-sm leading-[1.8] text-zinc-400 sm:text-base">
                  {item.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[0.7rem] font-medium text-zinc-500 sm:text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="mono mt-3 text-[0.6rem] uppercase tracking-[0.18em] text-white/[0.12] transition-colors group-hover:text-amber-400/30">
                  Click for full responsibilities
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {selected && (
        <DetailModal
          open={!!selected}
          title={selected.role}
          subtitle={selected.company}
          stack={selected.stack}
          bullets={selected.bullets}

          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
