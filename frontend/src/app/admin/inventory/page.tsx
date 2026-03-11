"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Package,
    Plus,
    Search,
    Filter,
    ArrowLeft,
    Loader2,
    Trash2,
    Edit3,
    AlertTriangle,
    Database,
    Boxes,
    ShoppingCart
} from "lucide-react";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/products"));
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm asset decomposition? This cannot be undone.")) return;
        try {
            const res = await fetch(getApiUrl(`/api/products/${id}`), { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            alert("Decomposition failed.");
        }
    };

    const filteredProducts = products.filter(p =>
        (p?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p?.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p?.trackingId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Asset Infrastructure</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Supply <span className="text-secondary block">Manifest</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search manifests by ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <Link href="/admin/inventory/new" className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                            <Plus size={18} /> New manifest Entry
                        </Link>
                    </div>
                </header>

                {/* 📊 INVENTORY TABLE */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Supply Nodes...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Asset Definition</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Protocol ID</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Node Source</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Liquidity (Price)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden shrink-0 group-hover:border-secondary/20 transition-all">
                                                        {product.images?.[0] ? (
                                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/10"><Boxes size={32} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-2">{product.name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40">{product.category}</span>
                                                            <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-secondary' : 'text-red-500'}`}>
                                                                {product.stock} {product.unit} Available
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex justify-center">
                                                    <span className="font-mono text-xs font-bold text-white/20 group-hover:text-secondary transition-colors">
                                                        {product.trackingId || 'UNTRACKED-NODE'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <p className="text-sm font-black text-white/60 uppercase tracking-widest">{product.farmSource || 'Direct Network'}</p>
                                                <p className="text-[10px] font-bold text-white/20 mt-1 italic">Authorized Producer</p>
                                            </td>
                                            <td className="px-12 py-10">
                                                <p className="text-3xl font-black font-serif italic text-white leading-none">₦{(Number(product.price)).toLocaleString()}</p>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-primary rounded-2xl transition-all shadow-xl"
                                                        title="Decompose Asset"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                    <Link
                                                        href={`/admin/inventory/${product.id}/edit`}
                                                        className="p-4 bg-white/5 text-white/60 hover:bg-white hover:text-primary rounded-2xl transition-all shadow-xl"
                                                        title="Edit Manifest"
                                                    >
                                                        <Edit3 size={20} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 📊 FOOTER STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl flex items-center justify-between group">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Total Assets</h4>
                            <p className="text-5xl font-black font-serif italic text-white">{products.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                            <Package size={32} />
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl flex items-center justify-between group">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Active Orders</h4>
                            <p className="text-5xl font-black font-serif italic text-secondary">42</p>
                        </div>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:bg-white group-hover:text-primary transition-all">
                            <ShoppingCart size={32} />
                        </div>
                    </div>
                    <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group flex flex-col justify-center">
                        <Database className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
                        <h3 className="text-3xl font-black font-serif italic uppercase leading-none mb-2">Manifest <br /> Verified</h3>
                        <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest">Global Ledger Synced</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
