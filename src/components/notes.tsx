import { notes } from "@/data/portfolio";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

// Semantic tints: idempotency=amber, caching=emerald, observability=sky, testing=violet
const noteTint = [
  { icon: "text-amber-400",   border: "border-amber-500/20 hover:border-amber-500/40",   bar: "bg-amber-400",   bg: "bg-amber-900/15 hover:bg-amber-900/25" },
  { icon: "text-emerald-400", border: "border-emerald-500/20 hover:border-emerald-500/40", bar: "bg-emerald-400", bg: "bg-emerald-900/15 hover:bg-emerald-900/25" },
  { icon: "text-sky-400",     border: "border-sky-500/20 hover:border-sky-500/40",       bar: "bg-sky-400",     bg: "bg-sky-900/15 hover:bg-sky-900/25" },
  { icon: "text-violet-400",  border: "border-violet-500/20 hover:border-violet-500/40", bar: "bg-violet-400",  bg: "bg-violet-900/15 hover:bg-violet-900/25" },
];

export function TechnicalNotes() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Technical notes"
        title="Things worth writing about."
        description="Topics pulled from real systems — payroll, caching, observability, testing. Not blog-post fluff, actual patterns from production."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note, index) => {
          const Icon = note.icon;
          const tint = noteTint[index % noteTint.length];
          return (
            <Reveal key={note.title} delay={index * 0.07}>
              <article className={`group relative overflow-hidden rounded-[2rem] border p-6 transition ${tint.border} ${tint.bg}`}>
                {/* Subtle left accent bar */}
                <div className={`absolute left-0 top-6 h-10 w-0.5 rounded-r-full ${tint.bar} opacity-40 transition-opacity group-hover:opacity-100`} />
                <Icon className={tint.icon} size={22} />
                <h3 className="mt-5 text-xl font-semibold text-white">{note.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{note.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
