import { z } from "zod";

export const kelasSchema = z.object({
  namaKelas: z.string().min(1, "Nama kelas wajib diisi"),
  mataKuliahId: z.string().min(1, "Mata kuliah wajib dipilih"),
  dosenId: z.string().min(1, "Dosen wajib dipilih"),
  tahunAjaran: z.string().min(1, "Tahun ajaran wajib diisi"),
  semester: z.enum(["Ganjil", "Genap"], {
    message: "Semester wajib dipilih",
  }),
  kapasitas: z.number().min(1, "Kapasitas minimal 1").max(200, "Kapasitas maksimal 200"),
  schedule: z.object({
    day: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    room: z.string().optional(),
  }).optional(),
  gradeComponents: z.array(
    z.object({
      name: z.string().min(1, "Nama komponen wajib diisi"),
      weight: z.number().min(0, "Bobot minimal 0").max(100, "Bobot maksimal 100"),
    })
  ).optional(),
});

export type KelasInput = z.infer<typeof kelasSchema>;
