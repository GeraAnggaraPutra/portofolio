import {
  asteroidAt,
  asteroidCount,
  asteroidRadius,
  beltCount,
  clamp,
  distance,
  dragonfly,
  dropPoint,
  techniques,
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
export function cameraFor(width: number, height: number, position: Point, world: World) {
  const magnification = { koi: 1.22, boat: 1.14, drone: 1.19, ship: 1.1 }[world.id];
  const scale = Math.max(width / 1000, height / 562) * magnification;
  const x = position.x;
  const left = clamp(x - width / (2 * scale), 0, Math.max(0, 1000 - width / scale));
  const top = clamp(281 + (position.y - 281) * 0.22 - height / (2 * scale), 0, 562 - height / scale);
  return { scale, left, top };
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

function pondDetails(ctx: Brush, run: Run, plate: Bitmap, hasShader: boolean) {
  const t = run.time;
  if (!hasShader) {
    // Animate the source cascade even on devices using only the 2D canvas.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(145, 192);
    ctx.quadraticCurveTo(169, 218, 176, 274);
    ctx.lineTo(212, 274);
    ctx.quadraticCurveTo(201, 212, 172, 192);
    ctx.closePath();
    ctx.clip();
    for (let y = 192; y < 275; y += 3) {
      const sy = y - 3 * Math.sin(t * 9 - y * 0.16);
      ctx.drawImage(
        plate,
        (145 * plate.width) / 1000,
        (sy * plate.height) / 562,
        (70 * plate.width) / 1000,
        (3.2 * plate.height) / 562,
        145,
        y,
        70,
        3.2,
      );
    }
    ctx.restore();
    // Bend just the hanging branch tips around their attachment to the canopy.
    for (const [x, y, w, h] of [
      [232, 156, 47, 25],
      [504, 80, 35, 21],
      [791, 124, 41, 18],
    ]) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0.25, 0, TAU);
      ctx.clip();
      ctx.translate(x - w, y - h);
      ctx.rotate(0.015 * Math.sin(t * 1.5 + x));
      ctx.translate(w - x, h - y);
      ctx.drawImage(plate, 0, 0, 1000, 562);
      ctx.restore();
    }
  }
  for (const crest of run.ripples) {
    const age = t - crest.born,
      r = 3 + age * 32,
      alpha = (1 - age / 1.6) * crest.power;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `rgba(240,224,191,${alpha * 0.24})`;
    ctx.beginPath();
    ctx.ellipse(crest.x, crest.y, r, r * 0.52, 0, 0.16, 2.55);
    ctx.stroke();
    ctx.strokeStyle = `rgba(20,49,41,${alpha * 0.24})`;
    ctx.beginPath();
    ctx.ellipse(crest.x, crest.y, r + 1, r * 0.52 + 1, 0, 3.05, 5.8);
    ctx.stroke();
  }
  for (let i = 0; i < 13; i++) {
    const age = (t * 1.5 + i * 0.618) % 1;
    const x = 173 + (i % 6) * 5 + Math.sin(i * 24) * age * 16,
      y = 274 - 12 * age + 15 * age * age;
    ellipse(ctx, x, y, 0.75, 0.85, `rgba(238,247,240,${0.58 * (1 - age)})`);
  }
  for (let i = 0; i < 7; i++) {
    const progress = (t / (14 + i * 0.8) + i * 0.618) % 1;
    const fall = Math.min(1, progress / 0.73),
      drift = Math.max(0, progress - 0.73) * 65;
    const x = 146 + ((i * 151) % 694) + fall * 36 + Math.sin(fall * 9 + i) * 11 + drift;
    const surface = 315 + (i % 4) * 24,
      y = 52 + (i % 3) * 18;
    const py = y + (surface - y) * fall;
    if (fall === 1) {
      const radius = 3 + drift * 2;
      ctx.lineWidth = 0.75;
      ellipse(
        ctx,
        x - drift,
        surface,
        radius,
        radius * 0.43,
        `rgba(249,233,197,${0.26 * (1 - drift / 18)})`,
        true,
      );
    }
    ctx.save();
    ctx.translate(x, py);
    ctx.rotate(fall === 1 ? 0.36 : Math.sin(fall * 11 + i) * 1.1);
    ctx.scale(1, fall === 1 ? 0.42 : 0.4 + 0.6 * Math.abs(Math.cos(fall * 13 + i)));
    ctx.globalAlpha = clamp((1 - progress) * 9, 0, 1);
    ctx.fillStyle = i % 2 ? "#9e3921" : "#be622b";
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(-4, -0.8);
    ctx.lineTo(-1.2, -0.5);
    ctx.lineTo(-2.1, -3.2);
    ctx.lineTo(-0.5, -2);
    ctx.lineTo(0.6, -5);
    ctx.lineTo(1, -1.6);
    ctx.lineTo(4, -3);
    ctx.lineTo(2, 0.1);
    ctx.lineTo(4.5, -0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function orbitalBelt(ctx: Brush, images: Images, time: number) {
  // Distant debris shares the orbital plane with the six rocks in the flight corridor.
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < asteroidCount + beltCount; i++) {
      const rock = asteroidAt(i, time);
      if (
        rock.hidden ||
        Number(rock.depth >= 0) !== layer ||
        rock.x < -36 ||
        rock.x > 1036 ||
        rock.y < -36 ||
        rock.y > 598
      )
        continue;
      const hazard = i < asteroidCount;
      const size = (hazard ? asteroidRadius(i) * 2.6 : 1.4 + ((i * 37) % 13) * 0.49) * rock.scale;
      ctx.globalAlpha = hazard ? 1 : 0.5 + 0.21 * rock.depth;
      sprite(ctx, images.asteroid, rock.x, rock.y, size, i + time * (0.16 + (i % 5) * 0.065));
    }
  }
  ctx.globalAlpha = 1;
}

function islandWater(ctx: Brush, plate: Bitmap, t: number) {
  // Each ribbon follows a photographed lip and its plunge pool. Advect narrow
  // bands inside the falling water so the surrounding rock stays fixed.
  for (const [lipX, lipY, footX, footY, width] of [
    [728, 31, 715, 69, 10],
    [693, 80, 681, 129, 13],
  ]) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lipX - width * 0.6, lipY);
    ctx.lineTo(lipX + width, lipY);
    ctx.quadraticCurveTo(footX + width, footY - 15, footX + width, footY);
    ctx.lineTo(footX - width, footY);
    ctx.closePath();
    ctx.clip();
    for (let y = lipY; y < footY; y += 3) {
      const depth = (y - lipY) / (footY - lipY),
        left = footX - width - 2,
        w = lipX + width - left;
      const sy = y - Math.sin(t * 9 - y * 0.34) * Math.sin(Math.PI * depth) * 3.2;
      ctx.drawImage(
        plate,
        (left * plate.width) / 1000,
        (sy * plate.height) / 562,
        (w * plate.width) / 1000,
        (3.3 * plate.height) / 562,
        left,
        y,
        w,
        3.3,
      );
    }
    ctx.restore();
    for (let i = 0; i < 3; i++) {
      const age = (t * 0.68 + i / 3) % 1;
      ctx.strokeStyle = `rgba(224,249,250,${(1 - age) * 0.38})`;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.ellipse(footX, footY, 5 + age * width * 1.5, 1 + age * 4, -0.12, 0.05, 2.99);
      ctx.stroke();
    }
  }
  // Sets of small waves break at an angle across the actual southern beach.
  for (let i = 0; i < 2; i++) {
    const age = (t * 0.16 + i * 0.5) % 1,
      offset = 16 * (1 - age);
    ctx.strokeStyle = `rgba(239,249,232,${Math.sin(age * Math.PI) * 0.4})`;
    ctx.lineWidth = 0.9 + age;
    ctx.beginPath();
    ctx.moveTo(445, 482 + offset);
    ctx.bezierCurveTo(519, 462 + offset, 568, 442 + offset, 627, 470 + offset);
    ctx.quadraticCurveTo(665, 495 + offset, 719, 504 + offset);
    ctx.stroke();
  }
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
        const growth = 0.16 + 0.84 * (1 - Math.exp(-1.4 * (t - run.plantedAt[i])));
        const sway = Math.sin(t * 1.65 + i) * 1.4;
        shadow(ctx, x + 8, y + 2, 20 * growth, 6 * growth, 0.48);
        sprite(ctx, images.sapling, x + sway * growth, y - 18 * growth, 54 * growth);
        sprite(ctx, images.sapling, x + 16, y - 4 * growth, 28 * growth, 0.3);
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
      ctx.globalAlpha = 0.72 + 0.07 * Math.sin(t * 0.69 + i);
      shadow(ctx, f.x + 3, f.y + 5, 18, 6, 0.31);
      sprite(ctx, images.koi, f.x, f.y, 44 + i * 3, f.heading, f.beat * 12);
    });
    ctx.globalAlpha = 1;
    shadow(ctx, x + 4, y + 6, 25, 9, 0.4);
    const leap = run.maneuver
      ? Math.sin(Math.PI * clamp((t - run.maneuver.started) / techniques.koi.duration, 0, 1))
      : 0;
    ctx.globalAlpha = 0.82 + leap * 0.18;
    sprite(
      ctx,
      images.koi,
      x,
      y - leap * 29,
      (70 + (y - 370) * 0.1) * (1 + leap * 0.12),
      h,
      run.swimBeat * 12,
    );
    ctx.globalAlpha = 1;
  } else if (world.id === "boat") {
    const size = 87 + (y - 280) * 0.19;
    ctx.save();
    ctx.translate(x, y + 7);
    ctx.scale(1, -0.48);
    ctx.globalAlpha = 0.19;
    sprite(ctx, images.boat, 0, 0, size, h, run.oarBeat);
    ctx.restore();
    shadow(ctx, x, y + 4, size * 0.39, size * 0.13, 0.6);
    sprite(ctx, images.boat, x, y + Math.sin(t * 1.6) * 1.3, size, h, run.oarBeat);
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

function drawDragonfly(ctx: Brush, world: World, run: Run, quiet: boolean) {
  if (run.caughtAt === run.current) return;
  const insect = dragonfly(world, run),
    t = run.time;
  const height = 15 + Math.sin(t * 2.3) * 2;
  shadow(ctx, insect.x + 3, insect.y + 1, 8, 2.8, 0.52);
  ctx.save();
  ctx.translate(insect.x, insect.y - height);
  ctx.rotate(
    Math.atan2(17 * Math.cos(t * 0.91 + Math.PI / 2), 26 * Math.cos(t * 0.79) + 17 * Math.cos(t * 1.87)),
  );
  const span = quiet ? 1 : 0.72 + Math.cos(t * 42) * 0.25;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.rotate(side * (0.22 + i * 0.42));
      ellipse(ctx, 0, side * 5.6 * span, 2.3, 7 * span, "rgba(195,237,242,.72)");
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = "#63858b";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, side * 11 * span);
      ctx.stroke();
      ctx.restore();
    }
  }
  ellipse(ctx, -3.6, 0, 7, 1.05, "#498e91");
  ellipse(ctx, 1, 0, 3.2, 1.85, "#183e43");
  ellipse(ctx, 3.6, 0, 1.9, 2.2, "#6cbdb8");
  ctx.restore();
}

function equipment(ctx: Brush, world: World, run: Run, quiet: boolean) {
  const m = run.maneuver,
    t = run.time,
    p = m ? clamp((t - m.started) / techniques[world.id].duration, 0, 1) : 0;
  if (world.id === "koi") {
    drawDragonfly(ctx, world, run, quiet);
    if (m && !quiet) {
      for (let i = 0; i < 12; i++) {
        const angle = i * 2.4,
          r = 6 + p * 24;
        ellipse(
          ctx,
          m.from.x + Math.cos(angle) * r,
          m.from.y + Math.sin(angle) * r * 0.46 - 14 * Math.sin(Math.PI * p),
          1.2,
          0.85,
          `rgba(231,242,228,${1 - p})`,
        );
      }
    }
  } else if (world.id === "boat" && m) {
    for (const side of [-1, 1]) {
      const x = m.from.x + side * Math.cos(m.heading) * 22,
        y = m.from.y + side * Math.sin(m.heading) * 14;
      ctx.lineWidth = 1.2;
      ellipse(ctx, x, y, 4 + p * 22, 2 + p * 8, `rgba(253,223,172,${(1 - p) * 0.72})`, true);
    }
  } else if (world.id === "drone" && run.water > 0 && run.progress === null) {
    const hit = m?.to ?? dropPoint(run);
    const aligned = world.sites.some((s, i) => !run.visited[i] && distance(s, hit) < 28);
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = aligned ? "#d8f8aa" : "rgba(246,242,210,.74)";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(hit.x, hit.y, 12, 6, 0, (i * Math.PI) / 2 + 0.2, (i * Math.PI) / 2 + 1.2);
      ctx.stroke();
    }
    if (m) {
      const x = m.from.x + (hit.x - m.from.x) * p,
        y = m.from.y + (hit.y - m.from.y) * p;
      shadow(ctx, x, y, 5, 2, 0.62);
      ellipse(ctx, x, y - 27 * (1 - p * p), 3.2, 4.2, "#ae8c59");
      ellipse(ctx, x - 1, y - 28 * (1 - p * p), 1.2, 2, "#dad09c");
    }
  } else if (world.id === "ship") {
    if (m) {
      ctx.save();
      ctx.translate(run.position.x, run.position.y);
      const shield = ctx.createRadialGradient(-5, -5, 6, 0, 0, 43);
      shield.addColorStop(0, "rgba(114,221,255,0)");
      shield.addColorStop(0.84, "rgba(76,173,214,.09)");
      shield.addColorStop(0.97, "rgba(167,235,255,.65)");
      shield.addColorStop(1, "transparent");
      ctx.fillStyle = shield;
      ctx.scale(1, 0.81);
      ctx.fillRect(-44, -44, 88, 88);
      ctx.restore();
    }
    for (let i = 0; i < asteroidCount; i++) {
      const a = asteroidAt(i, t),
        dist = distance(a, run.position);
      if (a.hidden || dist > 94 || dist < 1) continue;
      const angle = Math.atan2(a.y - run.position.y, a.x - run.position.x);
      ctx.lineWidth = 2;
      ctx.strokeStyle = m ? "#9fdef4" : "#f1b97a";
      ctx.beginPath();
      ctx.arc(run.position.x, run.position.y, 36, angle - 0.27, angle + 0.27);
      ctx.stroke();
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
  pondRendered = false,
) {
  const { scale, left, top } = cameraFor(width, height, run.position, world);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-left, -top);
  if (pondRendered) ctx.clearRect(left, top, width / scale, height / scale);
  else ctx.drawImage(images.plate, 0, 0, 1000, 562);
  if (!quiet && !pondRendered && (world.id === "boat" || world.id === "koi"))
    water(ctx, images.plate, run.time, world.id === "boat");
  if (world.id === "boat") {
    const dusk = run.visited.filter(Boolean).length / world.sites.length;
    ctx.fillStyle = `rgba(19,24,59,${0.32 * dusk})`;
    ctx.fillRect(0, 0, 1000, 562);
  } else if (world.id === "drone" && !quiet) {
    islandWater(ctx, images.plate, run.time);
    // Broad soft cloud shadows travel over the terrain, below the drone and its payload.
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(((run.time * (8 + i * 2) + i * 633) % 1590) - 260, 155 + i * 170);
      ctx.scale(1, 0.42);
      glow(ctx, 0, 0, 260, "rgba(31,47,52,.22)", "rgba(31,47,52,0)");
      ctx.restore();
    }
  }
  drawSites(ctx, world, run, images);
  if (world.id === "ship") orbitalBelt(ctx, images, run.time);
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
  if (!quiet && world.id !== "koi") wake(ctx, run, world);
  actor(ctx, world, run, images);
  equipment(ctx, world, run, quiet);
  if (!quiet && world.id === "koi") pondDetails(ctx, run, images.plate, pondRendered);
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
