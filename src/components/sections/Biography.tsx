"use client";

import React from "react";
import Section from "@/components/common/Section";
import { biography, artistName } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

const Biography: React.FC = () => {
  const bioImage = PlaceHolderImages.find(img => img.id === 'artist-bio');

  return (
    <Section id="about" title={`ABOUT ${artistName.toUpperCase()}`}>
        <div className="flex flex-col items-center gap-8 md:gap-12 max-w-3xl mx-auto">
            <div className="w-full max-w-sm">
                <Card className="group overflow-hidden border-white/10 bg-card backdrop-blur-sm shadow-lg box-glow">
                    <CardContent className="p-0">
                    {bioImage && (
                        <Image 
                            src={bioImage.imageUrl}
                            alt={`A photo of ${artistName}`}
                            width={800}
                            height={800}
                            className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={bioImage.imageHint}
                        />
                    )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <p className="text-lg text-foreground/80 leading-relaxed text-center md:text-justify">
                    {biography}
                </p>
            </div>
        </div>
    </Section>
  );
};

export default Biography;
