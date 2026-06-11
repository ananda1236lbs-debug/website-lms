"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createAssignment } from "@/lib/actions/dosen";

export function AssignmentsActions({ classes }: { classes: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const data = {
      kelasId: fd.get("kelasId") as string,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      deadline: fd.get("deadline") as string,
      weight: Number(fd.get("weight")),
    };

    try {
      const res = await createAssignment(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Tugas berhasil dibuat");
        setOpen(false);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Buat Tugas Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Tugas Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Kelas</Label>
            <select name="kelasId" required className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
              <option value="">Pilih Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.namaKelas} - {c.mataKuliah?.nama}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Judul Tugas</Label>
            <Input name="title" required placeholder="Misal: Tugas Besar 1" />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi / Instruksi</Label>
            <Input name="description" required placeholder="Kerjakan latihan soal di buku halaman..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tenggat Waktu (Deadline)</Label>
              <Input name="deadline" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label>Bobot Nilai (%)</Label>
              <Input name="weight" type="number" min="1" max="100" required defaultValue="10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading}>Simpan Tugas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
