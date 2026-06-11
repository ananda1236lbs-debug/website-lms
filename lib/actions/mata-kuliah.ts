"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { mataKuliahSchema } from "@/lib/validations/class";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getMataKuliahList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  programStudiId?: string;
}) {
  const { page = 1, limit = 10, search = "", programStudiId } = params || {};

  const where: Prisma.MataKuliahWhereInput = {};
  if (search) {
    where.OR = [
      { kodeMK: { contains: search, mode: "insensitive" } },
      { nama: { contains: search, mode: "insensitive" } },
    ];
  }
  if (programStudiId) where.programStudiId = programStudiId;

  const [data, total] = await Promise.all([
    prisma.mataKuliah.findMany({
      where,
      include: {
        programStudi: {
          select: {
            nama: true,
            kode: true,
          },
        },
      },
      orderBy: { kodeMK: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.mataKuliah.count({ where }),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getAllMataKuliah() {
  const data = await prisma.mataKuliah.findMany({
    where: { isActive: true },
    include: {
      programStudi: {
        select: {
          nama: true,
          kode: true,
        },
      },
    },
    orderBy: { nama: "asc" },
  });
  return data;
}

export async function createMataKuliah(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = mataKuliahSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const existing = await prisma.mataKuliah.findUnique({
    where: { kodeMK: validated.data.kodeMK.toUpperCase() },
  });
  if (existing) return { error: "Kode mata kuliah sudah ada" };

  const mk = await prisma.mataKuliah.create({
    data: validated.data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "create",
      model: "MataKuliah",
      modelId: mk.id,
      newValues: { kodeMK: mk.kodeMK, nama: mk.nama } as object,
    },
  });

  revalidatePath("/super-admin/mata-kuliah");
  revalidatePath("/admin/mata-kuliah");
  return { success: true };
}

export async function updateMataKuliah(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = mataKuliahSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const mk = await prisma.mataKuliah.findUnique({ where: { id } });
  if (!mk) return { error: "Mata kuliah tidak ditemukan" };

  const duplicate = await prisma.mataKuliah.findFirst({
    where: {
      id: { not: id },
      kodeMK: validated.data.kodeMK.toUpperCase(),
    },
  });
  if (duplicate) return { error: "Kode mata kuliah sudah digunakan" };

  const oldValues = { kodeMK: mk.kodeMK, nama: mk.nama };
  
  const updatedMk = await prisma.mataKuliah.update({
    where: { id },
    data: validated.data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "MataKuliah",
      modelId: mk.id,
      oldValues: oldValues as object,
      newValues: { kodeMK: updatedMk.kodeMK, nama: updatedMk.nama } as object,
    },
  });

  revalidatePath("/super-admin/mata-kuliah");
  revalidatePath("/admin/mata-kuliah");
  return { success: true };
}

export async function deleteMataKuliah(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const mk = await prisma.mataKuliah.findUnique({ where: { id } });
  if (!mk) return { error: "Mata kuliah tidak ditemukan" };

  await prisma.mataKuliah.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "delete",
      model: "MataKuliah",
      modelId: mk.id,
      oldValues: { kodeMK: mk.kodeMK, nama: mk.nama } as object,
    },
  });

  revalidatePath("/super-admin/mata-kuliah");
  revalidatePath("/admin/mata-kuliah");
  return { success: true };
}
