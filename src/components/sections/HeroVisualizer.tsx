"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { setMoodWithKeywords } from '@/ai/flows/set-mood-with-keywords';
import { generateAnimatedVisuals } from '@/ai/flows/generate-animated-visuals';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Loader, Palette, Rabbit, Snail, Waves, Wand2, Bot } from 'lucide-react';
import { gsap } from "gsap";

const HeroVisualizer: React.FC = () => {
  const { toast } = useToast();
  const { currentTrack } = useAppContext();
  
  const defaultVisual = useMemo(() => PlaceHolderImages.find(img => img.id === 'default-visual'), []);
  
  const [visualUrl, setVisualUrl] = useState(defaultVisual?.imageUrl || '');
  const [visualHint, setVisualHint] = useState(defaultVisual?.imageHint || '');
  
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('energetic');
  const [colorScheme, setColorScheme] = useState('vibrant');
  const [patternStyle, setPatternStyle] = useState('geometric');
  const [animationSpeed, setAnimationSpeed] = useState('medium');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMoodSetting, setIsMoodSetting] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const q = gsap.utils.selector(heroRef);

  useEffect(() => {
    gsap.fromTo(q(".anim-title"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(q(".anim-subtitle"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 });
    gsap.fromTo(q(".anim-card"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 });
    gsap.fromTo(q(".anim-controls"), { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
  }, [q]);

  const handleMoodSet = async () => {
    if (!keywords) return;
    setIsMoodSetting(true);
    try {
      const result = await setMoodWithKeywords({ keywords });
      setMood(result.mood);
      toast({
        title: "Mood Set!",
        description: `Graphic design mood is now "${result.mood}".`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not set mood.",
      });
    } finally {
      setIsMoodSetting(false);
    }
  };

  const handleGenerateVisuals = async () => {
    setIsGenerating(true);
    try {
      const comprehensiveMood = `${mood}, ${colorScheme} colors, ${patternStyle} patterns, ${animationSpeed} speed`;
      const result = await generateAnimatedVisuals({
        genre: currentTrack?.genre || 'Electronic',
        moodKeywords: comprehensiveMood,
      });
      setVisualUrl(result.visualDataUri);
      setVisualHint(`${mood} ${patternStyle}`);
      toast({
        title: "Visuals Updated!",
        description: "The canvas has been repainted.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate visuals.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  useEffect(() => {
    handleGenerateVisuals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, currentTrack]);


  return (
    <section id="visuals" className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden" ref={heroRef}>
      <div className="absolute inset-0 z-0">
        <Image
          key={visualUrl}
          src={visualUrl}
          alt="Animated Visualizer Background"
          fill
          priority
          className="object-cover animate-visualizer-pan"
          data-ai-hint={visualHint}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 p-4 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-black font-headline uppercase tracking-tighter text-glow anim-title">
          Nikether Title Music
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-foreground/80 anim-subtitle">
          An immersive audio-visual experience powered by generative AI.
        </p>

        <Card className="mt-8 bg-background/50 backdrop-blur-md border-white/10 w-full max-w-lg anim-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Mood Setter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 'cosmic journey, peaceful ocean'"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMoodSet()}
                className="bg-secondary/50"
              />
              <Button onClick={handleMoodSet} disabled={isMoodSetting}>
                {isMoodSetting ? <Loader className="animate-spin" /> : <Wand2 />}
                <span className="ml-2 hidden md:inline">Set Mood</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="absolute z-20 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-4 bg-background/50 backdrop-blur-md border-white/10 w-[calc(100%-2rem)] md:w-80 anim-controls">
          <CardHeader>
              <CardTitle className="text-lg">Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Palette/> Color Scheme</Label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="vibrant">Vibrant</SelectItem>
                          <SelectItem value="pastel">Pastel</SelectItem>
                          <SelectItem value="monochrome">Monochrome</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Waves/> Pattern Style</Label>
                  <Select value={patternStyle} onValueChange={setPatternStyle}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="geometric">Geometric</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="organic">Organic</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Snail className="inline"/><span className="flex-1">Animation Speed</span><Rabbit className="inline"/></Label>
                   <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Button onClick={handleGenerateVisuals} disabled={isGenerating} className="w-full accent-glow">
                  {isGenerating ? <Loader className="animate-spin" /> : "Update Canvas"}
              </Button>
          </CardContent>
      </Card>
    </section>
  );
};

export default HeroVisualizer;
