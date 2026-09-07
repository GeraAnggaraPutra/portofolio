"use client";

import { GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

export function Education() {
  const edu = education[0];

  return (
    <section id="education" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Education"
        title="Where it started."
        description="Formal background in software engineering — before Go, before production systems."
      />

      <Reveal>
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:border-amber-500/20 hover:bg-amber-950/10 sm:p-8">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-amber-500/20 bg-amber-950/20 text-amber-300">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600">
                  {edu.major}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                  {edu.school}
                </h3>
              </div>
            </div>

            <p className="mono shrink-0 text-xs text-zinc-600 sm:mt-1">{edu.period}</p>
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-400 sm:pl-[3.75rem]">
            {edu.description}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
