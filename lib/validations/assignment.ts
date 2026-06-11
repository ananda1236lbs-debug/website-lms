import { z } from "zod";

export const assignmentSchema = z.object({
  kelasId: z.string().min(1, "Kelas wajib dipilih"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  allowedFormats: z.array(z.string()).min(1, "Minimal 1 format file"),
  maxFileSize: z.number().min(1, "Ukuran file minimal 1 MB").max(100, "Ukuran file maksimal 100 MB"),
  weight: z.number().min(0, "Bobot minimal 0").max(100, "Bobot maksimal 100"),
  status: z.enum(["draft", "published", "closed"]).optional(),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
