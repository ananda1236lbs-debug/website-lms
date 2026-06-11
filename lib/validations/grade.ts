import { z } from "zod";

export const gradeSubmissionSchema = z.object({
  score: z.number().min(0, "Nilai minimal 0").max(100, "Nilai maksimal 100"),
  feedback: z.string().optional(),
  isDraft: z.boolean().optional(),
});

export const finalGradeSchema = z.object({
  kelasId: z.string().min(1, "Kelas wajib dipilih"),
  studentId: z.string().min(1, "Mahasiswa wajib dipilih"),
  components: z.array(
    z.object({
      name: z.string(),
      weight: z.number(),
      score: z.number().min(0).max(100),
    })
  ),
  status: z.enum(["draft", "published"]).optional(),
});

export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type FinalGradeInput = z.infer<typeof finalGradeSchema>;
