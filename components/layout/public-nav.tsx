"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

export function PublicNav() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="font-semibold">{config.productName}</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}