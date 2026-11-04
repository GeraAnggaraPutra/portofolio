"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** CSS-only motion: no canvas redraws, pointer tracking, or animation-frame loop. */
export function AmbientBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncVisibility = () => {
      root.current?.setAttribute("data-paused", String(document.hidden));
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return <div ref={root} className="ambient-backdrop" aria-hidden="true">
    <div className="ambient-lattice" />
    <div className="ambient-light ambient-light-gold" />
    <div className="ambient-light ambient-light-blue" />
    {Array.from({ length: 12 }, (_, i) => <span key={i} className="ambient-ember" style={{
      left: `${(i * 37 + 7) % 100}%`,
      top: `${(i * 23 + 11) % 100}%`,
      "--drift-time": `${19 + i * 2}s`,
      "--drift-delay": `${-i * 3}s`,
    } as CSSProperties} />)}
  </div>;
}
