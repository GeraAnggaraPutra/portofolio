"use client";

import { useId, useState, type CSSProperties } from "react";
import type { Game } from "@/lib/incident-game";

export function ServerCabinet({ game }: { game: Game }) {
  const controlId = useId();
  const [angle, setAngle] = useState(-28);
  const [open, setOpen] = useState<number | null>(null);
  const modules = [
    { name: "Gateway", value: game.shield ? "Shield installed" : "Routing active", detail: "The gateway receives requests. Install a shield in the game to prevent attack damage." },
    { name: "Compute", value: `${game.capacity} capacity`, detail: "Workers process incoming requests. Capacity increases when you invest in workers or cache." },
    { name: "Cache", value: game.cache ? "Online / +40 capacity" : "Awaiting installation", detail: "Cache contributes 40 capacity once installed. This tray reflects your actual campaign upgrade." },
    { name: "Upstream", value: game.breaker ? "Circuit breaker ready" : "Direct connection", detail: "A circuit breaker prevents dependency incidents from damaging service health." },
  ];
  return <div className="cabinet-card mb-6 rounded-3xl border border-cyan-200/20 p-4 sm:p-6">
    <div className="flex flex-wrap justify-between gap-2"><p className="mono text-xs uppercase tracking-widest text-cyan-200">Fig. 01 / Inside the machine</p><span className="text-xs text-slate-400">Interactive 3D cabinet</span></div>
    <div className="cabinet-stage">
      <div className="cabinet-body" style={{ "--cabinet-angle": `${angle}deg` } as CSSProperties}>
        <div className="cabinet-side cabinet-left" /><div className="cabinet-side cabinet-right" /><div className="cabinet-top" /><div className="cabinet-back" />
        <div className="cabinet-front">
          <div className="cabinet-badge">SYSTEMS / COMMAND</div>
          {modules.map((module, i) => <button key={module.name} type="button" className="cabinet-module" aria-pressed={open === i} aria-label={`Inspect ${module.name}: ${module.value}`} onClick={() => setOpen(open === i ? null : i)} style={{ transform: `translateZ(${open === i ? 58 : 0}px)` }}>
            <span className="cabinet-tray" aria-hidden="true" />
            <span className="cabinet-module-face"><span className="cabinet-screw" /><span className="cabinet-grip" /><span className="cabinet-vents" aria-hidden="true">{Array.from({length: 8}, (_, n) => <i key={n} />)}</span><span className="cabinet-led" style={{ background: game.health === 0 ? "#fb7185" : i === 2 && !game.cache ? "#475569" : "#a5f3fc" }} /><span className="cabinet-screw" /></span>
          </button>)}
          <div className="cabinet-meter"><span style={{ width: `${game.health}%` }} /></div>
          <div className="cabinet-foot cabinet-foot-left" /><div className="cabinet-foot cabinet-foot-right" />
        </div>
      </div>
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      <div><label htmlFor={controlId} className="flex justify-between text-xs text-slate-300">Rotate cabinet <span className="mono">{angle}°</span></label><input id={controlId} aria-label="Rotate cabinet" type="range" min="-55" max="55" value={angle} onChange={e => setAngle(Number(e.target.value))} className="mt-3 h-8 w-full accent-cyan-200" /><button type="button" className="min-h-10 text-xs text-cyan-200" onClick={() => { setAngle(-28); setOpen(null); }}>Reset view</button></div>
      <div className="min-h-24 rounded-xl border border-white/10 bg-black/20 p-4" aria-live="polite"><p className="text-sm font-medium text-cyan-100">{open === null ? "Tap a server tray to inspect" : `${modules[open].name} · ${modules[open].value}`}</p><p className="mt-2 text-xs leading-6 text-slate-400">{open === null ? "Pull out a module, rotate the cabinet, and explore the hardware behind your campaign. Use the investment controls below to upgrade it." : modules[open].detail}</p></div>
    </div>
  </div>;
}
