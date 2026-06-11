"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { getAdminCalendars, createAcademicCalendarEvent, deleteAcademicCalendarEvent } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminCalendars();
      setEvents(data);
    } catch {
      toast.error("Gagal memuat kalender akademik");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      startDate: fd.get("startDate") as string,
      endDate: fd.get("endDate") as string,
      type: fd.get("type") as string,
    };

    try {
      const res = await createAcademicCalendarEvent(data);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Acara akademik berhasil ditambahkan");
        setOpen(false);
        load();
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus acara ini?")) return;
    try {
      const res = await deleteAcademicCalendarEvent(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Acara dihapus");
        load();
      }
    } catch {
      toast.error("Gagal menghapus acara");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kalender Akademik</h1>
          <p className="text-muted-foreground">Kelola jadwal kegiatan kampus (Libur, Ujian, dll)</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Acara
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Acara Kampus Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Acara</Label>
                <Input name="title" required placeholder="Misal: Libur Idul Fitri" />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <Textarea name="description" placeholder="Penjelasan singkat..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input name="startDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Selesai</Label>
                  <Input name="endDate" type="datetime-local" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Jenis Acara</Label>
                <select name="type" required className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                  <option value="holiday">Libur Nasional / Cuti</option>
                  <option value="exam">Ujian (UTS / UAS)</option>
                  <option value="event">Kegiatan Kampus Umum</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button type="submit" loading={saving}>Simpan Acara</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Memuat kalender...</div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center border rounded-xl bg-white text-muted-foreground">
          Belum ada acara akademik. Klik "Tambah Acara" untuk memulai.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className={`h-5 w-5 ${ev.type === 'holiday' ? 'text-red-500' : ev.type === 'exam' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <h3 className="font-bold">{ev.title}</h3>
                </div>
                <Badge variant={ev.type === 'holiday' ? 'destructive' : ev.type === 'exam' ? 'warning' : 'default'} className="text-[10px]">
                  {ev.type === 'holiday' ? 'Libur' : ev.type === 'exam' ? 'Ujian' : 'Event'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Mulai: {formatDate(ev.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Sampai: {formatDate(ev.endDate)}</span>
                </div>
                {ev.description && (
                  <p className="mt-2 text-xs border-t pt-2">{ev.description}</p>
                )}
              </div>

              <div className="mt-auto pt-4 flex justify-end border-t">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(ev.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
