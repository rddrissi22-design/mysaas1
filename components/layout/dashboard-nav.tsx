"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrganizationSwitcher } from "@/components/ui/organization-switcher";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  orgSlug?: string;
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Billing",
    href: "/dashboard/[slug]/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/dashboard/[slug]/settings",
    icon: Settings,
  },
  {
    name: "Apps",
    href: "/apps",
    icon: Zap,
  },
];

export function DashboardNav({ user, orgSlug }: DashboardNavProps) {
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (orgSlug && href.includes("[slug]")) {
      return href.replace("[slug]", orgSlug);
    }
    return href;
  };

  const isActive = (href: string) => {
    const actualHref = getHref(href);
    if (actualHref === "/dashboard") {
      return pathname === "/dashboard" || pathname === `/dashboard/${orgSlug}`;
    }
    return pathname.startsWith(actualHref);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="font-semibold">{config.productName}</span>
            </Link>

            {orgSlug && <OrganizationSwitcher currentOrgSlug={orgSlug} />}
          </div>

          <nav className="flex items-center gap-4">
            {navigation.map((item) => {
              const href = getHref(item.href);
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                    <AvatarFallback>
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}