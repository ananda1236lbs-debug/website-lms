import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "Nilai Saya" };

export default async function MahasiswaGradesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await prisma.finalGrade.findMany({
    where: { studentId: session.user.id },
    include: {
      kelas: {
        select: {
          namaKelas: true,
          semester: true,
          tahunAjaran: true,
          mataKuliah: { select: { nama: true, kodeMK: true, sks: true } },
        },
      },
    },
    orderBy: { kelas: { tahunAjaran: "desc" } },
  });

  // Calculate IPK
  let totalWeight = 0;
  let totalGradePoints = 0;
  const gradePointMap: Record<string, number> = { A: 4, AB: 3.5, B: 3, BC: 2.5, C: 2, D: 1, E: 0 };

  data.forEach((g: any) => {
    const sks = g.kelas?.mataKuliah?.sks || 0;
    const gp = gradePointMap[g.letterGrade] ?? 0;
    totalWeight += sks;
    totalGradePoints += gp * sks;
  });
  const ipk = totalWeight > 0 ? (totalGradePoints / totalWeight).toFixed(2) : "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nilai Saya</h1>
          <p className="text-muted-foreground">Kartu Hasil Studi</p>
        </div>
        <Card className="px-6 py-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">IPK</p>
              <p className="text-xl font-bold">{ipk}</p>
            </div>
          </div>
        </Card>
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Belum ada nilai</CardContent></Card>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left font-medium px-4 py-3">Kode MK</th>
              <th className="text-left font-medium px-4 py-3">Mata Kuliah</th>
              <th className="text-center font-medium px-4 py-3">SKS</th>
              <th className="text-center font-medium px-4 py-3">Nilai Angka</th>
              <th className="text-center font-medium px-4 py-3">Huruf</th>
              <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Semester</th>
            </tr></thead>
            <tbody>
              {data.map((grade: any) => (
                <tr key={grade.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3"><Badge variant="outline">{grade.kelas?.mataKuliah?.kodeMK}</Badge></td>
                  <td className="px-4 py-3 font-medium">{grade.kelas?.mataKuliah?.nama}</td>
                  <td className="px-4 py-3 text-center">{grade.kelas?.mataKuliah?.sks}</td>
                  <td className="px-4 py-3 text-center font-medium">{grade.finalScore?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={["A", "AB"].includes(grade.letterGrade) ? "success" : grade.letterGrade === "E" ? "destructive" : "secondary"}>
                      {grade.letterGrade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {grade.kelas?.semester} {grade.kelas?.tahunAjaran}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
