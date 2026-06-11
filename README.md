# 🎓 LMSLearn

**LMSLearn** adalah sistem manajemen pembelajaran (Learning Management System) modern yang dirancang khusus untuk ekosistem universitas. Dibangun menggunakan teknologi *web* mutakhir, aplikasi ini menawarkan antarmuka yang cepat, intuitif, dan responsif untuk mengelola seluruh kegiatan akademik—mulai dari manajemen kelas, distribusi materi, pengumpulan tugas, hingga penilaian mahasiswa.

---

## ✨ Fitur Utama

Aplikasi ini menggunakan sistem **Role-Based Access Control (RBAC)** yang kuat dengan 4 peran (role) pengguna:

### 1. 👑 Super Admin
- Mengontrol penuh sistem dan hierarki akses.
- Manajemen pengguna tingkat tinggi (menambah/menghapus Admin, Dosen, dan Mahasiswa).
- Pemantauan aktivitas sistem melalui **Audit Log** secara *real-time*.
- Manajemen infrastruktur akademik dasar (Program Studi, Mata Kuliah).

### 2. 🛡️ Admin Akademik
- Fokus pada operasional akademik sehari-hari.
- Manajemen kelas, penugasan Dosen ke kelas tertentu, dan pendaftaran Mahasiswa.
- Melihat laporan statistik (*Dashboard Stats*) dari seluruh fakultas.
- Mengatur Kalender Akademik (Libur, Ujian, dll).

### 3. 👨‍🏫 Dosen
- Manajemen materi perkuliahan dengan fitur unggah *file*.
- Pembuatan tugas (beserta tenggat waktu dan bobot nilai).
- Mengoreksi dan memberikan nilai (*grading*) langsung pada hasil pekerjaan mahasiswa.
- Memantau pengumpulan tugas secara terorganisasi di dalam kelas yang diampunya.

### 4. 👨‍🎓 Mahasiswa
- Dasbor terpadu untuk melihat tugas mana yang belum dikerjakan (berdasarkan *deadline*).
- Mengunduh materi perkuliahan dari dosen.
- Mengunggah (*submit*) *file* jawaban tugas dengan lancar.
- Memantau rekapitulasi nilai akhir dan KHS (Kartu Hasil Studi).

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Aplikasi ini beroperasi menggunakan teknologi berbasis *Server-Side Rendering* (SSR) dengan *stack* modern:

- **Kerangka Kerja (Framework):** [Next.js 14/15 (App Router)](https://nextjs.org/)
- **Bahasa Pemrograman:** TypeScript
- **Basis Data:** PostgreSQL (didukung oleh [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autentikasi:** [Auth.js / NextAuth v5](https://authjs.dev/)
- **Desain & UI:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Validasi Formulir:** React Hook Form + Zod
- **Ikonografi:** Lucide React

---

## 🚀 Panduan Instalasi (Lokal)

Jika Anda ingin menjalankan atau mengembangkan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

### 1. Persiapan Basis Data (Supabase)
Karena sistem ini berbasis relasional, buat proyek baru di [Supabase](https://supabase.com) dan dapatkan 2 URL koneksi Anda (Transaction dan Session/Direct).

### 2. Unduh Repositori
```bash
git clone https://github.com/USERNAME/lmslearn.git
cd lmslearn
```

### 3. Instal Dependensi
Pastikan Anda telah memasang [Node.js](https://nodejs.org/).
```bash
npm install
```

### 4. Konfigurasi Lingkungan (Environment)
Buat file baru bernama `.env` di direktori utama (sejajar dengan `package.json`), dan isi dengan rahasia *database* Anda:

```env
# URL Transaction Supabase (Gunakan port 6543, tambahkan pgbouncer)
DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-xyz.pooler.supabase.com:6543/postgres?pgbouncer=true"

# URL Direct Supabase (Gunakan port 5432)
DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-xyz.pooler.supabase.com:5432/postgres"

# Konfigurasi NextAuth (Harus diisi di mode Production)
NEXTAUTH_SECRET="kunci-rahasia-super-aman-untuk-autentikasi"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Sinkronisasi Skema Prisma & *Seeding*
Dorong struktur tabel ke *database* dan isi data *dummy* awal agar bisa langsung digunakan untuk *login*:
```bash
npx prisma db push
npm run seed  # (atau npx tsx scripts/seed.ts)
```

### 6. Jalankan Server Pengembangan
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di *browser* Anda. 

> **Akun Default untuk Uji Coba:**
> - Super Admin: `superadmin` | Sandi: `password123`
> - Admin: `admin` | Sandi: `password123`
> - Dosen: `dosen1` | Sandi: `password123`
> - Mahasiswa: `mhs1` | Sandi: `password123`

---

## ☁️ Panduan Deploy (Vercel)

Proyek ini sangat kompatibel untuk di-deploy ke layanan nir-peladen (*serverless*) Vercel:

1. Unggah kode proyek Anda ini ke repositori GitHub.
2. Di *Dashboard* Vercel, pilih **Add New Project** dan sambungkan dengan repositori GitHub Anda.
3. Di bagian **Environment Variables** sebelum klik Deploy, pastikan Anda memasukkan `DATABASE_URL`, `DIRECT_URL`, dan `NEXTAUTH_SECRET`.
4. Klik **Deploy**!
*(File `package.json` sudah memiliki perintah `postinstall: prisma generate` yang diperlukan oleh Vercel).*

---

*LMSLearn dirancang dengan fokus pada kecepatan (Turbopack), kejelasan kode, dan keamanan tinggi bagi institusi pendidikan masa kini.* 🎓
