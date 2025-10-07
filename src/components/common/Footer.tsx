"use client";

import React from 'react';
import { socialLinks } from '@/lib/social-links';
import { Button } from '@/components/ui/button';
import { artistName } from '@/lib/data';

const Footer: React.FC = () => {
    return (
        <footer className="bg-background/50 border-t border-white/10 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-6">
                <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                        <Button
                            key={link.name}
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-muted-foreground hover:text-primary"
                        >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                <link.icon className="w-5 h-5" />
                            </a>
                        </Button>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {artistName}. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
