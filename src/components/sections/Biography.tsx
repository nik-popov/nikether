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
    <Section id="about" title={`About ${artistName}`}>
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
            <div className="md:col-span-2">
                <Card className="group overflow-hidden border-white/10 bg-card backdrop-blur-sm shadow-lg">
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
            <div className="md:col-span-3">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {biography}
                </p>
            </div>
        </div>
    </Section>
  );
};

export default Biography;
