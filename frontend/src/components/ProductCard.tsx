"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category?: string;
    farmSource?: string;
    rating?: number;
    trackingId?: string;
    ownerId?: string;
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
    category,
    farmSource,
    rating,
    trackingId
}: ProductCardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all group h-full flex flex-col">
            <div className="relative h-48">
                <Image
                    src={image || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2000"}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-primary shadow-sm">
                    {farmSource || "Lagos, NG"}
                </div>
                <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-[10px] font-black text-primary shadow-sm">
                    {category}
                </div>
                {trackingId && (
                    <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-black text-white border border-white/10 uppercase tracking-tighter">
                        Track: {trackingId}
                    </div>
                )}
            </div>
            <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                    <Link href={`/products/${id}`}>
                        <h4 className="text-xl font-bold font-serif group-hover:text-secondary transition-colors line-clamp-1">{name}</h4>
                    </Link>
                    {description && <p className="text-xs text-primary/40 font-medium line-clamp-2">{description}</p>}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary/5 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">₦{price.toLocaleString()}</span>
                        <span className="text-[10px] text-primary/30 font-bold uppercase">Source Verified</span>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-lg">
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
