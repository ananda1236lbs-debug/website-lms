"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createMaterial } from "@/lib/actions/dosen";

export function MaterialsActions({ classes }: { classes: any[] }) {
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
      meetingNumber: Number(fd.get("meetingNumber")),
      fileUrl: fd.get("fileUrl") as string,
    };

    try {
      const res = await createMaterial(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Materi berhasil diunggah");
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
          Upload Materi Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Materi Baru</DialogTitle>
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
            <Label>Judul Materi</Label>
            <Input name="title" required placeholder="Misal: Pengenalan Algoritma" />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi Singkat</Label>
            <Input name="description" placeholder="Penjelasan singkat materi ini..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pertemuan Ke-</Label>
              <Input name="meetingNumber" type="number" min="1" max="16" required defaultValue="1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL Dokumen (G-Drive / Link PDF)</Label>
            <Input name="fileUrl" type="url" required placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading}>Simpan Materi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
