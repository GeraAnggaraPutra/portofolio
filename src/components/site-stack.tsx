import { Code2 } from "lucide-react";
import { siteStack } from "@/data/portfolio";
import { Reveal } from "./reveal";

export function SiteStack() {
  return (
    <section className="container-x pb-16 pt-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-violet-500/20 bg-violet-950/20 text-violet-400">
                <Code2 size={16} />
              </div>
              <div>
                <p className="mono text-[0.58rem] uppercase tracking-[0.18em] text-zinc-600">
                  {siteStack.eyebrow}
                </p>
                <p className="mt-0.5 text-sm font-medium text-white">{siteStack.title}</p>
              </div>
            </div>

            <p className="text-xs leading-5 text-zinc-500 sm:max-w-sm sm:text-right">
              {siteStack.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {siteStack.stack.map((tech) => (
                <span
                  key={tech}
                  className="mono rounded-md border border-violet-500/15 bg-violet-950/15 px-2 py-0.5 text-[0.62rem] text-violet-400/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
