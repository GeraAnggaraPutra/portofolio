import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mono mb-3 text-xs font-medium uppercase tracking-[0.24em] text-amber-400">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
