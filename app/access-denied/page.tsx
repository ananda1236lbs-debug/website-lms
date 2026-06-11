import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-red-100 mx-auto">
          <ShieldX className="h-10 w-10 text-danger" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Akses Ditolak</h1>
          <p className="text-muted-foreground text-lg">
            Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login">Masuk Ulang</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
