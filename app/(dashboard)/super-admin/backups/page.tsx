"use client";

import React, { useState } from "react";
import { Database, DownloadCloud, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateFullBackup } from "@/lib/actions/backups";

export default function BackupsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBackup = async () => {
    setDownloading(true);
    toast.info("Mengkompilasi data database, mohon tunggu...");
    
    try {
      const backupJson = await generateFullBackup();
      
      // Create a blob from the JSON string
      const blob = new Blob([backupJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `lms_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Backup berhasil diunduh");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunduh backup");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Manajemen Backup Data</h1>
          <p className="text-muted-foreground">Lindungi data akademik Anda dengan mencadangkan secara berkala</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Perhatian Keamanan Data</p>
          <p>File backup yang dihasilkan memuat seluruh data rahasia universitas termasuk data pengguna, nilai, dan konfigurasi. <strong>Simpan file JSON ini di tempat yang aman dan jangan membagikannya kepada pihak yang tidak berkepentingan.</strong></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center border-4 border-slate-100">
            <DownloadCloud className="h-8 w-8 text-slate-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Logical Backup (JSON)</h3>
            <p className="text-sm text-muted-foreground mt-2 px-4">
              Mengunduh seluruh isi tabel (Pengguna, Kelas, Mata Kuliah, Program Studi) menjadi satu file terstruktur. Proses ini memakan waktu beberapa detik tergantung ukuran data.
            </p>
          </div>
          <div className="pt-4 mt-auto">
            <Button onClick={handleDownloadBackup} loading={downloading} className="w-full">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Mulai Unduh Backup
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Pemulihan (Restore)</h3>
            <p className="text-sm text-muted-foreground mt-2 px-4">
              Untuk mencegah kerusakan relasi data (Foreign Key constraints), pemulihan data dari file JSON saat ini harus dilakukan secara manual oleh teknisi / *Database Administrator* (DBA) universitas Anda.
            </p>
          </div>
          <div className="pt-4 mt-auto w-full">
            <Button variant="outline" className="w-full" disabled>
              Hubungi Administrator IT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
