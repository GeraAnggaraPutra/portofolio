"use client";

import { useId, useState } from "react";
import { Globe2, ShieldCheck, Server, Database } from "lucide-react";
import { waves, type Game } from "@/lib/incident-game";

export function NetworkScene({ game }: { game: Game }) {
  const [selected, setSelected] = useState(2);
  const sceneId = useId().replace(/:/g, "");
  const wave = waves[game.round];
  const nodes = [
    { name: "Ingress", icon: Globe2, status: `${wave.demand} requests`, detail: "Incoming demand for this wave. Amber traffic is waiting for capacity; the forecast lets you prepare before committing." },
    { name: "Gateway", icon: ShieldCheck, status: game.shield ? "Shield active" : "Unprotected", detail: game.shield ? "Your gateway shield is installed. Attack events no longer cause incident damage." : "The gateway routes incoming traffic. Install a shield before an attack to avoid its additional damage." },
    { name: "Workers", icon: Server, status: `${game.capacity} capacity`, detail: `Your service can process ${game.capacity} requests per wave. Each new worker adds 25 capacity.${game.cache ? " The cache adds another 40 capacity." : " A cache can add 40 capacity once installed."}` },
    { name: "Upstream", icon: Database, status: game.breaker ? "Breaker ready" : "Direct connection", detail: game.breaker ? "The circuit breaker contains upstream failures. Outage events no longer cause incident damage." : "A failing upstream can damage service health. Install a circuit breaker to contain these incidents." },
  ];
  const healthy = game.health > 0;
  const pressure = wave.demand > game.capacity;
  const color = healthy ? "#67e8f9" : "#fb7185";
  const workerCount = 1 + Math.round((game.capacity - 60 - (game.cache ? 40 : 0)) / 25);

  return <div className="network-scene mb-6 overflow-hidden rounded-3xl border border-cyan-200/15 bg-[#060d17]">
    <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5 sm:px-7"><p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-cyan-200">Infrastructure / inspect a node</p><span className={`mono text-[0.6rem] uppercase tracking-widest ${healthy ? "text-emerald-300" : "text-rose-300"}`}>{healthy ? game.phase === "plan" ? "Planning view" : "Wave resolved" : "Service offline"}</span></div>
    {[false, true].map(compact => {
      const uid = `${sceneId}-${compact ? "compact" : "wide"}`;
      return <svg key={uid} viewBox={compact ? "0 0 440 540" : "0 0 800 300"} className={compact ? "network-map-compact w-full" : "network-map-wide w-full"} role="img" aria-label={`Network diagram: ingress to gateway to ${workerCount} workers to upstream. ${game.cache ? "Cache installed." : "Cache not installed."}`}>
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#21384b" /><stop offset="1" stopColor="#0c1522" /></linearGradient>
        <radialGradient id={`${uid}-halo`}><stop stopColor={color} stopOpacity=".19" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
        <pattern id={`${uid}-grid`} width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .35 -1 .35 400 75)"><path d="M36 0H0V36" fill="none" stroke="#67e8f9" strokeOpacity=".1" /></pattern>
      </defs>
      <ellipse cx="400" cy="175" rx="330" ry="95" fill="none" stroke="#67e8f9" strokeOpacity=".08" strokeDasharray="5 9" />
      <ellipse cx="400" cy="175" rx="265" ry="73" fill="none" stroke="#67e8f9" strokeOpacity=".08" />
      <rect width="800" height={compact ? 560 : 300} fill={`url(#${uid}-grid)`} />
      <ellipse cx={compact ? 220 : 420} cy={compact ? 270 : 180} rx={compact ? 250 : 340} ry={compact ? 260 : 130} fill={`url(#${uid}-halo)`} />
      <path d={compact ? "M110 195H330V420H110" : "M110 195H690"} fill="none" stroke="#203b50" strokeWidth="3" />
      <path key={`${game.round}-${game.phase}`} d={compact ? "M110 195H330V420H110" : "M110 195H690"} fill="none" stroke={pressure ? "#fcd34d" : color} strokeWidth="2" strokeDasharray="5 18" className={game.phase !== "plan" && healthy ? "network-signal" : ""} />
      {[110, 300, 490, 680].map((x, index) => <g key={x} transform={compact ? `translate(${(index === 0 || index === 3 ? 110 : 330) - x} ${index > 1 ? 225 : 0})` : undefined}>
        {index === 2 && Array.from({ length: Math.min(workerCount - 1, 7) }, (_, n) => <g key={n} transform={`translate(${(n + 1) * 7} ${-(n + 1) * 6})`} opacity={.5 - n * .04}><path d={`M${x - 43} 115L${x} 95L${x + 43} 115V183L${x} 205L${x - 43} 183Z`} fill="#102438" stroke="#67e8f9" strokeOpacity=".45" /></g>)}
        {index === 1 && game.shield && <ellipse cx={x} cy="150" rx="58" ry="70" fill="#34d399" fillOpacity=".035" stroke="#6ee7b7" strokeOpacity=".5" strokeDasharray="5 4" />}
        <ellipse cx={x} cy="207" rx="66" ry="21" fill={selected === index ? color : "#22394c"} opacity={selected === index ? ".15" : ".18"} />
        <path d={`M${x - 43} 115L${x} 95L${x + 43} 115V183L${x} 205L${x - 43} 183Z`} fill={`url(#${uid}-metal)`} stroke={selected === index ? color : "#355469"} strokeWidth={selected === index ? "1.5" : "1"} />
        <path d={`M${x - 43} 115L${x} 136L${x + 43} 115M${x} 136V205`} fill="none" stroke="#416278" />
        {[0, 1, 2].map(row => <g key={row}><path d={`M${x + 9} ${149 + row * 15}l25 -12`} stroke="#496577" strokeWidth="3" strokeLinecap="round" /><circle cx={x - 28} cy={140 + row * 15} r="2.5" fill={healthy ? index === 1 && !game.shield ? "#fcd34d" : color : "#fb7185"} /></g>)}
        <text x={x} y="67" textAnchor="middle" fill={selected === index ? "#cffafe" : "#94a3b8"} fontSize="13" fontFamily="monospace" letterSpacing="2">{nodes[index].name.toUpperCase()}</text>
        <text x={x} y="239" textAnchor="middle" fill="#718a9f" fontSize="12" fontFamily="monospace">{index === 2 ? `${workerCount} WORKER${workerCount > 1 ? "S" : ""}` : index === 0 ? `${wave.demand} REQUESTS` : index === 1 ? game.shield ? "PROTECTED" : "OPEN" : game.breaker ? "ISOLATED" : "DIRECT"}</text>
      </g>)}
      {game.cache && (compact ? <g><path d="M330 430V485" fill="none" stroke="#67e8f9" strokeOpacity=".5" strokeDasharray="4 5" /><rect x="280" y="485" width="100" height="28" rx="8" fill="#102d35" stroke="#67e8f9" strokeOpacity=".4" /><text x="330" y="503" textAnchor="middle" fill="#a5f3fc" fontSize="12" fontFamily="monospace">CACHE +40</text></g> : <g><path d="M490 205V270H576" fill="none" stroke="#67e8f9" strokeOpacity=".5" strokeDasharray="4 5" /><rect x="576" y="256" width="98" height="28" rx="8" fill="#102d35" stroke="#67e8f9" strokeOpacity=".4" /><text x="625" y="274" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontFamily="monospace">CACHE +40</text></g>)}
    </svg>; })}
    <div className="network-node-controls grid grid-cols-2 gap-2 px-4 sm:px-7" role="group" aria-label="Inspect infrastructure components">{nodes.map((node, i) => <button type="button" key={node.name} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`flex min-h-16 min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${selected === i ? "border-cyan-200/40 bg-cyan-200/10" : "border-white/10 hover:bg-white/5"}`}><node.icon className="shrink-0 text-cyan-200" size={18} /><span className="min-w-0 break-words"><span className="block text-xs font-semibold text-white">{node.name}</span><span className="mt-1 block text-[0.65rem] text-zinc-400">{node.status}</span></span></button>)}</div>
    <p className="min-h-24 px-5 py-5 text-sm leading-6 text-zinc-400 sm:px-7" aria-live="polite">{nodes[selected].detail}</p>
  </div>;
}
