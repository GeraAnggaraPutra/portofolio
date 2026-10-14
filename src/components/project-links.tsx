import { ArrowUpRight, Globe2 } from "lucide-react";
import type { Project } from "@/data/portfolio";

type ProjectLink = NonNullable<Project["links"]>[number];

const labels = {
  web: "Website",
  playstore: "Google Play",
  appstore: "App Store",
} as const;

function PlatformIcon({ platform }: { platform: ProjectLink["platform"] }) {
  if (platform === "web") return <Globe2 size={15} aria-hidden="true" />;
  if (platform === "playstore") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 2.8v18.4L20 12 4.5 2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m4.5 2.8 10.2 12.5M4.5 21.2 14.7 8.7" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 4.5 17 20M16.5 4.5 7 20M5 16h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

export function ProjectLinks({ links, projectTitle }: { links?: Project["links"]; projectTitle: string }) {
  if (!links?.length) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label={`${projectTitle} links`}>
      {links.map(({ platform, href }) => (
        <a
          key={platform}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${projectTitle} on ${labels[platform]} (new tab)`}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-zinc-300 transition-colors hover:border-amber-400/45 hover:bg-amber-400/10 hover:text-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          <PlatformIcon platform={platform} />
          {labels[platform]}
          <ArrowUpRight size={12} className="text-zinc-500" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
