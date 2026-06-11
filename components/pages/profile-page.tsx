import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { generateAvatarFallback } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import { Role } from "@prisma/client";

export const metadata = { title: "Profil Saya" };

export default async function ProfilePage({ params }: { params?: any }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      programStudi: { select: { nama: true, kode: true } },
    },
  });

  if (!data) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">Informasi akun Anda</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={data.avatar || undefined} />
              <AvatarFallback className="text-xl">
                {generateAvatarFallback(data.fullName || data.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{data.fullName}</h2>
              <p className="text-muted-foreground">{data.email}</p>
              <Badge className="mt-1">{ROLE_LABELS[data.role as Role]}</Badge>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Username", value: data.username },
              { label: "Email", value: data.email },
              { label: "Telepon", value: data.phone || "-" },
              { label: "Status", value: data.isActive ? "Aktif" : "Nonaktif" },
              ...(data.nim ? [{ label: "NIM", value: data.nim }] : []),
              ...(data.nip ? [{ label: "NIP", value: data.nip }] : []),
              ...(data.programStudi ? [{ label: "Program Studi", value: data.programStudi.nama }] : []),
              ...(data.semester ? [{ label: "Semester", value: String(data.semester) }] : []),
              ...(data.angkatan ? [{ label: "Angkatan", value: String(data.angkatan) }] : []),
            ].map(item => (
              <div key={item.label}>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
