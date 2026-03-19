import type { ClassType, DifficultyLevel } from "@/types";

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function generateId(): string {
  return `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const typeStyles: Record<
  ClassType,
  { bar: string; badge: string; avatar: string }
> = {
  Yoga:     { bar: "bg-purple-400", badge: "bg-purple-100 text-purple-700", avatar: "bg-purple-100 text-purple-700" },
  HIIT:     { bar: "bg-red-400",    badge: "bg-red-100 text-red-700",       avatar: "bg-red-100 text-red-700"       },
  Pilates:  { bar: "bg-blue-400",   badge: "bg-blue-100 text-blue-700",     avatar: "bg-blue-100 text-blue-700"     },
  Spin:     { bar: "bg-amber-400",  badge: "bg-amber-100 text-amber-700",   avatar: "bg-amber-100 text-amber-700"   },
  Boxing:   { bar: "bg-orange-400", badge: "bg-orange-100 text-orange-700", avatar: "bg-orange-100 text-orange-700" },
  Dance:    { bar: "bg-pink-400",   badge: "bg-pink-100 text-pink-700",     avatar: "bg-pink-100 text-pink-700"     },
  Strength: { bar: "bg-teal-400",   badge: "bg-teal-100 text-teal-700",     avatar: "bg-teal-100 text-teal-700"     },
};

export const levelStyles: Record<DifficultyLevel, string> = {
  "All Levels":   "bg-gray-100 text-gray-600",
  "Beginner":     "bg-green-100 text-green-700",
  "Intermediate": "bg-yellow-100 text-yellow-700",
  "Advanced":     "bg-red-100 text-red-700",
};
