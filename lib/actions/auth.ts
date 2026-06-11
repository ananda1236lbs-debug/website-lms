"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/user";
import { AuthError } from "next-auth";

export async function loginAction(formData: { email: string; password: string }) {
  const validated = loginSchema.safeParse(formData);
  if (!validated.success) {
    return { error: (validated as any).error.errors[0].message };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    // Get user role for redirect
    const user = await prisma.user.findUnique({
      where: { email: validated.data.email.toLowerCase() },
      select: { role: true },
    });

    if (!user) return { error: "Email atau password salah" };

    const roleRedirects: Record<string, string> = {
      super_admin: "/super-admin/dashboard",
      admin: "/admin/dashboard",
      dosen: "/dosen/dashboard",
      mahasiswa: "/mahasiswa/dashboard",
    };

    return { success: true, redirect: roleRedirects[user.role] || "/login" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message || "Email atau password salah" };
    }
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  return { success: true };
}

export async function forgotPasswordAction(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if email exists
    return { success: true, message: "Jika email terdaftar, instruksi reset password akan dikirim." };
  }

  // In production, send email. For now, log to console.
  console.log(`[FORGOT PASSWORD] Reset token for ${email}: ${Math.random().toString(36).slice(2)}`);

  return { success: true, message: "Jika email terdaftar, instruksi reset password akan dikirim." };
}
