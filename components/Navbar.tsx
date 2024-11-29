"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8" />
              <span className="font-bold text-xl">You Chill Lounge</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/menu" className="hover:text-primary transition-colors">
                Menü
              </Link>
              <Link href="/reservation" className="hover:text-primary transition-colors">
                Rezervasyon
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                İletişim
              </Link>
              <ModeToggle />
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/menu"
              className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Menü
            </Link>
            <Link
              href="/reservation"
              className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Rezervasyon
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              İletişim
            </Link>
            <div className="px-3 py-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}