import { z } from "zod";
import { Role } from "@/types";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
});

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.nativeEnum(Role, {
    message: "Role tidak valid",
  }),
  profile: z.object({
    fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    nim: z.string().optional(),
    nip: z.string().optional(),
    programStudiId: z.string().optional(),
    semester: z.number().min(1).max(14).optional(),
    angkatan: z.number().optional(),
  }),
  phone: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .extend({
    password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
