import React from "react";
import Link from "next/link";
import { GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary-100 text-primary mx-auto">
          <span className="text-4xl font-bold">404</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-lg">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
        </div>
        <Button asChild>
          <Link href="/"><Home className="mr-2 h-4 w-4" /> Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
