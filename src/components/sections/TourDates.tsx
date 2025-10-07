import React from "react";
import Section from "@/components/common/Section";
import { tourDates } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TourDates: React.FC = () => {
  // Helper to parse date as UTC to avoid timezone mismatches
  const parseDateUTC = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  return (
    <Section id="tour" title="Performances">
      <div className="max-w-4xl mx-auto">
        <Card className="border-white/10 bg-card backdrop-blur-sm shadow-lg">
          <CardContent className="p-0">
            <ul className="divide-y divide-white/10">
              {tourDates.map((item) => (
                <li key={item.id} className="p-4 md:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center w-16">
                      <p className="text-sm font-bold text-primary">{format(parseDateUTC(item.date), 'MMM')}</p>
                      <p className="text-2xl font-bold font-headline">{format(parseDateUTC(item.date), 'dd')}</p>
                    </div>
                    <div>
                      <p className="font-bold font-headline text-lg">{item.city}</p>
                      <p className="text-muted-foreground text-sm">{item.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                        variant={item.status === 'Sold Out' ? 'destructive' : 'secondary'}
                        className={cn(item.status === 'On Sale' && 'bg-accent/80 text-accent-foreground')}
                    >
                        {item.status}
                    </Badge>
                    <Button 
                        disabled={item.status !== 'On Sale'}
                        className="hidden md:inline-flex"
                        variant="default"
                    >
                        Tickets
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};

export default TourDates;
