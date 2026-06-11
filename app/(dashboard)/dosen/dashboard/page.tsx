import React from "react";
import { Layers, ClipboardList, FileCheck, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { getDosenStats } from "@/lib/actions/dashboard-stats";
import { formatRelativeTime, generateAvatarFallback } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard Dosen" };

export default async function DosenDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { stats, recentSubmissions } = await getDosenStats(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {session.user.fullName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard title="Kelas Aktif" value={stats.activeClasses} icon={Layers} color="primary" />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard title="Tugas Aktif" value={stats.activeAssignments} icon={ClipboardList} color="warning" />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard title="Menunggu Penilaian" value={stats.pendingSubmissions} icon={FileCheck} color="danger" />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard title="Materi Dipublikasi" value={stats.publishedMaterials} icon={BookOpen} color="success" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengumpulan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada pengumpulan
              </p>
            ) : (
              recentSubmissions.map((sub: any) => (
                <div key={sub.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={sub.studentId?.avatar} />
                    <AvatarFallback className="text-xs">
                      {generateAvatarFallback(sub.studentId?.profile?.fullName || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {sub.studentId?.profile?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {sub.assignmentId?.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {sub.isLate ? (
                      <Badge variant="destructive" className="text-[10px]">Terlambat</Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">Tepat Waktu</Badge>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatRelativeTime(sub.submittedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
