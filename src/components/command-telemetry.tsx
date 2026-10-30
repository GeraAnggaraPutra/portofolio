"use client";

import { useState } from "react";
import { Check, ChevronRight, ShieldAlert, TrendingUp, Unplug } from "lucide-react";
import { gameReducer, upgrades, waves, type Game } from "@/lib/incident-game";

export function CommandTelemetry({ game }: { game: Game }) {
  const [inspected, setInspected] = useState<number | null>(null);
  const index = inspected ?? game.round;
  const forecast = waves[index];
  const preview = game.phase === "plan" ? gameReducer(game, { type: "run" }) : game;
  const report = preview.reports.at(-1);
  const points = waves.map((wave, i) => `${28 + i * 92},${154 - wave.demand * .7}`).join(" ");
  const served = game.reports.map((wave, i) => `${28 + i * 92},${154 - wave.served * .7}`).join(" ");

  return <div className="mb-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1522] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h3 className="mono text-xs uppercase tracking-widest text-cyan-100">Campaign radar</h3><span className="text-xs text-zinc-500">Tap a wave to inspect</span></div>
      <svg viewBox="0 0 700 180" className="mt-4 w-full" role="img" aria-label="Demand rises from 45 to 175 requests across eight waves. Cyan shows the requests you actually served.">
        {[49, 84, 119, 154].map(y => <path key={y} d={`M20 ${y}H680`} stroke="#ffffff" strokeOpacity=".06" strokeDasharray="3 6" />)}
        <polygon points={`28,154 ${points} 672,154`} fill="#fbbf24" fillOpacity=".045" />
        <polyline points={points} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 5" />
        <polyline points={served} fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinejoin="round" />
        {waves.map((wave, i) => <g key={wave.name}><circle cx={28 + i * 92} cy={154 - wave.demand * .7} r={index === i ? 6 : 3} fill={index === i ? "#fef3c7" : "#fbbf24"} /><text x={28 + i * 92} y="175" textAnchor="middle" fill="#94a3b8" fontSize="11">0{i + 1}</text></g>)}
        {game.reports.map((wave, i) => <circle key={wave.wave} cx={28 + i * 92} cy={154 - wave.served * .7} r="4" fill="#67e8f9" />)}
      </svg>
      <div className="mb-5 flex gap-5 text-[0.65rem] text-zinc-400"><span><span className="text-amber-300">––</span> Demand forecast</span><span><span className="text-cyan-200">━</span> Actually served</span></div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="group" aria-label="Inspect campaign waves">{waves.map((wave, i) => {
        const Icon = i < game.reports.length ? Check : wave.event === "attack" ? ShieldAlert : wave.event === "outage" ? Unplug : TrendingUp;
        return <button key={wave.name} type="button" aria-label={`Wave ${i + 1}: ${wave.name}, ${wave.demand} requests, ${wave.event}`} aria-pressed={index === i} onClick={() => setInspected(i)} className={`flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl border text-xs transition-colors focus-visible:outline-2 focus-visible:outline-cyan-200 ${index === i ? "border-cyan-200/50 bg-cyan-200/10 text-cyan-100" : "border-white/10 text-slate-400 hover:bg-white/5"}`}><Icon size={15} /><span className="mono">0{i + 1}</span></button>;
      })}</div>
      <div className="mt-4 min-h-24 rounded-xl bg-black/20 p-4" aria-live="polite"><p className="text-sm font-medium text-white">{forecast.name} <span className="ml-2 text-cyan-200">{forecast.demand} req</span></p><p className="mt-2 text-xs leading-6 text-slate-400">{forecast.brief}</p>{inspected !== null && inspected !== game.round && <button type="button" onClick={() => setInspected(null)} className="mt-2 inline-flex min-h-10 items-center text-xs text-cyan-200">Back to current wave <ChevronRight size={14} /></button>}</div>
    </div>
    <div className="relative overflow-hidden rounded-3xl border border-cyan-200/15 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,.10),transparent_70%)] p-5 sm:p-7">
      <p className="mono text-xs uppercase tracking-widest text-cyan-200">{game.phase === "plan" ? "Decision preview" : "Post-wave telemetry"}</p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{game.phase === "plan" ? "See the impact. Then commit." : preview.health === 0 ? "Recovery starts with a better plan." : "Your decisions, measured."}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{game.phase === "plan" ? "Select an investment below. This forecast uses the same rules as the simulation." : "Review the outcome, then use the radar to prepare for what comes next."}</p>
      <p className="mt-4 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/5 px-3 py-2 text-xs text-cyan-100">{game.phase === "plan" ? `Selected: ${upgrades[game.selected].name}` : report?.action}</p>
      <div className="my-6 grid grid-cols-[100px_1fr] items-center gap-5" aria-live="polite" aria-atomic="true">
        <div className="relative h-25 w-25"><svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true"><circle cx="50" cy="50" r="43" fill="none" stroke="#ffffff10" strokeWidth="5" /><circle cx="50" cy="50" r="43" fill="none" stroke={preview.health > 40 ? "#67e8f9" : "#fda4af"} strokeWidth="5" strokeLinecap="round" strokeDasharray="270.18" strokeDashoffset={270.18 * (1 - preview.health / 100)} className="transition-[stroke-dashoffset] duration-500" /></svg><span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums text-white">{preview.health}<span className="text-xs text-slate-500">%</span></span></div>
        <div><p className="text-sm text-white">{game.phase === "plan" ? "Projected health" : "Service health"}</p><p className={`mt-2 text-xs leading-6 ${report?.damage ? "text-amber-200" : "text-emerald-300"}`}>{report?.damage ? `${report.damage} damage this wave` : "No damage this wave"}</p><p className="text-xs leading-6 text-slate-500">{preview.credits} credits after wave</p></div>
      </div>
      <div className="space-y-3 border-t border-white/10 pt-5 text-xs">{[["Requests served", `${report?.served ?? 0} / ${waves[game.round].demand}`], ["Overload damage", report?.overloadDamage ?? 0], ["Incident damage", report?.incidentDamage ?? 0]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><span className="text-slate-400">{label}</span><span className="mono text-cyan-100">{value}</span></div>)}</div>
    </div>
  </div>;
}
