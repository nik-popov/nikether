import React from "react";
import Section from "@/components/common/Section";
import { biography, artistName } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const Biography: React.FC = () => {
  const bioImage = PlaceHolderImages.find(img => img.id === 'artist-bio');

  return (
    <Section id="about" title={`About ${artistName}`} className="bg-secondary/20">
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
            {bioImage && (
                <Image 
                    src={bioImage.imageUrl}
                    alt={`Portrait of ${artistName}`}
                    width={800}
                    height={800}
                    className="rounded-lg shadow-lg object-cover aspect-square box-glow"
                    data-ai-hint={bioImage.imageHint}
                />
            )}
        </div>
        <div className="md:col-span-3">
          <p className="text-lg text-foreground/80 leading-relaxed text-justify">
            {biography}
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Biography;
