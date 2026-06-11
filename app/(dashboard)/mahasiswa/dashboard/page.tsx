import React from "react";
import Link from "next/link";
import { Layers, ClipboardList, BarChart3, Clock, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getMahasiswaStats } from "@/lib/actions/dashboard-stats";
import { getDeadlineStatus, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard Mahasiswa" };

export default async function MahasiswaDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { stats, upcomingAssignments } = await getMahasiswaStats(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {session.user.fullName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard title="Kelas Saya" value={stats.totalClasses} icon={Layers} color="primary" />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard title="Tugas Aktif" value={stats.activeAssignments} icon={ClipboardList} color="warning" />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard title="Rata-rata Nilai" value={stats.averageGrade || "-"} icon={BarChart3} color="success" />
        </div>
      </div>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Tugas Mendatang
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mahasiswa/assignments">
              Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tidak ada tugas mendatang 🎉
              </p>
            ) : (
              upcomingAssignments.map((assignment: any) => {
                const deadlineStatus = getDeadlineStatus(assignment.deadline);
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {assignment.kelasId?.mataKuliahId?.nama} • {assignment.kelasId?.namaKelas}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Badge
                        variant={
                          deadlineStatus.variant === "danger"
                            ? "destructive"
                            : deadlineStatus.variant === "warning"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {deadlineStatus.label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
