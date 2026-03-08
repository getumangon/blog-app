"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ── Orb type ───────────────────────────────────────────────────────────────
interface Orb {
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  mouseStrength: number;
  scrollSpeed: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

// ── Warm pastel palette ────────────────────────────────────────────────────
const ORB_COLORS = [
  "255,185,80",   // gold
  "255,110,145",  // rose
  "75,160,255",   // sky blue
  "60,200,180",   // mint
  "165,110,255",  // lavender
  "255,145,100",  // peach
];

// Three depth layers — far / mid / near
const ORB_LAYERS = [
  { count: 6, radiusRange: [180, 340], opacityRange: [0.025, 0.050], mouseStrength: 20,  scrollSpeed: 0.03 },
  { count: 7, radiusRange: [90,  175], opacityRange: [0.040, 0.080], mouseStrength: 55,  scrollSpeed: 0.10 },
  { count: 5, radiusRange: [40,  100], opacityRange: [0.065, 0.120], mouseStrength: 115, scrollSpeed: 0.20 },
];

export function LightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (darkMode) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0, scrollY = 0;
    let rawMX = 0, rawMY = 0;
    let smoothMX = 0, smoothMY = 0;
    let mouseEntered = false;
    let orbs: Orb[] = [];
    let rafId: number;

    // ── Build scene ────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      rawMX = smoothMX = W / 2;
      rawMY = smoothMY = H / 2;
      buildOrbs();
    }

    function buildOrbs() {
      orbs = [];
      for (const layer of ORB_LAYERS) {
        for (let i = 0; i < layer.count; i++) {
          const angle = rand(0, Math.PI * 2);
          const speed = rand(0.04, 0.22) * (layer.mouseStrength / 700);
          orbs.push({
            baseX: rand(-120, W + 120),
            baseY: rand(-120, H + 120),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: rand(layer.radiusRange[0], layer.radiusRange[1]),
            baseOpacity: rand(layer.opacityRange[0], layer.opacityRange[1]),
            mouseStrength: layer.mouseStrength,
            scrollSpeed: layer.scrollSpeed,
            pulseSpeed: rand(0.15, 0.65),
            pulsePhase: rand(0, Math.PI * 2),
            color: ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)],
          });
        }
      }
    }

    // ── Draw ──────────────────────────────────────────────────────────────
    function drawBackground() {
      // Warm cream → soft periwinkle
      const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
      bg.addColorStop(0,    "#fdfaf5");
      bg.addColorStop(0.45, "#f5f3ff");
      bg.addColorStop(1,    "#eef4ff");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle warm sun-ray glow from top-left corner
      const sun = ctx.createRadialGradient(W * 0.04, 0, 0, W * 0.04, 0, W * 0.85);
      sun.addColorStop(0,   "rgba(255,225,140,0.14)");
      sun.addColorStop(0.5, "rgba(255,225,140,0.04)");
      sun.addColorStop(1,   "rgba(255,225,140,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, W, H);
    }

    function drawOrbs(time: number) {
      const nx = (smoothMX / W) - 0.5; // -0.5 → +0.5
      const ny = (smoothMY / H) - 0.5;

      for (const o of orbs) {
        // Advance drift — wraps with padding so orbs re-enter smoothly
        const pad = 250;
        o.baseX = ((o.baseX + o.vx) % (W + pad * 2) + (W + pad * 2)) % (W + pad * 2) - pad;
        o.baseY = ((o.baseY + o.vy) % (H + pad * 2) + (H + pad * 2)) % (H + pad * 2) - pad;

        // Mouse + scroll offset
        const x = o.baseX - nx * o.mouseStrength;
        const y = o.baseY - ny * o.mouseStrength - scrollY * o.scrollSpeed;

        // Gentle breathe
        const pulse = 0.82 + 0.18 * Math.sin(time * 0.001 * o.pulseSpeed + o.pulsePhase);
        const alpha = o.baseOpacity * pulse;

        // Watercolor radial gradient — soft centre, feathered edge
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.radius);
        g.addColorStop(0,    `rgba(${o.color},${(alpha * 1.0).toFixed(3)})`);
        g.addColorStop(0.40, `rgba(${o.color},${(alpha * 0.60).toFixed(3)})`);
        g.addColorStop(0.70, `rgba(${o.color},${(alpha * 0.20).toFixed(3)})`);
        g.addColorStop(1,    `rgba(${o.color},0)`);

        ctx.beginPath();
        ctx.arc(x, y, o.radius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }

    // ── Frame loop ────────────────────────────────────────────────────────
    function frame(time: number) {
      // Slower lerp than dark mode → dreamy, weightless feel
      smoothMX += (rawMX - smoothMX) * 0.045;
      smoothMY += (rawMY - smoothMY) * 0.045;

      drawBackground();
      drawOrbs(time);

      rafId = requestAnimationFrame(frame);
    }

    // ── Events ────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      rawMX = e.clientX;
      rawMY = e.clientY;
      if (!mouseEntered) {
        smoothMX = rawMX;
        smoothMY = rawMY;
        mouseEntered = true;
      }
    };
    const onScroll = () => { scrollY = window.scrollY; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [darkMode]);

  if (darkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
