"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fitnessClasses } from "@/data/classes";
import { useBookings } from "@/context/BookingContext";
import { formatTime, typeStyles, generateId } from "@/lib/utils";
import type { Booking } from "@/types";

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const params  = useSearchParams();
  const router  = useRouter();
  const { addBooking, isClassBooked } = useBookings();

  const classId  = params.get("classId");
  const cls      = fitnessClasses.find((c) => c.id === classId);

  const [booking,   setBooking  ] = useState<Booking | null>(null);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    if (!cls || committed) return;
    if (isClassBooked(cls.id)) {
      // Already booked — just show confirmation without duplicating
      setBooking({
        id:            generateId(),
        classId:       cls.id,
        className:     cls.name,
        type:          cls.type,
        instructor:    cls.instructor,
        day:           cls.day,
        time:          cls.time,
        duration:      cls.duration,
        location:      cls.location,
        customerName:  "Demo User",
        customerEmail: "demo@fitbook.app",
        bookedAt:      new Date().toISOString(),
        status:        "confirmed",
      });
      setCommitted(true);
      return;
    }

    const newBooking: Booking = {
      id:            generateId(),
      classId:       cls.id,
      className:     cls.name,
      type:          cls.type,
      instructor:    cls.instructor,
      day:           cls.day,
      time:          cls.time,
      duration:      cls.duration,
      location:      cls.location,
      customerName:  "Demo User",
      customerEmail: "demo@fitbook.app",
      bookedAt:      new Date().toISOString(),
      status:        "confirmed",
    };
    addBooking(newBooking);
    setBooking(newBooking);
    setCommitted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls]);

  if (!cls) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">Class not found</h2>
        <p className="text-gray-500 text-sm mb-6">The link may be incorrect.</p>
        <Link href="/" className="inline-block bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition text-sm">
          Back to Schedule
        </Link>
      </div>
    );
  }

  const style = typeStyles[cls.type];

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      {/* Success animation */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
          <svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">You&apos;re booked in!</h1>
        <p className="text-gray-500 text-sm">
          Your spot has been reserved. We&apos;ll see you there!
        </p>
      </div>

      {/* Booking card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 animate-fade-up">
        <div className={`h-2 ${style.bar}`} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.badge}`}>
              {cls.type}
            </span>
            <h2 className="font-bold text-gray-900 text-lg">{cls.name}</h2>
          </div>

          <dl className="space-y-3">
            {[
              { label: "Instructor", value: cls.instructor },
              { label: "Day",        value: cls.day },
              { label: "Time",       value: formatTime(cls.time) },
              { label: "Duration",   value: `${cls.duration} minutes` },
              { label: "Location",   value: cls.location },
              { label: "Reference",  value: booking?.id ?? "—" },
              { label: "Status",     value: "Confirmed ✓", className: "text-brand-600 font-semibold" },
            ].map(({ label, value, className }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <dt className="text-gray-500">{label}</dt>
                <dd className={`font-medium text-gray-900 ${className ?? ""}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-200 mx-6" />

        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl text-xs text-gray-400 text-center">
          Booked as <span className="font-medium text-gray-600">Demo User</span> · demo@fitbook.app
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition text-sm"
        >
          Browse More Classes
        </Link>
        <Link
          href="/admin"
          className="flex-1 text-center bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition text-sm"
        >
          View Admin Dashboard →
        </Link>
      </div>

      {/* Add to calendar hint */}
      <p className="text-center text-xs text-gray-400 mt-6">
        💡 In the full version, a calendar invite and email confirmation would be sent automatically.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse mx-auto mb-4" />
      <div className="h-4 bg-gray-100 rounded-full w-48 mx-auto animate-pulse" />
    </div>
  );
}
