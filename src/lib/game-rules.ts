export type WorldId = "koi" | "boat" | "drone" | "ship";
export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Site = Point & { name: string };
type World = {
  id: WorldId;
  title: string;
  region: string;
  image: string;
  color: string;
  objective: string;
  action: string;
  noun: string;
  finale: string;
  spawn: Point;
  speed: number;
  reach: number;
  duration: number;
  sites: Site[];
};

// Positions are in the same 1000 × 562 composition as the landscape plates.
export const worlds: World[] = [
  {
    id: "koi",
    title: "Koi Garden",
    region: "The maple pond",
    image: "koi-garden",
    color: "#edd59a",
    objective:
      "Guide the lead koi to each flowering lily. Scatter feed and wait for the school to gather.",
    action: "Scatter feed",
    noun: "lilies",
    finale: "The school is gathered.",
    spawn: { x: 473, y: 413 },
    speed: 135,
    reach: 50,
    duration: 1.2,
    sites: [
      { x: 329, y: 368, name: "Maple pool" },
      { x: 617, y: 307, name: "Bridge pool" },
      { x: 733, y: 393, name: "Reed pool" },
      { x: 488, y: 463, name: "Lotus pool" },
    ],
  },
  {
    id: "boat",
    title: "Lantern Journey",
    region: "Lake at dusk",
    image: "lantern-lake",
    color: "#ffd29d",
    objective:
      "Row alongside the five floating lanterns. Watch the breeze and light each wick when the wind drops.",
    action: "Light lantern",
    noun: "lanterns",
    finale: "Five lights across the lake.",
    spawn: { x: 505, y: 422 },
    speed: 145,
    reach: 49,
    duration: 0.9,
    sites: [
      { x: 332, y: 395, name: "West landing" },
      { x: 242, y: 321, name: "Pine shore" },
      { x: 504, y: 287, name: "Mountain pass" },
      { x: 745, y: 315, name: "East bank" },
      { x: 683, y: 411, name: "Home waters" },
    ],
  },
  {
    id: "drone",
    title: "Island Restoration",
    region: "The spring reserve",
    image: "island",
    color: "#d1e5a3",
    objective:
      "Pilot the nursery drone to five bare clearings. Water a seedling at each one and refill at the waterfall every two plantings.",
    action: "Plant & water",
    noun: "groves",
    finale: "The island is growing again.",
    spawn: { x: 525, y: 350 },
    speed: 169,
    reach: 45,
    duration: 1.1,
    sites: [
      { x: 385, y: 199, name: "West meadow" },
      { x: 573, y: 139, name: "High meadow" },
      { x: 721, y: 270, name: "East clearing" },
      { x: 610, y: 356, name: "Lower terrace" },
      { x: 735, y: 397, name: "South grove" },
    ],
  },
  {
    id: "ship",
    title: "Cosmic Explorer",
    region: "The orbital belt",
    image: "cosmos",
    color: "#b8dfed",
    objective:
      "Fly to three survey signals and hold position for a scan. Moving asteroids can damage your shield. Each survey restores fuel.",
    action: "Scan signal",
    noun: "surveys",
    finale: "The sector is charted.",
    spawn: { x: 435, y: 395 },
    speed: 190,
    reach: 50,
    duration: 1.35,
    sites: [
      { x: 254, y: 294, name: "Outer relay" },
      { x: 526, y: 141, name: "Polar relay" },
      { x: 764, y: 339, name: "Limb relay" },
    ],
  },
];
export const spring: Site = { x: 647, y: 183, name: "Waterfall spring" };
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export type Swimmer = Point & { heading: number; speed: number; beat: number };
export type PondRipple = Point & { born: number; power: number };
export const techniques = {
  koi: {
    label: "Breach",
    hint: "Leap beneath the blue dragonfly to catch it before feeding the school.",
    tally: "dragonflies caught",
    duration: 0.78,
    cooldown: 1.65,
  },
  boat: {
    label: "Pull oars",
    hint: "Pull as the stroke meter reaches the gold mark for a longer glide.",
    tally: "timed strokes",
    duration: 0.74,
    cooldown: 0.84,
  },
  drone: {
    label: "Drop seed",
    hint: "Lead a clearing with the landing sight to plant in flight. Each drop uses water.",
    tally: "aerial plantings",
    duration: 0.82,
    cooldown: 1.05,
  },
  ship: {
    label: "Pulse shield",
    hint: "Trigger a short shield burst before an asteroid hits. Watch its recharge.",
    tally: "impacts deflected",
    duration: 1.25,
    cooldown: 4.3,
  },
} as const;
type Maneuver = { started: number; from: Point; to: Point; heading: number; strong: boolean };
export type Run = {
  position: Point;
  velocity: Point;
  heading: number;
  time: number;
  destination: Point | null;
  visited: boolean[];
  current: number;
  progress: number | null;
  water: number;
  fuel: number;
  shields: number;
  impact: number;
  finish: "won" | "lost" | null;
  message: string;
  companions: Swimmer[];
  swimBeat: number;
  ripples: PondRipple[];
  trail: (Point & { age: number; heading: number })[];
  trailTime: number;
  maneuver: Maneuver | null;
  readyAt: number;
  techniqueHits: number;
  caughtAt: number;
  plantedAt: number[];
  notice: { text: string; until: number } | null;
  oarBeat: number;
};
export function newRun(world: World): Run {
  return {
    position: { ...world.spawn },
    velocity: { x: 0, y: 0 },
    heading: -0.45,
    time: 0,
    destination: null,
    visited: world.sites.map(() => false),
    current: 0,
    progress: null,
    water: 2,
    fuel: 100,
    shields: 3,
    impact: 0,
    finish: null,
    message: "",
    swimBeat: 0,
    ripples: [],
    companions: Array.from({ length: 3 }, (_, i) => ({
      x: world.spawn.x + 28 + i * 23,
      y: world.spawn.y + 18 + i * 5,
      heading: -0.45,
      speed: 12,
      beat: i * 0.37,
    })),
    trail: [],
    trailTime: 0,
    maneuver: null,
    readyAt: 0,
    techniqueHits: 0,
    caughtAt: -1,
    plantedAt: world.sites.map(() => -10),
    notice: null,
    oarBeat: 0,
  };
}
export function dragonfly(world: World, run: Run): Point {
  const lily = world.sites[run.current],
    t = run.time;
  return {
    x: lily.x + 33 * Math.sin(t * 0.79) + 9 * Math.sin(t * 1.87),
    y: lily.y + 19 * Math.cos(t * 0.91),
  };
}
export function strokeMeter(t: number) {
  return 0.5 - 0.5 * Math.cos(t * Math.PI * 1.22);
}
export function dropPoint(run: Run): Point {
  const flight = techniques.drone.duration;
  return {
    x: run.position.x + run.velocity.x * flight * 0.6 + Math.sin(run.time * 0.7) * 13,
    y: run.position.y + run.velocity.y * flight * 0.6 + 7 * Math.cos(run.time * 0.48),
  };
}
export function triggerTechnique(world: World, run: Run) {
  if (run.finish || run.progress !== null || run.maneuver || run.time < run.readyAt) return;
  if (world.id === "drone" && !run.water) return;
  const strong = world.id === "boat" && strokeMeter(run.time) >= 0.76;
  run.maneuver = {
    started: run.time,
    from: { ...run.position },
    to: world.id === "drone" ? dropPoint(run) : { ...run.position },
    heading: run.heading,
    strong,
  };
  run.readyAt = run.time + techniques[world.id].cooldown;
  if (strong) {
    run.techniqueHits++;
    run.notice = { text: "Clean stroke", until: run.time + 1.15 };
  }
}
export function objective(world: World, run: Run) {
  return world.id === "drone" && run.water === 0 ? spring : world.sites[run.current];
}
export function actionLabel(world: World, run: Run) {
  return world.id === "drone" && run.water === 0 ? "Refill tank" : world.action;
}
export function limitPoint(world: World, point: Point): Point {
  if (world.id === "ship" || world.id === "drone")
    return { x: clamp(point.x, 65, 935), y: clamp(point.y, 78, 495) };
  // Follow the shoreline as it widens towards the camera.
  const lake = world.id === "boat",
    y = clamp(point.y, lake ? 277 : 288, lake ? 485 : 466);
  const depth = (y - 280) / 200,
    halfWidth = lake ? 300 + depth * 80 : 125 + depth * 227;
  return { x: clamp(point.x, 500 - halfWidth, 500 + halfWidth), y };
}
export function steerTo(world: World, run: Run, point: Point) {
  if (world.id === "ship") run.progress = null;
  if (run.finish || run.progress !== null) return;
  run.message = "";
  run.destination = limitPoint(world, point);
}
export function lakeWind(time: number) {
  return (1 + Math.sin(time * 1.8 + Math.sin(time * 0.7) * 0.48)) / 2;
}
export const lightingThreshold = 0.62;
export function beginAction(world: World, run: Run) {
  if (run.finish || run.progress !== null || run.maneuver) return;
  const target = objective(world, run);
  if (distance(run.position, target) > world.reach) {
    run.message = "Move closer to " + target.name + ".";
    return;
  }
  if (world.id === "boat" && lakeWind(run.time) > lightingThreshold) {
    run.message = "The gust caught the flame. Try again in the lull.";
    return;
  }
  run.destination = null;
  run.velocity = { x: 0, y: 0 };
  run.progress = 0;
  run.message = "";
}
// Centre and apparent limb of the Earth in the orbital landscape, in scene pixels.
const earth = { x: 888, y: 335, rx: 342, ry: 302 };
export const asteroidCount = 6;
export const asteroidRadius = (i: number) => 13 + (i % 3) * 5;
export const beltCount = 208;
const orbits = Array.from({ length: asteroidCount + beltCount }, (_, i) => {
  const scatter = (n: number) => (Math.sin((i + 1) * n) * 43758.5453) % 1;
  const radius = 600 + scatter(12.24) * 157;
  const tilt = 0.21 + scatter(29.2) * 0.045;
  return {
    radius,
    sin: Math.sin(tilt),
    cos: Math.cos(tilt),
    flatten: 0.22 + scatter(39.1) * 0.09,
    phase: Math.PI + i * 2.399963,
    rate: 0.082 * (600 / radius) ** 1.5,
  };
});
export function asteroidAt(i: number, time: number) {
  const orbit = orbits[i],
    phase = orbit.phase + time * orbit.rate;
  const depth = Math.sin(phase),
    scale = 1 / (1 - depth * 0.2);
  const u = orbit.radius * Math.cos(phase) * scale;
  const v = orbit.radius * orbit.flatten * depth * scale;
  const dx = u * orbit.cos - v * orbit.sin,
    dy = u * orbit.sin + v * orbit.cos;
  const hidden = depth < 0 && (dx / earth.rx) ** 2 + (dy / earth.ry) ** 2 < 1;
  return { x: earth.x + dx, y: earth.y + dy, depth, scale, hidden };
}

function stroke(
  run: Run,
  p: Point,
  heading: number,
  beat: number,
  speed: number,
  dt: number,
  size: number,
) {
  // Emit a crest at each tail reversal. Its origin stays in the water as the fish moves on.
  const next = beat + dt * (0.65 + Math.min(speed, 180) * 0.013);
  if (Math.floor(next * 2) !== Math.floor(beat * 2)) {
    const side = Math.cos(next * 2 * Math.PI) * size * 0.15;
    run.ripples.push({
      x: p.x - Math.sin(heading) * size + Math.cos(heading) * side,
      y: p.y + Math.cos(heading) * size * 0.7 + Math.sin(heading) * side,
      born: run.time,
      power: (clamp(0.12 + speed / 155, 0.12, 1) * size) / 23,
    });
  }
  return next;
}

function swimSchool(world: World, run: Run, speed: number, dt: number) {
  while (run.ripples.length && run.time - run.ripples[0].born > 1.6) run.ripples.shift();
  run.swimBeat = stroke(run, run.position, run.heading, run.swimBeat, speed, dt, 23);
  run.companions.forEach((fish, i) => {
    const feeding = run.progress !== null;
    const phase = i * 2.4 + run.time * (feeding ? 0.63 : 0.39);
    const spread = feeding ? 21 : 42;
    const target = limitPoint(world, {
      x: run.position.x + Math.cos(phase) * spread - Math.sin(run.heading) * speed * 0.19,
      y: run.position.y + Math.sin(phase) * spread * 0.65 + Math.cos(run.heading) * speed * 0.13,
    });
    let dx = target.x - fish.x,
      dy = target.y - fish.y;
    for (const other of run.companions) {
      if (fish === other) continue;
      const gap = Math.max(1, distance(fish, other));
      if (gap < 24) {
        dx += ((fish.x - other.x) * (24 - gap)) / gap;
        dy += ((fish.y - other.y) * (24 - gap)) / gap;
      }
    }
    const angle = Math.atan2(dx, -dy) - fish.heading;
    const turn = Math.atan2(Math.sin(angle), Math.cos(angle));
    fish.heading += clamp(turn, -3.6 * dt, 3.6 * dt);
    const cruise = clamp(Math.hypot(dx, dy) * 2.1, 8, 176) * (0.58 + 0.42 * Math.max(0, Math.cos(turn)));
    fish.speed += (cruise - fish.speed) * (1 - Math.exp(-dt * 4));
    const step = fish.speed * dt * (1 + 0.08 * Math.sin(fish.beat * Math.PI * 2));
    Object.assign(
      fish,
      limitPoint(world, {
        x: fish.x + Math.sin(fish.heading) * step,
        y: fish.y - Math.cos(fish.heading) * step,
      }),
    );
    fish.beat = stroke(run, fish, fish.heading, fish.beat, fish.speed, dt, 14 + i);
  });
}

function completeAction(world: World, run: Run, siteIndex = run.current) {
  run.progress = null;
  if (world.id === "drone" && run.water === 0) {
    run.water = 2;
    run.message = "Tank refilled.";
    return;
  }
  run.visited[siteIndex] = true;
  run.message = world.sites[siteIndex].name + " complete.";
  if (world.id === "drone") {
    run.water--;
    run.plantedAt[siteIndex] = run.time;
  }
  if (world.id === "ship") run.fuel = Math.min(100, run.fuel + 23);
  if (run.visited.every(Boolean)) {
    run.finish = "won";
    return;
  }
  while (run.visited[run.current]) run.current = (run.current + 1) % world.sites.length;
}
function resolveManeuver(world: World, run: Run) {
  const maneuver = run.maneuver;
  if (!maneuver) return;
  const fraction = (run.time - maneuver.started) / techniques[world.id].duration;
  if (
    world.id === "koi" &&
    fraction >= 0.28 &&
    fraction <= 0.68 &&
    run.caughtAt !== run.current &&
    distance(run.position, dragonfly(world, run)) < 24
  ) {
    run.caughtAt = run.current;
    run.techniqueHits++;
    run.notice = { text: "Dragonfly caught", until: run.time + 1.5 };
  }
  if (fraction < 1) return;
  run.maneuver = null;
  if (world.id === "koi") run.ripples.push({ ...run.position, born: run.time, power: 1.45 });
  if (world.id === "drone") {
    const landing = world.sites.findIndex(
      (site, i) => !run.visited[i] && distance(site, maneuver.to) <= 28,
    );
    if (landing >= 0) {
      run.techniqueHits++;
      completeAction(world, run, landing);
      run.notice = { text: "Seed landed · " + world.sites[landing].name, until: run.time + 1.6 };
    } else {
      run.water--;
      run.notice = { text: "Drop missed the clearing", until: run.time + 1.6 };
    }
  }
}
export function advance(world: World, run: Run, axis: Point, dt: number) {
  if (run.finish) return;
  run.time += dt;
  let dx = axis.x,
    dy = axis.y;
  if (dx || dy) {
    run.destination = null;
    run.message = "";
    if (world.id === "ship") run.progress = null;
  } else if (run.destination) {
    dx = run.destination.x - run.position.x;
    dy = run.destination.y - run.position.y;
    const length = Math.hypot(dx, dy);
    if (length < 3) {
      run.destination = null;
      dx = dy = 0;
    } else {
      const brake = Math.min(1, length / 24);
      dx = (dx / length) * brake;
      dy = (dy / length) * brake;
    }
  }
  const length = Math.max(1, Math.hypot(dx, dy)),
    active = run.progress === null;
  const damping = 1 - Math.exp(-dt * (world.id === "boat" ? 4 : 8));
  const drift = world.id === "boat" ? (lakeWind(run.time) - 0.5) * 9 : 0;
  const pull =
    world.id === "boat" && run.maneuver
      ? (run.maneuver.strong ? 198 : 93) *
        Math.max(0, 1 - (run.time - run.maneuver.started) / techniques.boat.duration)
      : 0;
  const bearing = run.maneuver?.heading ?? run.heading;
  const vx = active ? (dx / length) * world.speed + drift + Math.sin(bearing) * pull : 0,
    vy = active ? (dy / length) * world.speed - Math.cos(bearing) * pull : 0;
  run.velocity.x += (vx - run.velocity.x) * damping;
  run.velocity.y += (vy - run.velocity.y) * damping;
  const speed = Math.hypot(run.velocity.x, run.velocity.y);
  if (world.id === "boat") run.oarBeat += dt * (0.7 + Math.min(1.5, speed / world.speed) * 4.5);
  if (speed > 2) {
    const angle = Math.atan2(run.velocity.x, -run.velocity.y) - run.heading;
    run.heading += Math.atan2(Math.sin(angle), Math.cos(angle)) * (1 - Math.exp(-8 * dt));
  }
  const old = run.position;
  run.position = limitPoint(world, { x: old.x + run.velocity.x * dt, y: old.y + run.velocity.y * dt });
  run.trailTime += dt;
  if (run.trailTime > 0.13 && speed > 9) {
    run.trail.push({ ...run.position, age: 0, heading: run.heading });
    run.trailTime = 0;
  }
  run.trail.forEach((p) => {
    p.age += dt;
  });
  while (run.trail.length && run.trail[0].age > 1.5) run.trail.shift();
  if (world.id === "koi") swimSchool(world, run, dt > 0 ? distance(old, run.position) / dt : 0, dt);
  if (world.id === "ship") {
    run.impact = Math.max(0, run.impact - dt);
    run.fuel = Math.max(0, run.fuel - distance(old, run.position) * 0.047);
    for (let i = 0; i < asteroidCount && run.impact === 0; i++) {
      const rock = asteroidAt(i, run.time);
      if (!rock.hidden && distance(rock, run.position) < asteroidRadius(i) * rock.scale + 10) {
        const deflected = !!run.maneuver && run.time - run.maneuver.started < techniques.ship.duration;
        if (deflected) {
          run.techniqueHits++;
          run.maneuver = null;
          run.notice = { text: "Impact deflected", until: run.time + 1.6 };
        } else run.shields--;
        run.impact = 2;
        run.message = deflected ? "Shield absorbed the impact." : "Asteroid impact.";
        run.progress = null;
        const a = Math.atan2(run.position.y - rock.y, run.position.x - rock.x);
        run.position = limitPoint(world, { x: rock.x + Math.cos(a) * 44, y: rock.y + Math.sin(a) * 44 });
        run.velocity = { x: 0, y: 0 };
        run.destination = null;
      }
    }
    if (run.shields === 0 || run.fuel <= 0) {
      run.finish = "lost";
      run.message = run.shields === 0 ? "Shield depleted." : "Fuel depleted.";
      return;
    }
  }
  resolveManeuver(world, run);
  if (run.progress !== null) {
    run.progress += dt;
    if (run.progress >= world.duration) {
      const gathered =
        world.id !== "koi" || run.companions.every((fish) => distance(fish, run.position) < 62);
      if (gathered) completeAction(world, run);
      else run.progress = world.duration * 0.99;
    }
  }
}
