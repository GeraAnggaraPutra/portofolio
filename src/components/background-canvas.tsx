"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const COLS = 24;
const ROWS = 24;
const TW = 58;
const TH = 29;

type Box = {
  col: number;
  row: number;
  baseH: number;
  currentH: number;
  wave: number; // -1 to 1
};

function drawBox(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  h: number,
  wave: number, // used for subtle top-face brightness
) {
  if (h < 1) return;

  const tl = { x: bx - TW / 2, y: by - h };
  const tb = { x: bx, y: by - TH / 2 - h };
  const tr = { x: bx + TW / 2, y: by - h };
  const tf = { x: bx, y: by + TH / 2 - h };
  const bl = { x: bx - TW / 2, y: by };
  const bb = { x: bx, y: by - TH / 2 };
  const br = { x: bx + TW / 2, y: by };
  const bf = { x: bx, y: by + TH / 2 };

  // Left face
  ctx.beginPath();
  ctx.moveTo(bl.x, bl.y);
  ctx.lineTo(bb.x, bb.y);
  ctx.lineTo(tb.x, tb.y);
  ctx.lineTo(tl.x, tl.y);
  ctx.closePath();
  ctx.fillStyle = "#0a0905";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.02)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(br.x, br.y);
  ctx.lineTo(bf.x, bf.y);
  ctx.lineTo(tf.x, tf.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.closePath();
  ctx.fillStyle = "#0d0b07";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.025)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Top face — brightness varies with wave (no color, just warm neutral)
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tb.x, tb.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(tf.x, tf.y);
  ctx.closePath();

  // wave -1..1 → opacity 0.02..0.10
  const topBrightness = 0.03 + Math.max(0, wave) * 0.09;
  ctx.fillStyle = `rgba(255,248,235,${topBrightness})`;
  ctx.fill();

  // Top edge — very subtle
  ctx.strokeStyle = `rgba(255,248,235,${topBrightness * 0.6})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const boxes: Box[] = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        boxes.push({
          col,
          row,
          baseH: 3 + Math.random() * 14,
          currentH: 4,
          wave: 0,
        });
      }
    }

    // Painter's algorithm: back-to-front
    boxes.sort((a, b) => a.col + a.row - (b.col + b.row));

    let time = 0;
    let offsetX = 0;
    let offsetY = 0;

    const calcOffset = () => {
      offsetX = W / 2;
      offsetY = H * 0.18;
    };
    calcOffset();

    const toScreen = (col: number, row: number) => ({
      x: offsetX + (col - row) * (TW / 2),
      y: offsetY + (col + row) * (TH / 2),
    });

    const ticker = gsap.ticker.add(() => {
      time += 0.012;
      ctx.clearRect(0, 0, W, H);

      for (const box of boxes) {
        const wave =
          Math.sin(box.col * 0.42 + box.row * 0.33 + time) * 0.55 +
          Math.sin(box.col * 0.25 - box.row * 0.38 + time * 0.65) * 0.45;

        box.wave += (wave - box.wave) * 0.06;
        const targetH = box.baseH + (wave + 1) * 16;
        box.currentH += (targetH - box.currentH) * 0.05;

        const { x, y } = toScreen(box.col, box.row);

        if (
          x + TW < 0 || x - TW > W ||
          y + box.currentH < -TH * 6 || y - box.currentH > H + 60
        ) continue;

        const distX = Math.abs(x - W / 2) / (W / 2);
        const distY = Math.abs(y - H / 2) / (H * 0.6);
        const edgeFade = Math.max(0, 1 - Math.pow(distX, 3) * 0.9 - Math.pow(distY, 2) * 0.6);
        if (edgeFade < 0.02) continue;

        ctx.globalAlpha = edgeFade;
        drawBox(ctx, x, y, box.currentH, box.wave);
      }
      ctx.globalAlpha = 1;

      // Bottom fade — match warm background
      const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
      grad.addColorStop(0, "rgba(13,12,10,0)");
      grad.addColorStop(1, "rgba(13,12,10,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      calcOffset();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1 }}
    />
  );
}
