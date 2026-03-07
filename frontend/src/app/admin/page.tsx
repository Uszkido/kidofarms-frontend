"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Map,
    ArrowUpRight,
    Clock,
    FileText,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

export default function AdminDashboard() {
    <button
        onClick={async () => {
            const res = await fetch(getApiUrl("/api/categories/init"), { method: "POST" });
            if (res.ok) alert("Categories Synced!");
            else alert("Sync Failed");
        }}
        className="absolute bottom-6 right-6 p-2 bg-blue-100 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
    >
        Sync Now
    </button>
                            </div >

                            <div className="group relative">
                                <Link href="/admin/blog" className="block">
                                    <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FileText size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Farm <span className="text-secondary italic">Blog</span></h3>
                                        <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Publish updates and community stories.</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={async () => {
                                        const res = await fetch(getApiUrl("/api/blog/init"), { method: "POST" });
                                        if (res.ok) alert("Blog Seeded!");
                                        else alert("Seed Failed");
                                    }}
                                    className="absolute bottom-6 right-6 p-2 bg-secondary/20 text-secondary rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Sync Now
                                </button>
                            </div>

                            <Link href="/admin/subscribers" className="group">
                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Users size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Network <span className="text-green-500 italic">Members</span></h3>
                                    <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Approve new farm basket subscribers.</p>
                                </div>
                            </Link>
                        </div >

        {/* Sidebar Info */ }
        < div className = "space-y-8" >
                            <div className="bg-primary p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-20" />
                                <h3 className="text-2xl font-black font-serif leading-tight">Farmer <br /><span className="text-secondary italic">Onboarding Hub</span></h3>
                                <p className="text-cream/40 text-sm font-medium leading-relaxed">
                                    There are <span className="text-white font-black underline decoration-secondary">14 pending</span> farmer applications awaiting verification and soil report review.
                                </p>
                                <button className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                    Review Applications
                                </button>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/20 flex items-center gap-2">
                                    <Map size={14} /> Logistics Network
                                </h4>
                                <div className="space-y-6">
                                    <div className="p-6 bg-neutral-50 rounded-2xl border border-primary/5">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-black text-sm uppercase tracking-widest">Kano Depot</p>
                                            <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                                            <div className="w-[85%] h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(190,160,78,0.5)]" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary/30 uppercase mt-4">85% Capacity Used</p>
                                    </div>
                                    <div className="p-6 bg-neutral-50 rounded-2xl border border-primary/5">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-black text-sm uppercase tracking-widest">Lagos Hub</p>
                                            <span className="text-[10px] font-black text-amber-500 uppercase">High Volume</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                                            <div className="w-[98%] h-full bg-primary rounded-full shadow-[0_0_10px_rgba(10,21,11,0.5)]" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary/30 uppercase mt-4">98% Capacity Used</p>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </main >
        </div >
    );
}
