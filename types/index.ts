import { Role, NotificationType, AssignmentStatus, MaterialStatus, GradeLetterScale, Jenjang } from "@prisma/client";

export { Role, NotificationType, AssignmentStatus, MaterialStatus, GradeLetterScale, Jenjang };

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  profile: {
    fullName: string;
    nim?: string;
    nip?: string;
    programStudiId?: string;
    semester?: number;
    angkatan?: number;
  };
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgramStudi {
  _id: string;
  kode: string;
  nama: string;
  fakultas: string;
  jenjang: Jenjang;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMataKuliah {
  _id: string;
  kodeMK: string;
  nama: string;
  sks: number;
  semester: number;
  programStudiId: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface IGradeComponent {
  name: string;
  weight: number;
}

export interface IKelas {
  _id: string;
  namaKelas: string;
  mataKuliahId: string;
  dosenId: string;
  tahunAjaran: string;
  semester: string;
  kapasitas: number;
  students: string[];
  schedule: ISchedule;
  gradeComponents: IGradeComponent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaterial {
  _id: string;
  kelasId: string;
  dosenId: string;
  title: string;
  description?: string;
  meetingNumber: number;
  file: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  };
  status: MaterialStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment {
  _id: string;
  kelasId: string;
  title: string;
  description: string;
  deadline: Date;
  allowedFormats: string[];
  maxFileSize: number;
  weight: number;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  file: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  };
  submittedAt: Date;
  isLate: boolean;
  grade?: {
    score: number;
    feedback: string;
    gradedBy: string;
    gradedAt: Date;
    isDraft: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinalGrade {
  _id: string;
  kelasId: string;
  studentId: string;
  components: {
    name: string;
    weight: number;
    score: number;
  }[];
  score: number;
  letter: GradeLetterScale;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface IAcademicCalendar {
  _id: string;
  title: string;
  type: "academic" | "holiday" | "exam" | "event";
  startDate: Date;
  endDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: string;
  userId: string;
  action: string;
  model: string;
  modelId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

export interface ISession {
  _id: string;
  userId: string;
  device?: string;
  browser?: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ISetting {
  _id: string;
  institutionName: string;
  logo?: string;
  activeSemester: string;
  tahunAjaran: string;
  uploadLimit: number;
  gradingScale: {
    A: { min: number; max: number };
    AB: { min: number; max: number };
    B: { min: number; max: number };
    BC: { min: number; max: number };
    C: { min: number; max: number };
    D: { min: number; max: number };
    E: { min: number; max: number };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  updatedAt: Date;
}

export interface IDashboardStats {
  _id: string;
  type: "super_admin" | "admin";
  data: {
    totalUsers: number;
    totalDosen: number;
    totalMahasiswa: number;
    totalKelas: number;
    totalAssignments: number;
    totalSubmissions: number;
    averageGrade: number;
    activeUsers: number;
  };
  updatedAt: Date;
}

// Table query params
export interface TableQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface SessionUser {
  id: string;
  email: string;
  username: string;
  role: Role;
  avatar?: string;
  fullName: string;
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface User extends SessionUser {}
}


