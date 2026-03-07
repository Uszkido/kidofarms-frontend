import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { Plus, LayoutDashboard, ShoppingCart, Users, Package, TrendingUp, Search } from "lucide-react";

export default function MarketplacePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold font-serif">Kido Farms <span className="text-secondary italic">Marketplace</span></h1>
                            <p className="text-primary/60">The digital bridge between local community farmers and conscious consumers.</p>
                        </div>
                        <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-lg">
                            <Plus size={20} /> List New Product
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Stats */}
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary/40">Market Statistics</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold font-serif">1,240</p>
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
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold font-serif">450+</p>
                                                <p className="text-xs text-primary/40">Registered Farmers</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-primary/5 space-y-4">
                                    <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary/40">Top Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Fruits", "Organic Grains", "Fresh Fish", "Tubers"].map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-primary/70 border border-primary/5">{tag}</span>
                                        ))}
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
                            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-primary/5 shadow-sm">
                                <Search className="text-primary/20" />
                                <input
                                    type="text"
                                    placeholder="Search farmer listings..."
                                    className="flex-grow outline-none text-sm font-medium"
                                />
                                <button className="bg-cream px-6 py-2 rounded-2xl text-xs font-bold text-primary hover:bg-secondary transition-all">Filters</button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Bulk Maize (50kg)", price: "₦15,000", farmer: "Abubakar H.", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2000&auto=format&fit=crop", origin: "Kano State" },
                                    { name: "Yams (Large Basket)", price: "₦8,500", farmer: "Grace O.", image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2000&auto=format&fit=crop", origin: "Benue State" },
                                    { name: "Fresh Peppers (Basket)", price: "₦4,200", farmer: "Musa J.", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?q=80&w=2000&auto=format&fit=crop", origin: "Kaduna State" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all group">
                                        <div className="relative h-48">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                                {item.origin}
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <div>
                                                <h4 className="text-xl font-bold font-serif group-hover:text-secondary transition-colors">{item.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-5 h-5 rounded-full bg-cream inline-flex items-center justify-center text-[8px] font-bold">👤</div>
                                                    <span className="text-xs text-primary/40 font-medium">Sold by {item.farmer}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                                                <span className="text-xl font-bold text-primary">{item.price}</span>
                                                <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                                    <ShoppingCart size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Farmer Onboarding Banner */}
                            <div className="relative p-16 rounded-[4rem] bg-primary text-white overflow-hidden text-center md:text-left">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
                                <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                                    <div className="space-y-6">
                                        <h2 className="text-4xl font-bold font-serif leading-tight">Become a Registered <br />Kido Farms Farmer</h2>
                                        <p className="text-cream/60">Join over 450 farmers reaching thousands of customers directly. Take control of your harvest sales.</p>
                                        <button className="bg-secondary text-primary px-8 py-4 rounded-full font-bold hover:bg-white transition-all">
                                            Apply Today
                                        </button>
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
