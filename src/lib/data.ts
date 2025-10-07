import { PlaceHolderImages } from "./placeholder-images";

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';
const getHint = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageHint || '';

export type Track = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  cover: string;
  hint: string;
};

export type TourDate = {
  id: number;
  date: string;
  city: string;
  venue: string;
  status: 'On Sale' | 'Sold Out' | 'Upcoming';
};

export type Merchandise = {
  id: number;
  name: string;
  price: string;
  image: string;
  hint: string;
};

export const artistName = "Nikether Title Music";

export const biography = "Rhythmic Canvas is a visionary DJ and producer who paints with sound. Blending genres from synthwave to future funk, their music creates immersive sonic landscapes. With a passion for the intersection of audio and visual art, Rhythmic Canvas's live shows are a multi-sensory experience, featuring stunning, AI-generated visuals that dance in harmony with every beat. Step into the canvas and experience music like never before.";

export const discography: Track[] = [
  { id: 1, title: 'Chromatic Dreams', artist: artistName, genre: 'Synthwave', cover: getImage('album-1'), hint: getHint('album-1') },
  { id: 2, title: 'Neon Nights', artist: artistName, genre: 'Cyberpunk', cover: getImage('album-2'), hint: getHint('album-2') },
  { id: 3, title: 'Synthwave Serenity', artist: artistName, genre: 'Chillwave', cover: getImage('album-3'), hint: getHint('album-3') },
  { id: 4, title: 'Future Funk', artist: artistName, genre: 'Funk', cover: getImage('album-4'), hint: getHint('album-4') },
];

export const tourDates: TourDate[] = [
  { id: 1, date: '2024-10-26', city: 'Neo-Tokyo', venue: 'Cyber-Dome', status: 'On Sale' },
  { id: 2, date: '2024-11-09', city: 'Aethelgard', venue: 'The Ætherium', status: 'On Sale' },
  { id: 3, date: '2024-11-23', city: 'New Berlin', venue: 'Kraftwerk 2.0', status: 'Sold Out' },
  { id: 4, date: '2024-12-07', city: 'Paris-Nouveau', venue: 'Le Zenith Futur', status: 'Upcoming' },
];

export const merchandise: Merchandise[] = [
  { id: 1, name: 'RC Logo Tee', price: '$29.99', image: getImage('merch-1'), hint: getHint('merch-1') },
  { id: 2, name: 'Chromatic Dreams Hoodie', price: '$59.99', image: getImage('merch-2'), hint: getHint('merch-2') },
  { id: 3, name: 'RC Snapback', price: '$24.99', image: getImage('merch-3'), hint: getHint('merch-3') },
  { id: 4, name: 'Chromatic Dreams Vinyl', price: '$39.99', image: getImage('merch-4'), hint: getHint('merch-4') },
];
