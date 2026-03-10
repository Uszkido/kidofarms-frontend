"use client";
import { useState, useEffect } from "react";
import {
    Users,
    Truck,
    Briefcase,
    Search,
    ArrowLeft,
    Loader2,
    ShoppingCart,
    TrendingUp,
    ShieldCheck,
    MapPin,
    Package
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function MarketBuyersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await fetch(getApiUrl("/api/users"));
            const data = await res.json();
            if (res.ok) {
                // Filter for market-specific roles
                const marketRoles = ["wholesale_buyer", "retailer", "distributor"];
                setUsers(data.filter((u: any) => marketRoles.includes(u.role)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => {
        const matchesRole = filter === "all" || u.role === filter;
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3] px-6 py-24">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary transition-all mb-4">
                            <ArrowLeft size={14} /> Back to Hub
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">Market <span className="text-secondary italic">& Buyers</span></h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Scale the Kido distribution network through certified off-takers.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search partners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-white outline-none backdrop-blur-md focus:ring-2 focus:ring-secondary/30 transition-all"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none backdrop-blur-md cursor-pointer appearance-none"
                        >
                            <option value="all" className="bg-[#161B22]">All Partners</option>
                            <option value="wholesale_buyer" className="bg-[#161B22]">Wholesale</option>
                            <option value="retailer" className="bg-[#161B22]">Retailers</option>
                            <option value="distributor" className="bg-[#161B22]">Distributors</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-secondary" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="bg-white/5 p-10 rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-md hover:border-secondary/20 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white group-hover:scale-110 transition-transform">
                                    {user.role === 'distributor' ? <Truck size={120} /> : <Briefcase size={120} />}
                                </div>

                                <div className="mb-8 flex justify-between items-start relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${user.role === 'distributor' ? 'bg-blue-500/10 text-blue-400' :
                                        user.role === 'wholesale_buyer' ? 'bg-purple-500/10 text-purple-400' :
                                            'bg-orange-500/10 text-orange-400'
                                        }`}>
                                        {user.role === 'distributor' ? <Truck size={28} /> :
                                            user.role === 'wholesale_buyer' ? <Package size={28} /> :
                                                <ShoppingCart size={28} />}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/5">
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-black font-serif text-white truncate">{user.name}</h3>
                                        <p className="text-xs font-bold text-white/20 mt-1">{user.email}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase text-white/20">Market Status</p>
                                            <p className="text-xs font-bold flex items-center gap-1 text-green-400">
                                                <ShieldCheck size={12} /> Active Node
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[8px] font-black uppercase text-white/20">Orders</p>
                                            <p className="text-xs font-bold text-white/60">0 Volume</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <Link href={`/admin/users?search=${user.email}`} className="flex-grow bg-secondary text-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                            Manage Profile
                                        </Link>
                                        <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/60">
                                            <TrendingUp size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="col-span-full py-32 bg-white/5 rounded-[4rem] border border-white/5 text-center flex flex-col items-center justify-center gap-6 backdrop-blur-md">
                                <Users size={64} className="text-white/10" />
                                <div>
                                    <h4 className="text-2xl font-black font-serif text-white">No Partners Found</h4>
                                    <p className="text-white/20 font-medium">Add new distributors or wholesale buyers in the User Management section.</p>
                                </div>
                                <Link href="/admin/users" className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                    Open User Center
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}
