"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate as fmAnimate } from "framer-motion";
import { X, Briefcase, GraduationCap, Play, Square } from "lucide-react";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

/* ─── Island paths ───────────────────────────────────────────── */

// Java — more detailed coastline
const JAVA_PATH = `
  M 65,252
  C 80,236 102,216 128,202
  C 148,191 158,184 172,182
  L 182,181
  C 196,184 218,193 252,198
  C 288,203 328,202 370,198
  C 408,195 448,192 490,191
  C 530,191 565,194 598,196
  C 622,197 645,200 668,207
  C 694,214 722,220 755,225
  C 790,231 828,237 865,242
  C 900,248 936,256 968,263
  C 998,270 1025,277 1050,285
  L 1068,294
  C 1064,310 1050,322 1028,326
  C 1004,330 978,322 950,314
  C 918,306 882,302 844,299
  C 805,296 765,294 724,293
  C 682,292 640,292 598,293
  C 555,294 512,296 470,298
  C 428,301 386,304 345,307
  C 305,310 264,310 228,307
  C 196,304 168,296 145,286
  C 118,274 88,260 72,253
  Z
`;

// Madura island (northeast of Surabaya)
const MADURA_PATH = `
  M 878,210
  C 892,198 918,189 952,186
  C 978,184 1005,189 1018,200
  L 1016,213
  C 1000,221 970,226 942,224
  C 914,222 890,218 878,210
  Z
`;

// Bali silhouette (far right, partially visible)
const BALI_PATH = `
  M 1082,308
  C 1090,300 1105,296 1120,298
  C 1132,300 1140,308 1136,318
  C 1130,326 1115,330 1100,327
  C 1088,324 1080,316 1082,308
  Z
`;

/* ─── Career stops ───────────────────────────────────────────── */

const stops = [
  {
    id: "smk",
    city: "Bandung",
    name: "SMK Assalaam Bandung",
    role: "Rekayasa Perangkat Lunak",
    period: "Jun 2020 – Jun 2023",
    type: "education" as const,
    x: 272, y: 278,
    accent: "emerald" as const,
    summary: "Foundation years. Learned Laravel, PHP, and MySQL from scratch. Built the Car Rental System as first full-stack project with a team of two.",
    stack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap"],
  },
  {
    id: "plabs",
    city: "Bandung",
    name: "PLABS.ID",
    role: "Intern → Junior SE → Software Engineer",
    period: "May 2023 – May 2025",
    type: "work" as const,
    x: 252, y: 258,
    accent: "sky" as const,
    summary: "Progressed through three roles in two years. Delivered backend systems across HRIS, travel, inventory, and company platforms. Mentored vocational school interns to functional Go CRUD APIs with JWT auth in 3 months.",
    stack: ["Go", "PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "GCS", "FCM"],
  },
  {
    id: "nusapala",
    city: "Jakarta",
    name: "PT Nusapala Berkah Autonomous",
    role: "Backend Developer",
    period: "Jul 2025 – Present",
    type: "work" as const,
    x: 185, y: 218,
    accent: "amber" as const,
    summary: "Design and develop scalable Go backend services for HRIS and parking platforms. Own the full backend lifecycle from FSD to API design, transactions, unit tests, and Docker deployment.",
    stack: ["Go", "PostgreSQL", "MySQL", "Redis", "Docker", "Grafana", "Loki", "Prometheus"],
  },
];

/* ─── Path geometry ─────────────────────────────────────────── */

const JOURNEY_D = `M ${stops[0].x},${stops[0].y} L ${stops[1].x},${stops[1].y} L ${stops[2].x},${stops[2].y}`;
const seg1  = Math.hypot(stops[1].x - stops[0].x, stops[1].y - stops[0].y);
const seg2  = Math.hypot(stops[2].x - stops[1].x, stops[2].y - stops[1].y);
const MID_T = seg1 / (seg1 + seg2);

/* ─── Accent colors ─────────────────────────────────────────── */

const C = {
  amber:   { stroke: "#f59e0b", fill: "rgba(251,191,36,0.18)",  pulse: "rgba(251,191,36,0.08)", text: "text-amber-400",   pill: "border-amber-500/25 bg-amber-950/40 text-amber-300/80" },
  sky:     { stroke: "#38bdf8", fill: "rgba(56,189,248,0.18)",   pulse: "rgba(56,189,248,0.08)",  text: "text-sky-400",     pill: "border-sky-500/25 bg-sky-950/40 text-sky-300/80" },
  emerald: { stroke: "#34d399", fill: "rgba(52,211,153,0.18)",   pulse: "rgba(52,211,153,0.08)",  text: "text-emerald-400", pill: "border-emerald-500/25 bg-emerald-950/40 text-emerald-300/80" },
};

/* ─── Map geo detail ─────────────────────────────────────────── */

const GEO_LABELS = [
  { name: "CIREBON",    x: 400, y: 188 },
  { name: "SEMARANG",   x: 608, y: 192 },
  { name: "YOGYAKARTA", x: 548, y: 300 },
  { name: "SURABAYA",   x: 866, y: 238 },
  { name: "MALANG",     x: 855, y: 313 },
];

// Volcanic mountain chain along Java's spine
const VOLCANOS = [
  { x: 225, y: 252, h: 9,  name: "G. Salak"   },
  { x: 390, y: 248, h: 7,  name: "G. Ciremai" },
  { x: 488, y: 252, h: 9,  name: "G. Slamet"  },
  { x: 552, y: 266, h: 10, name: "G. Merapi"  },
  { x: 680, y: 258, h: 8,  name: "G. Lawu"    },
  { x: 785, y: 264, h: 8,  name: "G. Wilis"   },
  { x: 870, y: 272, h: 10, name: "G. Semeru"  },
];

/* ─── Rail routes ────────────────────────────────────────────── */

type TrainWaypoint = { x: number; y: number; station?: string };

// Argo Parahyangan — Bandung→Jatinegara (Jakarta), winding mountain corridor
// Stops: Cimahi · Padalarang · Purwakarta · Karawang · Bekasi
const REGULAR_RAIL_WP: TrainWaypoint[] = [
  { x:252, y:258 },
  { x:247, y:262 },
  { x:244, y:265, station:"Cimahi" },
  { x:238, y:265 },
  { x:233, y:264, station:"Padalarang" },
  { x:226, y:261 },
  { x:221, y:259, station:"Purwakarta" },
  { x:213, y:253 },
  { x:206, y:247, station:"Karawang" },
  { x:199, y:238 },
  { x:194, y:231, station:"Bekasi" },
  { x:189, y:223 },
  { x:185, y:218 },
];
const REGULAR_RAIL_D = "M 252,258 C 247,268 236,268 224,261 C 214,255 207,246 200,237 C 193,228 188,223 185,218";

// Whoosh / KCJB — Halim (Jakarta)→Tegalluar (Bandung), dedicated HSR corridor
// Stops: Karawang · Padalarang
const WHOOSH_RAIL_WP: TrainWaypoint[] = [
  { x:185, y:218 },
  { x:193, y:225 },
  { x:205, y:234, station:"Karawang" },
  { x:218, y:243 },
  { x:228, y:248, station:"Padalarang" },
  { x:241, y:254 },
  { x:252, y:258 },
];
const WHOOSH_RAIL_D = "M 185,218 C 198,227 217,241 238,251 C 245,255 249,257 252,258";

/* ─── Vehicle icons ──────────────────────────────────────────── */

// All icons scaled to 0.5x — crisp at map scale, not oversize
// Regular kereta api — blue body, orange stripe
function TrainIcon() {
  return (
    <g transform="scale(0.5)">
      {/* exhaust trail */}
      <line x1="-18" y1="-2" x2="-30" y2="-2" stroke="rgba(200,200,200,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="-18" y1="0"  x2="-34" y2="0"  stroke="rgba(200,200,200,0.25)" strokeWidth="1.1" strokeLinecap="round"/>
      {/* body */}
      <rect x="-16" y="-5" width="30" height="10" rx="2" fill="#1e3a5f"/>
      {/* nose */}
      <path d="M 14,-5 Q 22,-5 22,0 Q 22,5 14,5 Z" fill="#1d4ed8"/>
      {/* orange stripe */}
      <rect x="-16" y="-1.5" width="38" height="3" fill="#e05c1a"/>
      {/* windows */}
      <rect x="-10" y="-4" width="4" height="3" rx="0.5" fill="#bae6fd" opacity="0.6"/>
      <rect x="-4"  y="-4" width="4" height="3" rx="0.5" fill="#bae6fd" opacity="0.6"/>
      <rect x="2"   y="-4" width="4" height="3" rx="0.5" fill="#bae6fd" opacity="0.6"/>
      {/* wheels */}
      <circle cx="-8" cy="6.5" r="2.5" fill="#4b5563"/>
      <circle cx="6"  cy="6.5" r="2.5" fill="#4b5563"/>
      {/* headlight */}
      <circle cx="21" cy="0" r="1.5" fill="#fef3c7" opacity="0.9"/>
    </g>
  );
}

// Whoosh (KCJB) — sleek dark body, gold nose
function WhooshIcon() {
  return (
    <g transform="scale(0.5)">
      {/* slipstream */}
      <line x1="-20" y1="-2" x2="-38" y2="-2" stroke="rgba(251,191,36,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="-20" y1="0"  x2="-42" y2="0"  stroke="rgba(251,191,36,0.35)" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="-20" y1="2"  x2="-36" y2="2"  stroke="rgba(251,191,36,0.18)" strokeWidth="0.7" strokeLinecap="round"/>
      {/* body */}
      <rect x="-20" y="-4" width="34" height="8" rx="1.5" fill="#1c1c2e"/>
      {/* pointed nose */}
      <path d="M 14,-4 L 28,0 L 14,4 Z" fill="#f59e0b"/>
      {/* gold stripe */}
      <rect x="-20" y="-1" width="34" height="2" fill="#f59e0b"/>
      {/* panoramic window */}
      <rect x="-16" y="-3" width="28" height="2" rx="0.3" fill="#0ea5e9" opacity="0.4"/>
      {/* wheels */}
      <circle cx="-10" cy="5" r="2" fill="#374151"/>
      <circle cx="4"   cy="5" r="2" fill="#374151"/>
      {/* headlight */}
      <circle cx="27" cy="0" r="1.8" fill="#fef9c3" opacity="0.9"/>
    </g>
  );
}

// Motorcycle — simple clean shape
function MotorcycleIcon() {
  return (
    <g transform="scale(0.5)">
      {/* dust trail */}
      <line x1="-10" y1="-1" x2="-20" y2="-1" stroke="rgba(251,191,36,0.5)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="-10" y1="2"  x2="-22" y2="2"  stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" strokeLinecap="round"/>
      {/* rear wheel */}
      <circle cx="-8" cy="5" r="5" fill="none" stroke="#52525b" strokeWidth="2"/>
      <circle cx="-8" cy="5" r="1.5" fill="#52525b"/>
      {/* front wheel */}
      <circle cx="10" cy="5" r="5" fill="none" stroke="#52525b" strokeWidth="2"/>
      <circle cx="10" cy="5" r="1.5" fill="#52525b"/>
      {/* frame */}
      <path d="M -8,0 L 2,-5 L 10,0" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M -8,0 L -12,-2 L -2,-5 L 2,-5" fill="#b45309" stroke="none"/>
      {/* fuel tank */}
      <rect x="-1" y="-3" width="9" height="4" rx="1.5" fill="#92400e"/>
      {/* fork */}
      <line x1="8" y1="-4" x2="10" y2="1" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      {/* handlebar */}
      <line x1="4" y1="-5" x2="10" y2="-5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      {/* rider helmet */}
      <circle cx="0" cy="-9" r="4" fill="#d4d4d8"/>
    </g>
  );
}

/* ─── Animated vehicle ───────────────────────────────────────── */

type VehicleState = {
  key: number;
  waypoints: TrainWaypoint[];
  vehicleType: "regular-train" | "whoosh" | "motorcycle";
};

const STATION_DWELL_MS = 1000; // 1s stop at each intermediate station

function AnimatedVehicle({
  v, onDone, onPosition,
}: {
  v: VehicleState;
  onDone: () => void;
  onPosition: (x: number, y: number) => void;
}) {
  const isTrain  = v.vehicleType !== "motorcycle";
  // base travel time (seconds) — stations add STATION_DWELL_MS each
  const baseDur  = isTrain ? 4.0 : 1.8;
  const stationCount = v.waypoints.filter(p => p.station).length;

  const gRef     = useRef<SVGGElement>(null);
  const innerRef = useRef<SVGGElement>(null);
  const smokeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el    = gRef.current;
    const inner = innerRef.current;
    const smoke = smokeRef.current;
    if (!el || !inner) return;

    const pts = v.waypoints;
    const n   = pts.length;

    // precompute cumulative distances and station raw-fractions
    const segLen = pts.map((p, i) =>
      i === 0 ? 0 : Math.hypot(p.x - pts[i-1].x, p.y - pts[i-1].y)
    );
    const totalDist = segLen.reduce((a, b) => a + b, 0);
    let cum = 0;
    const ptFracs = segLen.map(d => { cum += d; return cum / totalDist; }); // 0..1 per waypoint

    let travelMs = 0;        // elapsed travel-only time
    let pausedMs = 0;        // accumulated dwell time
    let pauseUntil = 0;      // absolute now() when pause ends
    const visitedStations = new Set<number>();
    let t0: number | null = null;
    let done = false;
    let smokePhase = 0;      // rotating smoke puff index
    let currentAngle = 0;    // smoothly interpolated heading

    function tick(now: number) {
      if (done) return;

      // --- dwell at station ---
      if (now < pauseUntil) {
        // still stopped — keep updating smoke
        if (smoke && isTrain) renderSmoke(smoke, smokePhase, now, v.vehicleType === "whoosh");
        return;
      }
      if (pauseUntil > 0 && now >= pauseUntil) {
        pausedMs += STATION_DWELL_MS;
        pauseUntil = 0;
      }

      if (t0 === null) t0 = now;
      travelMs = now - t0 - pausedMs;
      const raw = Math.min(travelMs / (baseDur * 1000), 1);

      // ease-in-out on raw travel progress
      const eased = raw < 0.5 ? 2*raw*raw : 1 - Math.pow(-2*raw+2,2)/2;
      const scaled = eased * (n - 1);
      const i = Math.min(Math.floor(scaled), n - 2);
      const frac = scaled - i;

      const x = pts[i].x + (pts[i+1].x - pts[i].x) * frac;
      const y = pts[i].y + (pts[i+1].y - pts[i].y) * frac;
      const targetAngle = Math.atan2(pts[i+1].y - pts[i].y, pts[i+1].x - pts[i].x) * (180/Math.PI);
      // Smooth angle interpolation (shortest arc)
      let da = ((targetAngle - currentAngle + 540) % 360) - 180;
      currentAngle += da * 0.12;
      const op = raw < 0.06 ? raw/0.06 : raw > 0.94 ? (1-raw)/0.06 : 1;

      el!.setAttribute("transform", `translate(${x},${y})`);
      el!.setAttribute("opacity", op.toFixed(3));
      inner!.setAttribute("transform", `rotate(${currentAngle})`);
      onPosition(x, y);

      if (smoke && isTrain) renderSmoke(smoke, smokePhase, now, v.vehicleType === "whoosh");
      smokePhase = (smokePhase + 1) % 60;

      // check if we just reached a station waypoint (use ptFracs)
      for (let si = 1; si < n - 1; si++) {
        if (pts[si].station && !visitedStations.has(si) && eased >= ptFracs[si] - 0.02) {
          visitedStations.add(si);
          pauseUntil = now + STATION_DWELL_MS;
          return;
        }
      }

      if (raw >= 1) {
        done = true;
        el!.setAttribute("opacity", "0");
        if (smoke) smoke.setAttribute("opacity", "0");
        onDone();
      }
    }

    const interval = setInterval(() => tick(performance.now()), 16);
    return () => { done = true; clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.key]);

  return (
    <g ref={gRef} opacity="0">
      <g ref={innerRef}>
        {v.vehicleType === "whoosh"        ? <WhooshIcon />   :
         v.vehicleType === "regular-train" ? <TrainIcon />    :
         <MotorcycleIcon />}
      </g>
      {/* smoke puffs rendered relative to vehicle position */}
      <g ref={smokeRef} />
    </g>
  );
}

// Render animated smoke puffs into a <g> element
function renderSmoke(g: SVGGElement, phase: number, now: number, isHSR: boolean) {
  // Remove old puffs that have lived > 1.2s
  const children = [...g.children];
  for (const c of children) {
    const born = Number((c as SVGElement).dataset.born);
    if (now - born > 1200) c.remove();
  }
  // Emit new puff every ~8 frames
  if (phase % 8 === 0) {
    const puff = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const spread = isHSR ? 6 : 3;
    puff.setAttribute("cx", String(-28 + (Math.random()-0.5)*spread));
    puff.setAttribute("cy", String(-8 - Math.random()*4));
    puff.setAttribute("r",  isHSR ? "4" : "3");
    puff.setAttribute("fill", isHSR ? "rgba(251,191,36,0.25)" : "rgba(200,200,200,0.35)");
    (puff as SVGElement).dataset.born = String(now);
    g.appendChild(puff);
  }
  // Animate existing puffs (float up, fade out)
  for (const c of [...g.children]) {
    const el = c as SVGElement;
    const age = (now - Number(el.dataset.born)) / 1200; // 0..1
    const cy0 = Number(el.getAttribute("cy"));
    el.setAttribute("cy", String(cy0 - 0.3));
    el.setAttribute("opacity", String(Math.max(0, 1 - age * 1.5)));
    const r0 = Number(el.getAttribute("r"));
    el.setAttribute("r", String(r0 + (isHSR ? 0.25 : 0.15)));
  }
}

/* ─── Flow dots ──────────────────────────────────────────────── */

function FlowDot({ delay }: { delay: number }) {
  return (
    <motion.circle r={2} fill="rgba(251,191,36,0.4)"
      animate={{ cx: [stops[0].x, stops[1].x, stops[2].x, stops[2].x], cy: [stops[0].y, stops[1].y, stops[2].y, stops[2].y], opacity: [0, 0.7, 0.7, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "linear", times: [0, MID_T, 0.95, 1] }}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────── */

const MAP_WIDTH = 1200;

// Station building icon (small, map-scale)
function StationIcon({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={0.75}>
      {/* platform */}
      <rect x="-7" y="2" width="14" height="2" rx="0.5" fill="#4a3c28" stroke="#6b5840" strokeWidth="0.4"/>
      {/* building body */}
      <rect x="-4" y="-4" width="8" height="6" rx="0.5" fill="#3a2e1e" stroke="#5a4830" strokeWidth="0.4"/>
      {/* gabled roof */}
      <polygon points="0,-7 -5,-4 5,-4" fill="#2d4a20" stroke="#3d6030" strokeWidth="0.4"/>
      {/* window */}
      <rect x="-1.5" y="-2.5" width="3" height="2.5" rx="0.3" fill="#bae6fd" opacity="0.4"/>
      {/* name label */}
      <text y="-9" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={5} fontFamily="monospace" letterSpacing="0.05em">{name}</text>
    </g>
  );
}

// All intermediate stations to render on map
const INTERMEDIATE_STATIONS: { x: number; y: number; name: string }[] = [
  // Argo Parahyangan stations
  { x: 244, y: 265, name: "Cimahi" },
  { x: 233, y: 264, name: "Padalarang" },
  { x: 221, y: 259, name: "Purwakarta" },
  { x: 206, y: 247, name: "Karawang" },
  { x: 194, y: 231, name: "Bekasi" },
];

export function CareerMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging   = useRef(false);
  const playTimers   = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [activeId, setActiveId]           = useState<string | null>(null);
  const [vehicle, setVehicle]             = useState<VehicleState | null>(null);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [svgViewBox, setSvgViewBox]       = useState("0 0 1200 430");

  // Smooth viewBox lerp for zoom in/out
  const currentVB = useRef([0, 0, 1200, 430]);
  const targetVB  = useRef([0, 0, 1200, 430]);

  useEffect(() => {
    const iv = setInterval(() => {
      const [cx, cy, cw, ch] = currentVB.current;
      const [tx, ty, tw, th] = targetVB.current;
      const lerp = (a: number, b: number) => a + (b - a) * 0.07;
      const nx = lerp(cx, tx), ny = lerp(cy, ty), nw = lerp(cw, tw), nh = lerp(ch, th);
      currentVB.current = [nx, ny, nw, nh];
      if (Math.abs(nx-cx) > 0.05 || Math.abs(nw-cw) > 0.05)
        setSvgViewBox(`${nx.toFixed(1)} ${ny.toFixed(1)} ${nw.toFixed(1)} ${nh.toFixed(1)}`);
    }, 16);
    return () => clearInterval(iv);
  }, []);

  const mapX       = useMotionValue(0);
  const activeStop = stops.find(s => s.id === activeId) ?? null;

  useEffect(() => () => { playTimers.current.forEach(clearTimeout); }, []);

  function centerOnStop(stopId: string) {
    const stop = stops.find(s => s.id === stopId);
    if (!stop || !containerRef.current) return;
    const w      = containerRef.current.offsetWidth;
    const target = Math.min(0, Math.max(w - MAP_WIDTH, w / 2 - stop.x));
    fmAnimate(mapX, target, { type: "spring", stiffness: 65, damping: 16 });
  }

  function clampVB(x: number, y: number, w: number, h: number): [number,number,number,number] {
    // Keep viewBox inside map bounds
    const cx = Math.max(0, Math.min(1200 - w, x));
    const cy = Math.max(0, Math.min(430  - h, y));
    return [cx, cy, w, h];
  }

  function zoomIn(x: number, y: number, factor = 3) {
    const zw = 1200 / factor, zh = 430 / factor;
    targetVB.current = clampVB(x - zw/2, y - zh/2, zw, zh);
  }

  function zoomOut() {
    targetVB.current = [0, 0, 1200, 430];
  }

  function handleVehiclePosition(x: number, y: number) {
    const factor = 3;
    const zw = 1200 / factor, zh = 430 / factor;
    targetVB.current = clampVB(x - zw/2, y - zh/2, zw, zh);
  }

  function manualZoom(direction: 1 | -1) {
    const [cx, cy, cw, ch] = currentVB.current;
    const factor = direction === 1 ? 0.7 : 1.4; // zoom in shrinks window
    const nw = Math.max(200, Math.min(1200, cw * factor));
    const nh = Math.max(70,  Math.min(430,  ch * factor));
    const mx = cx + cw/2, my = cy + ch/2;
    targetVB.current = clampVB(mx - nw/2, my - nh/2, nw, nh);
  }

  function fireVehicle(fromId: string, toId: string) {
    const from = stops.find(s => s.id === fromId)!;
    const to   = stops.find(s => s.id === toId)!;
    const bdgToJkt = from.city === "Bandung" && to.city === "Jakarta";
    const jktToBdg = from.city === "Jakarta" && to.city === "Bandung";
    const waypoints = bdgToJkt ? REGULAR_RAIL_WP
                    : jktToBdg ? WHOOSH_RAIL_WP
                    : [{ x: from.x, y: from.y }, { x: to.x, y: to.y }] as TrainWaypoint[];
    const vehicleType = bdgToJkt ? "regular-train"
                      : jktToBdg ? "whoosh"
                      : "motorcycle";
    // zoom in to start position
    zoomIn(waypoints[0].x, waypoints[0].y);
    setVehicle({ key: Date.now(), waypoints, vehicleType });
  }

  function handleNodeClick(stopId: string) {
    if (isDragging.current) return;
    setHasInteracted(true);
    if (activeId === stopId) { setActiveId(null); return; }
    if (activeId) fireVehicle(activeId, stopId);
    setActiveId(stopId);
    centerOnStop(stopId);
  }

  function stopPlay() {
    playTimers.current.forEach(clearTimeout);
    playTimers.current = [];
    setIsPlaying(false);
  }

  function playJourney() {
    if (isPlaying) { stopPlay(); return; }
    setIsPlaying(true);
    setActiveId(null);
    setVehicle(null);
    setHasInteracted(true);
    // Train BDG→JKT: 4s travel + 5 stations × 1s = 9s total
    const seq = [
      { at: 400,   fn: () => { setActiveId("smk");     centerOnStop("smk");      } },
      { at: 2600,  fn: () => { fireVehicle("smk", "plabs");      setActiveId("plabs");    centerOnStop("plabs");    } },
      { at: 5200,  fn: () => { fireVehicle("plabs", "nusapala"); setActiveId("nusapala"); centerOnStop("nusapala"); } },
      { at: 15000, fn: () => setIsPlaying(false) },
    ];
    seq.forEach(({ at, fn }) => { playTimers.current.push(setTimeout(fn, at)); });
  }

  return (
    <section id="experience" className="container-x py-24 sm:py-32">
      <SectionHeader
        eyebrow="Experience"
        title="3+ years of backend engineering."
        description="Three stops that shaped how I build systems. Tap a pin, or hit Play to watch the journey."
      />

      {/* ── Timeline strip ─────────────────────────────────── */}
      <div className="relative mt-8 mb-5 flex items-start justify-between px-2">
        <div className="absolute left-2 right-2 top-[9px] h-px bg-white/[0.06]"/>
        {activeId && (() => {
          const idx = stops.findIndex(s => s.id === activeId);
          return (
            <motion.div
              className="absolute top-[9px] h-px origin-left bg-amber-500/40"
              style={{ left: 8, right: `${(1 - idx / (stops.length - 1)) * 100}%` }}
              layoutId="tl-fill"
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          );
        })()}
        {stops.map((stop, i) => {
          const isActive = activeId === stop.id;
          const col      = C[stop.accent];
          return (
            <button
              key={stop.id}
              onClick={() => handleNodeClick(stop.id)}
              className="group relative flex flex-col items-center gap-2"
              style={{ minWidth: 0, flex: i === 1 ? "1 1 auto" : "0 0 auto", alignItems: i === 0 ? "flex-start" : i === stops.length - 1 ? "flex-end" : "center" }}
            >
              <motion.div
                className={`relative z-10 size-[18px] rounded-full border-2 transition-colors ${isActive ? "border-current" : "border-zinc-700"} ${col.text}`}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                {isActive && (
                  <motion.div className={`absolute inset-0 rounded-full`} style={{ background: col.stroke, opacity: 0.25 }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div className={i === stops.length - 1 ? "text-right" : i === 0 ? "text-left" : "text-center"}>
                <p className={`mono text-[0.55rem] uppercase tracking-[0.14em] ${isActive ? col.text : "text-zinc-600"} transition-colors`}>{stop.period}</p>
                <p className={`text-[0.7rem] font-medium leading-tight ${isActive ? "text-white" : "text-zinc-600"} transition-colors group-hover:text-zinc-300`}>{stop.name.split(" ").slice(0, 2).join(" ")}</p>
                <p className={`text-[0.6rem] leading-tight ${isActive ? "text-zinc-400" : "text-zinc-700"} transition-colors`}>{stop.city}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Map card ───────────────────────────────────────── */}
      <Reveal>
        <div ref={containerRef} className="relative overflow-hidden rounded-[2rem] border border-white/[0.07]" style={{ height: 480 }}>

          {/* Play button */}
          <button
            onClick={playJourney}
            className={`absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.65rem] backdrop-blur-sm transition-all duration-200 ${
              isPlaying ? "border-red-500/30 bg-red-950/40 text-red-400 hover:border-red-400/50" : "border-white/[0.1] bg-black/40 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
            }`}
          >
            {isPlaying ? <Square size={10} fill="currentColor"/> : <Play size={10} fill="currentColor"/>}
            <span className="mono tracking-[0.15em]">{isPlaying ? "STOP" : "PLAY JOURNEY"}</span>
          </button>

          {/* Zoom controls */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-1">
            <button onClick={() => manualZoom(1)}
              className="grid size-7 place-items-center rounded-lg border border-white/[0.1] bg-black/40 text-zinc-400 text-sm font-bold backdrop-blur-sm transition hover:border-amber-500/30 hover:text-amber-400"
            >+</button>
            <button onClick={() => manualZoom(-1)}
              className="grid size-7 place-items-center rounded-lg border border-white/[0.1] bg-black/40 text-zinc-400 text-sm font-bold backdrop-blur-sm transition hover:border-amber-500/30 hover:text-amber-400"
            >−</button>
            <button onClick={zoomOut}
              className="grid size-7 place-items-center rounded-lg border border-white/[0.1] bg-black/40 text-zinc-400 text-[0.5rem] backdrop-blur-sm transition hover:border-amber-500/30 hover:text-amber-400 mono"
            >FIT</button>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.p exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="mono pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 whitespace-nowrap text-[0.58rem] uppercase tracking-[0.22em] text-zinc-600"
              >
                drag · tap a pin
              </motion.p>
            )}
          </AnimatePresence>

          {/* Draggable map */}
          <motion.div
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0.06}
            onDragStart={() => { isDragging.current = true; setHasInteracted(true); }}
            onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 60); }}
            style={{ width: MAP_WIDTH, x: mapX }}
            className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
          >
            <svg viewBox={svgViewBox} width={MAP_WIDTH} height={430} className="absolute inset-0" style={{ transition: "none" }}>

              {/* ── Defs ──────────────────────────── */}
              <defs>
                {/* Ocean depth gradient — north (Java Sea) lighter, south (Indian Ocean) darker */}
                <linearGradient id="ocean-depth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#0d2035"/>
                  <stop offset="42%"  stopColor="#091828"/>
                  <stop offset="58%"  stopColor="#070f1e"/>
                  <stop offset="100%" stopColor="#050c18"/>
                </linearGradient>

                {/* Island terrain gradient — simulates vegetation + elevation */}
                <linearGradient id="terrain-base" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#122010"/>
                  <stop offset="50%"  stopColor="#0e1c0c"/>
                  <stop offset="100%" stopColor="#0c1a0a"/>
                </linearGradient>

                {/* Mountain highland overlay — central ridge */}
                <radialGradient id="highland-w" cx="22%" cy="60%" r="22%">
                  <stop offset="0%"   stopColor="#1e3018" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#0e1c0c" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="highland-c" cx="52%" cy="62%" r="20%">
                  <stop offset="0%"   stopColor="#1e3018" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#0e1c0c" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="highland-e" cx="80%" cy="64%" r="22%">
                  <stop offset="0%"   stopColor="#1c2e16" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#0e1c0c" stopOpacity="0"/>
                </radialGradient>

                {/* Coastal glow — shallow water shelf */}
                <filter id="coast-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
                </filter>

                {/* Clip to island */}
                <clipPath id="java-clip">
                  <path d={JAVA_PATH}/>
                </clipPath>
                <clipPath id="madura-clip">
                  <path d={MADURA_PATH}/>
                </clipPath>

                {/* Lat/lon grid pattern */}
                <pattern id="latlon" width="80" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.018)" strokeWidth="0.5"/>
                </pattern>
              </defs>

              {/* ── Ocean ─────────────────────────── */}
              <rect width={MAP_WIDTH} height={430} fill="url(#ocean-depth)"/>
              <rect width={MAP_WIDTH} height={430} fill="url(#latlon)"/>

              {/* Sea labels */}
              <text x="600" y="110" textAnchor="middle" fill="#1a3050" fontSize={11} fontFamily="serif" letterSpacing="0.4em" fontStyle="italic">LAUT JAWA</text>
              <text x="600" y="400" textAnchor="middle" fill="#0e1e30" fontSize={11} fontFamily="serif" letterSpacing="0.3em" fontStyle="italic">SAMUDERA HINDIA</text>

              {/* ── Coastal shelf (shallow water glow around Java) ── */}
              <path d={JAVA_PATH} fill="none" stroke="rgba(30,80,130,0.22)" strokeWidth="18" strokeLinejoin="round"/>
              <path d={JAVA_PATH} fill="none" stroke="rgba(30,80,130,0.12)" strokeWidth="32" strokeLinejoin="round"/>

              {/* ── Java island ───────────────────── */}
              {/* Base terrain color */}
              <path d={JAVA_PATH} fill="url(#terrain-base)" stroke="#1a2e12" strokeWidth={1.2}/>

              {/* Mountain highland overlays (clipped to island) */}
              <g clipPath="url(#java-clip)">
                <rect width={MAP_WIDTH} height={430} fill="url(#highland-w)"/>
                <rect width={MAP_WIDTH} height={430} fill="url(#highland-c)"/>
                <rect width={MAP_WIDTH} height={430} fill="url(#highland-e)"/>
              </g>

              {/* Coastline highlight */}
              <path d={JAVA_PATH} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={2}/>

              {/* ── Madura island ─────────────────── */}
              <path d={MADURA_PATH} fill="none" stroke="rgba(30,80,130,0.18)" strokeWidth="10" strokeLinejoin="round"/>
              <path d={MADURA_PATH} fill="#0f1c0e" stroke="#162510" strokeWidth={1}/>
              <text x="948" y="204" textAnchor="middle" fill="#1a2a14" fontSize={6.5} fontFamily="serif" letterSpacing="0.08em">MADURA</text>

              {/* ── Bali (partially visible) ──────── */}
              <path d={BALI_PATH} fill="none" stroke="rgba(30,80,130,0.15)" strokeWidth="8"/>
              <path d={BALI_PATH} fill="#0f1c0e" stroke="#162510" strokeWidth={0.8}/>

              {/* Selat Bali label */}
              <text x="1078" y="298" textAnchor="end" fill="#0e1e30" fontSize={6} fontFamily="serif" letterSpacing="0.05em" fontStyle="italic">Selat Bali</text>

              {/* ── Volcanic mountain chain ───────── */}
              {VOLCANOS.map((v, i) => {
                const h = v.h * 2.2;
                return (
                  <g key={i}>
                    {/* Drop shadow */}
                    <polygon
                      points={`${v.x + 2},${v.y - h + 4} ${v.x - h * 0.75 + 2},${v.y + 2} ${v.x + h * 0.75 + 2},${v.y + 2}`}
                      fill="#050c08" opacity={0.55}
                    />
                    {/* Dark base slope */}
                    <polygon
                      points={`${v.x},${v.y - h} ${v.x - h * 0.8},${v.y} ${v.x + h * 0.8},${v.y}`}
                      fill="#1a2e14" stroke="#223819" strokeWidth={0.6}
                    />
                    {/* Mid tone body */}
                    <polygon
                      points={`${v.x},${v.y - h} ${v.x - h * 0.62},${v.y} ${v.x + h * 0.62},${v.y}`}
                      fill="#2d4a20" stroke="#385a28" strokeWidth={0.5}
                    />
                    {/* Light face (sun-lit side) */}
                    <polygon
                      points={`${v.x},${v.y - h} ${v.x},${v.y} ${v.x + h * 0.62},${v.y}`}
                      fill="#3d6030" opacity={0.7}
                    />
                    {/* Snow cap */}
                    <polygon
                      points={`${v.x},${v.y - h} ${v.x - h * 0.28},${v.y - h * 0.5} ${v.x + h * 0.28},${v.y - h * 0.5}`}
                      fill="#8fac78" stroke="#aec98e" strokeWidth={0.4}
                    />
                    {/* Snow highlight */}
                    <polygon
                      points={`${v.x},${v.y - h} ${v.x + h * 0.05},${v.y - h * 0.8} ${v.x + h * 0.22},${v.y - h * 0.52}`}
                      fill="#c5ddb0" opacity={0.6}
                    />
                  </g>
                );
              })}

              {/* ── City reference dots ───────────── */}
              {GEO_LABELS.map(c => (
                <g key={c.name} opacity={0.55}>
                  <circle cx={c.x} cy={c.y} r={2.2} fill="#1e3018" stroke="#2a4020" strokeWidth={0.8}/>
                  <text x={c.x} y={c.y - 6} textAnchor="middle" fill="#2e4822" fontSize={6.5} fontFamily="serif" letterSpacing="0.08em">{c.name}</text>
                </g>
              ))}

              {/* ── Rail tracks ───────────────────── */}
              {/*
                Regular (Argo Parahyangan) — ballasted track, winding through highlands
                Rendered as 4 layers: shadow → ballast bed → sleepers → rail heads
              */}
              {/* shadow / outer ballast */}
              <path d={REGULAR_RAIL_D} fill="none" stroke="#1a1008" strokeWidth={9}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.7}/>
              {/* gravel ballast */}
              <path d={REGULAR_RAIL_D} fill="none" stroke="#3d2e1a" strokeWidth={6}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.8}/>
              {/* sleepers — short fat dashes = railway ties at map scale */}
              <path d={REGULAR_RAIL_D} fill="none" stroke="#52402a" strokeWidth={4.5}
                strokeLinecap="square" strokeLinejoin="round"
                strokeDasharray="2 5" opacity={0.9}/>
              {/* left rail head */}
              <path d={REGULAR_RAIL_D} fill="none" stroke="#8d8177" strokeWidth={0.9}
                strokeLinecap="round" strokeLinejoin="round"
                opacity={0.85}
                style={{ transform: "translate(-1.2px,-1.2px)" }}/>
              {/* right rail head */}
              <path d={REGULAR_RAIL_D} fill="none" stroke="#8d8177" strokeWidth={0.9}
                strokeLinecap="round" strokeLinejoin="round"
                opacity={0.85}
                style={{ transform: "translate(1.2px,1.2px)" }}/>

              {/*
                Whoosh / KCJB — dedicated high-speed rail, concrete slab track
                Rendered as: shadow → concrete deck → electric rail highlight
              */}
              {/* shadow */}
              <path d={WHOOSH_RAIL_D} fill="none" stroke="#060d1a" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.8}/>
              {/* concrete slab */}
              <path d={WHOOSH_RAIL_D} fill="none" stroke="#0f2036" strokeWidth={4.5}
                strokeLinecap="round" strokeLinejoin="round" opacity={1}/>
              {/* center catenary highlight */}
              <path d={WHOOSH_RAIL_D} fill="none" stroke="#0ea5e9" strokeWidth={1.2}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.65}/>
              {/* electric glow */}
              <path d={WHOOSH_RAIL_D} fill="none" stroke="#7dd3fc" strokeWidth={0.5}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.45}/>

              {/* ── Journey path ──────────────────── */}
              <motion.path
                d={JOURNEY_D} fill="none"
                stroke="rgba(251,191,36,0.2)" strokeWidth={1.5} strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
              />

              {/* Ambient flow dots */}
              <FlowDot delay={0} />
              <FlowDot delay={1.65} />
              <FlowDot delay={3.3} />

              {/* Intermediate station buildings */}
              {INTERMEDIATE_STATIONS.map(s => (
                <StationIcon key={s.name} x={s.x} y={s.y} name={s.name} />
              ))}

              {/* Rice paddy fields along Bandung-Jakarta corridor */}
              <g opacity={0.18}>
                {[
                  {x:230,y:268},{x:237,y:270},{x:215,y:264},{x:208,y:258},
                  {x:199,y:248},{x:192,y:238},{x:210,y:254},{x:220,y:262},
                ].map((p,i) => (
                  <g key={i} transform={`translate(${p.x},${p.y})`}>
                    <rect x="-4" y="-2" width="8" height="4" rx="0.5" fill="none" stroke="#4a7a30" strokeWidth="0.6"/>
                    <line x1="-4" y1="0" x2="4" y2="0" stroke="#4a7a30" strokeWidth="0.3"/>
                    <line x1="0" y1="-2" x2="0" y2="2" stroke="#4a7a30" strokeWidth="0.3"/>
                  </g>
                ))}
              </g>

              {/* Vehicle */}
              {vehicle && (
                <AnimatedVehicle
                  v={vehicle}
                  onDone={() => { setVehicle(null); zoomOut(); }}
                  onPosition={handleVehiclePosition}
                />
              )}

              {/* ── Career nodes ──────────────────── */}
              {stops.map((stop, i) => {
                const col = C[stop.accent];
                const isActive = activeId === stop.id;
                return (
                  <g key={stop.id} style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); handleNodeClick(stop.id); }}>
                    <motion.circle cx={stop.x} cy={stop.y} fill={isActive ? col.fill : col.pulse} stroke={col.stroke} strokeWidth={1}
                      animate={{ r: isActive ? [26, 33, 26] : [18, 24, 18], strokeOpacity: isActive ? [0.7, 0.2, 0.7] : [0.22, 0.06, 0.22] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                    />
                    {isActive && (
                      <motion.circle cx={stop.x} cy={stop.y} fill="none" stroke={col.stroke} strokeWidth={0.7}
                        initial={{ r: 10, strokeOpacity: 0.9 }} animate={{ r: 50, strokeOpacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                    )}
                    <motion.circle cx={stop.x} cy={stop.y} r={7} fill={col.fill} stroke={col.stroke} strokeWidth={isActive ? 2.4 : 1.8}
                      animate={{ scale: isActive ? 1.45 : 1 }} whileHover={{ scale: 1.5 }}
                      style={{ originX: stop.x + "px", originY: stop.y + "px" }}
                      transition={{ type: "spring", stiffness: 180, damping: 12 }}
                    />
                    <circle cx={stop.x} cy={stop.y} r={3} fill={col.stroke} opacity={0.55}/>
                    <text x={stop.x} y={stop.y - 27} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="monospace" letterSpacing="0.14em">{stop.city.toUpperCase()}</text>
                    <text x={stop.x} y={stop.y - 16} textAnchor="middle" fill={isActive ? col.stroke : "rgba(255,255,255,0.22)"} fontSize={8} fontWeight="600" fontFamily="system-ui, sans-serif">{stop.name.split(" ").slice(0, 2).join(" ")}</text>
                    <text x={stop.x + 13} y={stop.y + 5} fill={isActive ? col.stroke : "rgba(255,255,255,0.18)"} fontSize={7} fontFamily="monospace" opacity={0.8}>{stop.period.split(" ")[0]}</text>
                  </g>
                );
              })}

              {/* ── Compass ───────────────────────── */}
              <g opacity={0.18} transform="translate(1142, 62)">
                <circle cx={0} cy={0} r={18} fill="none" stroke="#4a6080" strokeWidth={0.8}/>
                <line x1={0} y1={-14} x2={0} y2={14}  stroke="#4a6080" strokeWidth={0.8}/>
                <line x1={-14} y1={0} x2={14} y2={0}  stroke="#4a6080" strokeWidth={0.8}/>
                <text x={0}  y={-20} textAnchor="middle" fill="#4a6080" fontSize={7} fontFamily="serif" fontWeight="700">N</text>
                <text x={0}  y={28}  textAnchor="middle" fill="#4a6080" fontSize={7} fontFamily="serif">S</text>
                <text x={21} y={4}   textAnchor="start"  fill="#4a6080" fontSize={7} fontFamily="serif">E</text>
                <text x={-21} y={4}  textAnchor="end"    fill="#4a6080" fontSize={7} fontFamily="serif">W</text>
              </g>

              {/* ── Scale bar ─────────────────────── */}
              <g opacity={0.3} transform="translate(60, 400)">
                <line x1={0} y1={0} x2={100} y2={0} stroke="#4a6080" strokeWidth={1.5}/>
                <line x1={0} y1={-4} x2={0} y2={4} stroke="#4a6080" strokeWidth={1}/>
                <line x1={100} y1={-4} x2={100} y2={4} stroke="#4a6080" strokeWidth={1}/>
                <text x={50} y={-7} textAnchor="middle" fill="#4a6080" fontSize={7} fontFamily="monospace">100 km</text>
              </g>

            </svg>
          </motion.div>

          {/* ── Info card ─────────────────────── */}
          <AnimatePresence>
            {activeStop && (
              <motion.div
                key={activeStop.id}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-4 right-4 z-20 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#09080a]/96 p-5 backdrop-blur-md"
              >
                <button onClick={() => setActiveId(null)} className="absolute right-4 top-4 grid size-7 place-items-center rounded-full border border-white/[0.08] text-zinc-500 transition hover:text-white">
                  <X size={13}/>
                </button>
                <div className="flex items-start gap-3 pr-8">
                  <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border ${activeStop.type === "education" ? "border-emerald-500/25 bg-emerald-950/30 text-emerald-400" : "border-amber-500/25 bg-amber-950/30 text-amber-400"}`}>
                    {activeStop.type === "education" ? <GraduationCap size={14}/> : <Briefcase size={14}/>}
                  </div>
                  <div>
                    <p className={`mono text-[0.58rem] uppercase tracking-[0.18em] ${C[activeStop.accent].text}`}>{activeStop.city} · {activeStop.period}</p>
                    <h3 className="mt-0.5 text-base font-semibold text-white">{activeStop.name}</h3>
                    <p className="text-sm text-zinc-500">{activeStop.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-400">{activeStop.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeStop.stack.map(t => (
                    <span key={t} className={`mono rounded-md border px-1.5 py-0.5 text-[0.6rem] ${C[activeStop.accent].pill}`}>{t}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
