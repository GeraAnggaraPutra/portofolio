"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { navItems } from "@/data/portfolio";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <header className="fixed inset-x-0 top-5 z-50 px-4 sm:px-8 xl:px-14">
      {/* Floating bar */}
      <div className="mx-auto max-w-screen-2xl">
        <nav className="flex h-14 items-center justify-between rounded-xl border border-white/[0.1] bg-[#07090f]/90 px-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-8">
          {/* Logo */}
          <a
            href="#home"
            className="text-sm font-semibold tracking-tight text-white transition hover:text-cyan-200"
          >
            Gera Anggara<span className="text-amber-400">.</span>
          </a>

          {/* Nav links — desktop */}
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right spacer keeps links centered */}
          <div className="hidden w-28 lg:block" />

          {/* Hamburger — mobile */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-zinc-300 transition hover:text-white lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Scroll progress bar — sits flush under the nav */}
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="h-[2px] rounded-full bg-amber-400/60"
        />

        {/* Mobile drawer */}
        <div
          className={cn(
            "overflow-hidden rounded-b-xl border-x border-b border-white/[0.08] bg-[#07090f]/95 transition-all duration-300 lg:hidden",
            open ? "max-h-72 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col gap-0.5 px-5 pb-4 pt-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-zinc-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
