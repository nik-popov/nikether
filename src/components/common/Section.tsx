import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className, titleClassName }) => {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={cn("text-4xl md:text-5xl font-bold font-headline text-center mb-12 text-glow", titleClassName)}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
