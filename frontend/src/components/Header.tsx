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
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 overflow-hidden">
                        <Image
                            src="/logo.svg"
                            alt="Kido Farms Logo"
                            fill
                            className="p-2 object-contain filter brightness-0 invert"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter uppercase leading-none">Kido Farms</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-secondary">Network System</span>
                    </div>
                </Link>

                {/* Global Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    <Link href="/shop" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Marketplace</Link>
                    <Link href="/subscriptions" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Subscriptions</Link>
                    <Link href="/about" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Our Vision</Link>
                    <Link href="/blog" className="text-xs font-black uppercase tracking-widest hover:text-secondary transition-colors">Farm Blog</Link>

                    {session?.user && (session.user as any).role === "admin" && (
                        <Link href="/admin" className="bg-white/10 hover:bg-white hover:text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                            <BarChart3 size={14} className="text-secondary" /> Admin Hub
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-6">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-all group">
                        <Search size={22} className="group-hover:text-secondary transition-colors" />
                    </button>

                    {session ? (
                        <div className="flex items-center gap-3">
                            <Link href="/profile" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all">
                                <User size={16} className="text-secondary" />
                                <span className="text-xs font-bold">{session.user?.name?.split(' ')[0] || "Profile"}</span>
                            </Link>
                            <LogoutButton />
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 group p-2 hover:bg-white/10 rounded-full transition-all">
                            <User size={22} className="group-hover:text-secondary transition-colors" />
                        </Link>
                    )}

                    <CartCount />
                    <button className="lg:hidden p-2">
                        <Menu size={28} />
                    </button>
                </div>
            </div>
        </header>
    );
};
