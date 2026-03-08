"use client";


import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, ShoppingBag, TrendingUp, Users, Plus, Star, MapPin, Bell } from "lucide-react";
import Link from "next/link";

export default function VendorDashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Farm Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center text-secondary border-4 border-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                    <span className="text-4xl font-black relative z-10">KV</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-black font-serif">Kano Valley <span className="text-secondary italic">Organics</span></h1>
                                        <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-secondary/20">Verified Farm</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                        <div className="flex items-center gap-1"><MapPin size={12} className="text-secondary" /> Kano State, NG</div>
                                        <div className="flex items-center gap-1 text-yellow-600"><Star size={12} className="fill-yellow-600" /> 4.9 Rating</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none border-2 border-primary/5 px-8 py-4 rounded-2xl font-black text-sm hover:bg-cream transition-all flex items-center justify-center gap-3">
                                    Edit Farm Profile
                                </button>
                                <Link href="/admin/inventory/new" className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                    <Plus size={18} /> List New Product
                                </Link>
                            </div>
                        </div>

                        {/* Vendor Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Monthly Revenue", value: "₦1.2M", icon: TrendingUp, color: "bg-green-50 text-green-600" },
                                { label: "Active Listings", value: "18", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
                                { label: "Customer Reach", value: "450+", icon: Users, color: "bg-secondary/20 text-secondary" },
                                { label: "Notifications", value: "3 New", icon: Bell, color: "bg-red-50 text-red-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <stat.icon size={48} />
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Inventory Management Mini-Table */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <h2 className="text-3xl font-black font-serif">Active <span className="text-secondary italic">Live Inventory</span></h2>
                                    <button className="text-xs font-black uppercase tracking-widest text-secondary hover:underline">Manage All</button>
                                </div>
                                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden p-8">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-primary/5 uppercase text-[10px] font-black tracking-widest text-primary/20">
                                                <th className="text-left py-6 px-4">Product Name</th>
                                                <th className="text-left py-6">Status</th>
                                                <th className="text-left py-6">Stock</th>
                                                <th className="text-right py-6 px-4">Total Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {[
                                                { name: "Organic Bulbous Onions", status: "Live", stock: "120 kg", sales: "₦85,000" },
                                                { name: "Sweet Yellow Maize", status: "Live", stock: "45 Bags", sales: "₦320,000" },
                                                { name: "Red Chili Peppers", status: "Low Stock", sales: "₦42,000" },
                                            ].map((item, i) => (
                                                <tr key={i} className="group hover:bg-cream/20 transition-colors">
                                                    <td className="py-6 px-4 font-bold text-sm tracking-tight group-hover:text-secondary transition-colors underline underline-offset-4 decoration-transparent group-hover:decoration-secondary">
                                                        {item.name}
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Live' ? 'text-green-500' : 'text-orange-500'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 font-mono text-xs">{item.stock || "---"}</td>
                                                    <td className="py-6 px-4 text-right font-black text-sm">{item.sales}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Sales Activity Sidebar */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black font-serif px-4">Recent <span className="text-secondary italic">Sales</span></h2>
                                <div className="bg-primary rounded-[3rem] p-10 space-y-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
                                    <div className="space-y-6 relative z-10">
                                        {[1, 2, 3].map((sale) => (
                                            <div key={sale} className="flex gap-4 items-center group cursor-pointer">
                                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black group-hover:bg-secondary group-hover:text-primary transition-all">
                                                    {sale === 1 ? "JH" : sale === 2 ? "MK" : "AO"}
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-xs font-black uppercase tracking-widest text-secondary group-hover:text-white transition-colors">Order #293{sale}</p>
                                                    <p className="font-bold text-sm">₦14,500 <span className="text-white/30 text-[10px] font-medium tracking-normal ml-2">2 min ago</span></p>
                                                </div>
                                                <ShoppingBag size={18} className="text-white/20 group-hover:text-secondary" />
                                            </div>
                                        ))}
                                        <button className="w-full bg-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">View All Sales Records</button>
                                    </div>
                                </div>
                                <div className="bg-secondary p-1 rounded-[2rem] shadow-xl">
                                    <div className="bg-white rounded-[1.8rem] p-8 space-y-4">
                                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-primary/30">Your Vendor Balance</p>
                                        <h3 className="text-5xl font-black font-serif text-center">₦840,200</h3>
                                        <button className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all">Request Payout</button>
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

