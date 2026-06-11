"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Settings, Save, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getSettings, updateSettings } from "@/lib/actions/settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        toast.error("Gagal memuat pengaturan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const fd = new FormData(e.currentTarget);
    const data = {
      institutionName: fd.get("institutionName") as string,
      activeSemester: fd.get("activeSemester") as string,
      tahunAjaran: fd.get("tahunAjaran") as string,
      primaryColor: fd.get("primaryColor") as string,
      uploadLimit: Number(fd.get("uploadLimit")),
    };

    try {
      const result = await updateSettings(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pengaturan berhasil disimpan");
        setSettings({ ...settings, ...data });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">Konfigurasi dasar aplikasi LMS</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            Informasi Institusi
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Nama Institusi / Universitas</Label>
              <Input 
                id="institutionName" 
                name="institutionName" 
                defaultValue={settings?.institutionName} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadLimit">Batas Upload File (MB)</Label>
              <Input 
                id="uploadLimit" 
                name="uploadLimit" 
                type="number" 
                defaultValue={settings?.uploadLimit} 
                required 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold">Tahun Akademik Berjalan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
              <Input 
                id="tahunAjaran" 
                name="tahunAjaran" 
                defaultValue={settings?.tahunAjaran} 
                placeholder="Contoh: 2024/2025"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeSemester">Semester Aktif</Label>
              <select 
                id="activeSemester" 
                name="activeSemester" 
                defaultValue={settings?.activeSemester}
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
                required
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
                <option value="Pendek">Pendek</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold">Personalisasi Tema</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Warna Utama Sistem (Hex)</Label>
              <div className="flex gap-3">
                <Input 
                  id="primaryColor" 
                  name="primaryColor" 
                  defaultValue={settings?.primaryColor} 
                  required 
                />
                <div 
                  className="w-10 h-10 rounded-lg border flex-shrink-0" 
                  style={{ backgroundColor: settings?.primaryColor || "#0f172a" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <Button type="submit" size="lg" loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
