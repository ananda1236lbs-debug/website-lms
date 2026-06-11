"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { programStudiSchema } from "@/lib/validations/class";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getProgramStudiList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 10, search = "" } = params || {};

  const where: Prisma.ProgramStudiWhereInput = {};
  if (search) {
    where.OR = [
      { kode: { contains: search, mode: "insensitive" } },
      { nama: { contains: search, mode: "insensitive" } },
      { fakultas: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.programStudi.findMany({
      where,
      orderBy: { nama: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.programStudi.count({ where }),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getAllProgramStudi() {
  const data = await prisma.programStudi.findMany({
    where: { isActive: true },
    orderBy: { nama: "asc" },
  });
  return data;
}

export async function createProgramStudi(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = programStudiSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const existing = await prisma.programStudi.findUnique({
    where: { kode: validated.data.kode.toUpperCase() },
  });
  if (existing) return { error: "Kode program studi sudah ada" };

  const prodi = await prisma.programStudi.create({
    data: validated.data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "create",
      model: "ProgramStudi",
      modelId: prodi.id,
      newValues: { kode: prodi.kode, nama: prodi.nama } as object,
    },
  });

  revalidatePath("/super-admin/program-studi");
  revalidatePath("/admin/program-studi");
  return { success: true };
}

export async function updateProgramStudi(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = programStudiSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const prodi = await prisma.programStudi.findUnique({ where: { id } });
  if (!prodi) return { error: "Program studi tidak ditemukan" };

  const duplicate = await prisma.programStudi.findFirst({
    where: {
      id: { not: id },
      kode: validated.data.kode.toUpperCase(),
    },
  });
  if (duplicate) return { error: "Kode program studi sudah digunakan" };

  const oldValues = { kode: prodi.kode, nama: prodi.nama };
  
  const updatedProdi = await prisma.programStudi.update({
    where: { id },
    data: validated.data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "ProgramStudi",
      modelId: prodi.id,
      oldValues: oldValues as object,
      newValues: { kode: updatedProdi.kode, nama: updatedProdi.nama } as object,
    },
  });

  revalidatePath("/super-admin/program-studi");
  revalidatePath("/admin/program-studi");
  return { success: true };
}

export async function deleteProgramStudi(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const prodi = await prisma.programStudi.findUnique({ where: { id } });
  if (!prodi) return { error: "Program studi tidak ditemukan" };

  await prisma.programStudi.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "delete",
      model: "ProgramStudi",
      modelId: prodi.id,
      oldValues: { kode: prodi.kode, nama: prodi.nama } as object,
    },
  });

  revalidatePath("/super-admin/program-studi");
  revalidatePath("/admin/program-studi");
  return { success: true };
}
