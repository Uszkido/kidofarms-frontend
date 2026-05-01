"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { Search, User, Menu, BarChart3, ShoppingCart, X, ArrowRight } from "lucide-react";
import LogoutButton from './LogoutButton';
import CartCount from './CartCount';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

export const Header = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userRole = (session?.user as any)?.role;
    const isBusiness = ['business', 'wholesale_buyer', 'retailer', 'hotel', 'distributor'].includes(userRole);

    const navLinks = [
        { label: "Marketplace", href: "/shop" },
        ...(!isBusiness ? [{ label: "Subscriptions", href: "/subscriptions" }] : []),
        { label: "Track Order", href: "/track-order" },
        { label: "Our Vision", href: "/about" },
        { label: "Sovereign Vault", href: "/vault" },
        { label: "Farm Blog", href: "/blog" },
        ...(session ? [{ label: "Support Hub", href: "/dashboard/support" }] : []),
    ];

    const languages = [
        { code: "en", label: "EN" },
        { code: "pg", label: "PDG" },
        { code: "hs", label: "HSA" },
        { code: "yo", label: "YOR" },
    ];
    const [currentLang, setCurrentLang] = useState("en");

    return (
        <header className="bg-primary/95 backdrop-blur-xl text-white py-4 sticky top-0 z-[60] shadow-2xl border-b border-white/10">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4 group shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                        <Image src="/logo.svg" alt="Kido Farms" fill className="p-2 object-contain" priority />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">Kido Farms</span>
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] text-secondary">Premium Network</span>
                    </div>
                </Link>

                {/* Global Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="relative text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-secondary transition-colors group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    {session?.user && (session.user as any).role === "admin" && (
                        <Link href="/admin" className="bg-white/10 hover:bg-secondary hover:text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                            Admin Hub
                        </Link>
                    )}

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setCurrentLang(lang.code)}
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
                                className="flex items-center gap-3 bg-white/5 hover:bg-secondary hover:text-primary px-4 md:px-5 py-2.5 rounded-full transition-all border border-white/5 shadow-lg group"
                            >
                                <div className="shrink-0 w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="User" width={28} height={28} />
                                    ) : (
                                        <User size={14} />
                                    )}
                                </div>
                                <span className="text-[10px] font-black tracking-widest uppercase truncate max-w-[100px]">
                                    {session.user?.name?.split(' ')[0] || "Account"}
                                </span>
                            </Link>
                            <div className="hidden md:block">
                                <LogoutButton />
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-3 bg-white/5 hover:bg-secondary hover:text-primary px-5 py-2.5 rounded-full transition-all border border-white/5 shadow-lg group">
                            <span className="text-[10px] font-black tracking-widest uppercase">Sign In</span>
                        </Link>
                    )}

                    <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
                    <CartCount />

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden p-2 bg-white/5 rounded-xl text-white hover:bg-secondary hover:text-primary transition-all active:scale-95"
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

                            <nav className="flex flex-col gap-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-3xl font-black font-serif text-white hover:text-secondary transition-colors flex items-center justify-between group"
                                        >
                                            {link.label}
                                            <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-secondary" />
                                        </Link>
                                    </motion.div>
                                ))}

                                {session?.user && (session.user as any).role === "admin" && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: navLinks.length * 0.1 }}
                                    >
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="bg-white/10 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-secondary hover:text-primary transition-all shadow-xl"
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

