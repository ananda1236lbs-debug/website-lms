"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { getProgramStudiList, createProgramStudi, updateProgramStudi, deleteProgramStudi } from "@/lib/actions/program-studi";

export default function ProgramStudiPage() {
  const [data, setData] = useState<any[]>([]);
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
      const result = await getProgramStudiList({ page: pagination.page, limit: pagination.limit, search: debouncedSearch });
      setData(result.data);
      setPagination(result.pagination);
    } catch { toast.error("Gagal memuat data"); }
    finally { setIsLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData(e.currentTarget);
    const input = {
      kode: fd.get("kode") as string,
      nama: fd.get("nama") as string,
      fakultas: fd.get("fakultas") as string,
      jenjang: fd.get("jenjang") as string,
    };
    try {
      const result = selected ? await updateProgramStudi(selected.id, input) : await createProgramStudi(input);
      if (result.error) { toast.error(result.error); }
      else { toast.success(selected ? "Program studi diperbarui" : "Program studi ditambahkan"); setDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const result = await deleteProgramStudi(selected.id);
      if (result.error) { toast.error(result.error); }
      else { toast.success("Program studi dihapus"); setDeleteDialogOpen(false); setSelected(null); fetchData(); }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setFormLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Program Studi</h1>
          <p className="text-muted-foreground">Kelola data program studi</p>
        </div>
        <Button onClick={() => { setSelected(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Tambah Prodi</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari program studi..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left font-medium px-4 py-3">Kode</th>
              <th className="text-left font-medium px-4 py-3">Nama</th>
              <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Fakultas</th>
              <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Jenjang</th>
              <th className="text-right font-medium px-4 py-3">Aksi</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td className="px-4 py-3" colSpan={5}><Skeleton className="h-6 w-full" /></td></tr>
              )) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><Badge variant="outline">{item.kode}</Badge></td>
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{item.fakultas}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="secondary">{item.jenjang}</Badge></td>
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
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Selanjutnya</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{selected ? "Edit" : "Tambah"} Program Studi</DialogTitle><DialogDescription>Isi data program studi</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Kode</Label><Input name="kode" required defaultValue={selected?.kode} /></div>
            <div className="space-y-2"><Label>Nama</Label><Input name="nama" required defaultValue={selected?.nama} /></div>
            <div className="space-y-2"><Label>Fakultas</Label><Input name="fakultas" required defaultValue={selected?.fakultas} /></div>
            <div className="space-y-2"><Label>Jenjang</Label>
              <select name="jenjang" required defaultValue={selected?.jenjang || ""} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
                <option value="">Pilih Jenjang</option><option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option><option value="D3">D3</option><option value="D4">D4</option>
              </select>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button type="submit" loading={formLoading}>{selected ? "Simpan" : "Tambah"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Hapus Program Studi</DialogTitle><DialogDescription>Anda yakin ingin menghapus <strong>{selected?.nama}</strong>?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button><Button variant="destructive" onClick={handleDelete} loading={formLoading}>Hapus</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
