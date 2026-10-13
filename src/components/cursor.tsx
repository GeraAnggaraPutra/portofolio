"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Particle = { x: number; y: number; vx: number; vy: number; born: number; r: number };

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    document.documentElement.style.cursor = "none";

    // Canvas setup
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // GSAP cursor
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

    // Particle system
    const particles: Particle[] = [];
    const LIFE = 650;

    let raf = 0;
    const drawParticles = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.born;
        if (age > LIFE) { particles.splice(i, 1); continue; }
        const t = age / LIFE;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // slight gravity
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 - t * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${(1 - t) * 0.65})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(drawParticles);
    };
    raf = requestAnimationFrame(drawParticles);

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      // Emit 2 particles per move
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 1.2) * 1.4,
          born: performance.now(),
          r: 1.5 + Math.random() * 2,
        });
      }
    };

    // Click ripple — DOM-based
    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      Object.assign(ripple.style, {
        position: "fixed",
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        width: "6px",
        height: "6px",
        transform: "translate(-50%, -50%) scale(1)",
        borderRadius: "50%",
        border: "1.5px solid rgba(251,191,36,0.7)",
        pointerEvents: "none",
        zIndex: "9997",
        transition: "transform 0.55s cubic-bezier(0.2,0,0.4,1), opacity 0.55s ease",
      });
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(28)";
        ripple.style.opacity = "0";
      });
      setTimeout(() => ripple.remove(), 600);
    };

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

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.22 });
    const onEnterDoc = () => gsap.to([dot, ring], { opacity: 1, duration: 0.22 });

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnterDoc);

    return () => {
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnterDoc);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 9998 }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 7, height: 7, background: "rgba(251,191,36,0.95)", boxShadow: "0 0 12px rgba(251,191,36,0.7)" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 36, height: 36, border: "1.5px solid rgba(251,191,36,0.35)" }}
      />
    </>
  );
}
