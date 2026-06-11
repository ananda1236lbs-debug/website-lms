import React from "react";
import { GraduationCap, School, Layers, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAdminStats } from "@/lib/actions/dashboard-stats";
import { formatDate, generateAvatarFallback } from "@/lib/utils";

export const metadata = { title: "Dashboard Admin" };

export default async function AdminDashboard() {
  const { stats, recentStudents } = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan data akademik</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard title="Total Mahasiswa" value={stats.totalMahasiswa} icon={School} color="primary" />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard title="Total Dosen" value={stats.totalDosen} icon={GraduationCap} color="success" />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard title="Total Kelas" value={stats.totalKelas} icon={Layers} color="warning" />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard title="Total Tugas" value={stats.totalAssignments} icon={BookOpen} color="violet" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mahasiswa Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada mahasiswa</p>
            ) : (
              recentStudents.map((student: any) => (
                <div key={student.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="text-xs">
                      {generateAvatarFallback(student.profile?.fullName || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.profile?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(student.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
