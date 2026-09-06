"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Touch devices keep native cursor
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.style.cursor = "none";

    // quickTo for perf — no new tween per frame
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    // Delegation — catches all interactive, including dynamic ones
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role=button], input, textarea, select, label")) {
        gsap.to(ring, { scale: 1.9, opacity: 0.7, borderColor: "rgba(251,191,36,0.7)", duration: 0.28, ease: "power2.out" });
        gsap.to(dot, { scale: 0.3, duration: 0.22 });
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.relatedTarget as Element | null;
      if (!target?.closest("a, button, [role=button], input, textarea, select, label")) {
        gsap.to(ring, { scale: 1, opacity: 1, borderColor: "rgba(251,191,36,0.35)", duration: 0.32, ease: "power2.out" });
        gsap.to(dot, { scale: 1, duration: 0.22 });
      }
    };

    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.22 });
    };
    const onEnterDoc = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.22 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnterDoc);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnterDoc);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 7,
          height: 7,
          background: "rgba(251,191,36,0.95)",
          boxShadow: "0 0 12px rgba(251,191,36,0.7)",
        }}
      />
      {/* Ring — lags behind for feel */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 36,
          height: 36,
          border: "1.5px solid rgba(251,191,36,0.35)",
        }}
      />
    </>
  );
}
