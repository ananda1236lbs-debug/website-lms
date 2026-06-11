import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GradeLetterScale } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return formatDate(d);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getLetterGrade(
  score: number,
  scale?: Record<string, { min: number; max: number }>
): GradeLetterScale {
  const defaultScale = {
    A: { min: 85, max: 100 },
    AB: { min: 80, max: 84 },
    B: { min: 70, max: 79 },
    BC: { min: 65, max: 69 },
    C: { min: 55, max: 64 },
    D: { min: 45, max: 54 },
    E: { min: 0, max: 44 },
  };
  const s = scale || defaultScale;

  if (score >= s.A.min) return GradeLetterScale.A;
  if (score >= s.AB.min) return GradeLetterScale.AB;
  if (score >= s.B.min) return GradeLetterScale.B;
  if (score >= s.BC.min) return GradeLetterScale.BC;
  if (score >= s.C.min) return GradeLetterScale.C;
  if (score >= s.D.min) return GradeLetterScale.D;
  return GradeLetterScale.E;
}

export function getGradeColor(letter: string): string {
  const colors: Record<string, string> = {
    A: "text-emerald-600 bg-emerald-50",
    "A/B": "text-green-600 bg-green-50",
    B: "text-blue-600 bg-blue-50",
    "B/C": "text-sky-600 bg-sky-50",
    C: "text-amber-600 bg-amber-50",
    D: "text-orange-600 bg-orange-50",
    E: "text-red-600 bg-red-50",
  };
  return colors[letter] || "text-gray-600 bg-gray-50";
}

export function generateAvatarFallback(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getDeadlineStatus(deadline: Date | string): {
  label: string;
  variant: "default" | "warning" | "danger" | "success";
  isPast: boolean;
} {
  const now = new Date();
  const d = new Date(deadline);
  const diffMs = d.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffMs < 0) return { label: "Terlambat", variant: "danger", isPast: true };
  if (diffHours < 24) return { label: `${Math.floor(diffHours)} jam lagi`, variant: "danger", isPast: false };
  if (diffDays < 3) return { label: `${Math.floor(diffDays)} hari lagi`, variant: "warning", isPast: false };
  return { label: formatDate(d), variant: "default", isPast: false };
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export const ALLOWED_FILE_TYPES = {
  document: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  presentation: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  archive: ["application/zip", "application/x-zip-compressed"],
  video: ["video/mp4"],
};

export const FILE_EXTENSIONS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/zip": "ZIP",
  "video/mp4": "MP4",
};
