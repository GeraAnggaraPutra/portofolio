"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useRef } from "react";
import { systemNodes } from "@/data/portfolio";
import { SectionHeader } from "./section-header";

gsap.registerPlugin(ScrollTrigger);

// Each node gets a subtle tint — amber, sky, emerald, violet, amber, sky
const nodeTint = [
  "border-amber-500/20 bg-amber-950/20 text-amber-300",
  "border-sky-500/20 bg-sky-950/20 text-sky-300",
  "border-emerald-500/20 bg-emerald-950/20 text-emerald-300",
  "border-violet-500/20 bg-violet-950/20 text-violet-300",
  "border-amber-500/20 bg-amber-950/20 text-amber-300",
  "border-sky-500/20 bg-sky-950/20 text-sky-300",
];

export function SystemFlow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray<HTMLElement>("[data-system-node]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-system-line]");

      gsap.set(nodes, { opacity: 0, y: 18 });
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 60%",
          end: "bottom 55%",
          scrub: 0.7,
        },
      });

      nodes.forEach((node, index) => {
        timeline.to(node, { opacity: 1, y: 0, duration: 0.6 }, index * 0.28);
        if (lines[index]) {
          timeline.to(lines[index], { scaleX: 1, duration: 0.5 }, index * 0.28 + 0.12);
        }
      });
    },
    { scope: root },
  );

  return (
    <section id="system" ref={root} className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="System flow"
        title="The backend work becomes visible here."
        description="Instead of hiding backend experience inside bullet points, this section turns request flow, consistency, caching, and observability into a visual path."
      />

      <div className="glass overflow-hidden rounded-[2rem] p-5 sm:p-7">
        <div className="grid gap-4 lg:grid-cols-6">
          {systemNodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div key={node.title} className="relative">
                <div
                  data-system-node
                  className="min-h-48 rounded-3xl border border-white/[0.07] bg-black/20 p-5 transition hover:border-white/[0.12] hover:bg-white/[0.03]"
                >
                  <div className={`mb-5 grid size-11 place-items-center rounded-2xl border ${nodeTint[index]}`}>
                    <Icon size={20} />
                  </div>
                  <p className="mono text-xs text-zinc-600">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{node.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{node.description}</p>
                </div>
                {index < systemNodes.length - 1 && (
                  <div
                    data-system-line
                    className="mx-5 hidden h-px bg-gradient-to-r from-amber-500/40 to-transparent lg:absolute lg:left-[calc(100%-1.25rem)] lg:top-24 lg:block lg:w-8 relative"
                  >
                    <motion.span
                      className="absolute top-1/2 left-0 -translate-y-1/2 size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.5)]"
                      style={{ x: 0 }}
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut", delay: index * 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
