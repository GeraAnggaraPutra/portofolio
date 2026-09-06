"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Stagger, StaggerItem } from "./reveal";

// Subtle color tints cycling per group — amber, sky, emerald, violet, stone
const iconTint = [
  "border-amber-500/25 bg-amber-950/30 text-amber-300",
  "border-sky-500/25 bg-sky-950/30 text-sky-300",
  "border-emerald-500/25 bg-emerald-950/30 text-emerald-300",
  "border-violet-500/25 bg-violet-950/30 text-violet-300",
  "border-stone-400/20 bg-stone-900/30 text-stone-300",
];

export function TechStack() {
  return (
    <section id="stack" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Stack"
        title="The tools that ship production systems."
        description="Backend-first, pragmatic, and honest. These are the technologies behind the projects and services listed above."
      />

      <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skillGroups.map((group, i) => {
          const Icon = group.icon;
          return (
            <StaggerItem key={group.title}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="min-h-72 rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-6"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
                  className={`grid size-12 place-items-center rounded-2xl border ${iconTint[i % iconTint.length]}`}
                >
                  <Icon size={21} />
                </motion.div>
                <h3 className="mt-5 text-xl font-semibold text-white">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.07] bg-black/20 px-3 py-2 text-sm text-zinc-400 transition hover:border-white/15 hover:text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
