"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Activity, ArrowRight, Database, HeartPulse, Radio, RotateCcw, Server, ShieldCheck, Wallet, Zap } from "lucide-react";
import { gameReducer, newGame, unavailable, upgrades, waves, type Upgrade } from "@/lib/incident-game";
import { NetworkScene } from "./network-scene";
import { CommandTelemetry } from "./command-telemetry";

const icons = { server: Server, cache: Database, shield: ShieldCheck, breaker: Zap, repair: HeartPulse, hold: Wallet };
const buttonStyle = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300";

export function IncidentLab() {
  const [game, dispatch] = useReducer(gameReducer, undefined, newGame);
  const [started, setStarted] = useState(false);
  const decisionHeading = useRef<HTMLHeadingElement>(null);
  const reportPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!started) return;
    const target = game.phase === "plan" ? decisionHeading.current : reportPanel.current;
    target?.focus({ preventScroll: true });
  }, [started, game.phase, game.round]);
  const wave = waves[game.round];
  const report = game.reports.at(-1);
  const total = game.reports.reduce((sum, item) => sum + item.served, 0);
  const demand = game.reports.reduce((sum, item) => sum + item.demand, 0);
  const coverage = demand ? Math.round(total / demand * 100) : 100;
  const projected = game.capacity + (game.selected === "server" ? 25 : game.selected === "cache" ? 40 : 0);
  const finished = game.phase === "finished";
  const preview = game.phase === "plan" ? gameReducer(game, { type: "run" }) : game;

  return (
    <section id="lab" className="container-x py-20 sm:py-28" aria-labelledby="lab-title">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
        <div><p className="mono text-xs uppercase tracking-[0.23em] text-cyan-300">Playable experience / 08 waves</p><h2 id="lab-title" className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">Keep the system <span className="text-cyan-200">alive.</span></h2></div>
        <p className="max-w-sm text-sm leading-7 text-zinc-400">Build capacity. Protect the gateway. Survive the surge. A strategy game about the decisions behind reliable systems.</p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-[#080f19] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_0%,rgba(34,211,238,0.12),transparent_60%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-8"><span className="mono flex items-center gap-3 text-xs tracking-[0.18em] text-cyan-200"><Radio size={17} /> SYSTEMS / COMMAND</span><span className="mono text-[0.65rem] uppercase tracking-widest text-zinc-400">{!started ? "Awaiting operator" : finished ? "Mission debrief" : `Wave ${game.round + 1} of ${waves.length}`}</span></div>

        {!started ? <div className="relative grid gap-6 p-4 sm:gap-10 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
          <div><p className="mono text-xs uppercase tracking-widest text-cyan-300">You are the engineer on call.</p><h3 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">One service.<br />A growing city of requests.</h3><p className="mt-6 max-w-lg text-base leading-8 text-zinc-400">Make one investment before each wave. Workers and cache increase capacity; shields and circuit breakers protect against incidents. Keep health above zero through all eight waves.</p><button type="button" onClick={() => setStarted(true)} className={`${buttonStyle} mt-8 bg-cyan-200 text-slate-950 hover:bg-cyan-100`}>Start your shift <ArrowRight size={17} /></button><p className="mt-4 text-xs leading-6 text-zinc-500">No timer. No account. All progress stays in this visit.</p></div>
          <div className="self-center"><NetworkScene game={game} /><div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"><p className="mono text-xs tracking-widest text-zinc-400">MISSION BRIEF</p><div className="mt-6 grid grid-cols-2 gap-4">{[["75", "starting credits"], ["100", "service health"], ["22", "credits after each wave"], ["08", "waves to survive"]].map(([value, label]) => <div key={label} className="border-b border-white/10 pb-4"><p className="text-3xl font-semibold text-cyan-100">{value}</p><p className="mt-2 text-xs text-zinc-400">{label}</p></div>)}</div><p className="mt-6 text-sm leading-7 text-zinc-400">Every 2 requests above capacity cost about 1 health. Unprotected attacks cost 18 health; upstream incidents cost 20. All figures are simplified game rules.</p></div></div>
        </div> : <div className="relative p-3 sm:p-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Service health", `${game.health}%`, HeartPulse], ["Credits", String(game.credits), Wallet], ["Capacity", String(game.capacity), Server], ["Traffic served", `${coverage}%`, Activity]].map(([label, value, Icon]) => { const MetricIcon = Icon as typeof Activity; return <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-center justify-between gap-2 text-zinc-400"><p className="text-xs">{String(label)}</p><MetricIcon size={15} /></div><p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{String(value)}</p></div>; })}</div>
          <div className="my-6 flex gap-1.5" aria-label={`${game.reports.length} waves completed`}>{waves.map((item, i) => <span title={item.name} key={item.name} className={`h-1.5 flex-1 rounded-full ${i < game.reports.length ? "bg-cyan-300" : i === game.round ? "bg-amber-300" : "bg-white/10"}`} />)}</div>

          <NetworkScene game={game} />
          {game.phase !== "plan" && report && <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-4" aria-label="Latest wave damage breakdown">
            {[["Unserved", report.demand - report.served], ["Overload damage", report.overloadDamage], ["Incident damage", report.incidentDamage]].map(([label, value]) => <div key={label} className="text-center"><p className="mono text-lg text-amber-200">{value}</p><p className="mt-1 text-[0.65rem] leading-5 text-zinc-400">{label}</p></div>)}
          </div>}
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-7">
              <p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-cyan-300">{finished ? "Shift ended" : `${wave.event === "normal" ? "Traffic forecast" : "Incident forecast"} / ${wave.event}`}</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{finished ? game.health > 0 ? "You held the line." : "The service went down." : wave.name}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{finished ? `${game.reports.length} waves resolved. ${total} of ${demand} requests served. Try a different investment order to improve your result.` : wave.brief}</p>
              <div className="my-7 space-y-4" aria-label="Traffic and capacity comparison">{[["Incoming traffic", wave.demand, "bg-amber-300"], [game.phase === "plan" ? "Capacity after selection" : "Available capacity", game.phase === "plan" ? projected : game.capacity, "bg-cyan-300"]].map(([label, value, color]) => <div key={String(label)}><div className="mb-2 flex justify-between text-xs text-zinc-300"><span>{label}</span><span className="mono">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full transition-[width] duration-300 ${color}`} style={{ width: `${Math.min(100, Number(value) / 220 * 100)}%` }} /></div></div>)}</div>
              <div className="grid grid-cols-3 gap-2">{[["Cache", game.cache, Database], ["Shield", game.shield, ShieldCheck], ["Breaker", game.breaker, Zap]].map(([name, installed, Icon]) => { const NodeIcon = Icon as typeof Database; return <div key={String(name)} className={`rounded-xl border p-3 text-center ${installed ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200" : "border-white/10 text-zinc-500"}`}><NodeIcon className="mx-auto" size={20} /><p className="mt-2 text-xs">{String(name)}</p><p className="mt-1 text-[0.6rem]">{installed ? "ONLINE" : "OFFLINE"}</p></div>; })}</div>
            </div>

            <div>
              {game.phase === "plan" ? <><div className="mb-4 flex items-center justify-between"><h3 ref={decisionHeading} tabIndex={-1} className="text-lg font-semibold text-white focus-visible:outline-2 focus-visible:outline-cyan-200">Choose your investment</h3><span className="text-xs text-zinc-500">One per wave</span></div><div className="grid grid-cols-2 gap-2">{(Object.keys(upgrades) as Upgrade[]).map(key => { const item = upgrades[key]; const Icon = icons[key]; const reason = unavailable(game, key); return <button key={key} type="button" disabled={!!reason} aria-pressed={game.selected === key} onClick={() => dispatch({ type: "select", upgrade: key })} className={`min-h-32 min-w-0 rounded-2xl border p-3 text-left sm:p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:opacity-45 ${game.selected === key ? "border-cyan-200/60 bg-gradient-to-br from-cyan-200/20 to-cyan-900/20 shadow-[inset_0_1px_0_rgba(165,243,252,0.15)]" : "border-white/10 bg-white/[0.025] enabled:hover:bg-white/[0.06]"}`}><div className="flex items-center justify-between gap-2"><Icon size={18} className="text-cyan-200" /><span className="mono text-xs text-zinc-400">{item.cost} cr</span></div><p className="mt-3 text-sm font-semibold text-white">{item.name}</p><p className="mt-1 text-xs leading-5 text-zinc-400">{reason ?? item.description}</p></button>; })}</div><div className="mt-4 flex flex-wrap justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs" aria-live="polite"><span className="text-zinc-400">After this wave</span><span className={preview.health > 40 ? "text-cyan-200" : "text-rose-300"}>{preview.health}% health · {preview.credits} credits</span></div><button type="button" onClick={() => dispatch({ type: "run" })} className={`${buttonStyle} mt-5 w-full bg-cyan-200 text-slate-950 hover:bg-cyan-100`}>Commit & run wave {game.round + 1}<ArrowRight size={17} /></button></> : <div ref={reportPanel} tabIndex={-1} key={game.round} className="command-reveal focus-visible:outline-2 focus-visible:outline-cyan-200 rounded-3xl border border-cyan-200/20 bg-cyan-200/[0.045] p-6 sm:p-8" role="status"><p className="mono text-xs uppercase tracking-widest text-cyan-200">Wave report</p><h3 className="mt-4 text-2xl font-semibold text-white">{report?.damage === 0 ? "All systems steady." : `${report?.damage} health lost.`}</h3><p className="mt-4 text-sm leading-7 text-zinc-300">{report?.action === "Hold budget" ? "Budget saved" : `${report?.action} deployed`}. Served {report?.served} of {report?.demand} requests. {report?.protected ? "No unprotected incident damage." : "An unprotected incident caused additional damage."} Earned 22 credits.</p><p className="mt-4 text-sm leading-7 text-zinc-400">{finished ? game.health > 0 ? "Campaign complete. Capacity, defense, and recovery kept your service running." : "Use the forecast to prepare defenses before incidents and grow capacity before the peak." : "Your upgrades carry forward. Review the next forecast before committing another investment."}</p><button type="button" onClick={() => dispatch({ type: finished ? "reset" : "next" })} className={`${buttonStyle} mt-6 bg-cyan-200 text-slate-950 hover:bg-cyan-100`}>{finished ? <RotateCcw size={16} /> : <ArrowRight size={16} />}{finished ? "Play a new campaign" : "Plan next wave"}</button></div>}
            </div>
          </div>
          <div className="mt-6"><CommandTelemetry game={game} /></div>
          {game.reports.length > 0 && <details className="mt-6 rounded-2xl border border-white/10 px-5 py-4"><summary className="cursor-pointer text-sm font-medium text-zinc-300">Mission log · {game.reports.length} resolved waves</summary><ol className="mt-4 divide-y divide-white/10">{game.reports.map((item, i) => <li key={item.wave} className="flex flex-wrap justify-between gap-2 py-3 text-xs leading-6 text-zinc-400"><span>{i + 1}. {item.wave} · {item.action}</span><span>{item.served}/{item.demand} served · −{item.damage} health</span></li>)}</ol></details>}
          <p className="mt-5 text-xs leading-6 text-zinc-500">Illustrative strategy simulation. Capacity, credits, and damage are game mechanics, not production benchmarks.</p>
        </div>}
      </div>
    </section>
  );
}
