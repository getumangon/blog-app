"use client";

import { useState } from "react";
import markdownStyles from "@/app/_components/markdown-styles.module.css";

type DaySection = {
  title: string;
  content: string;
};

export function FitnessAccordion({ days }: { days: DaySection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {days.map((day, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md dark:hover:shadow-slate-700/40"
          >
            {/* Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span className="font-semibold text-base md:text-lg tracking-tight">
                {day.title}
              </span>
              <svg
                className={`w-5 h-5 shrink-0 ml-4 transition-transform duration-300 text-slate-400 dark:text-slate-500 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Collapsible body — CSS grid trick for smooth height animation */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.35s ease",
              }}
            >
              <div className="overflow-hidden">
                <div
                  className={`${markdownStyles["markdown"]} px-5 pb-6 pt-1 border-t border-slate-100 dark:border-slate-700/60`}
                  dangerouslySetInnerHTML={{ __html: day.content }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
