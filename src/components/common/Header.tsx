"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
    <span className="text-xl font-headline font-bold text-glow">Nikether Title Music</span>
  </div>
);

const navItems = [
  { name: "Home", id: "visuals" },
  { name: "Music", id: "music" },
  { name: "Performances", id: "tour" },
  { name: "Booking", id: "booking" },
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
