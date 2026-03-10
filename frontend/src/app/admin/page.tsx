"use client";

import { useState, useEffect } from "react";
import {
    Users,
    ShoppingCart,
    Activity,
    ArrowRight,
    Globe,
    ImagePlus,
    Loader2,
    TrendingUp,
    Warehouse,
    ShieldCheck,
    Briefcase,
    Building2
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(getApiUrl("/api/admin/stats"));
                if (res.ok) setStats(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#06120e] text-[#E6EDF3] p-6 lg:p-10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <h1 className="text-6xl font-black font-serif uppercase tracking-tighter text-white leading-none">
                            Network <span className="text-secondary italic">Command</span>
                        </h1>
                        <p className="text-white/40 font-bold text-sm tracking-widest uppercase mt-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            Core Systems Online • Kano North Hub Active
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black shadow-xl">
                            {session?.user?.name?.[0]}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-white font-bold text-sm">{session?.user?.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Chief Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* User Registry Card */}
                    <div className="group relative bg-white/5 p-10 rounded-[4rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl hover:border-secondary/20 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[60px] opacity-10 -translate-y-16 translate-x-16" />
                        <div className="relative space-y-6">
                            <div className="w-16 h-16 bg-[#1a3c34] rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif text-white uppercase italic">Citizen <br /><span className="text-secondary">Registry</span></h3>
                                <p className="text-white/30 text-xs font-medium mt-4 leading-relaxed">Manage user identities, verify accounts, and assign node access across the network.</p>
                            </div>
                            <Link href="/admin/users" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-6 transition-all">
                                Open Registry <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Team & Task Card */}
                    <div className="group relative bg-white/5 p-10 rounded-[4rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl hover:border-secondary/20 transition-all">
                        <div className="relative space-y-6">
                            <div className="w-16 h-16 bg-[#1a3c34] rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:scale-110 transition-transform">
                                <Briefcase size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif text-white uppercase italic">Node <br /><span className="text-secondary">Workflows</span></h3>
                                <p className="text-white/30 text-xs font-medium mt-4 leading-relaxed">Assign tasks to team members, monitor node productivity, and manage the internal roster.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/admin/team" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary transition-all">
                                    Roster
                                </Link>
                                <span className="text-white/10">|</span>
                                <Link href="/admin/tasks" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-6 transition-all">
                                    Deploy Tasks <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Horizon Stories Card */}
                    <div className="group relative bg-[#1a3c34] p-10 rounded-[4rem] overflow-hidden shadow-2xl border-4 border-secondary/10 hover:border-secondary/30 transition-all">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="relative space-y-6">
                            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
                                <ImagePlus size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif text-white uppercase italic">Horizon <br /><span className="text-secondary">Broadcast</span></h3>
                                <p className="text-white/60 text-xs font-medium mt-4 leading-relaxed">Stream live visual updates from the farm network to the global marketplace feed.</p>
                            </div>
                            <Link href="/admin/stories" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-6 transition-all">
                                Start Broadcast <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Global Bridge Card */}
                    <div className="group relative bg-white/5 p-10 rounded-[4rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl hover:border-secondary/20 transition-all">
                        <div className="relative space-y-6">
                            <div className="w-16 h-16 bg-[#1a3c34] rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:scale-110 transition-transform">
                                <Globe size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif text-white uppercase italic">Global <br /><span className="text-secondary">Bridge</span></h3>
                                <p className="text-white/30 text-xs font-medium mt-4 leading-relaxed">Oversee international exports, manage certifications, and track trans-border logistics.</p>
                            </div>
                            <Link href="/admin/horizon" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-6 transition-all">
                                Open Bridge <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* B2B / Hotels Card */}
                    <div className="group relative bg-white/5 p-10 rounded-[4rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl hover:border-secondary/20 transition-all">
                        <div className="relative space-y-6">
                            <div className="w-16 h-16 bg-[#1a3c34] rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:scale-110 transition-transform">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif text-white uppercase italic">B2B <br /><span className="text-secondary">Partnerships</span></h3>
                                <p className="text-white/30 text-xs font-medium mt-4 leading-relaxed">Manage corporate accounts, hotel procurement contracts, and bulk credit lines.</p>
                            </div>
                            <Link href="/dashboard/business" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-6 transition-all">
                                Protocol B2B <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Real-time Stats */}
                <div className="mt-20 grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 bg-white/5 rounded-[4rem] p-12 border border-white/5 backdrop-blur-md shadow-2xl space-y-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black font-serif uppercase tracking-tight text-white">Network <span className="text-secondary italic">Health</span></h2>
                            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-secondary underline underline-offset-8 transition-colors">View Detailed Analytics</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Total Revenue", value: "₦142.8M", change: "+14%", icon: TrendingUp, color: "text-green-400" },
                                { label: "Active Nodes", value: "1,204", change: "+8%", icon: Activity, color: "text-blue-400" },
                                { label: "Pending Orders", value: "84", change: "-2%", icon: ShoppingCart, color: "text-yellow-400" },
                                { label: "Trust Index", value: "98.2%", change: "+0.4%", icon: ShieldCheck, color: "text-secondary" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                                    <h4 className="text-3xl font-black font-serif text-white">{s.value}</h4>
                                    <p className={`text-[10px] font-bold ${s.color}`}>{s.change} <span className="text-white/10 ml-1">vs last month</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-secondary rounded-[4rem] p-12 text-primary shadow-2xl relative overflow-hidden group hover:rotate-1 transition-transform">
                        <Warehouse className="absolute -bottom-10 -right-10 text-primary/5 w-64 h-64 -rotate-12" />
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Supply <br />Node Beta</h3>
                            <p className="text-primary/60 text-xs font-medium leading-relaxed uppercase tracking-widest">You have <span className="font-black text-primary">12 inventory alerts</span> from the central warehouse. Direct bulk transfers are active.</p>
                            <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">Audit Inventory</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
