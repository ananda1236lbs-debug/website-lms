import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data (order matters due to foreign keys)
  console.log("🗑️ Clearing existing data...");
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.gradeComponent.deleteMany();
  await prisma.kelas.deleteMany();
  await prisma.mataKuliah.deleteMany();
  await prisma.user.deleteMany();
  await prisma.programStudi.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.academicCalendar.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create Program Studi
  console.log("📚 Creating Program Studi...");
  const prodis = await prisma.$transaction([
    prisma.programStudi.create({ data: { kode: "TI", nama: "Teknik Informatika", fakultas: "Fakultas Teknik", jenjang: "S1", isActive: true } }),
    prisma.programStudi.create({ data: { kode: "SI", nama: "Sistem Informasi", fakultas: "Fakultas Teknik", jenjang: "S1", isActive: true } }),
    prisma.programStudi.create({ data: { kode: "MI", nama: "Manajemen Informatika", fakultas: "Fakultas Teknik", jenjang: "D3", isActive: true } }),
    prisma.programStudi.create({ data: { kode: "AK", nama: "Akuntansi", fakultas: "Fakultas Ekonomi", jenjang: "S1", isActive: true } }),
    prisma.programStudi.create({ data: { kode: "MN", nama: "Manajemen", fakultas: "Fakultas Ekonomi", jenjang: "S1", isActive: true } }),
  ]);

  console.log("👥 Creating Users...");
  const superadmin = await prisma.user.create({
    data: {
      username: "superadmin",
      email: "superadmin@lmslearn.ac.id",
      password: hashedPassword,
      role: "super_admin",
      fullName: "Super Administrator",
      isActive: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@lmslearn.ac.id",
      password: hashedPassword,
      role: "admin",
      fullName: "Administrator Akademik",
      isActive: true,
    },
  });

  const dosen = await prisma.$transaction([
    prisma.user.create({ data: { username: "dosen1", email: "budi.santoso@lmslearn.ac.id", password: hashedPassword, role: "dosen", fullName: "Dr. Budi Santoso, M.Kom.", nip: "198501012010011001", isActive: true } }),
    prisma.user.create({ data: { username: "dosen2", email: "siti.rahayu@lmslearn.ac.id", password: hashedPassword, role: "dosen", fullName: "Prof. Siti Rahayu, Ph.D.", nip: "197803152005012001", isActive: true } }),
    prisma.user.create({ data: { username: "dosen3", email: "ahmad.wijaya@lmslearn.ac.id", password: hashedPassword, role: "dosen", fullName: "Ahmad Wijaya, M.T.", nip: "199001202015011001", isActive: true } }),
  ]);

  const mahasiswa = await prisma.$transaction([
    prisma.user.create({ data: { username: "mhs1", email: "andi.pratama@student.lmslearn.ac.id", password: hashedPassword, role: "mahasiswa", fullName: "Andi Pratama", nim: "2024001001", programStudiId: prodis[0].id, semester: 3, angkatan: 2024, isActive: true } }),
    prisma.user.create({ data: { username: "mhs2", email: "dina.sari@student.lmslearn.ac.id", password: hashedPassword, role: "mahasiswa", fullName: "Dina Sari", nim: "2024001002", programStudiId: prodis[0].id, semester: 3, angkatan: 2024, isActive: true } }),
    prisma.user.create({ data: { username: "mhs3", email: "rizky.ramadhan@student.lmslearn.ac.id", password: hashedPassword, role: "mahasiswa", fullName: "Rizky Ramadhan", nim: "2024001003", programStudiId: prodis[0].id, semester: 3, angkatan: 2024, isActive: true } }),
    prisma.user.create({ data: { username: "mhs4", email: "putri.ayu@student.lmslearn.ac.id", password: hashedPassword, role: "mahasiswa", fullName: "Putri Ayu Lestari", nim: "2024002001", programStudiId: prodis[1].id, semester: 1, angkatan: 2024, isActive: true } }),
    prisma.user.create({ data: { username: "mhs5", email: "fajar.nugraha@student.lmslearn.ac.id", password: hashedPassword, role: "mahasiswa", fullName: "Fajar Nugraha", nim: "2024002002", programStudiId: prodis[1].id, semester: 1, angkatan: 2024, isActive: true } }),
  ]);

  console.log("📘 Creating Mata Kuliah...");
  const mks = await prisma.$transaction([
    prisma.mataKuliah.create({ data: { kodeMK: "TI201", nama: "Pemrograman Web", sks: 3, semester: 3, programStudiId: prodis[0].id, isActive: true } }),
    prisma.mataKuliah.create({ data: { kodeMK: "TI202", nama: "Basis Data Lanjut", sks: 3, semester: 3, programStudiId: prodis[0].id, isActive: true } }),
    prisma.mataKuliah.create({ data: { kodeMK: "TI301", nama: "Kecerdasan Buatan", sks: 3, semester: 5, programStudiId: prodis[0].id, isActive: true } }),
    prisma.mataKuliah.create({ data: { kodeMK: "SI101", nama: "Pengantar Sistem Informasi", sks: 2, semester: 1, programStudiId: prodis[1].id, isActive: true } }),
  ]);

  console.log("🏫 Creating Kelas...");
  const kelas = await prisma.$transaction([
    prisma.kelas.create({
      data: {
        namaKelas: "TI201-A",
        mataKuliahId: mks[0].id,
        dosenId: dosen[0].id,
        tahunAjaran: "2024/2025",
        semester: "Ganjil",
        kapasitas: 40,
        scheduleDay: "Senin", scheduleStartTime: "08:00", scheduleEndTime: "10:30", scheduleRoom: "Lab Komputer 1",
        students: { connect: [{ id: mahasiswa[0].id }, { id: mahasiswa[1].id }, { id: mahasiswa[2].id }] },
        gradeComponents: {
          create: [{ name: "Tugas", weight: 30 }, { name: "UTS", weight: 30 }, { name: "UAS", weight: 40 }]
        },
        isActive: true,
      }
    }),
  ]);

  console.log("📄 Creating Materials...");
  await prisma.material.createMany({
    data: [
      { kelasId: kelas[0].id, dosenId: dosen[0].id, title: "Pengenalan HTML & CSS", description: "Materi pertemuan 1", meetingNumber: 1, fileUrl: "https://example.com/materi1.pdf", fileName: "materi-1-html-css.pdf", fileSize: 2048000, fileType: "application/pdf", status: "published" },
      { kelasId: kelas[0].id, dosenId: dosen[0].id, title: "JavaScript Fundamentals", description: "Materi pertemuan 2", meetingNumber: 2, fileUrl: "https://example.com/materi2.pdf", fileName: "materi-2-javascript.pdf", fileSize: 3072000, fileType: "application/pdf", status: "published" },
    ]
  });

  console.log("📝 Creating Assignments...");
  await prisma.assignment.create({
    data: {
      kelasId: kelas[0].id,
      title: "Membuat Website Portfolio",
      description: "Buatlah website portfolio pribadi menggunakan HTML, CSS, dan JavaScript.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      allowedFormats: ["zip", "pdf"],
      maxFileSize: 10,
      weight: 15,
      status: "published",
    }
  });

  console.log("⚙️ Creating Settings...");
  await prisma.setting.create({
    data: {
      institutionName: "Universitas LMSLearn",
      activeSemester: "Ganjil",
      tahunAjaran: "2024/2025",
      uploadLimit: 50,
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      gradingScale: {
        A: { min: 85, max: 100 },
        AB: { min: 80, max: 84.99 },
        B: { min: 75, max: 79.99 },
        BC: { min: 70, max: 74.99 },
        C: { min: 65, max: 69.99 },
        D: { min: 50, max: 64.99 },
        E: { min: 0, max: 49.99 }
      }
    }
  });

  console.log("\n🎉 Database seeded successfully!\n");
}

seed()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
