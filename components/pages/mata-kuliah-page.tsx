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
import { getMataKuliahList, createMataKuliah, updateMataKuliah, deleteMataKuliah } from "@/lib/actions/mata-kuliah";
import { getAllProgramStudi } from "@/lib/actions/program-studi";

export default function MataKuliahPage() {
  const [data, setData] = useState<any[]>([]);
  const [prodis, setProdis] = useState<any[]>([]);
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
      const [mkResult, prodiResult] = await Promise.all([
        getMataKuliahList({ page: pagination.page, limit: pagination.limit, search: debouncedSearch }),
        getAllProgramStudi()
      ]);
      setData(mkResult.data);
      setPagination(mkResult.pagination);
      setProdis(prodiResult);
    } catch { toast.error("Gagal memuat data"); }
    finally { setIsLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData(e.currentTarget);
    const input = {
      kodeMK: fd.get("kodeMK") as string,
      nama: fd.get("nama") as string,
      sks: Number(fd.get("sks")),
      semester: Number(fd.get("semester")),
      programStudiId: fd.get("programStudiId") as string,
    };
    try {
      const result = selected ? await updateMataKuliah(selected.id, input) : await createMataKuliah(input);
      if (result.error) { toast.error(result.error); }
      else { toast.success(selected ? "Mata kuliah diperbarui" : "Mata kuliah ditambahkan"); setDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const result = await deleteMataKuliah(selected.id);
      if (result.error) { toast.error(result.error); }
      else { toast.success("Mata kuliah dihapus"); setDeleteDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mata Kuliah</h1>
          <p className="text-muted-foreground">Kelola kurikulum mata kuliah</p>
        </div>
        <Button onClick={() => { setSelected(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Tambah MK</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari mata kuliah..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left font-medium px-4 py-3">Kode MK</th>
              <th className="text-left font-medium px-4 py-3">Nama</th>
              <th className="text-left font-medium px-4 py-3">SKS</th>
              <th className="text-left font-medium px-4 py-3">Prodi</th>
              <th className="text-right font-medium px-4 py-3">Aksi</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td className="px-4 py-3" colSpan={5}><Skeleton className="h-6 w-full" /></td></tr>
              )) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3"><Badge variant="outline">{item.kodeMK}</Badge></td>
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sks} SKS (Sem {item.semester})</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.programStudiId?.nama}</td>
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
        <DialogContent><DialogHeader><DialogTitle>{selected ? "Edit" : "Tambah"} Mata Kuliah</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Kode MK</Label><Input name="kodeMK" required defaultValue={selected?.kodeMK} /></div>
            <div className="space-y-2"><Label>Nama Mata Kuliah</Label><Input name="nama" required defaultValue={selected?.nama} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>SKS</Label><Input name="sks" type="number" required defaultValue={selected?.sks} /></div>
              <div className="space-y-2"><Label>Semester</Label><Input name="semester" type="number" required defaultValue={selected?.semester} /></div>
            </div>
            <div className="space-y-2"><Label>Program Studi</Label>
              <select name="programStudiId" required defaultValue={selected?.programStudiId?.id || ""} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                <option value="">Pilih Program Studi</option>
                {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button type="submit" loading={formLoading}>{selected ? "Simpan" : "Tambah"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Hapus Mata Kuliah</DialogTitle><DialogDescription>Yakin ingin menghapus <strong>{selected?.nama}</strong>?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button><Button variant="destructive" onClick={handleDelete} loading={formLoading}>Hapus</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
