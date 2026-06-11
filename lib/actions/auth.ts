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
    // Get user role for redirect first
    const user = await prisma.user.findUnique({
      where: { email: validated.data.email.toLowerCase() },
      select: { role: true },
    });

    const roleRedirects: Record<string, string> = {
      super_admin: "/super-admin/dashboard",
      admin: "/admin/dashboard",
      dosen: "/dosen/dashboard",
      mahasiswa: "/mahasiswa/dashboard",
    };

    const redirectTo = user ? roleRedirects[user.role] : "/login";

    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: true,
      redirectTo: redirectTo || "/login",
    });

    return { success: true };
  } catch (error: any) {
    // If it's a redirect error from Next.js/Auth.js, we MUST throw it
    // so Next.js can perform the actual redirect and set cookies!
    if (error?.name === "RedirectError" || error?.message === "NEXT_REDIRECT" || error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message || "Email atau password salah" };
    }
    
    // Fallback for Next.js internal redirect error if type checking fails
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
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
