"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.");
    (e.target as HTMLFormElement).reset();
    setIsLoading(false);
  };

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

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-lg text-muted-foreground mb-10">
              Punya pertanyaan atau ingin demo? Kami siap membantu Anda.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "info@lmslearn.ac.id" },
                { icon: Phone, label: "Telepon", value: "+62 21 1234 5678" },
                { icon: MapPin, label: "Alamat", value: "Jl. Pendidikan No. 1, Jakarta Selatan 12345" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary-100 text-primary shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-8">
            <h2 className="text-xl font-semibold mb-6">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" name="name" required placeholder="Nama Anda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="email@contoh.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subjek</Label>
                <Input id="subject" name="subject" required placeholder="Perihal pesan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Pesan</Label>
                <Textarea id="message" name="message" required rows={5} placeholder="Tulis pesan Anda..." />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Mengirim..." : "Kirim Pesan"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
