"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only show once per session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("ga-loaded")) {
      setDone(true);
      return;
    }

    const duration = 2000;
    let startTs: number | null = null;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      // Ease-out curve: fast at start, slows near end
      const raw = elapsed / duration;
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 2.2);
      const p = Math.min(100, Math.floor(eased * 100));
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("ga-loaded", "1");
        }
        setTimeout(() => setDone(true), 500);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 flex flex-col items-start justify-end bg-black"
          style={{ zIndex: 9999 }}
        >
          {/* Center mark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
            <p
              className="font-bold leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(3rem,10vw,6rem)", fontFamily: "var(--font-geist-sans)" }}
            >
              Gera<span style={{ color: "#f59e0b" }}>.</span>
            </p>
            <p
              className="mt-3 uppercase text-white/25"
              style={{ fontSize: "0.6rem", letterSpacing: "0.32em", fontFamily: "var(--font-geist-mono)" }}
            >
              Backend Engineer
            </p>
          </div>

          {/* Bottom bar */}
          <div className="w-full px-7 pb-10">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-white/20 uppercase"
                style={{ fontSize: "0.55rem", letterSpacing: "0.22em", fontFamily: "var(--font-geist-mono)" }}
              >
                Initializing
              </span>
              <span
                className="tabular-nums text-white/40"
                style={{ fontSize: "0.72rem", fontFamily: "var(--font-geist-mono)" }}
              >
                {String(progress).padStart(3, " ")}
                <span className="text-white/20">%</span>
              </span>
            </div>

            {/* Track */}
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full origin-left"
                style={{ background: "#f59e0b" }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
