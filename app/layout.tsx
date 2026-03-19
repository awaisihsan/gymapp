import type { Metadata } from "next";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FitBook — Gym Class Booking",
  description: "Book your favourite fitness classes in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <BookingProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="mt-20 border-t border-gray-100 py-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} FitBook — Gym Booking MVP
          </footer>
        </BookingProvider>
      </body>
    </html>
  );
}
