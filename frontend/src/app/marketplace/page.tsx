"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, LayoutDashboard, ShoppingCart, Users, Package, TrendingUp, Search, Loader2, Filter } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    images: string[];
    farmSource?: string;
    origin?: string;
    rating: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
}

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch(getApiUrl("/api/products")),
                    fetch(getApiUrl("/api/categories"))
                ]);

                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }

                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }
            } catch (error) {
                console.error("Failed to fetch marketplace data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold font-serif">Kido Farms <span className="text-secondary italic">Marketplace</span></h1>
                            <p className="text-primary/60">The digital bridge between local community farmers and conscious consumers.</p>
                        </div>
                        <Link href="/admin/inventory/new" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-lg">
                            <Plus size={20} /> List New Product
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Stats & Categories */}
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary/40 flex items-center gap-2">
                                        <Filter size={12} /> Filter by Category
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setSelectedCategory("All")}
                                            className={`px-6 py-3 rounded-2xl text-left text-sm font-bold transition-all ${selectedCategory === "All"
                                                    ? "bg-secondary text-primary shadow-lg shadow-secondary/20"
                                                    : "bg-white text-primary/40 hover:bg-cream"
                                                }`}
                                        >
                                            All Products
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.name)}
                                                className={`px-6 py-3 rounded-2xl text-left text-sm font-bold transition-all ${selectedCategory === cat.name
                                                        ? "bg-secondary text-primary shadow-lg shadow-secondary/20"
                                                        : "bg-white text-primary/40 hover:bg-cream"
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-primary/5 space-y-4">
                                    <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary/40">Market Statistics</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold font-serif">{products.length}</p>
                                                <p className="text-xs text-primary/40">Active Listings</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold font-serif">₦4.2M</p>
                                                <p className="text-xs text-primary/40">This Week's Volume</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-secondary text-primary space-y-4 shadow-xl">
                                <h4 className="text-xl font-bold font-serif">Wholesale Orders</h4>
                                <p className="text-xs opacity-70 leading-relaxed">Are you a restaurant or business? Access our bulk pricing and recurring delivery schedules.</p>
                                <button className="w-full bg-primary text-white py-3 rounded-full font-bold text-sm hover:bg-white hover:text-primary transition-all">
                                    Contact Wholesale
                                </button>
                            </div>
                        </aside>

                        {/* Marketplace Grid */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-primary/5 shadow-sm sticky top-24 z-20">
                                <Search className="text-primary/20 ml-2" />
                                <input
                                    type="text"
                                    placeholder="Search gardener listings, crop types, or farm sources..."
                                    className="flex-grow outline-none text-sm font-medium h-12"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="hidden md:flex gap-2">
                                    {["Fruits", "Vegetables", "Grains"].slice(0, 3).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedCategory(tag)}
                                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-cream/50 text-primary/40 hover:bg-secondary hover:text-primary transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                    <Loader2 className="animate-spin text-secondary" size={48} />
                                    <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">Syncing with Master Node...</p>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid md:grid-cols-3 gap-8">
                                    {filteredProducts.map((item) => (
                                        <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all group">
                                            <div className="relative h-48">
                                                <Image
                                                    src={item.images?.[0] || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2000"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                                    {item.farmSource || "Lagos, NG"}
                                                </div>
                                                <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                                    {item.category}
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <div className="h-20">
                                                    <h4 className="text-xl font-bold font-serif group-hover:text-secondary transition-colors line-clamp-1">{item.name}</h4>
                                                    <p className="text-xs text-primary/40 font-medium line-clamp-2 mt-2">{item.description}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xl font-bold text-primary">₦{parseFloat(item.price).toLocaleString()}</span>
                                                        <span className="text-[10px] text-primary/30 font-bold uppercase">Source Verified</span>
                                                    </div>
                                                    <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-lg">
                                                        <ShoppingCart size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 space-y-6 bg-white rounded-[4rem] border border-primary/5 shadow-inner">
                                    <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto text-primary/20">
                                        <Search size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold font-serif">No results found</h3>
                                        <p className="text-primary/40 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                                    </div>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                        className="text-secondary font-bold underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {/* Farmer Onboarding Banner */}
                            <div className="relative p-16 rounded-[4rem] bg-primary text-white overflow-hidden text-center md:text-left">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
                                <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                                    <div className="space-y-6">
                                        <h2 className="text-4xl font-bold font-serif leading-tight">Become a Registered <br />Kido Farms Farmer</h2>
                                        <p className="text-cream/60">Join over 450 farmers reaching thousands of customers directly. Take control of your harvest sales.</p>
                                        <Link href="/register/vendor" className="inline-block bg-secondary text-primary px-8 py-4 rounded-full font-bold hover:bg-white transition-all text-center">
                                            Apply Today
                                        </Link>
                                    </div>
                                    <div className="hidden md:flex justify-end">
                                        <div className="w-48 h-48 rounded-[3rem] border-4 border-secondary flex items-center justify-center text-secondary rotate-12">
                                            <Plus size={80} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
