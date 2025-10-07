"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Logo = () => (
  <div className="flex items-center gap-2">
    <span className="text-2xl font-headline font-bold text-glow tracking-tighter">NIKETHER</span>
  </div>
);

const navItems = [
  { name: "Home", type: "scroll" as const, target: "visuals" },
  { name: "Music", type: "scroll" as const, target: "music" },
  { name: "Playlists", type: "scroll" as const, target: "playlists" },
  { name: "Performances", type: "scroll" as const, target: "tour" },
  { name: "About", type: "scroll" as const, target: "about" },
  { name: "Contact", type: "scroll" as const, target: "booking" },
  { name: "Radio", type: "route" as const, href: "/stream" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHome = pathname === "/" || pathname === "/#";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {isHome ? (
            <button onClick={() => scrollTo("visuals")} aria-label="Scroll to top">
              <Logo />
            </button>
          ) : (
            <Link href="/" aria-label="Back to home" className="flex items-center">
              <Logo />
            </Link>
          )}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              if (item.type === "route" && item.href) {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant="ghost"
                    className={cn(
                      "font-headline text-sm uppercase tracking-wider",
                      isActive && "text-glow"
                    )}
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                );
              }

              if (item.type === "scroll") {
                const target = item.target;

                if (isHome && target) {
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      onClick={() => scrollTo(target)}
                      className="font-headline text-sm uppercase tracking-wider"
                    >
                      {item.name}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={item.name}
                    asChild
                    variant="ghost"
                    className="font-headline text-sm uppercase tracking-wider"
                  >
                    <Link href={target ? `/#${target}` : "/"}>{item.name}</Link>
                  </Button>
                );
              }

              return null;
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
