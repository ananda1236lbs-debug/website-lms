"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitAssignment(data: {
  assignmentId: string;
  fileUrl: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "mahasiswa") {
    return { error: "Akses ditolak" };
  }

  try {
    // Check if deadline has passed
    const assignment = await prisma.assignment.findUnique({
      where: { id: data.assignmentId }
    });

    if (!assignment) return { error: "Tugas tidak ditemukan" };
    
    // Allow submission but might mark as late (optional)
    // For now, we just save it.

    // Check if already submitted
    const existing = await prisma.submission.findFirst({
      where: { assignmentId: data.assignmentId, studentId: session.user.id }
    });

    if (existing) {
      await prisma.submission.update({
        where: { id: existing.id },
        data: {
          fileUrl: data.fileUrl,
          fileName: "Tugas_Terbaru",
          submittedAt: new Date(),
        }
      });
    } else {
      await prisma.submission.create({
        data: {
          assignmentId: data.assignmentId,
          studentId: session.user.id,
          fileUrl: data.fileUrl,
          fileName: "Tugas_Pertama",
          fileSize: 0,
          fileType: "url",
        }
      });
    }

    revalidatePath("/mahasiswa/assignments");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal mengumpulkan tugas: " + error.message };
  }
}
