"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getApiUrl } from '@/lib/api';
import { PackageCheck } from 'lucide-react';

export default function BundlesPage() {
 const [bundles, setBundles] = useState<any[]>([]);
 useEffect(() => { fetch(getApiUrl('/api/bundles')).then(r => r.ok ? r.json() : []).then(setBundles).catch(() => setBundles([])); }, []);
 return <div className="flex min-h-screen flex-col bg-cream/20"><Header /><main className="flex-grow px-6 py-28"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-widest text-secondary">Curated farm boxes</p><h1 className="mt-3 font-serif text-5xl font-black text-primary">Fresh bundles for every kitchen.</h1><p className="mt-4 text-primary/60">Save time with useful combinations assembled by Kido Farms. Availability updates with the live catalog.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{bundles.map(bundle => <article key={bundle.id} className="rounded-3xl bg-white p-7 shadow-xl"><PackageCheck className="text-secondary" /><h2 className="mt-6 text-2xl font-black text-primary">{bundle.name}</h2><p className="mt-3 text-sm text-primary/60">{bundle.description}</p><p className="mt-6 font-serif text-3xl font-black text-secondary">₦{Number(bundle.price).toLocaleString()}</p><Link href="/shop" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">Shop bundle items</Link></article>)}{bundles.length === 0 && <p className="rounded-3xl border border-primary/10 bg-white p-8 text-primary/60">New curated bundles will appear here soon. Browse the live shop in the meantime.</p>}</div></div></main><Footer /></div>;
}
