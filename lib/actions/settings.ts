"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  let setting = await prisma.setting.findFirst();
  
  if (!setting) {
    // Create default setting if none exists
    setting = await prisma.setting.create({
      data: {
        institutionName: "LMSLearn University",
        activeSemester: "Ganjil",
        tahunAjaran: "2024/2025",
        uploadLimit: 10,
        primaryColor: "#0f172a",
        secondaryColor: "#334155",
        gradingScale: {
          A: { min: 85, max: 100 },
          B: { min: 70, max: 84 },
          C: { min: 55, max: 69 },
          D: { min: 40, max: 54 },
          E: { min: 0, max: 39 },
        }
      }
    });
  }
  
  return setting;
}

export async function updateSettings(data: {
  institutionName: string;
  activeSemester: string;
  tahunAjaran: string;
  primaryColor: string;
  uploadLimit: number;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "super_admin") {
    return { error: "Akses ditolak" };
  }

  const setting = await prisma.setting.findFirst();
  
  if (setting) {
    await prisma.setting.update({
      where: { id: setting.id },
      data: {
        institutionName: data.institutionName,
        activeSemester: data.activeSemester,
        tahunAjaran: data.tahunAjaran,
        primaryColor: data.primaryColor,
        uploadLimit: data.uploadLimit,
      }
    });
    
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "update",
        model: "Setting",
        modelId: setting.id,
        newValues: data as object,
      }
    });
  }

  revalidatePath("/super-admin/settings");
  revalidatePath("/");
  
  return { success: true };
}
