import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata = { title: "Kelas Saya" };

export default async function MahasiswaClassesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await prisma.kelas.findMany({
    where: { students: { some: { id: session.user.id } }, isActive: true },
    include: {
      mataKuliah: { select: { nama: true, kodeMK: true, sks: true } },
      dosen: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelas Saya</h1>
        <p className="text-muted-foreground">Kelas yang Anda ikuti semester ini</p>
      </div>

      {data.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          Anda belum terdaftar di kelas manapun
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((kelas: any) => (
            <Card key={kelas.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{kelas.mataKuliah?.nama}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{kelas.namaKelas}</p>
                  </div>
                  <Badge variant="outline">{kelas.mataKuliah?.kodeMK}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dosen</span>
                    <span className="font-medium">{kelas.dosen?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKS</span>
                    <span className="font-medium">{kelas.mataKuliah?.sks}</span>
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
                  <Badge variant="secondary">{kelas.semester} {kelas.tahunAjaran}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
