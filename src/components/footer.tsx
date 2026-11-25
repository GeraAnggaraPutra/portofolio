import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "GitHub", value: "GeraAnggaraPutra", href: "https://github.com/GeraAnggaraPutra" },
  { label: "LinkedIn", value: "gera-anggara-putra", href: "https://linkedin.com/in/gera-anggara-putra" },
] as const;

export function Footer() {
  return (
    <footer className="container-x pb-8 sm:pb-10">
      <div className="rounded-[1.5rem] border border-[#4a4033] bg-[#1a1814] px-6 pb-5 pt-7 sm:px-9 sm:pt-8">
        <p className="mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-300">Elsewhere</p>
        <div className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-8">
          {footerLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="group block min-w-0 border-b border-[#574d3e] pb-5 transition-colors duration-300 hover:border-amber-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
              <span className="mono block text-[0.67rem] uppercase tracking-[0.18em] text-[#a59b8e]">{item.label}</span>
              <span className="mt-3 flex items-center justify-between gap-2 text-base font-semibold text-[#f5f0e7] sm:text-lg">
                <span className="min-w-0 break-words">{item.value}</span>
                <ArrowUpRight size={17} className="shrink-0 text-[#b8a17c] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </a>
          ))}
          <div className="border-b border-[#574d3e] pb-5">
            <span className="mono block text-[0.67rem] uppercase tracking-[0.18em] text-[#a59b8e]">Based in</span>
            <span className="mt-3 block text-base font-semibold text-[#f5f0e7] sm:text-lg">Bandung, Indonesia</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 text-xs text-[#90897e] sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-semibold text-[#d8d0c4]">Gera Anggara Putra</span><span className="mx-2 text-amber-300/60">·</span>Backend systems made visible.</p>
          <a href="#home" className="group inline-flex min-h-11 w-fit items-center gap-2 font-medium text-[#c8bb9e] transition-colors hover:text-amber-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
            Back to top <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
