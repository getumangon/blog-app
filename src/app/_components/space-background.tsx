"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";

// ── Types ──────────────────────────────────────────────────────────────────
interface Star {
  baseX: number;
  baseY: number;
  vx: number;      // autonomous drift velocity
  vy: number;
  size: number;
  baseOpacity: number;
  parallaxSpeed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
}

// ── Layer config ───────────────────────────────────────────────────────────
// mouseStrength: max pixel shift on each axis when mouse is at the edge
const LAYERS = [
  { count: 180, sizeRange: [0.2, 0.7],  opacityRange: [0.25, 0.55], speed: 0.04, mouseStrength: 18  },
  { count: 90,  sizeRange: [0.7, 1.3],  opacityRange: [0.45, 0.75], speed: 0.12, mouseStrength: 45  },
  { count: 35,  sizeRange: [1.3, 2.2],  opacityRange: [0.65, 1.00], speed: 0.25, mouseStrength: 90  },
];

const STAR_COLORS = [
  "220,235,255",
  "255,255,255",
  "200,215,255",
  "255,240,220",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ── Component ──────────────────────────────────────────────────────────────
export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!darkMode) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let scrollY = 0;

    // Raw mouse position (updated on mousemove)
    let rawMX = 0, rawMY = 0;
    // Smoothed mouse position (lerped each frame) — starts at center
    let smoothMX = 0, smoothMY = 0;
    let mouseEntered = false;

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let lastMeteorTime = 0;
    let rafId: number;

    // ── Init ──────────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      // Reset smooth mouse to center on resize
      rawMX = smoothMX = W / 2;
      rawMY = smoothMY = H / 2;
      buildStars();
    }

    function buildStars() {
      stars = [];
      for (const layer of LAYERS) {
        for (let i = 0; i < layer.count; i++) {
          // Nearer (larger) stars drift slightly faster
          const driftScale = layer.mouseStrength / 1800;
          const angle = rand(0, Math.PI * 2);
          const speed = rand(0.03, 0.12) * driftScale * 20;
          stars.push({
            baseX: rand(0, W),
            baseY: rand(0, H),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: rand(layer.sizeRange[0], layer.sizeRange[1]),
            baseOpacity: rand(layer.opacityRange[0], layer.opacityRange[1]),
            parallaxSpeed: layer.speed,
            twinkleSpeed: rand(0.4, 2.0),
            twinklePhase: rand(0, Math.PI * 2),
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          });
        }
      }
    }

    function spawnMeteor() {
      const angle = rand(0.3, 0.65);
      const speed = rand(9, 16);
      meteors.push({
        x: rand(W * 0.1, W),
        y: rand(-20, H * 0.3),
        vx: -Math.cos(angle) * speed,
        vy:  Math.sin(angle) * speed,
        length: rand(80, 200),
        opacity: rand(0.6, 1.0),
        life: 0,
      });
    }

    // ── Draw ──────────────────────────────────────────────────────────────
    function drawNebulae() {
      const nebulae = [
        { x: W * 0.15, y: H * 0.25, r: W * 0.3,  color: "80,0,180"   },
        { x: W * 0.80, y: H * 0.60, r: W * 0.25, color: "0,60,160"   },
        { x: W * 0.50, y: H * 0.85, r: W * 0.2,  color: "0,100,120"  },
      ];
      for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0,   `rgba(${n.color},0.07)`);
        g.addColorStop(0.5, `rgba(${n.color},0.03)`);
        g.addColorStop(1,   `rgba(${n.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawStars(time: number, layerIndex: number) {
      const layer = LAYERS[layerIndex];
      const layerStars = stars.filter((_, i) => {
        // Determine which layer this star belongs to by index ranges
        let offset = 0;
        for (let l = 0; l < layerIndex; l++) offset += LAYERS[l].count;
        return i >= offset && i < offset + layer.count;
      });

      // Normalize mouse to -0.5 → +0.5 from center
      const nx = (smoothMX / W) - 0.5;
      const ny = (smoothMY / H) - 0.5;
      const mouseOffsetX = nx * layer.mouseStrength;
      const mouseOffsetY = ny * layer.mouseStrength;

      for (const s of layerStars) {
        // Advance autonomous drift and wrap at canvas edges
        s.baseX = ((s.baseX + s.vx) % W + W) % W;
        s.baseY = ((s.baseY + s.vy) % H + H) % H;

        // Scroll parallax on Y, mouse parallax on both axes
        const scrollOffset = (scrollY * s.parallaxSpeed) % H;
        const x = ((s.baseX - mouseOffsetX) % W + W) % W;
        const y = ((s.baseY - scrollOffset - mouseOffsetY) % H + H) % H;

        const twinkle = 0.75 + 0.25 * Math.sin(time * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseOpacity * twinkle;

        // Glow halo for larger stars
        if (s.size > 1.0) {
          const gr = ctx.createRadialGradient(x, y, 0, x, y, s.size * 4);
          gr.addColorStop(0, `rgba(${s.color},${alpha * 0.35})`);
          gr.addColorStop(1, `rgba(${s.color},0)`);
          ctx.beginPath();
          ctx.arc(x, y, s.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();
      }
    }

    function drawMeteors(dt: number) {
      meteors = meteors.filter((m) => {
        m.life += dt * 0.6;
        if (m.life >= 1) return false;

        const fadeIn  = Math.min(m.life * 8, 1);
        const fadeOut = 1 - Math.max((m.life - 0.6) / 0.4, 0);
        const alpha   = m.opacity * fadeIn * fadeOut;

        const mag  = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / mag) * m.length;
        const tailY = m.y - (m.vy / mag) * m.length;

        const g = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        g.addColorStop(0,   `rgba(255,255,255,0)`);
        g.addColorStop(0.7, `rgba(200,220,255,${alpha * 0.5})`);
        g.addColorStop(1,   `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        m.x += m.vx;
        m.y += m.vy;

        return m.x > -m.length && m.y < H + m.length;
      });
    }

    // ── Frame loop ────────────────────────────────────────────────────────
    let prevTime = 0;
    function frame(time: number) {
      const dt = Math.min((time - prevTime) / 1000, 0.05);
      prevTime = time;

      // Smoothly lerp mouse toward raw position (0.06 = floaty space feel)
      smoothMX += (rawMX - smoothMX) * 0.06;
      smoothMY += (rawMY - smoothMY) * 0.06;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   "#000008");
      bg.addColorStop(0.5, "#03000f");
      bg.addColorStop(1,   "#000508");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawNebulae();
      // Draw layers back-to-front so near stars are on top
      for (let l = 0; l < LAYERS.length; l++) drawStars(time, l);

      if (time - lastMeteorTime > rand(2500, 6000)) {
        spawnMeteor();
        lastMeteorTime = time;
      }
      drawMeteors(dt);

      rafId = requestAnimationFrame(frame);
    }

    // ── Events ────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      rawMX = e.clientX;
      rawMY = e.clientY;
      if (!mouseEntered) {
        // Snap smooth position on first move to avoid a jarring sweep from center
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

  if (!darkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
