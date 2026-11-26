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
  companions: (Point & { heading: number })[];
  trail: (Point & { age: number; heading: number })[];
  trailTime: number;
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
    companions: Array.from({ length: 3 }, (_, i) => ({
      x: world.spawn.x + 28 + i * 23,
      y: world.spawn.y + 18 + i * 5,
      heading: -0.45,
    })),
    trail: [],
    trailTime: 0,
  };
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
  if (run.finish || run.progress !== null) return;
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
export function asteroidAt(i: number, time: number): Point {
  const origins = [
    [368, 293],
    [480, 241],
    [667, 276],
    [765, 196],
    [300, 173],
    [595, 403],
  ];
  const [x, y] = origins[i],
    phase = time * (0.34 + i * 0.025) + i * 1.63;
  return { x: x + Math.cos(phase) * (36 + i * 2), y: y + Math.sin(phase * 0.89) * (25 + i * 1.8) };
}
export const asteroidCount = 6;
export const asteroidRadius = (i: number) => 13 + (i % 3) * 5;

function completeAction(world: World, run: Run) {
  run.progress = null;
  if (world.id === "drone" && run.water === 0) {
    run.water = 2;
    run.message = "Tank refilled.";
    return;
  }
  run.visited[run.current] = true;
  run.message = world.sites[run.current].name + " complete.";
  if (world.id === "drone") run.water--;
  if (world.id === "ship") run.fuel = Math.min(100, run.fuel + 23);
  if (run.current === world.sites.length - 1) {
    run.finish = "won";
    return;
  }
  run.current++;
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
  const vx = active ? (dx / length) * world.speed + drift : 0,
    vy = active ? (dy / length) * world.speed : 0;
  run.velocity.x += (vx - run.velocity.x) * damping;
  run.velocity.y += (vy - run.velocity.y) * damping;
  const speed = Math.hypot(run.velocity.x, run.velocity.y);
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
  if (world.id === "koi") {
    run.companions.forEach((fish, i) => {
      const leader = i === 0 ? run.position : run.companions[i - 1];
      const h = run.heading,
        spread = run.progress === null ? 1 : 0.45;
      const tx = leader.x - Math.sin(h) * 26 * spread + Math.cos(run.time * 1.3 + i * 2) * 13;
      const ty = leader.y + Math.cos(h) * 16 * spread + Math.sin(run.time + i) * 10;
      const a = Math.atan2(tx - fish.x, fish.y - ty) - fish.heading;
      fish.heading += Math.atan2(Math.sin(a), Math.cos(a)) * (1 - Math.exp(-dt * 3));
      fish.x += (tx - fish.x) * (1 - Math.exp(-dt * 2.8));
      fish.y += (ty - fish.y) * (1 - Math.exp(-dt * 2.8));
    });
  }
  if (world.id === "ship") {
    run.impact = Math.max(0, run.impact - dt);
    run.fuel = Math.max(0, run.fuel - distance(old, run.position) * 0.047);
    for (let i = 0; i < asteroidCount && run.impact === 0; i++) {
      const rock = asteroidAt(i, run.time);
      if (distance(rock, run.position) < asteroidRadius(i) + 10) {
        run.shields--;
        run.impact = 2;
        run.message = "Asteroid impact.";
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
