"use client";

import { ArrowUpRight, Download, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const channels = [
  { label: "Email", value: "anggaragera@gmail.com", href: "mailto:anggaragera@gmail.com" },
  { label: "GitHub", value: "GeraAnggaraPutra", href: "https://github.com/GeraAnggaraPutra", external: true },
  { label: "LinkedIn", value: "gera-anggara-putra", href: "https://linkedin.com/in/gera-anggara-putra", external: true },
  { label: "Location", value: "Bandung, Indonesia" },
] as const;

export function Contact() {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="contact" className="container-x pb-12 pt-24 sm:pb-16 sm:pt-32" aria-labelledby="contact-heading">
      <div className="grid overflow-hidden rounded-[1.75rem] border border-[#6b5f4c]/55 bg-[#171511] lg:grid-cols-[0.98fr_1.02fr]">
        <div className="flex flex-col justify-between bg-[#e9e3d6] px-7 py-9 text-[#211e19] sm:px-10 sm:py-12 lg:min-h-[35rem] lg:px-12 lg:py-11">
          <div>
            <motion.p {...enter(0)} className="mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#9b6c28]">Let&apos;s connect</motion.p>
            <motion.h2 {...enter(0.09)} id="contact-heading" className="mt-10 max-w-[11ch] text-balance text-[clamp(2.75rem,5.2vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.065em] sm:mt-14 lg:mt-12">
              Let&apos;s make the complex feel clear.
            </motion.h2>
          </div>
          <motion.div {...enter(0.2)} className="mt-12 lg:mt-8">
            <div className="h-px w-full bg-[#b6aa97]" />
            <p className="mt-5 max-w-md text-sm leading-7 text-[#635b50] sm:text-base">Go backend engineer in Bandung, Indonesia. Open to teams building reliable product systems.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="mailto:anggaragera@gmail.com" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#211e19] px-5 text-sm font-semibold !text-[#f5f0e7] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#3b3328] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#211e19]">
                <Mail size={16} aria-hidden="true" /> Email me <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
              <a href="/gera-anggara-putra-cv.pdf" download="gera-anggara-putra-cv.pdf" className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[#8f8370] px-5 text-sm font-semibold text-[#211e19] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#211e19] hover:bg-[#f5f0e7] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#211e19]">
                <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" /> Download CV
              </a>
            </div>
          </motion.div>
        </div>

        <div className="px-7 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-11">
          <motion.p {...enter(0.08)} className="mono mb-7 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-300">Direct channels</motion.p>
          <div>
            {channels.map((channel, index) => {
              const content = (
                <>
                  <span className="mono block text-[0.67rem] font-medium uppercase tracking-[0.2em] text-[#a59b8e]">{channel.label}</span>
                  <span className="mt-2 flex items-center justify-between gap-4 text-base font-semibold text-[#f5f0e7] sm:text-lg">
                    <span className="min-w-0 break-words">{channel.value}</span>
                    {"href" in channel && <ArrowUpRight size={20} className="shrink-0 text-amber-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />}
                  </span>
                  {"href" in channel && <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-300 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" aria-hidden="true" />}
                </>
              );

              return (
                <motion.div key={channel.label} {...enter(0.15 + index * 0.07)}>
                  {"href" in channel ? (
                    <a href={channel.href} {...("external" in channel ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`group relative block border-b border-[#494036] pb-5 transition-colors hover:border-[#8d7445] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${index === 0 ? "pt-0" : "pt-5"}`}>
                      {content}
                    </a>
                  ) : (
                    <div className="relative border-b border-[#494036] py-5">{content}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative mt-10 h-px bg-[#574b38] sm:mt-12" aria-hidden="true">
        <motion.span initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 origin-left bg-amber-300/70" />
        <span className="absolute -top-1 right-0 size-2 rounded-full bg-amber-300" />
      </div>
    </section>
  );
}
