"use client";

import { useState, useMemo } from "react";
import { fitnessClasses } from "@/data/classes";
import ClassCard from "@/components/ClassCard";
import type { ClassType } from "@/types";

const ALL_TYPES: (ClassType | "All")[] = [
  "All", "Yoga", "HIIT", "Pilates", "Spin", "Boxing", "Dance", "Strength",
];

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function HomePage() {
  const [activeType, setActiveType] = useState<ClassType | "All">("All");
  const [activeDay,  setActiveDay ] = useState<string>("All");

  const allDays = useMemo(
    () => ["All", ...DAY_ORDER.filter((d) => fitnessClasses.some((c) => c.day === d))],
    []
  );

  const filtered = useMemo(
    () =>
      fitnessClasses.filter(
        (c) =>
          (activeType === "All" || c.type === activeType) &&
          (activeDay  === "All" || c.day  === activeDay)
      ),
    [activeType, activeDay]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Hero ── */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl px-8 py-12 sm:py-16 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/3" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              Classes available now
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Find your perfect<br />fitness class
            </h1>
            <p className="text-brand-100 text-base sm:text-lg leading-relaxed">
              Book a spot in minutes. No account required for this demo.
            </p>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { label: "Classes/week",   value: fitnessClasses.length },
                { label: "Instructors",    value: [...new Set(fitnessClasses.map((c) => c.instructor))].length },
                { label: "Avg. duration",  value: `${Math.round(fitnessClasses.reduce((s, c) => s + c.duration, 0) / fitnessClasses.length)} min` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-brand-200 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="mb-6 space-y-3">
        {/* Class type tabs */}
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === t
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Day filter */}
        <div className="flex flex-wrap gap-2">
          {allDays.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDay === d
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {d === "All" ? "All Days" : d.slice(0, 3)}
            </button>
          ))}

          {/* Results count */}
          <span className="ml-auto self-center text-xs text-gray-400">
            {filtered.length} class{filtered.length !== 1 ? "es" : ""} found
          </span>
        </div>
      </section>

      {/* ── Class grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🏋️</div>
          <p className="text-gray-500 text-sm">No classes match your filters.</p>
          <button
            onClick={() => { setActiveType("All"); setActiveDay("All"); }}
            className="mt-3 text-brand-600 text-sm font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </section>
      )}
    </div>
  );
}
