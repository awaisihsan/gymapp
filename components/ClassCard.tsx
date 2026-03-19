"use client";

import { useRouter } from "next/navigation";
import type { FitnessClass } from "@/types";
import { useBookings } from "@/context/BookingContext";
import { formatTime, typeStyles, levelStyles } from "@/lib/utils";

interface Props {
  cls: FitnessClass;
}

export default function ClassCard({ cls }: Props) {
  const router = useRouter();
  const { isClassBooked } = useBookings();
  const alreadyBooked = isClassBooked(cls.id);
  const isFull = cls.spotsLeft === 0;
  const pct = Math.round(((cls.capacity - cls.spotsLeft) / cls.capacity) * 100);
  const style = typeStyles[cls.type];
  const lvl = levelStyles[cls.level];

  function handleBook() {
    router.push(`/confirmation?classId=${cls.id}`);
  }

  const spotsColor =
    isFull
      ? "text-red-500"
      : cls.spotsLeft <= 3
      ? "text-amber-600"
      : "text-brand-600";

  return (
    <article className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Accent bar */}
      <div className={`h-1.5 w-full ${style.bar}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
              {cls.type}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lvl}`}>
              {cls.level}
            </span>
          </div>
          {alreadyBooked && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Booked
            </span>
          )}
        </div>

        {/* Class name */}
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1 group-hover:text-brand-700 transition-colors">
          {cls.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {cls.description}
        </p>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <CalendarIcon /> {cls.day}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon /> {formatTime(cls.time)}
          </span>
          <span className="flex items-center gap-1.5">
            <TimerIcon /> {cls.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <LocationIcon /> {cls.location}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${style.avatar}`}>
            {cls.instructor.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="text-sm text-gray-600">{cls.instructor}</span>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Capacity</span>
            <span className={`font-semibold ${spotsColor}`}>
              {isFull ? "Class full" : `${cls.spotsLeft} spot${cls.spotsLeft !== 1 ? "s" : ""} left`}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all ${
                pct >= 100 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-brand-400"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {alreadyBooked ? (
            <div className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              ✓ You&apos;re booked in
            </div>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              Class Full
            </button>
          ) : (
            <button
              onClick={handleBook}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-sm transition-all"
            >
              Book Now →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Micro-icons ──────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function TimerIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
