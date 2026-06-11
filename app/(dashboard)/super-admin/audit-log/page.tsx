import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime, generateAvatarFallback } from "@/lib/utils";

export const metadata = { title: "Audit Log" };

export default async function AuditLogPage() {
  const data = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { fullName: true, avatar: true, email: true } },
    },
  });

  const actionColors: Record<string, "default" | "success" | "destructive" | "warning"> = {
    create: "success",
    update: "warning",
    delete: "destructive",
    login: "default",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground">Riwayat aktivitas sistem</p>
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Belum ada log</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {data.map((log: any) => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border bg-white">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={log.user?.avatar || undefined} />
                <AvatarFallback className="text-xs">{generateAvatarFallback(log.user?.fullName || "?")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{log.user?.fullName || "System"}</span>
                  {" "}<Badge variant={actionColors[log.action] || "default"} className="text-[10px]">{log.action}</Badge>
                  {" "}<span className="text-muted-foreground">{log.model}</span>
                </p>
                {log.newValues && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {JSON.stringify(log.newValues).slice(0, 100)}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(log.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
