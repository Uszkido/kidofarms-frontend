"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
    Store,
    MapPin,
    Calendar,
    Star,
    ShieldCheck,
    ArrowLeft,
    Loader2,
    Package,
    Mail,
    Phone,
    Share2,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export function VendorProfileClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [vendor, setVendor] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vRes, pRes] = await Promise.all([
                    fetch(getApiUrl(`/api/vendors/${id}`)),
                    fetch(getApiUrl(`/api/vendors/${id}/products`))
                ]);

                if (vRes.ok) setVendor(await vRes.json());
                if (pRes.ok) setProducts(await pRes.json());
            } catch (err) {
                console.error("Failed to fetch vendor profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-secondary" size={48} />
                    <p className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/20">Syncing Storefront...</p>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center p-10">
                <h1 className="text-4xl font-black font-serif text-primary">Store Not Found</h1>
                <Link href="/shop" className="mt-6 text-secondary font-black uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-12">

                    {/* Hero Storefront Header */}
                    <div className="relative bg-white rounded-[4rem] border border-primary/5 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[30%] h-full bg-secondary/5 -skew-x-12 translate-x-1/2" />
                        <div className="flex flex-col lg:flex-row p-8 md:p-16 gap-10 md:gap-16 items-center lg:items-end relative z-10">

                            {/* Logo/Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 md:w-48 md:h-48 bg-primary rounded-[3rem] shadow-2xl flex items-center justify-center text-white border-8 border-white group-hover:rotate-3 transition-transform duration-500">
                                    {vendor.logo ? (
                                        <img src={vendor.logo} className="w-full h-full object-cover rounded-[3rem]" />
                                    ) : (
                                        <Store size={64} />
                                    )}
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-secondary text-primary p-4 rounded-full shadow-xl border-4 border-white">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-grow text-center lg:text-left space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                        <h1 className="text-4xl md:text-7xl font-black font-serif text-primary tracking-tight leading-none uppercase">
                                            {vendor.businessName}
                                        </h1>
                                        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                                            <CheckCircle size={14} /> Official Vendor
                                        </div>
                                    </div>
                                    <p className="max-w-xl text-primary/60 font-medium leading-relaxed italic md:text-lg">
                                        {vendor.description || "Premium agricultural producer dedicated to quality and sustainability in the Kido Farms network."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-primary/40">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 leading-none">Location</p>
                                            <p className="text-sm font-bold text-primary">{vendor.user?.state || "National Network"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-primary/40">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 leading-none">Member Since</p>
                                            <p className="text-sm font-bold text-primary">{new Date(vendor.createdAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-primary/40">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 leading-none">Catalog Size</p>
                                            <p className="text-sm font-bold text-primary">{products.length} Products</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 w-full lg:w-auto">
                                <button className="px-10 py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                    <Share2 size={16} /> Share Store
                                </button>
                                <div className="flex gap-2">
                                    <button className="flex-1 p-5 bg-white border border-primary/10 rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center">
                                        <Mail size={18} className="text-primary/40" />
                                    </button>
                                    <button className="flex-1 p-5 bg-white border border-primary/10 rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center">
                                        <Phone size={18} className="text-primary/40" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Storefront Navigation */}
                    <div className="flex items-center justify-between border-b border-primary/5 pb-8 px-4">
                        <h2 className="text-3xl font-black font-serif text-primary">All <span className="text-secondary italic">Listings</span></h2>
                        <div className="flex gap-8">
                            <button className="text-[10px] font-black uppercase tracking-widest text-secondary border-b-2 border-secondary pb-1">Shop Collections</button>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary/20 hover:text-primary transition-all pb-1">Vendor Bio</button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={parseFloat(product.price)}
                                image={product.images?.[0]}
                                category={product.category}
                                rating={parseFloat(product.rating)}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] border-2 border-dashed border-primary/5">
                            <Package size={64} strokeWidth={1} className="text-primary/10" />
                            <p className="font-black text-xs uppercase tracking-widest text-primary/20">This vendor hasn't listed any products yet.</p>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
