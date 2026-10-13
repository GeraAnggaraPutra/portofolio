"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(text);
  const ran = useRef(false);

  useEffect(() => {
    if (!inView || ran.current) return;
    ran.current = true;
    const frames = 28;
    let f = 0;
    const id = setInterval(() => {
      f++;
      const resolved = Math.floor((f / frames) * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < resolved) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      if (f >= frames) { setDisplay(text); clearInterval(id); }
    }, 38);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
