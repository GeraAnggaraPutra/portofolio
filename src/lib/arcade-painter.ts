import {
  asteroidAt,
  asteroidCount,
  asteroidRadius,
  clamp,
  objective,
  spring,
  type Point,
  type Run,
  type WorldId,
  worlds,
} from "./game-rules";

type World = (typeof worlds)[number];
type Bitmap = HTMLImageElement;
type Images = Record<string, Bitmap>;
type Brush = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const period = (a: number, n: number) => ((a % n) + n) % n;
const extras: Record<WorldId, string[]> = {
  koi: [],
  boat: ["lantern"],
  drone: ["sapling"],
  ship: ["asteroid"],
};
export async function loadArtwork(world: World): Promise<Images> {
  const load = async (key: string, path: string): Promise<[string, Bitmap]> => {
    const image = new Image();
    image.src = path;
    await image.decode();
    return [key, image];
  };
  return Object.fromEntries(
    await Promise.all([
      load("plate", "/games/" + world.image + ".webp"),
      ...[world.id, ...extras[world.id]].map((key) => load(key, "/games/sprites/" + key + ".webp")),
    ]),
  );
}
export function cameraFor(width: number, height: number, x: number) {
  const scale = Math.max(width / 1000, height / 562);
  const left = clamp(x - width / (2 * scale), 0, Math.max(0, 1000 - width / scale));
  return { scale, left, top: (562 - height / scale) / 2 };
}
function sprite(ctx: Brush, img: Bitmap, x: number, y: number, size: number, heading = 0, frame = 0) {
  const cols = Math.round(img.width / 160),
    rows = Math.round(img.height / 160);
  const turn = period(Math.round((heading / TAU) * cols), cols);
  ctx.drawImage(
    img,
    turn * 160,
    period(Math.floor(frame), rows) * 160,
    160,
    160,
    x - size / 2,
    y - size / 2,
    size,
    size,
  );
}
function ellipse(
  ctx: Brush,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
  stroke = false,
) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU);
  if (stroke) {
    ctx.strokeStyle = color;
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
}
function glow(
  ctx: Brush,
  x: number,
  y: number,
  r: number,
  inner: string,
  outer = "rgba(255,214,117,0)",
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function shadow(ctx: Brush, x: number, y: number, rx: number, ry: number, strength: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  glow(ctx, 0, 0, rx, `rgba(10,18,20,${strength})`, "transparent");
  ctx.restore();
}
function water(ctx: Brush, plate: Bitmap, time: number, lake: boolean) {
  // Refract strips of the original water surface; feather the disturbance at both banks.
  const horizon = lake ? 278 : 292;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(lake ? 175 : 381, horizon);
  ctx.lineTo(lake ? 828 : 622, horizon);
  ctx.lineTo(lake ? 925 : 822, 448);
  ctx.lineTo(685, 486);
  ctx.lineTo(287, 478);
  ctx.lineTo(lake ? 98 : 182, 413);
  ctx.closePath();
  ctx.clip();
  for (let y = horizon; y < 490; y += 4) {
    const depth = (y - horizon) / 210;
    const offset =
      Math.sin(y * 0.096 + time * 1.8) * depth * 2.4 + Math.sin(y * 0.26 - time * 0.9) * depth;
    ctx.drawImage(
      plate,
      0,
      (y / 562) * plate.height,
      plate.width,
      (4.1 / 562) * plate.height,
      offset,
      y,
      1000,
      4.1,
    );
  }
  ctx.restore();
}
function wake(ctx: Brush, run: Run, world: World) {
  for (const mark of run.trail) {
    const life = 1 - mark.age / 1.5;
    ctx.save();
    ctx.translate(mark.x, mark.y);
    ctx.scale(1, 0.61);
    ctx.rotate(mark.heading);
    if (world.id === "ship") {
      glow(ctx, 0, 0, 2 + life * 5, `rgba(140,220,255,${life * 0.55})`, "transparent");
    } else if (world.id !== "drone") {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(239,233,198,${life * (world.id === "boat" ? 0.34 : 0.18)})`;
      const spread = 6 + mark.age * 18;
      ctx.beginPath();
      ctx.moveTo(-spread, spread * 0.8);
      ctx.quadraticCurveTo(0, -spread * 0.3, spread, spread * 0.8);
      ctx.stroke();
    }
    ctx.restore();
  }
}
function flower(ctx: Brush, site: Point) {
  ctx.save();
  ctx.translate(site.x, site.y);
  ctx.scale(1, 0.55);
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate(i * 2.31);
    const leaf = ctx.createRadialGradient(0, 0, 0, 0, 0, 19);
    leaf.addColorStop(0, "#879658");
    leaf.addColorStop(1, "#445631");
    ctx.fillStyle = leaf;
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.arc(9, 0, 13, 0.18, TAU - 0.19);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * TAU) / 8);
    ellipse(ctx, 0, -4.7, 2.7, 6.7, i % 2 ? "#e9b8a4" : "#fcdbca");
    ctx.restore();
  }
  ellipse(ctx, 0, 0, 2.8, 2.8, "#e2b75d");
  ctx.restore();
}
function drawSites(ctx: Brush, world: World, run: Run, images: Images) {
  const t = run.time;
  world.sites.forEach((site, i) => {
    const lit = run.visited[i],
      { x, y } = site;
    if (world.id === "koi") {
      flower(ctx, { x, y: y + Math.sin(t + i) * 0.7 });
    } else if (world.id === "boat") {
      const size = 35 + (y - 270) * 0.12,
        bob = Math.sin(t * 1.7 + i) * 1.2;
      shadow(ctx, x, y + 4, size * 0.37, 5, 0.6);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, -0.48);
      ctx.globalAlpha = 0.24;
      sprite(ctx, images.lantern, 0, -size * 0.43, size);
      ctx.restore();
      sprite(ctx, images.lantern, x, y - size * 0.42 + bob, size);
      if (lit || i === run.current) {
        const alpha = lit ? 0.88 : 0.28;
        glow(ctx, x, y - size * 0.4, lit ? 20 : 11, `rgba(255,176,66,${alpha})`);
        ellipse(ctx, x, y - size * 0.4, 2.5, 4.5, lit ? "#fff0aa" : "#c39a63");
        for (let j = 1; j < 8; j++)
          ellipse(
            ctx,
            x + Math.sin(j * 2 + t) * j * 0.4,
            y + j * 2,
            4 + j * 0.6,
            0.62,
            `rgba(255,191,95,${(1 - j / 8) * alpha * 0.5})`,
          );
      }
    } else if (world.id === "drone") {
      if (lit) {
        shadow(ctx, x + 8, y + 2, 20, 6, 0.48);
        sprite(ctx, images.sapling, x, y - 18, 54);
        sprite(ctx, images.sapling, x + 16, y - 4, 28, 0.3);
      } else {
        shadow(ctx, x, y, 17, 6, 0.35);
        for (let k = 0; k < 3; k++) {
          const px = x + (k - 1) * 7;
          ctx.fillStyle = "#a27149";
          ctx.fillRect(px, y - 5 - (k % 2), 2, 7);
          ellipse(ctx, px + 2, y - 6 - (k % 2), 3.4, 1.8, "#a6ac62");
        }
      }
    } else {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.42);
      ctx.fillStyle = "#344c64";
      ctx.strokeStyle = "#a8c8d1";
      ctx.lineWidth = 1;
      for (const side of [-1, 1]) {
        const left = side < 0 ? -21 : 6;
        ctx.fillRect(left, -5, 15, 10);
        ctx.strokeRect(left, -5, 15, 10);
        for (let n = 1; n < 4; n++) {
          ctx.fillStyle = "#798daa";
          ctx.fillRect(left + n * 3.5, -5, 0.6, 10);
        }
      }
      ellipse(ctx, 0, 0, 6, 9, "#b3b3aa");
      ellipse(ctx, -1, -3, 4, 5, "#e3d0a7");
      ctx.restore();
      glow(ctx, x, y - 6, 8, lit ? "#d0ffc1" : "#a9e9fc", "transparent");
    }
  });
  if (world.id === "drone") {
    for (let j = 0; j < 3; j++) {
      const age = (t * 0.6 + j / 3) % 1;
      ctx.lineWidth = 1;
      ellipse(ctx, spring.x, spring.y, 4 + age * 17, 2 + age * 6, `rgba(178,233,241,${1 - age})`, true);
    }
  }
}
function actor(ctx: Brush, world: World, run: Run, images: Images) {
  const { x, y } = run.position,
    t = run.time,
    h = run.heading;
  const speed = Math.hypot(run.velocity.x, run.velocity.y) / world.speed;
  if (world.id === "koi") {
    run.companions.forEach((f, i) => {
      ctx.globalAlpha = 0.8;
      shadow(ctx, f.x + 3, f.y + 5, 18, 6, 0.31);
      sprite(ctx, images.koi, f.x, f.y, 44 + i * 3, f.heading, t * (3 + speed * 3) + i);
    });
    ctx.globalAlpha = 1;
    shadow(ctx, x + 4, y + 6, 25, 9, 0.4);
    sprite(ctx, images.koi, x, y, 70 + (y - 370) * 0.1, h, t * (3 + speed * 4));
  } else if (world.id === "boat") {
    const size = 87 + (y - 280) * 0.19;
    ctx.save();
    ctx.translate(x, y + 7);
    ctx.scale(1, -0.48);
    ctx.globalAlpha = 0.19;
    sprite(ctx, images.boat, 0, 0, size, h, t * speed * 5);
    ctx.restore();
    shadow(ctx, x, y + 4, size * 0.39, size * 0.13, 0.6);
    sprite(ctx, images.boat, x, y + Math.sin(t * 1.6) * 1.3, size, h, t * (speed > 0.07 ? 4.6 : 0.65));
  } else if (world.id === "drone") {
    const height = run.progress !== null ? 11 : 23 + Math.sin(t * 2) * 2;
    shadow(ctx, x + 9, y + 3, 31, 10, 0.64);
    sprite(ctx, images.drone, x, y - height, 79, h, t * 14);
    for (const side of [-1, 1]) {
      const a = t * 7 + side;
      ellipse(ctx, x + Math.cos(a) * 13, y + Math.sin(a) * 4, 2.1, 0.8, "rgba(219,208,168,.36)");
    }
  } else {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(h);
    for (const s of [-1, 1]) {
      const length = 7 + speed * 21 + Math.sin(t * 33) * 2;
      const flame = ctx.createLinearGradient(0, 15, 0, 20 + length);
      flame.addColorStop(0, "#ecfeff");
      flame.addColorStop(0.3, "#7acffe");
      flame.addColorStop(1, "rgba(90,140,255,0)");
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(s * 9 - 3, 15);
      ctx.quadraticCurveTo(s * 9 - 5, 22, s * 9, 20 + length);
      ctx.lineTo(s * 9 + 3, 15);
      ctx.fill();
    }
    ctx.restore();
    sprite(ctx, images.ship, x, y, 85, h);
    if (run.impact > 0) {
      ctx.lineWidth = 2;
      ellipse(ctx, x, y, 34, 28, `rgba(255,170,132,${run.impact * 0.4})`, true);
    }
  }
}
function actionEffect(ctx: Brush, world: World, run: Run, site: Point) {
  if (run.progress === null) return;
  const p = run.progress / world.duration,
    t = run.time;
  if (world.id === "koi" || world.id === "drone") {
    for (let i = 0; i < 13; i++) {
      const phase = (p * 2 + i * 0.071) % 1;
      const x = run.position.x + (site.x - run.position.x) * phase + Math.sin(i * 2.4) * phase * 12;
      const y =
        run.position.y +
        (site.y - run.position.y) * phase -
        (1 - phase) * (world.id === "drone" ? 23 : 0) -
        Math.sin(phase * Math.PI) * 6;
      ellipse(ctx, x, y, world.id === "koi" ? 2 : 1.2, 2, world.id === "koi" ? "#cf9b55" : "#a6e1e9");
    }
  } else if (world.id === "ship") {
    ctx.strokeStyle = "#ace9ee";
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(run.position.x, run.position.y);
    ctx.lineTo(site.x, site.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ellipse(ctx, site.x, site.y, 4 + p * 34, 4 + p * 34, `rgba(146,235,255,${1 - p})`, true);
  } else {
    glow(ctx, site.x, site.y - 15, 8 + p * 19, `rgba(255,191,72,${0.5 + 0.15 * Math.sin(t * 8)})`);
  }
}
export function paint(
  ctx: Brush,
  width: number,
  height: number,
  world: World,
  run: Run,
  images: Images,
  quiet: boolean,
) {
  const { scale, left, top } = cameraFor(width, height, run.position.x);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-left, -top);
  ctx.drawImage(images.plate, 0, 0, 1000, 562);
  if (!quiet && (world.id === "boat" || world.id === "koi"))
    water(ctx, images.plate, run.time, world.id === "boat");
  drawSites(ctx, world, run, images);
  if (world.id === "ship") {
    for (let i = 0; i < asteroidCount; i++) {
      const r = asteroidAt(i, run.time);
      sprite(ctx, images.asteroid, r.x, r.y, asteroidRadius(i) * 2.6, i + run.time * 0.21);
    }
  }
  if (run.destination && !run.finish) {
    ctx.lineWidth = 1.2;
    ellipse(ctx, run.destination.x, run.destination.y, 7, 4, "#fff9d6", true);
  }
  const target = objective(world, run);
  if (!run.finish) {
    const pulse = quiet ? 0 : (Math.sin(run.time * 2.8) + 1) * 2.5;
    ctx.lineWidth = 1.6;
    ellipse(ctx, target.x, target.y + 2, 23 + pulse, 8 + pulse * 0.4, world.color, true);
    const y = target.y - (world.id === "boat" ? 55 : world.id === "drone" ? 26 : 25);
    ctx.fillStyle = world.color;
    ctx.beginPath();
    ctx.moveTo(target.x - 4, y);
    ctx.lineTo(target.x + 4, y);
    ctx.lineTo(target.x, y + 5);
    ctx.fill();
  }
  if (!quiet) wake(ctx, run, world);
  actor(ctx, world, run, images);
  actionEffect(ctx, world, run, target);
  if (!run.finish && (target.x < left + 20 || target.x > left + width / scale - 20)) {
    const side = target.x < left ? -1 : 1,
      x = side < 0 ? left + 18 : left + width / scale - 18;
    ctx.save();
    ctx.translate(x, target.y);
    ctx.scale(side, 1);
    ctx.fillStyle = world.color;
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(-6, -7);
    ctx.lineTo(-6, 7);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
