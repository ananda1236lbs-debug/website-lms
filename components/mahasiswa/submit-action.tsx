"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitAssignment } from "@/lib/actions/mahasiswa";

export function SubmitAction({ assignmentId, isPastDeadline }: { assignmentId: string; isPastDeadline: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const data = {
      assignmentId,
      fileUrl: fd.get("fileUrl") as string,
    };

    try {
      const res = await submitAssignment(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Tugas berhasil dikumpulkan!");
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
        <Button size="sm" variant={isPastDeadline ? "destructive" : "default"}>
          <Upload className="h-4 w-4 mr-2" />
          Kumpulkan Tugas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pengumpulan Tugas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
            Masukkan tautan (link) tugas Anda di sini. Pastikan akses Google Drive atau dokumen Anda diatur ke <strong>"Siapa saja yang memiliki tautan (Public)"</strong> agar Dosen bisa membukanya.
          </div>
          <div className="space-y-2">
            <Label>Tautan Dokumen / Google Drive</Label>
            <Input name="fileUrl" type="url" required placeholder="https://docs.google.com/..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading}>Kirim Tugas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
