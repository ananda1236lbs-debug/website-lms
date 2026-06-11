import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle } from "lucide-react";
import { formatDate, getDeadlineStatus } from "@/lib/utils";
import { AssignmentStatus } from "@prisma/client";
import { SubmitAction } from "@/components/mahasiswa/submit-action";

export const metadata = { title: "Tugas" };

export default async function MahasiswaAssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const classes = await prisma.kelas.findMany({
    where: { students: { some: { id: session.user.id } }, isActive: true },
    select: { id: true },
  });
  const classIds = classes.map((c: { id: string }) => c.id);

  const data = await prisma.assignment.findMany({
    where: { kelasId: { in: classIds }, status: AssignmentStatus.published },
    include: {
      kelas: {
        select: {
          namaKelas: true,
          mataKuliah: { select: { nama: true } },
        },
      },
      submissions: {
        where: { studentId: session.user.id },
        select: { id: true, fileUrl: true, submittedAt: true }
      }
    },
    orderBy: { deadline: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tugas</h1>
        <p className="text-muted-foreground">Tugas aktif dari kelas Anda</p>
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Tidak ada tugas aktif 🎉</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {data.map((assignment: any) => {
            const status = getDeadlineStatus(assignment.deadline);
            return (
              <div key={assignment.id} className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-amber-100 text-amber-600 shrink-0">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {assignment.kelas?.namaKelas} • {assignment.kelas?.mataKuliah?.nama}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bobot: {assignment.weight}% • Format: {assignment.allowedFormats?.join(", ")}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={status.variant === "danger" ? "destructive" : status.variant === "warning" ? "warning" : "secondary"}>
                    {status.label}
                  </Badge>
                  
                  {assignment.submissions.length > 0 ? (
                    <div className="flex flex-col items-end">
                      <Badge variant="success" className="gap-1 mb-1 text-[10px]">
                        <CheckCircle className="h-3 w-3" /> Selesai
                      </Badge>
                      <SubmitAction assignmentId={assignment.id} isPastDeadline={status.isPast} />
                    </div>
                  ) : (
                    <SubmitAction assignmentId={assignment.id} isPastDeadline={status.isPast} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
