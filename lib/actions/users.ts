"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";
import { Role, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    role,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") where.role = role as Role;
  if (isActive !== undefined && isActive !== "") where.isActive = isActive === "true";

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        fullName: true,
        nim: true,
        nip: true,
        programStudiId: true,
        semester: true,
        angkatan: true,
        programStudi: {
          select: {
            nama: true,
            kode: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createUser(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = createUserSchema.safeParse(data);
  if (!validated.success) {
    return { error: (validated as any).error.errors[0].message };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: validated.data.email }, { username: validated.data.username }],
    },
  });

  if (existingUser) {
    return { error: "Email atau username sudah terdaftar" };
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(validated.data.password, salt);

  const user = await prisma.user.create({
    data: {
      username: validated.data.username,
      email: validated.data.email,
      password: hashedPassword,
      role: validated.data.role,
      fullName: validated.data.profile.fullName,
      nim: validated.data.profile.nim,
      nip: validated.data.profile.nip,
      programStudiId: validated.data.profile.programStudiId,
      semester: validated.data.profile.semester,
      angkatan: validated.data.profile.angkatan,
      phone: validated.data.phone,
      isActive: validated.data.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "create",
      model: "User",
      modelId: user.id,
      newValues: { username: user.username, email: user.email, role: user.role } as object,
    },
  });

  revalidatePath("/super-admin/users");
  revalidatePath("/admin/users");
  
  // Omit password from returned data
  const { password, ...userWithoutPassword } = user;
  return { success: true, data: userWithoutPassword };
}

export async function updateUser(id: string, data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const validated = updateUserSchema.safeParse(data);
  if (!validated.success) {
    return { error: (validated as any).error.errors[0].message };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { error: "Pengguna tidak ditemukan" };

  if (session.user.role === "admin" && user.role === "super_admin") {
    return { error: "Akses ditolak: Admin tidak dapat memodifikasi akun Super Admin" };
  }
  if (session.user.role === "admin" && validated.data.role === "super_admin") {
    return { error: "Akses ditolak: Admin tidak dapat menjadikan pengguna sebagai Super Admin" };
  }

  const oldValues = { username: user.username, email: user.email, role: user.role };

  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: id },
      OR: [{ email: validated.data.email }, { username: validated.data.username }],
    },
  });

  if (duplicate) {
    return { error: "Email atau username sudah digunakan" };
  }

  const updateData: Prisma.UserUncheckedUpdateInput = {
    username: validated.data.username,
    email: validated.data.email,
    role: validated.data.role,
    fullName: validated.data.profile.fullName,
    nim: validated.data.profile.nim,
    nip: validated.data.profile.nip,
    programStudiId: validated.data.profile.programStudiId,
    semester: validated.data.profile.semester,
    angkatan: validated.data.profile.angkatan,
    phone: validated.data.phone,
    isActive: validated.data.isActive,
  };

  if (validated.data.password && validated.data.password.length > 0) {
    const salt = await bcrypt.genSalt(12);
    updateData.password = await bcrypt.hash(validated.data.password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "User",
      modelId: updatedUser.id,
      oldValues: oldValues as object,
      newValues: { username: updatedUser.username, email: updatedUser.email, role: updatedUser.role } as object,
    },
  });

  revalidatePath("/super-admin/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { error: "Pengguna tidak ditemukan" };

  if (session.user.role === "admin" && user.role === "super_admin") {
    return { error: "Akses ditolak: Admin tidak dapat menghapus akun Super Admin" };
  }

  if (user.id === session.user.id) {
    return { error: "Tidak dapat menghapus akun sendiri" };
  }

  await prisma.user.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "delete",
      model: "User",
      modelId: user.id,
      oldValues: { username: user.username, email: user.email, role: user.role } as object,
    },
  });

  revalidatePath("/super-admin/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActive(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak terautentikasi");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { error: "Pengguna tidak ditemukan" };

  if (session.user.role === "admin" && user.role === "super_admin") {
    return { error: "Akses ditolak: Admin tidak dapat menonaktifkan akun Super Admin" };
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "update",
      model: "User",
      modelId: user.id,
      oldValues: { isActive: user.isActive } as object,
      newValues: { isActive: updatedUser.isActive } as object,
    },
  });

  revalidatePath("/super-admin/users");
  revalidatePath("/admin/users");
  return { success: true, isActive: updatedUser.isActive };
}

export async function getUsersByRole(role: Role) {
  const users = await prisma.user.findMany({
    where: { role, isActive: true },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      nim: true,
      nip: true,
      avatar: true,
    },
    orderBy: { fullName: "asc" },
  });
  return users;
}
