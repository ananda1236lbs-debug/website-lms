"use server";

import { prisma } from "@/lib/db";
import { Role, AssignmentStatus, MaterialStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const getSuperAdminStats = unstable_cache(
  async () => {
    const [
      totalUsers,
      totalDosen,
      totalMahasiswa,
      totalKelas,
      activeUsers,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.dosen } }),
      prisma.user.count({ where: { role: Role.mahasiswa } }),
      prisma.kelas.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: {
            select: { fullName: true, avatar: true },
          },
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalDosen,
        totalMahasiswa,
        totalKelas,
        activeUsers,
      },
      recentActivity: recentAuditLogs,
    };
  },
  ["super-admin-stats"],
  { revalidate: 60 }
);

export const getAdminStats = unstable_cache(
  async () => {
    const [
      totalMahasiswa,
      totalDosen,
      totalKelas,
      totalAssignments,
      recentStudents,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.mahasiswa } }),
      prisma.user.count({ where: { role: Role.dosen } }),
      prisma.kelas.count({ where: { isActive: true } }),
      prisma.assignment.count(),
      prisma.user.findMany({
        where: { role: Role.mahasiswa },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, fullName: true, email: true, avatar: true, createdAt: true },
      }),
    ]);

    return {
      stats: { totalMahasiswa, totalDosen, totalKelas, totalAssignments },
      recentStudents,
    };
  },
  ["admin-stats"],
  { revalidate: 60 }
);

export const getDosenStats = unstable_cache(
  async (dosenId: string) => {
    const classes = await prisma.kelas.findMany({
      where: { dosenId, isActive: true },
      select: { id: true },
    });
    const classIds = classes.map((c) => c.id);

    const [
      activeClasses,
      activeAssignments,
      pendingSubmissions,
      publishedMaterials,
      recentSubmissions,
    ] = await Promise.all([
      classes.length,
      prisma.assignment.count({
        where: { kelasId: { in: classIds }, status: AssignmentStatus.published },
      }),
      prisma.submission.count({
        where: {
          assignment: { kelasId: { in: classIds } },
          gradeScore: null,
        },
      }),
      prisma.material.count({
        where: { dosenId, status: MaterialStatus.published },
      }),
      prisma.submission.findMany({
        where: { assignment: { kelasId: { in: classIds } } },
        orderBy: { submittedAt: "desc" },
        take: 5,
        include: {
          student: { select: { fullName: true, avatar: true } },
          assignment: { select: { title: true } },
        },
      }),
    ]);

    return {
      stats: { activeClasses, activeAssignments, pendingSubmissions, publishedMaterials },
      recentSubmissions,
    };
  },
  ["dosen-stats"],
  { revalidate: 60 }
);

export const getMahasiswaStats = unstable_cache(
  async (studentId: string) => {
    const enrolledClasses = await prisma.kelas.findMany({
      where: { students: { some: { id: studentId } }, isActive: true },
      select: { id: true },
    });
    const classIds = enrolledClasses.map((c) => c.id);

    const [
      totalClasses,
      activeAssignments,
      submissions,
      upcomingAssignments,
    ] = await Promise.all([
      enrolledClasses.length,
      prisma.assignment.count({
        where: {
          kelasId: { in: classIds },
          status: AssignmentStatus.published,
          deadline: { gte: new Date() },
        },
      }),
      prisma.submission.findMany({
        where: { studentId },
        include: {
          assignment: { select: { title: true, kelasId: true } },
        },
      }),
      prisma.assignment.findMany({
        where: {
          kelasId: { in: classIds },
          status: AssignmentStatus.published,
          deadline: { gte: new Date() },
        },
        orderBy: { deadline: "asc" },
        take: 5,
        include: {
          kelas: {
            select: {
              namaKelas: true,
              mataKuliah: { select: { nama: true } },
            },
          },
        },
      }),
    ]);

    // Calculate average grade
    const gradedSubmissions = submissions.filter(
      (s) => s.gradeScore !== null && !s.gradeIsDraft
    );
    const averageGrade =
      gradedSubmissions.length > 0
        ? Math.round(
            gradedSubmissions.reduce((sum, s) => sum + (s.gradeScore || 0), 0) /
              gradedSubmissions.length
          )
        : 0;

    return {
      stats: { totalClasses, activeAssignments, averageGrade },
      upcomingAssignments,
    };
  },
  ["mahasiswa-stats"],
  { revalidate: 60 }
);
