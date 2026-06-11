import { Role } from "@/types";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Settings,
  FileText,
  ClipboardList,
  Calendar,
  UserCircle,
  Shield,
  BarChart3,
  Database,
  Layers,
  Clock,
  UserPlus,
  Building,
  Activity,
  CalendarDays,
  CheckSquare,
  Award,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "LMSLearn";
export const APP_DESCRIPTION = "Modern Learning Management System for Universities";

export const PAGINATION_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 500;
export const AUTO_SAVE_INTERVAL_MS = 30000;

export const SEMESTER_OPTIONS = ["Ganjil", "Genap"] as const;
export const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface QuickAction {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  [Role.super_admin]: [
    { title: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    { title: "Semua Pengguna", href: "/super-admin/users", icon: Users },
    { title: "Admin", href: "/super-admin/admins", icon: Shield },
    { title: "Dosen", href: "/super-admin/dosen", icon: GraduationCap },
    { title: "Mahasiswa", href: "/super-admin/mahasiswa", icon: School },
    { title: "Program Studi", href: "/super-admin/program-studi", icon: Layers },
    { title: "Mata Kuliah", href: "/super-admin/mata-kuliah", icon: BookOpen },
    { title: "Kelas", href: "/super-admin/classes", icon: Layers },
    { title: "Audit Log", href: "/super-admin/audit-log", icon: FileText },
    { title: "Laporan", href: "/super-admin/reports", icon: BarChart3 },
    { title: "Backup", href: "/super-admin/backups", icon: Database },
    { title: "Pengaturan", href: "/super-admin/settings", icon: Settings },
  ],
  [Role.admin]: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Pengguna", href: "/admin/users", icon: Users },
    { title: "Dosen", href: "/admin/dosen", icon: GraduationCap },
    { title: "Mahasiswa", href: "/admin/mahasiswa", icon: School },
    { title: "Program Studi", href: "/admin/program-studi", icon: Layers },
    { title: "Mata Kuliah", href: "/admin/mata-kuliah", icon: BookOpen },
    { title: "Kelas", href: "/admin/classes", icon: Layers },
    { title: "Jadwal", href: "/admin/schedules", icon: Clock },
    { title: "Laporan", href: "/admin/reports", icon: BarChart3 },
  ],
  [Role.dosen]: [
    { title: "Dashboard", href: "/dosen/dashboard", icon: LayoutDashboard },
    { title: "Kelas Saya", href: "/dosen/classes", icon: Layers },
    { title: "Materi", href: "/dosen/materials", icon: BookOpen },
    { title: "Tugas", href: "/dosen/assignments", icon: ClipboardList },
    { title: "Pengumpulan", href: "/dosen/submissions", icon: FileText },
    { title: "Nilai", href: "/dosen/grades", icon: BarChart3 },
    { title: "Kalender", href: "/dosen/calendar", icon: Calendar },
    { title: "Profil", href: "/dosen/profile", icon: UserCircle },
  ],
  [Role.mahasiswa]: [
    { title: "Dashboard", href: "/mahasiswa/dashboard", icon: LayoutDashboard },
    { title: "Kelas Saya", href: "/mahasiswa/classes", icon: Layers },
    { title: "Materi", href: "/mahasiswa/materials", icon: BookOpen },
    { title: "Tugas", href: "/mahasiswa/assignments", icon: ClipboardList },
    { title: "Nilai", href: "/mahasiswa/grades", icon: BarChart3 },
    { title: "Kalender", href: "/mahasiswa/calendar", icon: Calendar },
    { title: "Profil", href: "/mahasiswa/profile", icon: UserCircle },
  ],
};

export const MOBILE_NAV_ITEMS: Record<Role, NavItem[]> = {
  [Role.super_admin]: [
    { title: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    { title: "Pengguna", href: "/super-admin/users", icon: Users },
    { title: "Kelas", href: "/super-admin/classes", icon: Layers },
    { title: "Laporan", href: "/super-admin/reports", icon: BarChart3 },
    { title: "Pengaturan", href: "/super-admin/settings", icon: Settings },
  ],
  [Role.admin]: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Pengguna", href: "/admin/users", icon: Users },
    { title: "Kelas", href: "/admin/classes", icon: Layers },
    { title: "Jadwal", href: "/admin/schedules", icon: Clock },
    { title: "Laporan", href: "/admin/reports", icon: BarChart3 },
  ],
  [Role.dosen]: [
    { title: "Dashboard", href: "/dosen/dashboard", icon: LayoutDashboard },
    { title: "Kelas", href: "/dosen/classes", icon: Layers },
    { title: "Tugas", href: "/dosen/assignments", icon: ClipboardList },
    { title: "Kalender", href: "/dosen/calendar", icon: Calendar },
    { title: "Profil", href: "/dosen/profile", icon: UserCircle },
  ],
  [Role.mahasiswa]: [
    { title: "Dashboard", href: "/mahasiswa/dashboard", icon: LayoutDashboard },
    { title: "Kelas", href: "/mahasiswa/classes", icon: Layers },
    { title: "Tugas", href: "/mahasiswa/assignments", icon: ClipboardList },
    { title: "Kalender", href: "/mahasiswa/calendar", icon: Calendar },
    { title: "Profil", href: "/mahasiswa/profile", icon: UserCircle },
  ],
};

export const QUICK_ACTIONS: Record<Role, QuickAction[]> = {
  [Role.super_admin]: [
    { title: "Tambah Pengguna", href: "/super-admin/users?action=add", icon: UserPlus, description: "Buat akun pengguna baru", color: "bg-blue-100 text-blue-600" },
    { title: "Buat Kelas", href: "/super-admin/classes?action=add", icon: Building, description: "Buat kelas akademik baru", color: "bg-indigo-100 text-indigo-600" },
    { title: "Log Sistem", href: "/super-admin/audit-log", icon: Activity, description: "Lihat log aktivitas sistem", color: "bg-slate-100 text-slate-600" },
  ],
  [Role.admin]: [
    { title: "Tambah Pengguna", href: "/admin/users?action=add", icon: UserPlus, description: "Buat akun pengguna baru", color: "bg-blue-100 text-blue-600" },
    { title: "Buat Kelas", href: "/admin/classes?action=add", icon: Building, description: "Buat kelas akademik baru", color: "bg-indigo-100 text-indigo-600" },
    { title: "Jadwal", href: "/admin/calendar", icon: CalendarDays, description: "Kelola kalender akademik", color: "bg-amber-100 text-amber-600" },
  ],
  [Role.dosen]: [
    { title: "Upload Materi", href: "/dosen/materials?action=add", icon: BookOpen, description: "Bagikan materi ke kelas", color: "bg-blue-100 text-blue-600" },
    { title: "Buat Tugas", href: "/dosen/assignments?action=add", icon: ClipboardList, description: "Buat tugas untuk mahasiswa", color: "bg-amber-100 text-amber-600" },
    { title: "Input Nilai", href: "/dosen/grades", icon: CheckSquare, description: "Masukkan nilai mahasiswa", color: "bg-emerald-100 text-emerald-600" },
  ],
  [Role.mahasiswa]: [
    { title: "Lihat Tugas", href: "/mahasiswa/assignments", icon: ClipboardList, description: "Cek tugas yang belum dikerjakan", color: "bg-amber-100 text-amber-600" },
    { title: "Download Materi", href: "/mahasiswa/materials", icon: BookOpen, description: "Unduh materi perkuliahan terbaru", color: "bg-blue-100 text-blue-600" },
    { title: "KHS & IPK", href: "/mahasiswa/grades", icon: Award, description: "Lihat Kartu Hasil Studi", color: "bg-emerald-100 text-emerald-600" },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.super_admin]: "Super Admin",
  [Role.admin]: "Admin",
  [Role.dosen]: "Dosen",
  [Role.mahasiswa]: "Mahasiswa",
};

export const ROLE_BASE_PATH: Record<Role, string> = {
  [Role.super_admin]: "/super-admin",
  [Role.admin]: "/admin",
  [Role.dosen]: "/dosen",
  [Role.mahasiswa]: "/mahasiswa",
};
