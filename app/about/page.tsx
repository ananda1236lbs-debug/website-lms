import Link from "next/link";
import { GraduationCap, Target, Eye, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Tentang Kami" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">LMSLearn</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Link>
        </Button>

        <h1 className="text-4xl font-bold mb-6">Tentang LMSLearn</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          LMSLearn adalah platform Learning Management System modern yang dirancang khusus untuk memenuhi kebutuhan universitas dan institusi pendidikan tinggi di Indonesia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Target, title: "Misi Kami", description: "Menyediakan platform pembelajaran digital yang intuitif, efisien, dan mendukung proses pendidikan berkualitas tinggi." },
            { icon: Eye, title: "Visi Kami", description: "Menjadi platform LMS terdepan yang mendorong transformasi digital pendidikan tinggi di Asia Tenggara." },
            { icon: Users, title: "Tim Kami", description: "Didukung oleh tim engineer dan desainer berpengalaman yang berdedikasi untuk inovasi pendidikan." },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border p-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 text-primary mb-5">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-primary-50 p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-4">Kenapa LMSLearn?</h2>
          <ul className="space-y-3">
            {[
              "Antarmuka modern dan mudah digunakan",
              "Mendukung semua perangkat (Desktop, Tablet, Mobile)",
              "Sistem penilaian otomatis dengan komponen yang fleksibel",
              "Keamanan tingkat enterprise dengan enkripsi dan audit log",
              "Manajemen kelas, materi, dan tugas yang terintegrasi",
              "Notifikasi real-time untuk setiap aktivitas penting",
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
