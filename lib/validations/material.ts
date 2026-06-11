import { z } from "zod";

export const materialSchema = z.object({
  kelasId: z.string().min(1, "Kelas wajib dipilih"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  meetingNumber: z.number().min(1, "Pertemuan ke- minimal 1"),
  status: z.enum(["draft", "published"]).optional(),
});

export type MaterialInput = z.infer<typeof materialSchema>;
