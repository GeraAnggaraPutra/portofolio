"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & Pick<MotionProps, "viewport">;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  viewport = { once: true, margin: "-40px" },
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
