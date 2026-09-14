import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base = 'https://kidofarms.vercel.app'; return ['/', '/shop', '/about', '/blog', '/wholesale', '/subscriptions', '/contact'].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === '/shop' ? 'daily' : 'weekly', priority: path === '/' ? 1 : 0.7 })); }
