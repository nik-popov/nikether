"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { gsap } from "gsap";
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroVisualizer: React.FC = () => {
  const defaultVisual = useMemo(() => PlaceHolderImages.find(img => img.id === 'default-visual'), []);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const q = gsap.utils.selector(heroRef);

  useEffect(() => {
    gsap.fromTo(q(".anim-title"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(q(".anim-subtitle"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 });
  }, [q]);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('music');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="visuals" className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden" ref={heroRef}>
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          src="hero.mp4"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 p-4 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-black font-headline uppercase tracking-tighter text-glow anim-title">
          NIKETHER
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-foreground/80 anim-subtitle">
          An immersive audio-visual experience.
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Button variant="ghost" size="icon" onClick={scrollToNextSection} aria-label="Scroll to next section">
          <ArrowDown className="w-8 h-8 text-white/50 animate-bounce" />
        </Button>
      </div>
    </section>
  );
};

export default HeroVisualizer;
