"use client";

import React, { useEffect, useState } from "react";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getAdminSchedules } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminSchedules();
        setSchedules(data);
      } catch {
        toast.error("Gagal memuat jadwal perkuliahan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group schedules by day
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const grouped = days.map(day => ({
    day,
    classes: schedules.filter(s => s.scheduleDay === day)
  })).filter(g => g.classes.length > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-64 mb-2" /><Skeleton className="h-4 w-48" /></div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jadwal Perkuliahan</h1>
        <p className="text-muted-foreground">Monitoring jadwal seluruh kelas aktif</p>
      </div>

      {grouped.length === 0 ? (
        <div className="p-16 text-center border rounded-xl bg-white text-muted-foreground">
          Belum ada jadwal kelas yang ditetapkan
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {grouped.map(group => (
            <div key={group.day} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b px-4 py-3 font-bold text-lg text-slate-800">
                {group.day}
              </div>
              <div className="p-4 space-y-4 flex-1">
                {group.classes.map((c: any) => (
                  <div key={c.id} className="border rounded-lg p-3 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-sm">{c.namaKelas}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.mataKuliah?.nama}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">{c.mataKuliah?.kodeMK}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-3">
                      <div className="flex items-center gap-1.5 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{c.scheduleStartTime} - {c.scheduleEndTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{c.scheduleRoom || "-"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{c.dosen?.fullName || "Belum ada dosen"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
