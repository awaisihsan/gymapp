"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookings } from "@/context/BookingContext";

export default function Navbar() {
  const pathname = usePathname();
  const { bookings } = useBookings();
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  const links = [
    { href: "/",      label: "Classes"   },
    { href: "/admin", label: "Admin"     },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
              <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Fit<span className="text-brand-600">Book</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Bookings pill */}
            {confirmedCount > 0 && (
              <div className="ml-2 px-3 py-1.5 bg-brand-600 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  {confirmedCount} booked
                </span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
