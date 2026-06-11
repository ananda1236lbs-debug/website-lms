"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMaterial(data: {
  kelasId: string;
  title: string;
  description: string;
  meetingNumber: number;
  fileUrl: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "dosen") {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.material.create({
      data: {
        kelasId: data.kelasId,
        dosenId: session.user.id,
        title: data.title,
        description: data.description,
        meetingNumber: data.meetingNumber,
        fileUrl: data.fileUrl,
        fileName: "Lampiran Materi",
        fileSize: 0,
        fileType: "url",
        status: "published",
      }
    });

    revalidatePath("/dosen/materials");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menyimpan materi: " + error.message };
  }
}

export async function createAssignment(data: {
  kelasId: string;
  title: string;
  description: string;
  deadline: string;
  weight: number;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "dosen") {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.assignment.create({
      data: {
        kelasId: data.kelasId,
        title: data.title,
        description: data.description,
        deadline: new Date(data.deadline),
        weight: data.weight,
        status: "published",
        allowedFormats: ["pdf", "docx", "zip", "url"],
      }
    });

    revalidatePath("/dosen/assignments");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal membuat tugas: " + error.message };
  }
}

export async function getDosenSubmissions() {
  const session = await auth();
  if (!session?.user) return [];

  const classes = await prisma.kelas.findMany({
    where: { dosenId: session.user.id },
    select: { id: true },
  });
  const classIds = classes.map(c => c.id);

  return await prisma.submission.findMany({
    where: {
      assignment: { kelasId: { in: classIds } }
    },
    include: {
      student: { select: { fullName: true, nim: true } },
      assignment: { select: { title: true, kelas: { select: { namaKelas: true } } } }
    },
    orderBy: { submittedAt: "desc" }
  });
}

export async function gradeSubmission(id: string, score: number, feedback: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "dosen") {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: {
        gradeScore: score,
        gradeFeedback: feedback,
        gradeGradedById: session.user.id,
        gradeGradedAt: new Date(),
        gradeIsDraft: false,
      }
    });

    revalidatePath("/dosen/submissions");
    revalidatePath("/dosen/grades");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menyimpan nilai: " + error.message };
  }
}

export async function getDosenGradesSummary() {
  const session = await auth();
  if (!session?.user) return [];

  return await prisma.kelas.findMany({
    where: { dosenId: session.user.id },
    include: {
      mataKuliah: { select: { nama: true } },
      students: {
        select: {
          id: true,
          fullName: true,
          nim: true,
          submissions: {
            where: { assignment: { kelas: { dosenId: session.user.id } } },
            select: { gradeScore: true }
          }
        }
      }
    }
  });
}

export async function getDosenCalendarEvents() {
  const session = await auth();
  if (!session?.user) return [];

  // Get assignments deadline for dosen's classes
  const classes = await prisma.kelas.findMany({
    where: { dosenId: session.user.id },
    select: { id: true },
  });
  const classIds = classes.map(c => c.id);

  const deadlines = await prisma.assignment.findMany({
    where: { kelasId: { in: classIds } },
    include: { kelas: { select: { namaKelas: true } } }
  });

  // Map into event format
  const events = deadlines.map(d => ({
    id: d.id,
    title: `Deadline: ${d.title}`,
    date: d.deadline,
    type: "deadline",
    description: `Kelas: ${d.kelas?.namaKelas}`,
  }));

  // You can also add academic calendars here
  const acCals = await prisma.academicCalendar.findMany({
    where: { startDate: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } }
  });

  const calEvents = acCals.map(c => ({
    id: c.id,
    title: c.title,
    date: c.startDate,
    type: c.type,
    description: c.description || "",
  }));

  return [...events, ...calEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
}
