import React from "react";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Role } from "@/types";
import { ROLE_BASE_PATH } from "@/lib/constants";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  role: Role;
}

export function PlaceholderPage({ 
  title, 
  description = "Fitur ini sedang dalam tahap pengembangan dan akan segera hadir pada pembaruan berikutnya.",
  role 
}: PlaceholderPageProps) {
  const basePath = ROLE_BASE_PATH[role] || "/dashboard";
  const dashboardPath = `${basePath}/dashboard`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Construction className="h-12 w-12" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        {description}
      </p>
      
      <Button asChild size="lg" className="rounded-full shadow-md">
        <Link href={dashboardPath}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  );
}
