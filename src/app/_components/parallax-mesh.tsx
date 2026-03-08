"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";

// Extend window to hold Vanta + Three
declare global {
  interface Window {
    THREE: unknown;
    VANTA: { BIRDS: (opts: Record<string, unknown>) => { destroy: () => void } };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Avoid double-loading
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function ParallaxMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef     = useRef<{ destroy: () => void } | null>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (darkMode) return;

    let cancelled = false;

    async function init() {
      // Three.js must be on window before Vanta loads
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js"
      );

      if (cancelled || !containerRef.current || !window.VANTA) return;

      vantaRef.current = window.VANTA.BIRDS({
        el:              containerRef.current,
        THREE:           window.THREE,
        backgroundColor: 0xfdfaf5,   // warm cream — matches LightBackground
        color1:          0x000000,   // coral
        color2:          0x0db34d,   // lavender
        colorMode:       "variance",
        birdSize:        1.2,
        wingSpan:        28,
        speedLimit:      3.5,
        separation:      55,
        alignment:       55,
        cohesion:        50,
        quantity:        5,
      });
    }

    init();

    return () => {
      cancelled = true;
      vantaRef.current?.destroy();
      vantaRef.current = null;
    };
  }, [darkMode]);

  if (darkMode) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
