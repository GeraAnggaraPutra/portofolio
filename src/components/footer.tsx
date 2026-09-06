import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="container-x pb-10">
      <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-zinc-500">
          <span className="text-zinc-300 font-medium">Gera Anggara Putra</span>
          <span className="mx-2 text-amber-500/40">·</span>
          Backend systems made visible.
        </p>
        <a
          href="#home"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-950/20 px-4 py-2 text-amber-300/70 transition hover:border-amber-500/40 hover:text-amber-200"
        >
          Back to top
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}
