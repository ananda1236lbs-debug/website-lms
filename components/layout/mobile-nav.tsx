"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";
import { Role, type SessionUser } from "@/types";

interface MobileNavProps {
  user: SessionUser;
}

export default function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const navItems = MOBILE_NAV_ITEMS[user.role as Role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden border-t bg-white/95 backdrop-blur-md safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-xl transition-all",
                isActive && "bg-primary-100"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            </div>
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
