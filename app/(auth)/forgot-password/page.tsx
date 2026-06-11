"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/user";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const result = await forgotPasswordAction(data.email);
      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[420px] space-y-8">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">LMSLearn</span>
        </Link>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 mx-auto">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Periksa Email Anda</h1>
              <p className="text-muted-foreground">
                Jika email terdaftar, instruksi reset password telah dikirim. Periksa inbox dan folder spam Anda.
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Lupa Password</h1>
              <p className="text-muted-foreground">
                Masukkan email yang terdaftar untuk menerima instruksi reset password
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@universitas.ac.id"
                  {...register("email")}
                  className={errors.email ? "border-danger" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-danger">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Instruksi
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
