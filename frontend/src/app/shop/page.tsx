"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Filter, Search as SearchIcon, ArrowUpDown, Loader2, ShoppingBag, Eye, Star, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getApiUrl } from "@/lib/api";

export default function ShopPage() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
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
                const url = selectedCategory === "All"
                    ? getApiUrl("/api/products")
                    : getApiUrl(`/api/products?category=${selectedCategory}`);
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
    }, [selectedCategory]);
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:row justify-between items-start md:items-end mb-12 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold font-serif">The Shop</h1>
                            <p className="text-primary/60">Browse our seasonal harvest and artisanal products.</p>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 rounded-full border border-primary/10 glass focus:ring-1 focus:ring-secondary outline-none text-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/10 text-sm font-bold hover:bg-white transition-all">
                                <Filter size={18} /> Filters
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/10 text-sm font-bold hover:bg-white transition-all">
                                <ArrowUpDown size={18} /> Sort
                            </button>
                        </div>
                    </div>

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
                                                <Image
                                                    src={prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"}
                                                    alt={prod.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase text-primary">
                                                        {prod.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold font-serif group-hover:text-secondary transition-colors">{prod.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-1 mb-4 text-secondary">
                                                    <span className="text-xs font-bold">★</span>
                                                    <span className="text-xs font-bold text-primary/60">{prod.rating}</span>
                                                </div>
                                                <div className="mt-auto pt-6 flex justify-between items-center border-t border-primary/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-bold text-primary">₦{Number(prod.price).toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-primary/30 uppercase">per {prod.unit}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart({
                                                            id: prod.id,
                                                            name: prod.name,
                                                            price: Number(prod.price),
                                                            image: prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
                                                            quantity: 1,
                                                            category: prod.category
                                                        })}
                                                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-secondary hover:text-primary transition-all"
                                                    >
                                                        Add to Cart
                                                    </button>
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
        </div>
    );
}
