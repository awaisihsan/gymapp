"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "@/types";
import { useBookings } from "@/context/BookingContext";
import { formatTime, typeStyles } from "@/lib/utils";

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "confirmed", label: "Confirmed" },
  { value: "waitlist",  label: "Waitlist"  },
  { value: "cancelled", label: "Cancelled" },
];

function statusBadge(status: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    confirmed: "bg-green-100 text-green-700",
    waitlist:  "bg-amber-100 text-amber-700",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function BookingTable() {
  const { bookings, cancelBooking } = useBookings();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");

  const displayed = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      b.customerName.toLowerCase().includes(term) ||
      b.className.toLowerCase().includes(term) ||
      b.instructor.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table controls */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === value
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
              {value !== "all" && (
                <span className="ml-1 opacity-70">
                  ({bookings.filter((b) => b.status === value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search customer, class…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-56 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-3 text-left font-medium">Customer</th>
              <th className="px-5 py-3 text-left font-medium">Class</th>
              <th className="px-5 py-3 text-left font-medium">Type</th>
              <th className="px-5 py-3 text-left font-medium">Day / Time</th>
              <th className="px-5 py-3 text-left font-medium">Booked</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                  No bookings found.
                </td>
              </tr>
            ) : (
              displayed.map((b) => (
                <BookingRow key={b.id} booking={b} onCancel={cancelBooking} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        Showing {displayed.length} of {bookings.length} bookings
      </div>
    </div>
  );
}

function BookingRow({
  booking: b,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  const style = typeStyles[b.type];
  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-3.5">
        <div className="font-medium text-gray-900">{b.customerName}</div>
        <div className="text-xs text-gray-400">{b.customerEmail}</div>
      </td>
      <td className="px-5 py-3.5 font-medium text-gray-700">{b.className}</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
          {b.type}
        </span>
      </td>
      <td className="px-5 py-3.5 text-gray-500">
        {b.day} · {formatTime(b.time)}
      </td>
      <td className="px-5 py-3.5 text-gray-500">{formatDate(b.bookedAt)}</td>
      <td className="px-5 py-3.5">{statusBadge(b.status)}</td>
      <td className="px-5 py-3.5">
        {b.status === "confirmed" ? (
          <button
            onClick={() => onCancel(b.id)}
            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
    </tr>
  );
}
