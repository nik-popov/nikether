"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Logo = () => (
  <div className="flex items-center gap-2">
    <span className="text-2xl font-headline font-bold text-glow tracking-tighter">NIKETHER</span>
  </div>
);

const navItems = [
  { name: "Home", id: "visuals" },
  { name: "About", id: "about" },
  { name: "Music", id: "music" },
  { name: "Performances", id: "tour" },
  { name: "Contact", id: "booking" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => scrollTo('visuals')} aria-label="Scroll to top">
            <Logo />
          </button>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => scrollTo(item.id)}
                className="font-headline text-sm uppercase tracking-wider"
              >
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
