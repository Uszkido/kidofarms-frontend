"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartCount() {
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    // Only show the count after mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="relative p-2 hover:bg-white/10 rounded-full transition-all group">
                <ShoppingCart size={22} className="group-hover:text-secondary transition-colors" />
            </div>
        );
    }

    return (
        <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-all group">
            <ShoppingCart size={22} className="group-hover:text-secondary transition-colors" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                    {cartCount}
                </span>
            )}
        </Link>
    );
}
