"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ChevronLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ROLE_LABELS } from "@/lib/constants";
import { Role, type SessionUser } from "@/types";
import { useUIStore } from "@/stores/ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateAvatarFallback } from "@/lib/utils";

interface SidebarProps {
  user: SessionUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const navItems = NAV_ITEMS[user.role as Role] || [];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300 ease-in-out hidden lg:flex flex-col",
          sidebarCollapsed ? "w-[72px]" : "w-[280px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          sidebarCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-white shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">LMSLearn</span>
              <span className="text-[10px] text-muted-foreground font-medium">University Platform</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== `/${user.role === Role.super_admin ? "super-admin" : user.role}/dashboard`);
              const Icon = item.icon;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-active text-sidebar-active-foreground"
                      : "text-sidebar-foreground hover:bg-accent hover:text-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3">
          {/* User Info */}
          <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 mb-2",
            sidebarCollapsed && "justify-center px-0"
          )}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-xs">
                {generateAvatarFallback(user.fullName)}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{user.fullName}</span>
                <span className="text-[11px] text-muted-foreground">
                  {ROLE_LABELS[user.role as Role]}
                </span>
              </div>
            )}
          </div>

          <Separator className="mb-2" />

          {/* Collapse Toggle & Logout */}
          <div className={cn("flex gap-1", sidebarCollapsed ? "flex-col items-center" : "")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleSidebarCollapse}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? "Perluas sidebar" : "Kecilkan sidebar"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={sidebarCollapsed ? "icon-sm" : "sm"}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className={cn(
                    "text-muted-foreground hover:text-danger hover:bg-red-50",
                    !sidebarCollapsed && "ml-auto"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!sidebarCollapsed && <span className="ml-2">Keluar</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">Keluar</TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
