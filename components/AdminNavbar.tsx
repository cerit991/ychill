"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays, UtensilsCrossed } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4 h-14">
          <Link href="/admin">
            <Button
              variant={pathname === "/admin" ? "default" : "ghost"}
              className="flex items-center"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Rezervasyonlar
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button
              variant={pathname === "/admin/menu" ? "default" : "ghost"}
              className="flex items-center"
            >
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Menü Yönetimi
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}