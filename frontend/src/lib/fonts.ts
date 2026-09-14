import { Playfair_Display, Outfit } from 'next/font/google';

export const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
    preload: false,
});

export const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    preload: false,
});
