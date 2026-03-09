"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { Search, User, Menu, BarChart3, ShoppingCart } from "lucide-react";
import LogoutButton from './LogoutButton';
import CartCount from './CartCount';
import { motion } from "framer-motion";

export const Header = () => {
    const { data: session } = useSession();

    return (
        <header className="bg-primary/95 backdrop-blur-xl text-white py-4 sticky top-0 z-[60] shadow-2xl border-b border-white/10">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4 group shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-14 h-14 md:w-20 md:h-20 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
                    >
                        <Image
                            src="/logo.svg"
                            alt="Kido Farms Logo"
                            fill
                            className="p-1.5 md:p-2 object-contain filter brightness-0 invert"
                            priority
                        />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">Kido Farms</span>
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] text-secondary">Premium Network</span>
                    </div>
                </Link>

                {/* Global Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {[
                        { label: "Marketplace", href: "/shop" },
                        { label: "Subscriptions", href: "/subscriptions" },
                        { label: "Our Vision", href: "/about" },
                        { label: "Farm Blog", href: "/blog" },
                    ].map((link) => (
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
                </nav>

                <div className="flex items-center gap-3 md:gap-6">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href={
                                    (session.user as any).role === "admin" ? "/admin" :
                                        (session.user as any).role === "farmer" ? "/dashboard/farmer" :
                                            (session.user as any).role === "vendor" ? "/dashboard/vendor" :
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

                    <button className="lg:hidden p-2 bg-white/5 rounded-xl">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

