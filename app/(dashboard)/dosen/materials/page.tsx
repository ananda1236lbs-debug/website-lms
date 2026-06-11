import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatFileSize } from "@/lib/utils";
import { MaterialsActions } from "@/components/dosen/materials-actions";

export const metadata = { title: "Materi" };

export default async function DosenMaterialsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const classes = await prisma.kelas.findMany({
    where: { dosenId: session.user.id, isActive: true },
    select: { id: true, namaKelas: true, mataKuliah: { select: { nama: true } } },
  });

  const data = await prisma.material.findMany({
    where: { dosenId: session.user.id },
    include: {
      kelas: {
        select: {
          namaKelas: true,
          mataKuliah: { select: { nama: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Materi Perkuliahan</h1>
          <p className="text-muted-foreground">Kelola materi untuk kelas Anda</p>
        </div>
        <MaterialsActions classes={classes} />
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Belum ada materi</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {data.map((material: any) => (
            <div key={material.id} className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{material.title}</p>
                  <Badge variant={material.status === "published" ? "success" : "secondary"} className="text-[10px]">
                    {material.status === "published" ? "Dipublikasi" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pertemuan {material.meetingNumber} • {material.kelas?.namaKelas} • {material.kelas?.mataKuliah?.nama}
                </p>
                <p className="text-xs text-muted-foreground">
                  {material.fileName} • {formatFileSize(material.fileSize || 0)} • {formatDate(material.createdAt)}
                </p>
              </div>
              {material.fileUrl && (
                <Button variant="ghost" size="icon-sm" asChild>
                  <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
