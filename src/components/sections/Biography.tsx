"use client";

import React from "react";
import Section from "@/components/common/Section";
import { biography, artistName } from "@/lib/data";

const Biography: React.FC = () => {
  return (
    <Section id="about" title={`ABOUT ${artistName.toUpperCase()}`}>
        <div className="flex flex-col items-center gap-8 md:gap-12 max-w-3xl mx-auto">
            <div>
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                    {biography}
                </p>
            </div>
        </div>
    </Section>
  );
};

export default Biography;
