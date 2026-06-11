import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, ClipboardList, BarChart3, Users, Shield, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">LMSLearn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kontak
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Platform Pembelajaran Modern
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Transformasi Pendidikan{" "}
              <span className="text-primary">Universitas</span> Anda
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Platform LMS modern yang dirancang khusus untuk universitas. Kelola kelas, materi, tugas, dan penilaian dengan antarmuka yang intuitif dan powerful.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="xl" asChild>
                <Link href="/login">
                  Masuk
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/about">Pelajari Selengkapnya</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "10K+", label: "Mahasiswa Aktif" },
              { value: "500+", label: "Dosen" },
              { value: "1,200+", label: "Mata Kuliah" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Semua yang Anda Butuhkan
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fitur lengkap untuk mengelola seluruh aktivitas akademik universitas Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Manajemen Materi",
                description: "Upload dan kelola materi kuliah dengan berbagai format. PDF, DOCX, PPTX, dan video.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: ClipboardList,
                title: "Tugas & Pengumpulan",
                description: "Buat tugas dengan deadline, format file, dan bobot nilai. Mahasiswa submit secara online.",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: BarChart3,
                title: "Sistem Penilaian",
                description: "Komponen nilai fleksibel, kalkulasi otomatis, dan konversi huruf mutu sesuai standar.",
                color: "bg-violet-100 text-violet-600",
              },
              {
                icon: Users,
                title: "Multi Role",
                description: "Super Admin, Admin, Dosen, dan Mahasiswa dengan hak akses yang terstruktur.",
                color: "bg-amber-100 text-amber-600",
              },
              {
                icon: Shield,
                title: "Keamanan Terjamin",
                description: "Enkripsi password, JWT authentication, RBAC, dan audit log untuk setiap aktivitas.",
                color: "bg-rose-100 text-rose-600",
              },
              {
                icon: GraduationCap,
                title: "Kalender Akademik",
                description: "Jadwal perkuliahan, deadline tugas, dan event akademik terintegrasi dalam satu kalender.",
                color: "bg-cyan-100 text-cyan-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-white p-8 transition-all duration-300 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.color} mb-5`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-16 sm:px-16 sm:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Siap Memulai Transformasi Digital?
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Bergabung dengan ratusan universitas yang telah menggunakan LMSLearn untuk meningkatkan kualitas pembelajaran.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-gray-50" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/contact">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-semibold">LMSLearn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LMSLearn. Platform Pembelajaran Universitas Modern.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
