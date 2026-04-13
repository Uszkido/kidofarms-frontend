"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Filter, Search as SearchIcon, ArrowUpDown, Loader2, ShoppingBag, Eye, Star, MapPin, Tag, Users, QrCode, Zap, ShieldCheck } from "lucide-react";
import { StoryFeed } from "@/components/StoryFeed";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import { ActionStatus } from "@/components/ActionStatus";
import { useSearchParams } from "next/navigation";
import SustainabilityTrustModal from "@/components/SustainabilityTrustModal";

function ShopContent() {
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [vettingProduct, setVettingProduct] = useState<any>(null);
    const initialSearch = searchParams.get("search") || "";

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [categories, setCategories] = useState<string[]>(["All"]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch(getApiUrl("/api/categories"));
            if (res.ok) {
                const data = await res.json();
                const categoryList = Array.isArray(data) ? data.map((c: any) => c.name) : [];
                setCategories(["All", ...categoryList]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = getApiUrl("/api/products?");
                if (selectedCategory !== "All") url += `category=${selectedCategory}&`;
                if (searchQuery) url += `search=${searchQuery}&`;

                const res = await fetch(url);
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const handleGroupBuy = async (productId: string) => {
        if (!session?.user) {
            setActionState({
                isOpen: true,
                title: "Authentication Required",
                message: "Please login to join a group buy node!",
                status: "error"
            });
            return;
        }
        setActionState({
            isOpen: true,
            title: "Group Buy",
            message: "Joining node...",
            status: "processing"
        });

        try {
            const res = await fetch(getApiUrl("/api/groupbuys/join"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    userId: (session.user as any).id,
                    quantity: 1
                })
            });
            if (res.ok) {
                setActionState({
                    isOpen: true,
                    title: "Success",
                    message: "🚀 Neighborhood Node Linked! You've joined the group buy.",
                    status: "success"
                });
            } else {
                setActionState({
                    isOpen: true,
                    title: "Error",
                    message: "Failed to join group buy.",
                    status: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setActionState({
                isOpen: true,
                title: "Network Error",
                message: "An error occurred.",
                status: "error"
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />
            <main className="flex-grow py-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold font-serif">The Shop</h1>
                            <p className="text-primary/60">Browse our seasonal harvest and artisanal products.</p>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 rounded-full border border-primary/10 glass focus:ring-1 focus:ring-secondary outline-none text-sm"
                                />
                            </div>
                            <button onClick={() => alert("Advanced filtering interface opening soon...")} className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/10 text-sm font-bold hover:bg-white transition-all">
                                <Filter size={18} /> Filters
                            </button>
                            <button onClick={() => alert("Sorting parameters coming soon...")} className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/10 text-sm font-bold hover:bg-white transition-all">
                                <ArrowUpDown size={18} /> Sort
                            </button>
                        </div>
                    </div>

                    <StoryFeed />

                    {/* ⚡ FLASH SALE BANNER */}
                    {products.some(p => p.isFlashSale) && (
                        <div className="mb-12 relative overflow-hidden rounded-[3rem] bg-secondary p-8 lg:p-12 shadow-2xl group flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48 animate-pulse" />
                            <div className="relative z-10 space-y-4 text-center md:text-left">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Zap className="text-primary animate-bounce" fill="currentColor" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Limited Protocol: Flash Sale</span>
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black font-serif italic text-primary uppercase leading-tight tracking-tighter">
                                    Harvest <span className="opacity-60 italic">Blitz</span>
                                </h2>
                                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest max-w-md">
                                    Fresh nodes just entered the discount vector. Secure your harvest before the timer hits zero.
                                </p>
                            </div>
                            <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 w-full md:w-auto md:pb-0 scrollbar-hide">
                                {products.filter(p => p.isFlashSale).slice(0, 3).map(p => (
                                    <div key={p.id} className="min-w-[200px] bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 border border-white/20 shadow-xl group/card hover:scale-105 transition-all">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                                            <Image src={p.images?.[0] || ""} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/40 truncate w-24">{p.name}</p>
                                            <p className="text-sm font-black text-secondary">₦{Number(p.flashPrice || p.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Sidebar Filters */}
                        <aside className="w-full md:w-64 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold font-serif">Categories</h3>
                                <div className="flex flex-col gap-3">
                                    {categories.map((cat) => (
                                        <label
                                            key={cat}
                                            className="flex items-center gap-3 cursor-pointer group"
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedCategory === cat ? 'border-secondary bg-secondary/10' : 'border-primary/20 group-hover:border-secondary'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-sm bg-secondary transition-opacity ${selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${selectedCategory === cat ? 'text-primary font-bold' : 'text-primary/70 group-hover:text-primary'}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold font-serif">Price Range</h3>
                                <div className="space-y-4">
                                    <input type="range" className="w-full accent-secondary" min="0" max="100" />
                                    <div className="flex justify-between text-xs font-bold text-primary/60 uppercase tracking-wider">
                                        <span>₦0</span>
                                        <span>₦10,000+</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-primary text-white space-y-4">
                                <h4 className="text-lg font-bold font-serif text-secondary">Farm Fresh Guarantee</h4>
                                <p className="text-xs text-cream/70 leading-relaxed">
                                    We harvest only when you order to ensure maximum freshness and nutritional value.
                                </p>
                            </div>

                            <div className="p-10 rounded-[3rem] bg-[#1a3c34] border border-secondary/20 space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                                <div className="space-y-2 relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Kido Impact Gauge</p>
                                    <h4 className="text-3xl font-black font-serif italic text-white uppercase leading-none">Social <span className="opacity-40 block">Alpha</span></h4>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Student Support</span>
                                        <span className="text-xs font-black text-secondary">+12 Days</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Clean Irrigation</span>
                                        <span className="text-xs font-black text-white">+1,200 Liters</span>
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] leading-relaxed">
                                    Calculated via Neural Node 09-Impact based on active community participation.
                                </p>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? (
                                    <div className="col-span-full py-20 flex justify-center">
                                        <Loader2 className="animate-spin text-secondary" size={48} />
                                    </div>
                                ) : products.length > 0 ? (
                                    products.map((prod) => (
                                        <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden border border-primary/5 hover:shadow-2xl transition-all h-full flex flex-col">
                                            <div className="relative h-72 overflow-hidden">
                                                <Link href={`/products/${prod.id}`}>
                                                    <Image
                                                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"}
                                                        alt={prod.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </Link>
                                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase text-primary shadow-lg border border-primary/5">
                                                        {prod.category}
                                                    </span>
                                                    {prod.isFlashSale && (
                                                        <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-2xl animate-pulse">
                                                            <Zap size={10} fill="currentColor" /> Flash
                                                        </span>
                                                    )}
                                                    {Number(prod.stock) <= 0 && (
                                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                            Sold Out
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-primary/40">Harvest ID: {prod.trackingId || 'Pending'}</p>
                                                            {prod.trackingId && (
                                                                <Link href={`/trace/${prod.trackingId}`} className="text-secondary hover:text-primary transition-colors">
                                                                    <QrCode size={12} strokeWidth={3} />
                                                                </Link>
                                                            )}
                                                        </div>
                                                        <Link href={`/products/${prod.id}`}>
                                                            <h3 className="text-xl font-bold font-serif group-hover:text-secondary transition-colors">{prod.name}</h3>
                                                        </Link>
                                                    </div>
                                                    <button
                                                        onClick={() => setVettingProduct(prod)}
                                                        className="p-3 bg-secondary/10 text-secondary rounded-2xl hover:bg-secondary hover:text-primary transition-all group/v shadow-lg border border-secondary/20"
                                                        title="View Sustainability Report"
                                                    >
                                                        <ShieldCheck size={20} className="group-hover/v:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 mb-4 text-secondary">
                                                    <span className="text-xs font-bold">★</span>
                                                    <span className="text-xs font-bold text-primary/60">{prod.rating}</span>
                                                </div>
                                                <div className="mt-auto pt-6 flex justify-between items-center border-t border-primary/5">
                                                    <div className="flex flex-col">
                                                        {prod.isFlashSale ? (
                                                            <>
                                                                <span className="text-2xl font-black text-secondary">₦{Number(prod.flashPrice).toLocaleString()}</span>
                                                                <span className="text-[10px] font-bold text-primary/30 line-through">₦{Number(prod.price).toLocaleString()}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-primary">₦{Number(prod.price).toLocaleString()}</span>
                                                        )}
                                                        <span className="text-[10px] font-bold text-primary/30 uppercase">per {prod.unit}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => addToCart({
                                                                id: prod.id,
                                                                name: prod.name,
                                                                price: Number(prod.price),
                                                                image: prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
                                                                quantity: 1,
                                                                category: prod.category
                                                            })}
                                                            disabled={Number(prod.stock) <= 0}
                                                            className={`bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-secondary hover:text-primary transition-all whitespace-nowrap disabled:bg-primary/10 disabled:text-primary/20 disabled:cursor-not-allowed`}
                                                        >
                                                            {Number(prod.stock) <= 0 ? "Out of Stock" : "Add to Cart"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleGroupBuy(prod.id)}
                                                            disabled={Number(prod.stock) <= 0}
                                                            className="bg-white border border-primary/10 text-primary px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:border-secondary transition-all flex items-center justify-center gap-1 group/btn disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <Users size={12} className="text-secondary group-hover/btn:text-primary" /> Buy as Group
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded italic">Save 15% with Group</span>
                                                    <span className="text-primary/20">4 Ongoing Buys</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center space-y-4">
                                        <div className="text-primary/20 flex justify-center">
                                            <SearchIcon size={64} />
                                        </div>
                                        <h3 className="text-2xl font-bold font-serif">No products found</h3>
                                        <p className="text-primary/60">Try adjusting your filters or search terms.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <SustainabilityTrustModal
                isOpen={!!vettingProduct}
                onClose={() => setVettingProduct(null)}
                product={vettingProduct}
            />
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center p-20"><Loader2 className="animate-spin text-secondary w-16 h-16" /></div>}>
            <ShopContent />
        </Suspense>
    );
}

