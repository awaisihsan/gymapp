"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Booking } from "@/types";
import { seedBookings } from "@/data/seedBookings";

const STORAGE_KEY = "fitbook_bookings";

interface BookingContextValue {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  isClassBooked: (classId: string) => boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Hydrate from localStorage on mount; fall back to seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookings(JSON.parse(stored) as Booking[]);
      } else {
        setBookings(seedBookings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
      }
    } catch {
      setBookings(seedBookings);
    }
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {/* ignore */}
      return next;
    });
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      );
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {/* ignore */}
      return next;
    });
  }, []);

  const isClassBooked = useCallback(
    (classId: string) =>
      bookings.some(
        (b) => b.classId === classId && b.status === "confirmed"
      ),
    [bookings]
  );

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, cancelBooking, isClassBooked }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
}
