"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; dAlpha: number };

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const compact = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const COUNT = Math.min(55, Math.floor(W / 25));
    const dots: Dot[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.12 - Math.random() * 0.2,
      r: 0.8 + Math.random() * 1.4,
      alpha: 0.05 + Math.random() * 0.18,
      dAlpha: (Math.random() - 0.5) * 0.002,
    }));

    let raf: number;
    let lastDraw = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (compact && now - lastDraw < 1000 / 30) return;
      lastDraw = now;
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.dAlpha;
        if (d.alpha < 0.03) { d.dAlpha = Math.abs(d.dAlpha); }
        if (d.alpha > 0.22) { d.dAlpha = -Math.abs(d.dAlpha); }
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10;
        if (d.x > W + 10) d.x = -10;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${d.alpha})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1, opacity: 0.7 }}
    />
  );
}
