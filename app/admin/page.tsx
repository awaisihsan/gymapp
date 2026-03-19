"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useBookings } from "@/context/BookingContext";
import BookingTable from "@/components/BookingTable";
import { fitnessClasses } from "@/data/classes";
import { typeStyles } from "@/lib/utils";

export default function AdminPage() {
  const { bookings } = useBookings();

  const stats = useMemo(() => {
    const confirmed  = bookings.filter((b) => b.status === "confirmed").length;
    const waitlist   = bookings.filter((b) => b.status === "waitlist").length;
    const cancelled  = bookings.filter((b) => b.status === "cancelled").length;
    const totalSpots = fitnessClasses.reduce((s, c) => s + c.capacity, 0);
    const bookedSpots = fitnessClasses.reduce((s, c) => s + (c.capacity - c.spotsLeft), 0);
    const occupancy  = Math.round((bookedSpots / totalSpots) * 100);
    return { total: bookings.length, confirmed, waitlist, cancelled, occupancy };
  }, [bookings]);

  // Most popular class by booking count
  const classBookingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings
      .filter((b) => b.status === "confirmed")
      .forEach((b) => { counts[b.className] = (counts[b.className] ?? 0) + 1; });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Live Demo</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage bookings and monitor class activity</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Booking
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Bookings",   value: stats.total,     icon: "📋", color: "border-brand-200 bg-brand-50",  text: "text-brand-700"  },
          { label: "Confirmed",        value: stats.confirmed,  icon: "✅", color: "border-green-200 bg-green-50",  text: "text-green-700"  },
          { label: "Waitlist",         value: stats.waitlist,   icon: "⏳", color: "border-amber-200 bg-amber-50",  text: "text-amber-700"  },
          { label: "Cancelled",        value: stats.cancelled,  icon: "❌", color: "border-red-200 bg-red-50",     text: "text-red-700"    },
          { label: "Avg Occupancy",    value: `${stats.occupancy}%`, icon: "📊", color: "border-blue-200 bg-blue-50", text: "text-blue-700" },
        ].map(({ label, value, icon, color, text }) => (
          <div key={label} className={`rounded-2xl border ${color} p-4 shadow-sm`}>
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`text-2xl font-extrabold ${text}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid: Table + Sidebar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Bookings table – takes 3 cols */}
        <div className="xl:col-span-3">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">All Bookings</h2>
          <BookingTable />
        </div>

        {/* Sidebar – 1 col */}
        <div className="space-y-5">

          {/* Popular classes */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Top Classes</h3>
            {classBookingCounts.length === 0 ? (
              <p className="text-xs text-gray-400">No data yet.</p>
            ) : (
              <ol className="space-y-3">
                {classBookingCounts.map(([name, count], i) => {
                  const cls = fitnessClasses.find((c) => c.name === name);
                  const style = cls ? typeStyles[cls.type] : null;
                  const maxCount = classBookingCounts[0][1];
                  return (
                    <li key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center bg-gray-100 rounded text-gray-500 font-bold text-[10px]">
                            {i + 1}
                          </span>
                          {style && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
                              {cls?.type}
                            </span>
                          )}
                          <span className="font-medium text-gray-700 truncate max-w-[90px]">{name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-1 bg-brand-400 rounded-full"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Classes at a glance */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Classes at a glance</h3>
            <ul className="space-y-2.5">
              {fitnessClasses.map((c) => {
                const style = typeStyles[c.type];
                const pct   = Math.round(((c.capacity - c.spotsLeft) / c.capacity) * 100);
                const full  = c.spotsLeft === 0;
                return (
                  <li key={c.id}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${style.bar}`} />
                        <span className="font-medium text-gray-700">{c.name}</span>
                      </div>
                      <span className={`font-semibold ${full ? "text-red-500" : "text-gray-500"}`}>
                        {full ? "Full" : `${c.spotsLeft} left`}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-1 rounded-full ${full ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-brand-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Demo notice ── */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex gap-2">
        <span className="text-base">⚠️</span>
        <p>
          <strong>Demo mode:</strong> All data is stored in your browser&apos;s localStorage and resets
          on a fresh session. In production, bookings would persist in a real database.
        </p>
      </div>
    </div>
  );
}
