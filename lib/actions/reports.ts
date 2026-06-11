"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getReportStats() {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    throw new Error("Akses ditolak");
  }

  const [
    totalMahasiswa,
    totalDosen,
    totalAdmin,
    totalKelas,
    totalProgramStudi
  ] = await Promise.all([
    prisma.user.count({ where: { role: "mahasiswa" } }),
    prisma.user.count({ where: { role: "dosen" } }),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.kelas.count(),
    prisma.programStudi.count(),
  ]);

  return {
    totalMahasiswa,
    totalDosen,
    totalAdmin,
    totalKelas,
    totalProgramStudi
  };
}

export async function generateUsersCSV() {
  const session = await auth();
  if (!session?.user || !["super_admin", "admin"].includes(session.user.role)) {
    throw new Error("Akses ditolak");
  }

  const users = await prisma.user.findMany({
    select: {
      username: true,
      email: true,
      role: true,
      fullName: true,
      nim: true,
      nip: true,
      phone: true,
      isActive: true,
      createdAt: true,
      programStudi: { select: { nama: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  // CSV Header
  let csvContent = "Nama Lengkap,Username,Email,Role,NIM/NIP,Telepon,Status,Program Studi,Tanggal Daftar\n";

  // CSV Rows
  users.forEach(user => {
    const identitas = user.nim || user.nip || "-";
    const status = user.isActive ? "Aktif" : "Nonaktif";
    const prodi = user.programStudi?.nama || "-";
    const date = new Date(user.createdAt).toLocaleDateString("id-ID");
    
    // Escape quotes and wrap in quotes to handle commas inside text
    const row = [
      `"${user.fullName}"`,
      `"${user.username}"`,
      `"${user.email}"`,
      `"${user.role}"`,
      `"${identitas}"`,
      `"${user.phone || "-"}"`,
      `"${status}"`,
      `"${prodi}"`,
      `"${date}"`
    ].join(",");
    
    csvContent += row + "\n";
  });

  return csvContent;
}
