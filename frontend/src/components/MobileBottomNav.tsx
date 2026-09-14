"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { data: session } = useSession();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register')) return null;
  const accountHref = session ? '/dashboard/buyer' : '/login';
  const items = [{ href: '/', label: 'Home', icon: Home }, { href: '/shop', label: 'Shop', icon: Search }, { href: '/cart', label: 'Cart', icon: ShoppingBag }, { href: accountHref, label: 'Account', icon: UserRound }];
  return <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-[90] flex h-16 items-center justify-around border-t border-primary/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(5,39,31,.10)] backdrop-blur lg:hidden">{items.map(({ href, label, icon: Icon }) => <Link key={label} href={href} className={`relative flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wide ${pathname === href ? 'text-primary' : 'text-primary/45'}`}><Icon size={18} strokeWidth={pathname === href ? 2.8 : 2} />{label === 'Cart' && cartCount > 0 && <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[8px] text-primary">{cartCount}</span>}<span>{label}</span></Link>)}</nav>;
}
