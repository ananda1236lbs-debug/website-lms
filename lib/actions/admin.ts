"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CalendarEventType } from "@prisma/client";

export async function getAdminSchedules() {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    throw new Error("Akses ditolak");
  }

  // Fetch all classes that have a schedule
  return await prisma.kelas.findMany({
    where: { 
      isActive: true,
      scheduleDay: { not: null },
      scheduleStartTime: { not: null }
    },
    include: {
      mataKuliah: { select: { nama: true, kodeMK: true } },
      dosen: { select: { fullName: true } }
    },
    orderBy: [
      { scheduleDay: "asc" },
      { scheduleStartTime: "asc" }
    ]
  });
}

export async function getAdminCalendars() {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    throw new Error("Akses ditolak");
  }

  return await prisma.academicCalendar.findMany({
    orderBy: { startDate: "asc" }
  });
}

export async function createAcademicCalendarEvent(data: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
}) {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.academicCalendar.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        type: data.type as CalendarEventType,
      }
    });

    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal membuat acara: " + error.message };
  }
}

export async function deleteAcademicCalendarEvent(id: string) {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.academicCalendar.delete({ where: { id } });
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus acara" };
  }
}
