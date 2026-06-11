"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { getKelasList, createKelas, updateKelas, deleteKelas } from "@/lib/actions/classes";
import { getAllMataKuliah } from "@/lib/actions/mata-kuliah";
import { getUsersByRole } from "@/lib/actions/users";
import { Role } from "@/types";

export default function ClassesPage() {
  const [data, setData] = useState<any[]>([]);
  const [mks, setMks] = useState<any[]>([]);
  const [dosens, setDosens] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [kelasRes, mkRes, dosenRes] = await Promise.all([
        getKelasList({ page: pagination.page, limit: pagination.limit, search: debouncedSearch }),
        getAllMataKuliah(),
        getUsersByRole(Role.dosen)
      ]);
      setData(kelasRes.data);
      setPagination(kelasRes.pagination);
      setMks(mkRes);
      setDosens(dosenRes);
    } catch { toast.error("Gagal memuat data"); }
    finally { setIsLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData(e.currentTarget);
    const input = {
      namaKelas: fd.get("namaKelas") as string,
      mataKuliahId: fd.get("mataKuliahId") as string,
      dosenId: fd.get("dosenId") as string,
      tahunAjaran: fd.get("tahunAjaran") as string,
      semester: fd.get("semester") as "Ganjil" | "Genap" | "Pendek",
      kapasitas: Number(fd.get("kapasitas")),
    };
    try {
      const result = selected ? await updateKelas(selected.id, input) : await createKelas(input);
      if (result.error) { toast.error(result.error); }
      else { toast.success(selected ? "Kelas diperbarui" : "Kelas ditambahkan"); setDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const result = await deleteKelas(selected.id);
      if (result.error) { toast.error(result.error); }
      else { toast.success("Kelas dihapus"); setDeleteDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
          <p className="text-muted-foreground">Kelola pembagian kelas dan dosen</p>
        </div>
        <Button onClick={() => { setSelected(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Tambah Kelas</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari nama kelas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left font-medium px-4 py-3">Nama Kelas</th>
              <th className="text-left font-medium px-4 py-3">Mata Kuliah</th>
              <th className="text-left font-medium px-4 py-3">Dosen Pengampu</th>
              <th className="text-center font-medium px-4 py-3">Kapasitas</th>
              <th className="text-center font-medium px-4 py-3">Status</th>
              <th className="text-right font-medium px-4 py-3">Aksi</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td className="px-4 py-3" colSpan={6}><Skeleton className="h-6 w-full" /></td></tr>
              )) : data.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{item.namaKelas}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.mataKuliah?.nama}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.dosen?.fullName}</td>
                  <td className="px-4 py-3 text-center">{item.students?.length || 0}/{item.kapasitas}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Aktif" : "Selesai"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelected(item); setDialogOpen(true); }}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-danger focus:text-danger" onClick={() => { setSelected(item); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" /> Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{selected ? "Edit" : "Tambah"} Kelas</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Nama Kelas</Label><Input name="namaKelas" required defaultValue={selected?.namaKelas} placeholder="Contoh: TI201-A" /></div>
            <div className="space-y-2"><Label>Mata Kuliah</Label>
              <select name="mataKuliahId" required defaultValue={selected?.mataKuliahId || ""} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                <option value="">Pilih Mata Kuliah</option>
                {mks.map(m => <option key={m.id} value={m.id}>{m.nama} ({m.kodeMK})</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Dosen Pengampu</Label>
              <select name="dosenId" required defaultValue={selected?.dosenId || ""} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                <option value="">Pilih Dosen</option>
                {dosens.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tahun Ajaran</Label><Input name="tahunAjaran" required defaultValue={selected?.tahunAjaran || "2024/2025"} /></div>
              <div className="space-y-2"><Label>Semester</Label>
                <select name="semester" required defaultValue={selected?.semester || "Ganjil"} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                  <option value="Ganjil">Ganjil</option><option value="Genap">Genap</option><option value="Pendek">Pendek</option>
                </select>
              </div>
            </div>
            <div className="space-y-2"><Label>Kapasitas Mahasiswa</Label><Input name="kapasitas" type="number" required defaultValue={selected?.kapasitas || 40} /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button type="submit" loading={formLoading}>{selected ? "Simpan" : "Tambah"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Hapus Kelas</DialogTitle><DialogDescription>Yakin ingin menghapus kelas <strong>{selected?.namaKelas}</strong>?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button><Button variant="destructive" onClick={handleDelete} loading={formLoading}>Hapus</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
