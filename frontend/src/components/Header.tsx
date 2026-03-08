import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Search, User, Menu, BarChart3 } from "lucide-react";
import LogoutButton from './LogoutButton';
import CartCount from './CartCount';

export const Header = async () => {
    const session = await getServerSession(authOptions);

    return (
        <header className="bg-primary text-white py-5 sticky top-0 z-[60] shadow-2xl border-b border-white/5">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 md:gap-4 group shrink-0">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 overflow-hidden">
                        <Image
                            src="/logo.svg"
                            alt="Kido Farms Logo"
                            fill
                            className="p-1.5 md:p-2 object-contain filter brightness-0 invert"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Kido Farms</span>
                        <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Network System</span>
                    </div>
                </Link>

                {/* Global Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    <Link href="/shop" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Marketplace</Link>
                    <Link href="/subscriptions" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Subscriptions</Link>
                    <Link href="/track-harvest" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Track Harvest</Link>
                    <Link href="/about" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Our Vision</Link>
                    <Link href="/blog" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Farm Blog</Link>

                    {session?.user && (session.user as any).role === "admin" && (
                        <Link href="/admin" className="bg-white/10 hover:bg-white hover:text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                            <BarChart3 size={14} className="text-secondary" /> Admin Hub
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2 md:gap-6">
                    {session ? (
                        <div className="flex items-center gap-2 md:gap-3">
                            <Link
                                href={
                                    (session.user as any).role === "admin" ? "/admin" :
                                        (session.user as any).role === "farmer" ? "/dashboard/farmer" :
                                            (session.user as any).role === "subscriber" ? "/dashboard/subscriber" :
                                                "/dashboard/consumer"
                                }
                                className="flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-secondary hover:text-primary px-4 md:px-6 py-2 md:py-3 rounded-full transition-all border border-white/10 shadow-lg group max-w-[120px] md:max-w-[200px]"
                            >
                                <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                                    <User size={14} className="md:size-[18px]" />
                                </div>
                                <span className="text-xs md:text-sm font-black tracking-tight truncate">
                                    {session.user?.name || session.user?.email || "User"}
                                </span>
                            </Link>
                            <div className="hidden md:block">
                                <LogoutButton />
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-secondary hover:text-primary px-4 md:px-6 py-2 md:py-3 rounded-full transition-all border border-white/10 shadow-lg group">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                                <User size={14} className="md:size-[18px]" />
                            </div>
                            <span className="text-xs md:text-sm font-black tracking-tight">Login</span>
                        </Link>
                    )}

                    <CartCount />
                    <button className="lg:hidden p-1">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};
