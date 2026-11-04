"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** CSS-only motion: no canvas redraws, pointer tracking, or animation-frame loop. */
export function AmbientBackdrop() {
  const sparks = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncVisibility = () => {
      root.current?.setAttribute("data-paused", String(document.hidden));
    };
    const burst = (event: PointerEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !sparks.current) return;
      const layer = sparks.current;
      while (layer.children.length >= 4) layer.firstElementChild?.remove();
      const group = document.createElement("div");
      const calm = document.documentElement.dataset.calm === "true";
      group.className = calm ? "click-burst click-burst-calm" : "click-burst";
      group.style.left = `${event.clientX}px`;
      group.style.top = `${event.clientY}px`;
      const ring = document.createElement("i");
      ring.className = "click-burst-ring";
      group.appendChild(ring);
      for (let i = 0; i < (calm ? 0 : 14); i++) {
        const particle = document.createElement("i");
        const angle = i / 14 * Math.PI * 2;
        const distance = 45 + (i % 3) * 22;
        particle.className = "click-burst-spark";
        particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
        group.appendChild(particle);
      }
      group.addEventListener("animationend", e => { if (e.target === ring) group.remove(); });
      layer.appendChild(group);
    };
    document.addEventListener("pointerdown", burst, { passive: true });
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => { document.removeEventListener("visibilitychange", syncVisibility); document.removeEventListener("pointerdown", burst); };
  }, []);

  return <><div ref={sparks} className="click-effects" aria-hidden="true" /><div ref={root} className="ambient-backdrop" aria-hidden="true">
    <div className="ambient-lattice" />
    <div className="ambient-light ambient-light-gold" />
    <div className="ambient-light ambient-light-blue" />
    {Array.from({ length: 12 }, (_, i) => <span key={i} className="ambient-ember" style={{
      left: `${(i * 37 + 7) % 100}%`,
      top: `${(i * 23 + 11) % 100}%`,
      "--drift-time": `${19 + i * 2}s`,
      "--drift-delay": `${-i * 3}s`,
    } as CSSProperties} />)}
  </div></>;
}
