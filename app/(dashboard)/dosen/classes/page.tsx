import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata = { title: "Kelas Saya" };

export default async function DosenClassesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await prisma.kelas.findMany({
    where: { dosenId: session.user.id, isActive: true },
    include: {
      mataKuliah: { select: { nama: true, kodeMK: true, sks: true } },
      students: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelas Saya</h1>
        <p className="text-muted-foreground">Daftar kelas yang Anda ampu</p>
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          Anda belum memiliki kelas yang aktif
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((kelas: any) => (
            <Card key={kelas.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{kelas.namaKelas}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {kelas.mataKuliah?.nama}
                    </p>
                  </div>
                  <Badge variant="outline">{kelas.mataKuliah?.kodeMK}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKS</span>
                    <span className="font-medium">{kelas.mataKuliah?.sks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mahasiswa</span>
                    <span className="font-medium">{kelas.students?.length || 0}/{kelas.kapasitas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jadwal</span>
                    <span className="font-medium">{kelas.scheduleDay} {kelas.scheduleStartTime}-{kelas.scheduleEndTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ruang</span>
                    <span className="font-medium">{kelas.scheduleRoom || "-"}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semester</span>
                    <Badge variant="secondary">{kelas.semester} {kelas.tahunAjaran}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
