"use client";

import { useState } from "react";
import {
    ShoppingBag,
    Search,
    Plus,
    Filter,
    ChevronRight,
    Box,
    TrendingUp,
    Warehouse,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const products = [
        { name: "Organic Honey Extract", stock: 124, price: "₦4,500", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80", status: "In Stock" },
        { name: "Dried Plantain Chips", stock: 56, price: "₦1,200", img: "https://images.unsplash.com/photo-1613511721526-78810e7b886c?auto=format&fit=crop&q=80", status: "Low Stock" },
        { name: "Cold Pressed Palm Oil", stock: 12, price: "₦8,900", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80", status: "Low Stock" },
        { name: "Premium White Yam", stock: 450, price: "₦2,500", img: "https://images.unsplash.com/photo-1608447714925-599deeb5a682?auto=format&fit=crop&q=80", status: "In Stock" },
        { name: "Spicy Red Pepper", stock: 89, price: "₦500", img: "https://images.unsplash.com/photo-1518994602218-4284b1259412?auto=format&fit=crop&q=80", status: "In Stock" }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black font-serif text-primary uppercase italic tracking-tighter">Inventory <span className="text-secondary tracking-tighter">Vault</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Managed Asset Ledger & Stock Nodes</p>
                </div>
                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder="Search Vault..."
                            className="w-full bg-white border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black text-[10px] uppercase tracking-widest pl-12 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                    </div>
                    <Link href="/dashboard/supplier/products/new" className="bg-primary text-white p-4 rounded-2xl shadow-xl hover:bg-secondary hover:text-primary transition-all">
                        <Plus size={24} />
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 px-4">
                {[
                    { label: "Total Assets", value: "852 Units", icon: Box, color: "bg-blue-500" },
                    { label: "Vault Value", value: "₦2.4M", icon: TrendingUp, color: "bg-green-500" },
                    { label: "Active Nodes", value: "12 Items", icon: Warehouse, color: "bg-secondary" },
                    { label: "Low Stock Alert", value: "3 Items", icon: Filter, color: "bg-red-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm group hover:shadow-xl transition-all">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-3xl font-black font-serif text-primary uppercase">{stat.value}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl overflow-hidden p-6 md:p-12 mx-4">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-primary/5 text-left text-[10px] font-black uppercase tracking-widest text-primary/20">
                                <th className="px-8 py-8">Product Identity</th>
                                <th className="px-8 py-8">Stock Level</th>
                                <th className="px-8 py-8">Unit Price</th>
                                <th className="px-8 py-8">Vault Status</th>
                                <th className="px-8 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {products.map((item, i) => (
                                <tr key={i} className="group hover:bg-cream/10 transition-colors">
                                    <td className="px-8 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                                                <img src={item.img} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-black text-2xl text-primary font-serif italic uppercase tracking-tighter">{item.name}</p>
                                                <p className="text-[9px] font-black text-primary/20 uppercase tracking-[0.2em] mt-2">Node Batch #{1000 + i}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-lg font-black font-serif italic text-primary">{item.stock} Units</span>
                                            <div className="w-32 h-1.5 bg-cream rounded-full overflow-hidden">
                                                <div className={`h-full ${item.stock < 100 ? 'bg-secondary' : 'bg-primary'} rounded-full`} style={{ width: `${Math.min(100, item.stock / 5)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-10">
                                        <p className="text-xl font-black font-serif text-primary italic font-sans">{item.price}</p>
                                    </td>
                                    <td className="px-8 py-10">
                                        <div className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-primary/5 shadow-sm">
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'In Stock' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-secondary animate-pulse'}`} />
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-10 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-secondary hover:text-primary transition-all shadow-sm">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-secondary hover:text-primary transition-all shadow-sm">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-3 bg-white rounded-xl border border-primary/5 hover:text-red-500 transition-all shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <button className="group-hover:hidden p-3 text-primary/20">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
