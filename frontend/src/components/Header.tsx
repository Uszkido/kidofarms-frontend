"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { Search, User, Menu, BarChart3, ShoppingCart, X, ArrowRight } from "lucide-react";
import LogoutButton from './LogoutButton';
import CartCount from './CartCount';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';

export const Header = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userRole = (session?.user as any)?.role;
    const isBusiness = ['business', 'wholesale_buyer', 'retailer', 'hotel', 'distributor'].includes(userRole);

    const mainLinks = [
        { label: "Marketplace", href: "/shop" },
        {
            label: "Sovereignty",
            href: "#",
            children: [
                { label: "Sovereign Vault", href: "/vault" },
                { label: "Intelligence Exchange", href: "/exchange" },
            ]
        },
        {
            label: "Ecosystem",
            href: "#",
            children: [
                { label: "Our Vision", href: "/about" },
                { label: "Farm Blog", href: "/blog" },
                ...(!isBusiness ? [{ label: "Subscriptions", href: "/subscriptions" }] : []),
            ]
        },
        {
            label: "Support",
            href: "#",
            children: [
                { label: "Track Order", href: "/track-order" },
                ...(session ? [{ label: "Support Hub", href: "/dashboard/support" }] : []),
            ]
        },
    ];

    const languages = [
        { code: "en", label: "EN" },
        { code: "pg", label: "PDG" },
        { code: "hs", label: "HSA" },
        { code: "yo", label: "YOR" },
    ];
    const [currentLang, setCurrentLang] = useState("en");

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const googtrans = getCookie('googtrans');
        if (googtrans) {
            const target = googtrans.split('/').pop() || 'en';
            const reverseMap: Record<string, string> = {
                'en': 'en',
                'pcm': 'pg',
                'ha': 'hs',
                'yo': 'yo'
            };
            if (reverseMap[target]) {
                setCurrentLang(reverseMap[target]);
            }
        }
    }, []);

    const handleLangChange = (code: string) => {
        setCurrentLang(code);

        // Map internal codes to Google Translate codes
        const map: Record<string, string> = {
            'en': 'en',
            'pg': 'pcm', // Nigerian Pidgin
            'hs': 'ha',  // Hausa
            'yo': 'yo'   // Yoruba
        };

        const target = map[code] || 'en';

        // Check if cookie suggests we are already in same state 
        document.cookie = `googtrans=/en/${target}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${target}; path=/;`;

        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
            select.value = target;
            select.dispatchEvent(new Event('change'));
        } else {
            window.location.reload(); // Fallback
        }
    };

    return (
        <header className="bg-primary/95 backdrop-blur-xl text-white py-4 sticky top-0 z-[60] shadow-2xl border-b border-white/10">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-primary transition-all duration-500">
                        <Image src="/logo.svg" alt="Kido Farms" fill className="p-2 object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500" priority />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-base md:text-xl font-black tracking-tighter uppercase leading-tight">Kido Farms</span>
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-secondary/80">Premium Network</span>
                    </div>
                </Link>

                {/* Global Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
                    {mainLinks.map((link) => (
                        <div key={link.label} className="relative group py-4">
                            {link.children ? (
                                <>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-secondary transition-colors">
                                        {link.label}
                                        <X size={10} className="rotate-45 group-hover:rotate-0 transition-transform" />
                                    </button>
                                    <div className="absolute top-full left-0 w-64 bg-primary border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 backdrop-blur-3xl">
                                        <div className="space-y-1">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block p-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={link.href}
                                    className="relative text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-secondary transition-colors group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                                </Link>
                            )}
                        </div>
                    ))}

                    {session?.user && (session.user as any).role === "admin" && (
                        <Link href="/admin" className="bg-secondary text-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
                            Admin Hub
                        </Link>
                    )}

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLangChange(lang.code)}
                                className={`px-2 py-1 text-[8px] font-black rounded-lg transition-all ${currentLang === lang.code ? 'bg-secondary text-primary' : 'text-white/30 hover:text-white'}`}
                            >
                                {lang.code}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="flex items-center gap-3 md:gap-6">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href={
                                    (session.user as any).role === "admin" ? "/admin" :
                                        (session.user as any).role === "farmer" ? "/dashboard/farmer" :
                                            (session.user as any).role === "vendor" ? "/dashboard/vendor" :
                                                (session.user as any).role === "wholesale_buyer" ? "/dashboard/wholesaler" :
                                                    (session.user as any).role === "distributor" ? "/dashboard/distributor" :
                                                        (session.user as any).role === "retailer" ? "/dashboard/retailer" :
                                                            (session.user as any).role === "team_member" ? "/dashboard/team" :
                                                                (session.user as any).role === "business" ? "/dashboard/business" :
                                                                    (session.user as any).role === "subscriber" ? "/dashboard/subscriber" :
                                                                        "/dashboard/consumer"
                                }
                                className="flex items-center gap-3 bg-white/5 hover:bg-secondary hover:text-primary px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all border border-white/5 shadow-lg group"
                            >
                                <div className="shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden text-[10px]">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="User" width={28} height={28} />
                                    ) : (
                                        <User size={12} />
                                    )}
                                </div>
                                <span className="text-[10px] font-black tracking-widest uppercase truncate max-w-[60px] md:max-w-[100px]">
                                    {session.user?.name?.split(' ')[0] || "Account"}
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-4 bg-white/5 hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full transition-all border border-white/5 shadow-lg group">
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">LOGIN / SIGNUP</span>
                            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-primary/20">
                                <User size={10} />
                            </div>
                        </Link>
                    )}

                    <div className="hidden md:flex items-center gap-4">
                        <LogoutButton />
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
                    <CartCount />

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden p-2.5 bg-white/5 rounded-xl text-white hover:bg-secondary hover:text-primary transition-all active:scale-95"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[70] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-primary border-l border-white/10 z-[80] lg:hidden shadow-2xl p-10 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <span className="text-secondary font-black uppercase tracking-widest text-xs">Menu</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-3 bg-white/5 rounded-2xl text-white hover:bg-secondary hover:text-primary transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6">
                                {mainLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="space-y-4"
                                    >
                                        {link.children ? (
                                            <>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/40">{link.label}</span>
                                                <div className="flex flex-col gap-4 pl-4 border-l border-white/5">
                                                    {link.children.map((child) => (
                                                        <Link
                                                            key={child.label}
                                                            href={child.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="text-xl font-black font-serif text-white hover:text-secondary transition-colors"
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-2xl font-black font-serif text-white hover:text-secondary transition-colors flex items-center justify-between group"
                                            >
                                                {link.label}
                                                <ArrowRight size={20} className="text-secondary" />
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}

                                {session?.user && (session.user as any).role === "admin" && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (mainLinks.length + 1) * 0.1 }}
                                    >
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="bg-secondary text-primary px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl mt-4"
                                        >
                                            Admin Hub
                                        </Link>
                                    </motion.div>
                                )}
                            </nav>

                            <div className="mt-auto pt-10 border-t border-white/5 space-y-8">
                                {session ? (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Logged in as</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                                                <User size={20} />
                                            </div>
                                            <span className="font-black text-white">{session.user?.name}</span>
                                        </div>
                                        <div className="pt-4">
                                            <LogoutButton />
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full bg-secondary text-primary py-6 rounded-2xl font-black uppercase tracking-widest text-sm text-center block shadow-2xl"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

