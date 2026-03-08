"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const { darkMode } = useTheme();

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const color = darkMode ? "#a855f7" : "#22c55e";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{
          width: `${progress}%`,
          background: color,
          boxShadow: `0 0 0px 0px ${color}, 0 0 0px 5px ${color}`,
        }}
      />
    </div>
  );
}
