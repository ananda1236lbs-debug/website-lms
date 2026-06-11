"use client";

import React, { useEffect, useState } from "react";
import { Download, Users, GraduationCap, Building, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getReportStats, generateUsersCSV } from "@/lib/actions/reports";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getReportStats();
        setStats(data);
      } catch (err) {
        toast.error("Gagal memuat data laporan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const csvData = await generateUsersCSV();
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_pengguna_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh");
    } catch (err) {
      toast.error("Gagal mengunduh laporan");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan Akademik</h1>
          <p className="text-muted-foreground">Ringkasan data akademik dan sistem</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <School className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Mahasiswa</p>
            <h3 className="text-2xl font-bold">{stats?.totalMahasiswa || 0}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Dosen</p>
            <h3 className="text-2xl font-bold">{stats?.totalDosen || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Kelas Aktif</p>
            <h3 className="text-2xl font-bold">{stats?.totalKelas || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Admin / Staf</p>
            <h3 className="text-2xl font-bold">{stats?.totalAdmin || 0}</h3>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Ekspor Data Universitas</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
          Unduh daftar seluruh mahasiswa dan dosen dalam format CSV untuk dilaporkan ke kementerian atau keperluan arsip internal.
        </p>
        <Button onClick={handleDownloadCSV} loading={downloading}>
          <Download className="h-4 w-4 mr-2" />
          Unduh Direktori Pengguna (CSV)
        </Button>
      </div>
    </div>
  );
}
