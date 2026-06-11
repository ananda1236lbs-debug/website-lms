import { z } from "zod";
import { Jenjang } from "@/types";

export const programStudiSchema = z.object({
  kode: z.string().min(2, "Kode minimal 2 karakter").max(20, "Kode maksimal 20 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  fakultas: z.string().min(3, "Fakultas minimal 3 karakter"),
  jenjang: z.nativeEnum(Jenjang, {
    message: "Jenjang tidak valid",
  }),
  isActive: z.boolean().optional().default(true),
});

export const mataKuliahSchema = z.object({
  kodeMK: z.string().min(2, "Kode MK minimal 2 karakter").max(20, "Kode MK maksimal 20 karakter"),
  nama: z.string().min(3, "Nama mata kuliah minimal 3 karakter"),
  sks: z.number().min(1, "SKS minimal 1").max(6, "SKS maksimal 6"),
  semester: z.number().min(1, "Semester minimal 1").max(14, "Semester maksimal 14"),
  programStudiId: z.string().min(1, "Program studi wajib dipilih"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export type ProgramStudiInput = z.infer<typeof programStudiSchema>;
export type MataKuliahInput = z.infer<typeof mataKuliahSchema>;
