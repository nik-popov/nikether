import { Instagram, Twitter, Music, Disc, Facebook } from 'lucide-react';

export type SocialLink = {
    name: string;
    url: string;
    icon: React.ElementType;
};

export const socialLinks: SocialLink[] = [
    {
        name: 'Spotify',
        url: 'https://spotify.com',
        icon: Music,
    },
    {
        name: 'Soundcloud',
        url: 'https://soundcloud.com',
        icon: Disc,
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com',
        icon: Instagram,
    },
    {
        name: 'Twitter',
        url: 'https://twitter.com',
        icon: Twitter,
    },
    {
        name: 'Facebook',
        url: 'https://facebook.com',
        icon: Facebook,
    }
];
