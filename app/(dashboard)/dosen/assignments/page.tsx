import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { formatDate, getDeadlineStatus } from "@/lib/utils";
import { AssignmentsActions } from "@/components/dosen/assignments-actions";

export const metadata = { title: "Tugas" };

export default async function DosenAssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const classes = await prisma.kelas.findMany({
    where: { dosenId: session.user.id, isActive: true },
    select: { id: true, namaKelas: true, mataKuliah: { select: { nama: true } } },
  });
  const classIds = classes.map((c) => c.id);

  const data = await prisma.assignment.findMany({
    where: { kelasId: { in: classIds } },
    include: {
      kelas: {
        select: {
          namaKelas: true,
          mataKuliah: { select: { nama: true } },
        },
      },
    },
    orderBy: { deadline: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tugas</h1>
          <p className="text-muted-foreground">Kelola tugas untuk kelas Anda</p>
        </div>
        <AssignmentsActions classes={classes} />
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Belum ada tugas</CardContent></Card>
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
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{assignment.title}</p>
                    <Badge variant={assignment.status === "published" ? "success" : assignment.status === "closed" ? "destructive" : "secondary"} className="text-[10px]">
                      {assignment.status === "published" ? "Aktif" : assignment.status === "closed" ? "Ditutup" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {assignment.kelas?.namaKelas} • {assignment.kelas?.mataKuliah?.nama}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bobot: {assignment.weight}% • Deadline: {formatDate(assignment.deadline)}
                  </p>
                </div>
                <Badge variant={status.variant === "danger" ? "destructive" : status.variant === "warning" ? "warning" : "secondary"}>
                  {status.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
