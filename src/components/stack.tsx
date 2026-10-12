"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { skillGroups } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Stagger, StaggerItem } from "./reveal";

function GlowCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !glowRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 10;
    ref.current.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    glowRef.current.style.background = `radial-gradient(220px circle at ${x}px ${y}px, rgba(251,191,36,0.12), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current || !glowRef.current) return;
    ref.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0)";
    glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-[2rem] transition-[background] duration-300"
      />
      {children}
    </div>
  );
}

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
              <GlowCard>
                <motion.article
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
              </GlowCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
