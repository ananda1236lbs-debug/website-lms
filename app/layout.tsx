import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "LMSLearn — University Learning Platform",
    template: "%s | LMSLearn",
  },
  description:
    "Platform pembelajaran universitas modern dengan fitur lengkap untuk dosen dan mahasiswa. Kelola kelas, materi, tugas, dan nilai dengan mudah.",
  keywords: ["LMS", "Learning Management System", "University", "E-Learning", "Education"],
  authors: [{ name: "LMSLearn" }],
  openGraph: {
    title: "LMSLearn — University Learning Platform",
    description: "Platform pembelajaran universitas modern",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
