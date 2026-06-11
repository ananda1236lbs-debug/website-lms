"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function generateFullBackup() {
  const session = await auth();
  if (!session?.user || session.user.role !== "super_admin") {
    throw new Error("Akses ditolak");
  }

  try {
    // Fetch all vital tables sequentially to avoid max connections
    const users = await prisma.user.findMany();
    const settings = await prisma.setting.findMany();
    const programStudi = await prisma.programStudi.findMany();
    const mataKuliah = await prisma.mataKuliah.findMany();
    const kelas = await prisma.kelas.findMany();
    
    // Construct the backup payload
    const backupData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: session.user.username,
        version: "1.0",
        appName: "LMSLearn",
      },
      data: {
        settings,
        users,
        programStudi,
        mataKuliah,
        kelas,
      }
    };

    // Audit log the backup creation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "export",
        model: "Database",
        newValues: { action: "Generated full logical backup" }
      }
    });

    return JSON.stringify(backupData, null, 2);
  } catch (error: any) {
    throw new Error("Gagal mengompilasi backup: " + error.message);
  }
}
