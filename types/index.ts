export type ClassType =
  | "Yoga"
  | "HIIT"
  | "Pilates"
  | "Spin"
  | "Boxing"
  | "Dance"
  | "Strength";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export interface FitnessClass {
  id: string;
  name: string;
  type: ClassType;
  instructor: string;
  day: string;          // e.g. "Monday"
  time: string;         // 24h e.g. "07:00"
  duration: number;     // minutes
  capacity: number;
  spotsLeft: number;
  level: DifficultyLevel;
  description: string;
  location: string;
}

export type BookingStatus = "confirmed" | "cancelled" | "waitlist";

export interface Booking {
  id: string;
  classId: string;
  className: string;
  type: ClassType;
  instructor: string;
  day: string;
  time: string;
  duration: number;
  location: string;
  customerName: string;
  customerEmail: string;
  bookedAt: string;     // ISO string
  status: BookingStatus;
}
