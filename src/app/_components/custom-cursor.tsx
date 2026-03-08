"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot snaps instantly
      dot!.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    // Ring lazily follows using lerp for a smooth trailing effect
    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring!.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    }

    // Shrink ring on click-hold
    function onMouseDown() {
      ring!.style.transform += " scale(0.75)";
      ring!.style.opacity = "0.6";
    }
    function onMouseUp() {
      ring!.style.opacity = "1";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const color = darkMode ? "#a855f7" : "#22c55e";

  return (
    <>
      {/* Small solid dot — snaps to cursor instantly */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px 2px ${color}`,
          willChange: "transform",
        }}
      />

      {/* Larger trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] transition-opacity duration-150"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          boxShadow: `0 0 10px 2px ${color}`,
          willChange: "transform",
        }}
      />
    </>
  );
}
