"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDosenGradesSummary } from "@/lib/actions/dosen";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DosenGradesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDosenGradesSummary();
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      } catch {
        toast.error("Gagal memuat rekap nilai");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rekapitulasi Nilai</h1>
        <p className="text-muted-foreground">Pantau rata-rata nilai mahasiswa per kelas</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
      ) : classes.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Anda belum memiliki kelas yang aktif</CardContent></Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
            <span className="font-medium text-sm whitespace-nowrap">Pilih Kelas:</span>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex h-10 w-full md:w-80 rounded-lg border border-input bg-white px-3 py-2 text-sm"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.namaKelas} - {c.mataKuliah?.nama}</option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium text-slate-600">Mahasiswa</th>
                    <th className="px-6 py-4 font-medium text-slate-600">NIM</th>
                    <th className="px-6 py-4 font-medium text-slate-600 text-center">Rata-rata Nilai Tugas</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.students.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Belum ada mahasiswa terdaftar di kelas ini</td>
                    </tr>
                  ) : (
                    selectedClass.students.map((student: any) => {
                      // Calculate average score
                      const gradedSubs = student.submissions.filter((s: any) => s.gradeScore !== null);
                      const totalScore = gradedSubs.reduce((acc: number, curr: any) => acc + curr.gradeScore, 0);
                      const average = gradedSubs.length > 0 ? (totalScore / gradedSubs.length).toFixed(1) : "-";
                      
                      const avgNum = gradedSubs.length > 0 ? totalScore / gradedSubs.length : 0;
                      let statusBadge = <Badge variant="secondary">Belum Dinilai</Badge>;
                      if (gradedSubs.length > 0) {
                        if (avgNum >= 80) statusBadge = <Badge variant="success">Sangat Baik</Badge>;
                        else if (avgNum >= 60) statusBadge = <Badge variant="warning" className="bg-amber-100 text-amber-700">Cukup</Badge>;
                        else statusBadge = <Badge variant="destructive">Kurang</Badge>;
                      }

                      return (
                        <tr key={student.id} className="border-b hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium">{student.fullName}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.nim}</td>
                          <td className="px-6 py-4 text-center text-lg font-bold">
                            {average}
                            <span className="block text-[10px] text-muted-foreground font-normal">Dari {gradedSubs.length} Tugas</span>
                          </td>
                          <td className="px-6 py-4">{statusBadge}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
