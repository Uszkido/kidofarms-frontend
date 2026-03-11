"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    Globe,
    Zap,
    GraduationCap,
    TrendingUp,
    MapPin,
    Activity,
    Sparkles,
    ShieldAlert,
    RefreshCw,
    Droplets,
    Building2,
    Search,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function HorizonPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sub = searchParams.get('sub') || 'shield';

    const tabs = [
        { id: 'shield', label: 'Yield-Shield', icon: ShieldCheck },
        { id: 'bridge', label: 'Global Bridge', icon: Globe },
        { id: 'energy', label: 'Sovereign Energy', icon: Zap },
        { id: 'academy', label: 'Mastery Academy', icon: GraduationCap },
        { id: 'oracle', label: 'Price Oracle', icon: TrendingUp },
        { id: 'logistics', label: 'Logistics Node', icon: MapPin },
    ];

    const setTab = (id: string) => {
        router.push(`/dashboard/supplier/horizon?sub=${id}`);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black font-serif text-primary uppercase italic tracking-tighter">Horizon <span className="text-secondary tracking-tighter">5.0</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">The Sovereign Food Infrastructure</p>
                </div>
                <div className="flex bg-white p-2 rounded-[2.5rem] border border-primary/5 shadow-xl overflow-x-auto no-scrollbar scroll-smooth">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTab(tab.id)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2 ${sub === tab.id ? 'bg-primary text-white shadow-lg' : 'text-primary/30 hover:bg-neutral-50'}`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-primary/5 shadow-2xl relative overflow-hidden min-h-[600px]">
                {sub === 'shield' && (
                    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <ShieldCheck size={14} /> Active Node Protection
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black font-serif text-primary tracking-tighter leading-none italic uppercase">Yield <br /><span className="text-secondary underline decoration-4 underline-offset-8">Shield</span></h3>
                            <p className="text-primary/40 text-sm font-medium leading-relaxed max-w-sm">Your farm is protected by sovereign parametric micro-insurance. If local IoT sensors detect climate anomalies, your survival credits are released automatically.</p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="p-8 bg-neutral-50 rounded-[3rem] border border-primary/5 shadow-inner">
                                    <p className="text-[8px] font-black uppercase text-primary/30 mb-2">Climate Risk</p>
                                    <p className="text-4xl font-black font-serif text-primary italic">12.4%</p>
                                </div>
                                <div className="p-8 bg-neutral-50 rounded-[3rem] border border-primary/5 shadow-inner">
                                    <p className="text-[8px] font-black uppercase text-primary/30 mb-2">Active Coverage</p>
                                    <p className="text-4xl font-black font-serif text-primary italic">₦5.0M</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 text-white flex flex-col justify-between relative overflow-hidden group">
                            <Globe className="absolute -top-10 -right-10 w-64 h-64 text-white/5 opacity-40 group-hover:rotate-180 transition-transform duration-[10000ms]" />
                            <div className="space-y-8 relative z-10">
                                <h4 className="text-2xl font-black font-serif italic uppercase tracking-tighter">Satellite Lock <br /><span className="text-secondary">Sentinel-2 Analytica</span></h4>
                                <div className="aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center backdrop-blur-md">
                                    <div className="text-center">
                                        <Activity className="mx-auto text-secondary mb-3 animate-pulse" size={40} />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Spectral Map: Sector 4A Online</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => alert("Satellite Integrity Report #Sentinel-2-A81 has been generated and sent to your secure node archive.")} className="bg-secondary text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl mt-8">
                                Download Integrity Report
                            </button>
                        </div>
                    </div>
                )}

                {sub === 'bridge' && (
                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        <div className="md:col-span-2 space-y-8">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Globe size={14} /> Export Protocol Active
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black font-serif text-primary tracking-tighter leading-none italic uppercase">Global <br /><span className="text-secondary italic underline decoration-4 underline-offset-8">Bridge</span></h3>
                            <div className="bg-neutral-50 p-8 rounded-[3rem] border border-primary/5 space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-primary/5 group hover:border-secondary transition-all">
                                    <div className="flex gap-4 items-center">
                                        <Building2 className="text-secondary" />
                                        <div>
                                            <p className="font-black text-sm uppercase">EU Organic Audit</p>
                                            <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">Phytosanitary ID: #9028</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Verified</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-primary/5 opacity-50">
                                    <div className="flex gap-4 items-center">
                                        <Globe className="text-primary/20" />
                                        <div>
                                            <p className="font-black text-sm uppercase">US FDA Compliance</p>
                                            <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">Documentation Pending</p>
                                        </div>
                                    </div>
                                    <RefreshCw className="text-primary/20 animate-spin" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-secondary rounded-[3rem] p-10 flex flex-col justify-between shadow-xl">
                            <h4 className="text-2xl font-black font-serif italic text-primary uppercase tracking-tighter">Active Routes</h4>
                            <div className="space-y-6">
                                {['Lagos Node -> London Hub', 'Kano Node -> Dubai Fresh', 'Jos Node -> NYC Bio'].map((route, i) => (
                                    <div key={route} className="flex items-center gap-4 text-[10px] font-black uppercase text-primary/60 border-b border-primary/5 pb-4 last:border-0 group cursor-pointer hover:translate-x-2 transition-transform">
                                        <div className="w-2 h-2 rounded-full bg-primary" /> {route}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => alert("Global Bridge Export Application #GB-REG-2026 has been initiated. Awaiting EU Phytosanitary node verification.")}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-white hover:text-primary transition-all shadow-2xl"
                            >
                                Apply for Export
                            </button>
                        </div>
                    </div>
                )}

                {sub === 'energy' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-primary/5 pb-12">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-black font-serif text-primary italic uppercase tracking-tighter leading-none">Sovereign <br /><span className="text-secondary italic underline decoration-4 underline-offset-8">Energy Node</span></h3>
                                <p className="text-primary/40 mt-4 text-sm font-medium">Trade your waste-to-wealth credits for next-gen farm tech.</p>
                            </div>
                            <div className="text-right p-8 bg-neutral-50 rounded-[3rem] border border-primary/5 shadow-inner">
                                <p className="text-[10px] font-black uppercase text-primary/30 mb-2">Accumulated Waste Credits</p>
                                <p className="text-5xl font-black font-serif text-secondary italic">4,280 <span className="text-lg">Credits</span></p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: 'Solar Kit v2', cost: 1200, icon: Zap, img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80' },
                                { name: 'Biogas Unit', cost: 2500, icon: RefreshCw, img: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80' },
                                { name: 'Eco-Irrigation', cost: 800, icon: Droplets, img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80' }
                            ].map(item => (
                                <div key={item.name} className="group bg-neutral-50 rounded-[3.5rem] overflow-hidden border border-primary/5 hover:border-secondary transition-all shadow-xl">
                                    <div className="h-48 relative">
                                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase text-primary border border-primary/5 shadow-xl">
                                            {item.cost} Credits
                                        </div>
                                    </div>
                                    <div className="p-10 space-y-6">
                                        <h4 className="font-black font-serif text-2xl uppercase tracking-tighter">{item.name}</h4>
                                        <button
                                            onClick={() => alert(`Node Redempton Initiated: ${item.name}. ${item.cost} credits will be deducted from your Sovereign Energy balance.`)}
                                            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-secondary hover:text-primary transition-all shadow-xl"
                                        >
                                            Redeem Credit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {sub === 'academy' && (
                    <div className="grid md:grid-cols-12 gap-12 animate-in fade-in duration-500">
                        <div className="md:col-span-4 space-y-10 border-r border-primary/5 pr-12">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-secondary flex items-center justify-center text-primary shadow-2xl relative group cursor-pointer overflow-hidden">
                                <GraduationCap size={48} className="group-hover:scale-110 transition-transform" />
                                <div className="absolute -bottom-2 -right-2 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-black border-4 border-white shadow-xl">
                                    4
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black font-serif text-primary italic uppercase tracking-tighter leading-none">Mastery <br /><span className="text-secondary">Level 4</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-3">Rank: Elite Specialist Specialist</p>
                            </div>
                            <div className="space-y-6 pt-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Active Achievements</p>
                                <div className="flex gap-4">
                                    {[Sparkles, ShieldCheck, MapPin].map((Icon, i) => (
                                        <div key={i} className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-secondary border border-primary/5 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                                            <Icon size={24} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-8 space-y-10">
                            <div className="flex justify-between items-center px-4">
                                <h4 className="text-2xl font-black font-serif italic text-primary uppercase tracking-tighter underline underline-offset-8 decoration-primary/10">Skill Modules</h4>
                                <span className="text-[10px] font-black uppercase text-secondary bg-secondary/5 px-4 py-2 rounded-full">2,400 XP to Level 5</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { title: "Climate-Smart Irrigation", progress: 85, status: "Advanced" },
                                    { title: "Sovereign Supply Management", progress: 40, status: "Intermediate" },
                                    { title: "Export Quality Compliance", progress: 100, status: "Mastered" }
                                ].map(skill => (
                                    <div
                                        key={skill.title}
                                        className="bg-neutral-50 p-8 rounded-[3rem] border border-primary/5 space-y-6 group hover:border-secondary transition-all cursor-pointer shadow-sm hover:shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center text-sm font-black uppercase">
                                            <p className="flex items-center gap-4 text-primary font-serif italic text-lg tracking-tighter"> <Sparkles size={18} className="text-secondary" /> {skill.title}</p>
                                            <span className="text-secondary font-black italic text-[10px]">{skill.status}</span>
                                        </div>
                                        <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5">
                                            <div className="h-full bg-secondary rounded-full transition-all duration-[2000ms] shadow-inner" style={{ width: `${skill.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {sub === 'oracle' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-primary/5 pb-12">
                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-5xl font-black font-serif text-primary italic uppercase tracking-tighter leading-none">Kido <span className="text-secondary italic">Price Oracle</span></h3>
                                <p className="text-primary/40 text-sm font-medium">Neural market predictions for next-cycle harvests.</p>
                            </div>
                            <div className="bg-primary/5 px-10 py-6 rounded-[3rem] border border-primary/5 shadow-inner">
                                <p className="text-[10px] font-black uppercase text-secondary mb-2">Oracle Trust Index</p>
                                <p className="text-4xl font-black font-serif text-primary italic">98.4%</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { crop: 'Maize (Yellow)', current: '₦450/kg', predicted: '₦520/kg', trend: 'up' },
                                { crop: 'Onions (Red)', current: '₦320/kg', predicted: '₦280/kg', trend: 'down' },
                                { crop: 'Rice (Short)', current: '₦650/kg', predicted: '₦690/kg', trend: 'up' }
                            ].map(item => (
                                <div key={item.crop} className="bg-neutral-50 p-10 rounded-[3.5rem] border border-primary/5 space-y-8 group hover:border-secondary transition-all shadow-xl">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-black font-serif text-2xl uppercase tracking-tighter">{item.crop}</h4>
                                        {item.trend === 'up' ? <TrendingUp className="text-green-500 bg-green-50 p-2 rounded-xl" size={32} /> : <TrendingUp className="text-red-500 bg-red-50 p-2 rounded-xl rotate-180" size={32} />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-[2rem] shadow-inner border border-primary/5">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-primary/20 mb-2 font-sans tracking-widest">Current</p>
                                            <p className="text-2xl font-black font-serif text-primary italic">{item.current}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-secondary/30 mb-2 font-sans tracking-widest">Predicted</p>
                                            <p className="text-2xl font-black font-serif text-secondary italic underline decoration-secondary/30">{item.predicted}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-primary text-white p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                            <Zap className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 opacity-40 group-hover:rotate-12 transition-transform duration-[5000ms]" />
                            <div className="space-y-6 relative z-10">
                                <h4 className="text-4xl font-black font-serif italic text-secondary uppercase tracking-tighter">Neural Insight</h4>
                                <p className="text-white/40 text-lg font-medium leading-relaxed max-w-2xl italic">"Localized supply shortages in Plateau district indicate a potential price spike for Grains in Q3. Recommendation: Optimize storage Node for late-release."</p>
                            </div>
                            <button onClick={() => alert("Neural Price Feed Synchronized. Real-time arbitrage nodes are now active for the current harvest cycle.")} className="bg-white text-primary px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shrink-0 hover:bg-secondary transition-all relative z-10">Connect Price Feed</button>
                        </div>
                    </div>
                )}

                {sub === 'logistics' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4 border-b border-primary/5 pb-10">
                            <h3 className="text-4xl md:text-5xl font-black font-serif text-primary italic uppercase tracking-tighter">Last-Mile <br /><span className="text-secondary italic underline decoration-4 underline-offset-8">Logistics Node</span></h3>
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shadow-xl">
                                <MapPin size={40} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="bg-neutral-50 p-12 rounded-[4rem] border border-primary/5 space-y-10 shadow-xl">
                                <h4 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">Active Shipments</h4>
                                <div className="space-y-6">
                                    {[
                                        { id: '#NODE-LGS-42', dest: 'Lagos Main Hub', status: 'In Transit', progress: 65 },
                                        { id: '#NODE-PH-09', dest: 'P/Harcourt Node', status: 'Pending Pickup', progress: 5 }
                                    ].map(shipment => (
                                        <div key={shipment.id} className="space-y-4 bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm group hover:border-secondary transition-all">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                                <p className="text-primary font-bold">{shipment.dest}</p>
                                                <span className="text-secondary italic">{shipment.status}</span>
                                            </div>
                                            <div className="h-3 w-full bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5">
                                                <div className="h-full bg-secondary rounded-full shadow-inner" style={{ width: `${shipment.progress}%` }} />
                                            </div>
                                            <div className="flex justify-between text-[8px] font-black uppercase text-primary/20">
                                                <span>ID: {shipment.id}</span>
                                                <span>{shipment.progress}% Complete</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => alert("Global Logistics Node dispatch protocol initiated. Carrier 'Sovereign-Express-01' is now routing to your farm node.")}
                                    className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl"
                                >
                                    Book Global Shipment
                                </button>
                            </div>
                            <div className="bg-primary/5 rounded-[4rem] border border-primary/5 p-12 flex flex-col items-center justify-center space-y-10 text-center relative overflow-hidden group">
                                <Globe className="text-secondary/10 absolute inset-0 w-full h-full p-10 group-hover:rotate-180 transition-transform duration-[20000ms]" />
                                <div className="space-y-6 relative z-10">
                                    <Globe className="text-secondary mx-auto animate-spin-slow" size={80} />
                                    <div>
                                        <h4 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Track Node</h4>
                                        <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Open Visual Tracking Portal</p>
                                    </div>
                                </div>
                                <Link href="/dashboard/logistics" className="bg-primary text-white px-12 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl relative z-10 hover:bg-secondary transition-all">Enter Tracking System</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
