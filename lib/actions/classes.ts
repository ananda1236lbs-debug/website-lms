"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { kelasSchema } from "@/lib/validations/kelas";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

function formatKelasData(kelas: any) {
  if (!kelas) return null;
  return {
    ...kelas,
    schedule: {
      day: kelas.scheduleDay || "",
      startTime: kelas.scheduleStartTime || "",
      endTime: kelas.scheduleEndTime || "",
      room: kelas.scheduleRoom || "",
    },
    scheduleDay: undefined,
    scheduleStartTime: undefined,
    scheduleEndTime: undefined,
    scheduleRoom: undefined,
  };
}

export async function getKelasList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  dosenId?: string;
  semester?: string;
  tahunAjaran?: string;
}) {
  const { page = 1, limit = 10, search = "", dosenId, semester, tahunAjaran } = params || {};

  const where: Prisma.KelasWhereInput = {};
  if (search) {
    where.OR = [{ namaKelas: { contains: search, mode: "insensitive" } }];
  }
  if (dosenId) where.dosenId = dosenId;
  if (semester) where.semester = semester;
  if (tahunAjaran) where.tahunAjaran = tahunAjaran;

  const [data, total] = await Promise.all([
    prisma.kelas.findMany({
      where,
      include: {
        mataKuliah: { select: { nama: true, kodeMK: true, sks: true } },
        dosen: { select: { fullName: true, avatar: true } },
        gradeComponents: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.kelas.count({ where }),
  ]);

  const formattedData = data.map(formatKelasData);

  return {
    data: formattedData,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getKelasById(id: string) {
  const kelas = await prisma.kelas.findUnique({
    where: { id },
    include: {
      mataKuliah: { select: { nama: true, kodeMK: true, sks: true, semester: true } },
      dosen: { select: { fullName: true, avatar: true, email: true } },
      students: { select: { id: true, fullName: true, nim: true, avatar: true, email: true } },
      gradeComponents: true,
    },
  });

  return formatKelasData(kelas);
}

export async function createKelas(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = kelasSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const data = validated.data;

  const kelas = await prisma.kelas.create({
    data: {
      namaKelas: data.namaKelas,
      mataKuliahId: data.mataKuliahId,
      dosenId: data.dosenId,
      tahunAjaran: data.tahunAjaran,
      semester: data.semester,
      kapasitas: data.kapasitas,
      scheduleDay: data.schedule?.day,
      scheduleStartTime: data.schedule?.startTime,
      scheduleEndTime: data.schedule?.endTime,
      scheduleRoom: data.schedule?.room,
      gradeComponents: {
        create: data.gradeComponents?.map((gc) => ({
          name: gc.name,
          weight: gc.weight,
        })) || [],
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "create",
      model: "Kelas",
      modelId: kelas.id,
      newValues: { namaKelas: kelas.namaKelas } as object,
    },
  });

  revalidatePath("/super-admin/classes");
  revalidatePath("/admin/classes");
  revalidatePath("/dosen/classes");
  return { success: true };
}

export async function updateKelas(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = kelasSchema.safeParse(input);
  if (!validated.success) return { error: (validated as any).error.errors[0].message };

  const kelas = await prisma.kelas.findUnique({ where: { id } });
  if (!kelas) return { error: "Kelas tidak ditemukan" };

  const oldValues = { namaKelas: kelas.namaKelas };
  const data = validated.data;

  await prisma.$transaction(async (tx) => {
    // Delete old components
    await tx.gradeComponent.deleteMany({ where: { kelasId: id } });
    
    // Update main model and create new components
    await tx.kelas.update({
      where: { id },
      data: {
        namaKelas: data.namaKelas,
        mataKuliahId: data.mataKuliahId,
        dosenId: data.dosenId,
        tahunAjaran: data.tahunAjaran,
        semester: data.semester,
        kapasitas: data.kapasitas,
        scheduleDay: data.schedule?.day,
        scheduleStartTime: data.schedule?.startTime,
        scheduleEndTime: data.schedule?.endTime,
        scheduleRoom: data.schedule?.room,
        gradeComponents: {
          create: data.gradeComponents?.map((gc) => ({
            name: gc.name,
            weight: gc.weight,
          })) || [],
        },
      },
    });
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "Kelas",
      modelId: kelas.id,
      oldValues: oldValues as object,
      newValues: { namaKelas: data.namaKelas } as object,
    },
  });

  revalidatePath("/super-admin/classes");
  revalidatePath("/admin/classes");
  revalidatePath("/dosen/classes");
  return { success: true };
}

export async function deleteKelas(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const kelas = await prisma.kelas.findUnique({ where: { id } });
  if (!kelas) return { error: "Kelas tidak ditemukan" };

  await prisma.kelas.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "delete",
      model: "Kelas",
      modelId: kelas.id,
      oldValues: { namaKelas: kelas.namaKelas } as object,
    },
  });

  revalidatePath("/super-admin/classes");
  revalidatePath("/admin/classes");
  return { success: true };
}

export async function enrollStudents(kelasId: string, studentIds: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: { students: true },
  });
  if (!kelas) return { error: "Kelas tidak ditemukan" };

  const currentStudents = new Set(kelas.students.map((s) => s.id));
  const newStudents = studentIds.filter((id) => !currentStudents.has(id));

  if (kelas.students.length + newStudents.length > kelas.kapasitas) {
    return { error: "Melebihi kapasitas kelas" };
  }

  await prisma.kelas.update({
    where: { id: kelasId },
    data: {
      students: {
        connect: newStudents.map((id) => ({ id })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "Kelas",
      modelId: kelas.id,
      newValues: { enrolledStudents: newStudents.length } as object,
    },
  });

  revalidatePath(`/super-admin/classes`);
  revalidatePath(`/admin/classes`);
  revalidatePath(`/dosen/classes`);
  return { success: true, enrolled: newStudents.length };
}

export async function removeStudent(kelasId: string, studentId: string) {
  await prisma.kelas.update({
    where: { id: kelasId },
    data: {
      students: {
        disconnect: { id: studentId },
      },
    },
  });
  revalidatePath(`/dosen/classes`);
  revalidatePath(`/admin/classes`);
  return { success: true };
}
