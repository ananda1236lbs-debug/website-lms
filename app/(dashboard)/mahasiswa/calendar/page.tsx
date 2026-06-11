import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { Role } from "@/types";

export default function CalendarPage() {
  return (
    <PlaceholderPage 
      title="Kalender Akademik" 
      description="Jadwal kelas, batas waktu pengumpulan tugas, dan hari libur akan otomatis muncul di kalender interaktif Anda."
      role={Role.mahasiswa}
    />
  );
}
