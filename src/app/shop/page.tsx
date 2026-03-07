import Link from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Filter, Search as SearchIcon, ArrowUpDown } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Fruits", "Vegetables", "Grains", "Catfish"];

const dummyProducts = [
    { id: 1, name: "Organic Gala Apples", price: 12.99, category: "Fruits", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=1974&auto=format&fit=crop", rating: 4.8 },
    { id: 2, name: "Fresh African Catfish", price: 24.50, category: "Catfish", image: "https://images.unsplash.com/photo-1555074213-911855e4be62?q=80&w=2070&auto=format&fit=crop", rating: 4.9 },
    { id: 3, name: "Premium Brown Rice", price: 18.00, category: "Grains", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop", rating: 4.7 },
    { id: 4, name: "Organic Spinach", price: 5.99, category: "Vegetables", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2070&auto=format&fit=crop", rating: 4.5 },
    { id: 5, name: "Local White Corn", price: 8.50, category: "Grains", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2070&auto=format&fit=crop", rating: 4.6 },
    { id: 6, name: "Sun-ripened Oranges", price: 10.99, category: "Fruits", image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1965&auto=format&fit=crop", rating: 4.8 },
];

export default function ShopPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/30">
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
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded border border-primary/20 flex items-center justify-center group-hover:border-secondary transition-colors">
                                                <div className="w-2.5 h-2.5 rounded-sm bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors text-primary/70">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold font-serif">Price Range</h3>
                                <div className="space-y-4">
                                    <input type="range" className="w-full accent-secondary" min="0" max="100" />
                                    <div className="flex justify-between text-xs font-bold text-primary/60 uppercase tracking-wider">
                                        <span>$0</span>
                                        <span>$100+</span>
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
                                {dummyProducts.map((prod) => (
                                    <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden border border-primary/5 hover:shadow-2xl transition-all h-full flex flex-col">
                                        <div className="relative h-72 overflow-hidden">
                                            <Image
                                                src={prod.image}
                                                alt={prod.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase text-primary">
                                                    {prod.category}
                                                </span>
                                            </div>
                                            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary/40 hover:text-red-500 transition-colors">
                                                <Filter size={18} className="rotate-45" /> {/* Heart icon replacement for now */}
                                            </button>
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
                                                <span className="text-2xl font-bold text-primary">${prod.price}</span>
                                                <button className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-secondary hover:text-primary transition-all">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
