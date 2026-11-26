"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Compass,
  Crosshair,
  Droplets,
  Flag,
  Leaf,
  Pause,
  Play,
  RotateCcw,
  Waves,
} from "lucide-react";
import {
  actionLabel,
  advance,
  clamp,
  distance,
  newRun,
  objective,
  steerTo,
  beginAction,
  lakeWind,
  lightingThreshold,
  worlds,
  type Direction,
  type Run,
} from "@/lib/game-rules";
import { cameraFor, loadArtwork, paint } from "@/lib/arcade-painter";
import { createPondSurface } from "@/lib/pond-surface";
import styles from "./game-arcade.module.css";

const icons = [Waves, Flag, Leaf, Compass];
const directions = { up: ArrowUp, left: ArrowLeft, down: ArrowDown, right: ArrowRight };
const keys: Record<string, Direction> = {
  ArrowUp: "up",
  w: "up",
  ArrowDown: "down",
  s: "down",
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
};
type Mode = "menu" | "loading" | "playing" | "paused" | "ended" | "error";
type World = (typeof worlds)[number];
function readHud(world: World, run: Run) {
  const target = objective(world, run);
  const near = distance(run.position, target) <= world.reach;
  const dx = target.x - run.position.x,
    dy = target.y - run.position.y;
  const bearing = near
    ? "In range"
    : [dy < -19 ? "north" : dy > 19 ? "south" : "", dx < -19 ? "west" : dx > 19 ? "east" : ""].join("");
  return {
    done: run.visited.filter(Boolean).length,
    near,
    wind: lakeWind(run.time),
    bearing,
    target: target.name,
    amount: run.water,
    fuel: Math.ceil(run.fuel),
    shields: run.shields,
    message: run.message,
    action: actionLabel(world, run),
    charge: run.progress === null ? null : Math.round((run.progress / world.duration) * 100),
  };
}
function GameSession({ world, run }: { world: World; run: Run }) {
  const [mode, setMode] = useState<Mode>(run.finish ? "ended" : "menu");
  const [hud, setHud] = useState(() => readHud(world, run));
  const canvas = useRef<HTMLCanvasElement>(null);
  const waterCanvas = useRef<HTMLCanvasElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const artwork = useRef<Awaited<ReturnType<typeof loadArtwork>> | null>(null);
  const held = useRef(new Set<Direction>());
  const taps = useRef<Partial<Record<Direction, number>>>({});
  const clear = useCallback(() => {
    held.current.clear();
    taps.current = {};
  }, []);
  const focusScene = () => canvas.current?.focus({ preventScroll: true });
  function engage() {
    clear();
    if (!artwork.current) {
      setMode("loading");
      return;
    }
    setMode("playing");
    focusScene();
  }
  function restart() {
    Object.assign(run, newRun(world));
    setHud(readHud(world, run));
    engage();
  }
  function act() {
    if (mode !== "playing") return;
    beginAction(world, run);
    setHud(readHud(world, run));
  }
  useEffect(() => {
    if (mode !== "loading") return;
    let cancelled = false;
    loadArtwork(world)
      .then((images) => {
        if (cancelled) return;
        artwork.current = images;
        setMode("playing");
        canvas.current?.focus({ preventScroll: true });
      })
      .catch(() => {
        if (!cancelled) setMode("error");
      });
    return () => {
      cancelled = true;
    };
  }, [world, mode]);
  useEffect(() => {
    if (mode !== "playing") return;
    const surface = canvas.current,
      images = artwork.current,
      panel = shell.current;
    if (!surface || !panel || !images) return;
    const ctx = surface.getContext("2d", { alpha: world.id === "koi" });
    if (!ctx) {
      setMode("error");
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const water = waterCanvas.current;
    const pond = water && !motion.matches ? createPondSurface(water, images.plate) : null;
    let raf = 0,
      last = 0,
      lastHud = 0,
      width = 0,
      height = 0;
    function draw() {
      if (!ctx || !images || !width || !height) return;
      const cam = cameraFor(width, height, run.position.x);
      const rendered =
        !motion.matches && pond?.draw(run, cam.left, cam.top, width / cam.scale, height / cam.scale);
      paint(ctx, width, height, world, run, images, motion.matches, !!rendered);
    }
    function fit() {
      if (!surface || !ctx || !images) return;
      width = surface.clientWidth;
      height = surface.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      if (water && pond) {
        // Refraction is low frequency. Keep its fill cost independent of device pixel ratio.
        const factor = Math.min(1, 1100 / width);
        water.width = Math.round(width * factor);
        water.height = Math.round(height * factor);
      }
      ctx.setTransform(surface.width / width, 0, 0, surface.height / height, 0, 0);
      draw();
    }
    function frame(now: number) {
      if (!ctx || !images) return;
      const dt = last ? Math.min(0.08, (now - last) / 1000) : 0;
      // A 30fps ceiling keeps the large landscape inexpensive on touch devices.
      if (last && now - last < 31) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      const pressed = (key: Direction) =>
        Number(held.current.has(key) || (taps.current[key] ?? 0) > now);
      const axis = { x: pressed("right") - pressed("left"), y: pressed("down") - pressed("up") };
      advance(world, run, axis, dt);
      draw();
      if (now - lastHud >= 110 || run.finish) {
        setHud(readHud(world, run));
        lastHud = now;
      }
      if (run.finish) {
        setMode("ended");
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    const release = (e: globalThis.KeyboardEvent) => held.current.delete(keys[e.key]);
    const pause = () => {
      clear();
      setMode("paused");
    };
    const visibility = () => {
      if (document.hidden) pause();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    const resize = new ResizeObserver(fit);
    resize.observe(surface);
    intersection.observe(panel);
    fit();
    raf = requestAnimationFrame(frame);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      pond?.dispose();
      intersection.disconnect();
      clear();
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [mode, world, run, clear]);
  function keyboard(e: KeyboardEvent) {
    if (mode !== "playing" || e.ctrlKey || e.metaKey || e.altKey) return;
    const direction = keys[e.key];
    if (direction) {
      e.preventDefault();
      held.current.add(direction);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setMode("paused");
    } else if ((e.key === " " || e.key === "Enter") && e.target === canvas.current) {
      e.preventDefault();
      if (!e.repeat) act();
    }
  }
  const active = mode === "playing",
    overlay = !active;
  const resumed = run.time > 0 && !run.finish;
  return (
    <div
      ref={shell}
      className={styles.session}
      onKeyDown={keyboard}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) clear();
      }}
      style={{ "--accent": world.color } as CSSProperties}
    >
      <div className={styles.stage} style={{ backgroundImage: `url('/games/${world.image}.webp')` }}>
        {world.id === "koi" && <canvas ref={waterCanvas} className={styles.canvas} aria-hidden="true" />}
        <canvas
          ref={canvas}
          tabIndex={active ? 0 : -1}
          className={styles.canvas}
          aria-label={`${world.title} playfield. Tap a destination or steer with the arrow keys. Press Space to ${hud.action.toLowerCase()}.`}
          onPointerUp={(e) => {
            if (!active) return;
            const rect = e.currentTarget.getBoundingClientRect(),
              cam = cameraFor(rect.width, rect.height, run.position.x);
            steerTo(world, run, {
              x: (e.clientX - rect.left) / cam.scale + cam.left,
              y: (e.clientY - rect.top) / cam.scale + cam.top,
            });
            focusScene();
          }}
        />
        {active && (
          <div className={styles.instruments}>
            <span>{world.title}</span>
            <button type="button" onClick={() => setMode("paused")} aria-label="Pause game">
              <Pause size={16} /> Pause
            </button>
          </div>
        )}
        {overlay && (
          <div className={styles.cover}>
            <div className={styles.coverCopy}>
              <span className={styles.location}>{world.region}</span>
              <h3>
                {mode === "ended"
                  ? run.finish === "won"
                    ? world.finale
                    : run.message
                  : mode === "paused"
                    ? "Journey paused."
                    : world.title}
              </h3>
              <p>
                {mode === "error"
                  ? "The scene could not load. Retry to open this world."
                  : mode === "ended"
                    ? run.finish === "won"
                      ? `All ${world.sites.length} ${world.noun} complete.`
                      : `You finished ${hud.done} of ${world.sites.length} surveys.`
                    : world.objective}
              </p>
              <button
                type="button"
                className={styles.launch}
                disabled={mode === "loading"}
                onClick={mode === "ended" ? restart : engage}
              >
                {mode === "ended" ? <RotateCcw size={16} /> : <Play size={15} fill="currentColor" />}
                {mode === "loading"
                  ? "Loading world…"
                  : mode === "ended"
                    ? "Play again"
                    : mode === "error"
                      ? "Retry"
                      : resumed || mode === "paused"
                        ? "Resume game"
                        : "Start playing"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.console}>
        <div className={styles.readout}>
          <div className={styles.mission}>
            <span className={styles.eyebrow}>
              {hud.done} / {world.sites.length} {world.noun}
            </span>
            {world.id === "drone" && (
              <span>
                <Droplets size={13} /> Tank {hud.amount}/2
              </span>
            )}
            {world.id === "ship" && (
              <span>
                Shield {hud.shields}/3 · Fuel {hud.fuel}%
              </span>
            )}
            {world.id === "boat" && (
              <span className={styles.wind}>
                <span className={styles.windTrack} aria-hidden="true">
                  <i style={{ left: hud.wind * 100 + "%" }} />
                </span>
                {hud.wind > lightingThreshold ? "Gust" : "Lull"}
              </span>
            )}
          </div>
          <strong aria-live="polite">
            {run.finish ? (run.finish === "won" ? "Journey complete" : run.message) : hud.target}
          </strong>
          <p>
            {mode === "playing"
              ? hud.charge !== null
                ? `${hud.action} · ${hud.charge}%`
                : hud.message ||
                  (hud.near
                    ? `In range · ${hud.action}`
                    : `Head ${hud.bearing} towards the marked site.`)
              : "Tap a destination or steer with the arrow buttons."}
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.pad} role="group" aria-label="Movement controls">
            {(Object.entries(directions) as [Direction, typeof ArrowUp][]).map(([dir, Icon]) => (
              <button
                type="button"
                key={dir}
                aria-label={`Move ${dir}`}
                disabled={!active}
                style={{ gridArea: dir }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  held.current.add(dir);
                  taps.current[dir] = performance.now() + 170;
                }}
                onPointerUp={() => held.current.delete(dir)}
                onPointerCancel={() => {
                  held.current.delete(dir);
                  delete taps.current[dir];
                }}
                onLostPointerCapture={() => held.current.delete(dir)}
                onClick={(e) => {
                  if (e.detail === 0) taps.current[dir] = performance.now() + 210;
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.action}
              type="button"
              disabled={!active || hud.charge !== null}
              onClick={act}
            >
              <Crosshair size={15} />
              {hud.action}
            </button>
            <button
              className={styles.restart}
              type="button"
              disabled={mode === "loading" || !run.time}
              onClick={restart}
            >
              <RotateCcw size={13} /> Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export function GameArcade() {
  const [selected, setSelected] = useState(0);
  const [sessions] = useState(() => worlds.map(newRun));
  const world = worlds[selected];
  return (
    <section id="unwind" aria-labelledby="arcade-title" className="container-x py-20 sm:py-28">
      <div className={styles.heading}>
        <div>
          <p className={styles.sectionLabel}>Explore / Interactive worlds</p>
          <h2 id="arcade-title">Take a little detour.</h2>
        </div>
        <p>
          Follow a school of koi, row at dusk, restore an island or chart a course through the stars.
        </p>
      </div>
      <div className={styles.arcade}>
        <div className={styles.shelf} role="group" aria-label="Choose a game">
          {worlds.map((item, i) => {
            const Icon = icons[i];
            return (
              <button
                type="button"
                key={item.id}
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                <span
                  className={styles.thumb}
                  style={{ backgroundImage: `url('/games/${item.image}.webp')` }}
                />
                <span>
                  <small>{item.region}</small>
                  <b>{item.title}</b>
                </span>
                {i === selected ? <Check size={14} /> : <Icon size={14} />}
              </button>
            );
          })}
        </div>
        <label className={styles.picker}>
          <Compass size={18} />
          <span>Choose a world</span>
          <select
            value={selected}
            onChange={(e) => setSelected(clamp(Number(e.target.value), 0, worlds.length - 1))}
          >
            {worlds.map((item, i) => (
              <option key={item.id} value={i}>
                {item.title}
              </option>
            ))}
          </select>
          <ChevronDown size={16} />
        </label>
        <GameSession key={world.id} world={world} run={sessions[selected]} />
      </div>
    </section>
  );
}
