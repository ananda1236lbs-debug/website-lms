"use client";

import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getDosenSubmissions, gradeSubmission } from "@/lib/actions/dosen";

export default function DosenSubmissionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeModal, setGradeModal] = useState<{ open: boolean; sub: any }>({ open: false, sub: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const subs = await getDosenSubmissions();
      setData(subs);
    } catch {
      toast.error("Gagal memuat data pengumpulan");
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const score = Number(fd.get("score"));
    const feedback = fd.get("feedback") as string;

    try {
      const res = await gradeSubmission(gradeModal.sub.id, score, feedback);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Nilai berhasil disimpan");
        setGradeModal({ open: false, sub: null });
        load(); // reload
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengumpulan Tugas</h1>
        <p className="text-muted-foreground">Periksa dan beri nilai tugas mahasiswa</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="p-16 text-center border rounded-xl bg-white text-muted-foreground">Belum ada tugas yang dikumpulkan</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Mahasiswa</th>
                <th className="px-4 py-3 font-medium">Tugas & Kelas</th>
                <th className="px-4 py-3 font-medium">File Tugas</th>
                <th className="px-4 py-3 font-medium">Status Nilai</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{sub.student?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{sub.student?.nim}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{sub.assignment?.title}</p>
                    <p className="text-xs text-muted-foreground">{sub.assignment?.kelas?.namaKelas}</p>
                  </td>
                  <td className="px-4 py-3">
                    {sub.fileUrl ? (
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Lihat File
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada file</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {sub.gradeScore !== null ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3"/> Dinilai ({sub.gradeScore})</Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3"/> Menunggu</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => setGradeModal({ open: true, sub })}>
                      {sub.gradeScore !== null ? "Ubah Nilai" : "Beri Nilai"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grade Modal */}
      <Dialog open={gradeModal.open} onOpenChange={(open) => !open && setGradeModal({ open: false, sub: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Penilaian Tugas</DialogTitle>
          </DialogHeader>
          {gradeModal.sub && (
            <form onSubmit={handleGrade} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg text-sm mb-4">
                <p><strong>Mahasiswa:</strong> {gradeModal.sub.student?.fullName}</p>
                <p><strong>Tugas:</strong> {gradeModal.sub.assignment?.title}</p>
              </div>
              <div className="space-y-2">
                <Label>Nilai (0-100)</Label>
                <Input name="score" type="number" min="0" max="100" required defaultValue={gradeModal.sub.gradeScore ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Catatan / Feedback (Opsional)</Label>
                <Textarea name="feedback" rows={3} placeholder="Kerja bagus! Perhatikan bagian..." defaultValue={gradeModal.sub.gradeFeedback ?? ""} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setGradeModal({ open: false, sub: null })}>Batal</Button>
                <Button type="submit" loading={saving}>Simpan Nilai</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
