import React from "react";
import Section from "@/components/common/Section";
import { merchandise } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Merchandise: React.FC = () => {
  return (
    <Section id="merch" title="Merchandise" className="bg-secondary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {merchandise.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0 relative">
              <div className="aspect-square bg-muted overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.hint}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-headline text-lg">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-muted-foreground">{item.price}</p>
                    <Button variant="outline" size="sm">Add to Cart</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Merchandise;
