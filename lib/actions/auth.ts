"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/user";
import { AuthError } from "next-auth";

export async function loginAction(data: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { role: true }
    });
    
    const roleRedirects: Record<string, string> = {
      super_admin: "/super-admin/dashboard",
      admin: "/admin/dashboard",
      dosen: "/dosen/dashboard",
      mahasiswa: "/mahasiswa/dashboard",
    };
    
    const dashboardUrl = user?.role ? roleRedirects[user.role] : "/login";

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: dashboardUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email atau password salah" };
    }
    // Required for Next.js redirects
    throw error;
  }
}

export async function getDashboardUrlAction() {
  const session = await auth();
  if (!session?.user?.role) return "/login";
  
  const roleRedirects: Record<string, string> = {
    super_admin: "/super-admin/dashboard",
    admin: "/admin/dashboard",
    dosen: "/dosen/dashboard",
    mahasiswa: "/mahasiswa/dashboard",
  };
  
  return roleRedirects[session.user.role] || "/login";
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
