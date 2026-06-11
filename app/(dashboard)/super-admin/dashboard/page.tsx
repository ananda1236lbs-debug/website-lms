import React from "react";
import { Users, GraduationCap, School, Layers, Activity, Shield } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSuperAdminStats } from "@/lib/actions/dashboard-stats";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard Super Admin" };

export default async function SuperAdminDashboard() {
  const { stats, recentActivity } = await getSuperAdminStats();

  const actionLabels: Record<string, string> = {
    create: "Membuat",
    update: "Mengubah",
    delete: "Menghapus",
    login: "Login",
    logout: "Logout",
    export: "Mengekspor",
    import: "Mengimpor",
    publish: "Mempublikasi",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan sistem dan aktivitas platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard
            title="Total Pengguna"
            value={stats.totalUsers}
            icon={Users}
            color="primary"
            description="Semua pengguna terdaftar"
          />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard
            title="Total Dosen"
            value={stats.totalDosen}
            icon={GraduationCap}
            color="success"
            description="Dosen aktif"
          />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard
            title="Total Mahasiswa"
            value={stats.totalMahasiswa}
            icon={School}
            color="warning"
            description="Mahasiswa terdaftar"
          />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard
            title="Total Kelas"
            value={stats.totalKelas}
            icon={Layers}
            color="violet"
            description="Kelas aktif"
          />
        </div>
      </div>

      {/* Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada aktivitas
                </p>
              ) : (
                recentActivity.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {log.userId?.profile?.fullName || "Sistem"}
                        </span>{" "}
                        {actionLabels[log.action] || log.action}{" "}
                        <span className="text-muted-foreground">{log.model}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(log.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {log.action}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Kesehatan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Server Status", status: "Aktif", color: "success" as const },
                { label: "Database", status: "Terhubung", color: "success" as const },
                { label: "Pengguna Aktif", status: `${stats.activeUsers}`, color: "info" as const },
                { label: "Storage", status: "Normal", color: "success" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <Badge variant={item.color}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
