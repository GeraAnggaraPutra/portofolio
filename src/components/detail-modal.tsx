"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

type DetailModalProps = {
  open: boolean;
  title: string;
  subtitle: string;
  stack: string[];
  bullets: string[];
  accent?: "cyan" | "emerald" | "amber" | "blue";
  onClose: () => void;
};

const accentColor: Record<string, string> = {
  cyan: "text-amber-400",
  emerald: "text-amber-400",
  amber: "text-amber-400",
  blue: "text-amber-400",
};

const dotColor: Record<string, string> = {
  cyan: "bg-amber-400",
  emerald: "bg-amber-400",
  amber: "bg-amber-400",
  blue: "bg-amber-400",
};

export function DetailModal({ open, title, subtitle, stack, bullets, accent = "cyan", onClose }: DetailModalProps) {
  // Use position:fixed technique — preserves portal scroll, unlike overflow:hidden on html
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — swallows wheel events so background never scrolls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9990] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            aria-hidden="true"
          />

          {/* Sheet — overflow-y-auto so the panel itself scrolls */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[9991] mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#08101a] p-6 pb-10 shadow-2xl scrollbar-hide md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:p-8 md:pb-8"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile only) */}
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20 md:hidden" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/25 hover:text-white"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <p className={`mono text-xs font-medium uppercase tracking-[0.22em] ${accentColor[accent]}`}>
              {subtitle}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>

            {/* Stack pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-white/[0.07]" />

            {/* Bullet points */}
            <ul className="space-y-3.5">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dotColor[accent]}`} />
                  <span className="text-sm leading-[1.8] text-zinc-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
