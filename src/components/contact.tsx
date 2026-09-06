import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

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
              <a
                href="mailto:anggaragera@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#0d0c0a] transition hover:bg-amber-50"
              >
                <Mail size={17} />
                Email me
              </a>
              <a
                href="/gera-anggara-putra-cv.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                <Download size={17} />
                Download CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3">
              <a
                href="mailto:anggaragera@gmail.com"
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-black/20 p-5 transition hover:border-amber-500/25 hover:bg-amber-950/10"
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">
                    Email
                  </span>
                  <span className="mt-2 block text-lg font-medium text-white">
                    anggaragera@gmail.com
                  </span>
                </span>
                <Mail className="text-amber-400/70" size={22} />
              </a>
              <a
                href="https://github.com/GeraAnggaraPutra"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-black/20 p-5 transition hover:border-violet-500/25 hover:bg-violet-950/10"
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">
                    GitHub
                  </span>
                  <span className="mt-2 block text-lg font-medium text-white">
                    GeraAnggaraPutra
                  </span>
                </span>
                <Github className="text-violet-400/70" size={22} />
              </a>
              <a
                href="https://linkedin.com/in/gera-anggara-putra"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-black/20 p-5 transition hover:border-sky-500/25 hover:bg-sky-950/10"
              >
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">
                    LinkedIn
                  </span>
                  <span className="mt-2 block text-lg font-medium text-white">
                    gera-anggara-putra
                  </span>
                </span>
                <Linkedin className="text-sky-400/70" size={22} />
              </a>
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-black/20 p-5">
                <span>
                  <span className="mono block text-xs uppercase tracking-[0.22em] text-zinc-600">
                    Location
                  </span>
                  <span className="mt-2 block text-lg font-medium text-white">
                    Bandung, Indonesia
                  </span>
                </span>
                <MapPin className="text-emerald-400/70" size={22} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
