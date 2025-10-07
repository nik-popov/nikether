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

export type Playlist = {
  id: number;
  name: string;
  description: string;
  cover: string;
  hint: string;
};


export const artistName = "NIKETHER";

export const biography = "Nik Ether’s tracks blend melodic techno, house, and Afrobeat rhythms, crafting a captivating sound with deep emotional resonance. Drawing from artists like Lane 8, NTO, Boris Brejcha, and Eelke Kleijn, Nik Ether’s music, featured in playlists such as Melodic Techno & House, Deep & Groovy, and Lofi & Chill, takes listeners on an engaging journey through fresh, nostalgic sound.";

export const discography: Track[] = [
  { id: 5, title: 'Time', artist: 'NTO', genre: 'Melodic Techno', cover: getImage('album-1'), hint: getHint('album-1') },
  { id: 7, title: 'Bloom - Intro Mix', artist: 'Sultan + Shepard', genre: 'Deep House', cover: getImage('album-3'), hint: getHint('album-3') },
  { id: 8, title: 'Invisible - Paul Kalkbrenner Remix', artist: 'NTO, Paul Kalkbrenner', genre: 'Techno', cover: getImage('album-4'), hint: getHint('album-4') },
  { id: 9, title: 'The Morning After', artist: 'NTO', genre: 'Melodic House', cover: getImage('album-5'), hint: getHint('album-5') },
  { id: 10, title: 'La clé des champs', artist: 'NTO', genre: 'Ambient', cover: getImage('album-6'), hint: getHint('album-6') },
  { id: 11, title: 'Invisible - Piano Version', artist: 'NTO, Sofiane Pamart', genre: 'Neoclassical', cover: getImage('album-7'), hint: getHint('album-7') },
  { id: 12, title: 'Trauma - Worakls Remix', artist: 'NTO, Worakls', genre: 'Orchestral', cover: getImage('album-8'), hint: getHint('album-8') },
  { id: 13, title: 'Beyond Control', artist: 'NTO, Monolink', genre: 'Melodic Techno', cover: getImage('album-2'), hint: getHint('album-9') },
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

export const featuredPlaylists: Playlist[] = [
    { id: 1, name: 'Melodic Techno & House', description: 'The finest selection of melodic techno and house tracks.', cover: getImage('playlist-1'), hint: getHint('playlist-1') },
    { id: 2, name: 'Deep & Groovy', description: 'Get lost in the deep and groovy sounds.', cover: getImage('playlist-2'), hint: getHint('playlist-2') },
    { id: 3, name: 'Ambient & Cinematic', description: 'A journey through ambient and cinematic soundscapes.', cover: getImage('playlist-3'), hint: getHint('playlist-3') },
];
