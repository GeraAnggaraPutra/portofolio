"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

function TiltCard({ children, className, href, target }: {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 8;
    ref.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  const inner = (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  return inner;
}

const cardBase = "flex items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-black/20 p-5";

export function Contact() {
  return (
    <section id="contact" className="container-x py-24 sm:py-32">
      <div className="glass overflow-hidden rounded-[2rem] p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal>
            <SectionHeader
              eyebrow="Contact"
              title="Start with the systems. Stay for the craft."
              description="Open for backend engineering conversations, Go roles, and teams that care about reliable product systems."
            />
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="mailto:anggaragera@gmail.com"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#0d0c0a] transition hover:bg-amber-50"
              >
                <Mail size={17} />
                Email me
              </motion.a>
              <motion.a
                href="/gera-anggara-putra-cv.pdf"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                <Download size={17} />
                Download CV
              </motion.a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3">
              <TiltCard
                href="mailto:anggaragera@gmail.com"
                className={`${cardBase} transition hover:border-amber-500/25 hover:bg-amber-950/10`}
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">Email</span>
                  <span className="mt-2 block text-lg font-medium text-white">anggaragera@gmail.com</span>
                </span>
                <Mail className="text-amber-400/70" size={22} />
              </TiltCard>

              <TiltCard
                href="https://github.com/GeraAnggaraPutra"
                target="_blank"
                className={`${cardBase} transition hover:border-violet-500/25 hover:bg-violet-950/10`}
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">GitHub</span>
                  <span className="mt-2 block text-lg font-medium text-white">GeraAnggaraPutra</span>
                </span>
                <Github className="text-violet-400/70" size={22} />
              </TiltCard>

              <TiltCard
                href="https://linkedin.com/in/gera-anggara-putra"
                target="_blank"
                className={`${cardBase} transition hover:border-sky-500/25 hover:bg-sky-950/10`}
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">LinkedIn</span>
                  <span className="mt-2 block text-lg font-medium text-white">gera-anggara-putra</span>
                </span>
                <Linkedin className="text-sky-400/70" size={22} />
              </TiltCard>

              <TiltCard className={cardBase}>
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">Location</span>
                  <span className="mt-2 block text-lg font-medium text-white">Bandung, Indonesia</span>
                </span>
                <MapPin className="text-emerald-400/70" size={22} />
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
