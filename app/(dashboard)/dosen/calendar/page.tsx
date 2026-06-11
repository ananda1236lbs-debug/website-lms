"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getDosenCalendarEvents } from "@/lib/actions/dosen";
import { formatDate } from "@/lib/utils";

export default function DosenCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDosenCalendarEvents();
        setEvents(data);
      } catch {
        toast.error("Gagal memuat jadwal kalender");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Jadwal & Tenggat Waktu</h1>
        <p className="text-muted-foreground">Garis waktu (timeline) kegiatan akademik Anda</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Memuat kalender...</div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center border rounded-xl bg-white text-muted-foreground">
          Tidak ada kegiatan akademik atau tenggat waktu tugas yang mendekat.
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 py-4">
          {events.map((ev, index) => {
            const isDeadline = ev.type === "deadline";
            const isPast = new Date(ev.date) < new Date();
            
            return (
              <div key={`${ev.id}-${index}`} className={`relative pl-8 md:pl-10 ${isPast ? 'opacity-60' : ''}`}>
                {/* Timeline Dot */}
                <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-white flex items-center justify-center ${isDeadline ? 'bg-amber-500' : 'bg-blue-500'}`}>
                </div>
                
                {/* Content Card */}
                <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isDeadline ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                      )}
                      <h3 className="font-bold text-base md:text-lg">{ev.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(ev.date)}
                    </div>
                  </div>
                  
                  {ev.description && (
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                  
                  {isDeadline && !isPast && (
                    <div className="mt-3 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                      Tenggat Waktu Pengumpulan Mahasiswa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
