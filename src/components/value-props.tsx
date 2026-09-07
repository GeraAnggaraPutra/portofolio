"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { valueProps } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Stagger, StaggerItem } from "./reveal";

const icons = ["⚙️", "🔄", "📊", "🤝"];

export function ValueProps() {
  return (
    <section id="value" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="What I can bring"
        title="Backend engineering that ships and holds up."
        description="What I focus on when joining a backend team — the patterns I default to and the things I've already done in production."
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {valueProps.map((prop, i) => (
          <StaggerItem key={prop.title}>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-amber-500/20 hover:bg-amber-950/10"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="mb-4 text-2xl">{icons[i]}</span>

              <h3 className="text-base font-semibold text-white">{prop.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">{prop.description}</p>

              <div className="mt-4 flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-amber-400/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Already shipped</span>
                <ArrowRight size={10} />
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
