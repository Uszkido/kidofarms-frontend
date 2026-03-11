"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Truck,
    MapPin,
    Package,
    Navigation,
    Activity,
    ShieldCheck,
    Clock,
    Box,
    ArrowRight,
    QrCode,
    Loader2,
    Globe,
    ExternalLink,
    Fuel,
    Star,
    ChevronRight,
    Zap,
    Warehouse as WarehouseIcon,
    AlertCircle,
    CheckCircle2,
    ThermometerSun,
    Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function UnifiedLogisticsDashboard() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("fleet");
    const [deliveries, setDeliveries] = useState([
        { id: "NODE-LGS-42", origin: "Jos Node", dest: "Lagos Hub", status: "In Transit", eta: "4h 20m", items: "20kg Grains", temp: "21°C", progress: 70 },
        { id: "NODE-LGS-88", origin: "Kano Node", dest: "Abuja Store", status: "Sorting", eta: "1d 2h", items: "50kg Onions", temp: "24°C", progress: 20 },
        { id: "NODE-LGS-12", origin: "Owerri Node", dest: "P/H Node", status: "Delivered", eta: "Done", items: "15kg Tubers", temp: "22°C", progress: 100 }
    ]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#06120e] flex flex-col items-center justify-center gap-8">
            <Truck size={64} className="text-secondary animate-bounce" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Broadcasting Logistics Mesh</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Status Header */}
                        <header className="relative py-16 px-12 bg-primary rounded-[4rem] overflow-hidden shadow-2xl group">
                            <Navigation className="absolute -bottom-10 -right-10 text-white/5 w-80 h-80 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-20" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl">
                                        <Globe size={14} className="animate-pulse" /> Last-Mile Global Mesh
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">
                                        Logistics <br />
                                        <span className="text-secondary italic">Hub</span>
                                    </h1>
                                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Active Agent: {session?.user?.name || "Logistics Master Node"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black uppercase text-white/30 mb-2">Network Nodes</p>
                                        <p className="text-4xl font-black font-serif text-white">124 <span className="text-secondary tracking-widest text-xs">LIVE</span></p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black uppercase text-white/30 mb-2">Fulfillment</p>
                                        <p className="text-4xl font-black font-serif text-secondary">98.4%</p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Fuel Credits", value: "₦42,000", icon: Fuel, color: "text-green-500 bg-green-50" },
                                { label: "Emission Offset", value: "420 kg", icon: Activity, color: "text-blue-500 bg-blue-50" },
                                { label: "Active Routes", value: "38", icon: MapPin, color: "text-purple-500 bg-purple-50" },
                                { label: "Trust Rating", value: "4.9★", icon: Star, color: "text-secondary bg-secondary/10" },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-2xl transition-all cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <s.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black font-serif">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "fleet", label: "Fleet Stream", icon: Truck },
                                { id: "map", label: "Global Mesh", icon: Globe },
                                { id: "routes", label: "Route Optimizer", icon: Navigation },
                                { id: "warehouse", label: "Warehouse Node", icon: WarehouseIcon },
                                { id: "terminal", label: "Terminal Logs", icon: Clock }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* Content Grid */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Main Display */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "fleet" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif italic text-primary">Active <span className="text-secondary">Stream</span></h2>
                                            <div className="flex gap-4">
                                                <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary border-b border-transparent hover:border-secondary transition-all pb-1">Broadcast</button>
                                                <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary border-b border-transparent hover:border-secondary transition-all pb-1">Filter</button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {deliveries.map((d, i) => (
                                                <div key={d.id} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl hover:border-secondary transition-all group cursor-pointer">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="w-16 h-16 bg-cream rounded-[2.2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0 shadow-inner">
                                                                <Box size={28} />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-1">{d.id}</p>
                                                                <h3 className="text-2xl font-black font-serif text-primary">{d.items}</h3>
                                                                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-1 italic">{d.temp} Cold-Chain Secure</p>
                                                                {/* Progress Bar */}
                                                                <div className="mt-4 h-1.5 w-full bg-cream rounded-full overflow-hidden">
                                                                    <div className={`h-full rounded-full transition-all duration-1000 ${d.status === 'In Transit' ? 'bg-secondary' : d.status === 'Delivered' ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${d.progress}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow flex items-center justify-center gap-8 group-hover:gap-12 transition-all">
                                                            <div className="text-center">
                                                                <p className="text-[9px] font-black uppercase text-primary/20 mb-1">Origin</p>
                                                                <p className="text-xs font-black uppercase">{d.origin}</p>
                                                            </div>
                                                            <ArrowRight size={20} className="text-secondary animate-pulse" />
                                                            <div className="text-center">
                                                                <p className="text-[9px] font-black uppercase text-primary/20 mb-1">Dest</p>
                                                                <p className="text-xs font-black uppercase">{d.dest}</p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0 border-primary/5">
                                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${d.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-secondary text-primary'}`}>{d.status}</span>
                                                            <p className="text-xs font-black font-serif mt-3 italic text-primary">ETA: {d.eta}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "warehouse" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-primary p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
                                            <WarehouseIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-40 rotate-12" />
                                            <div className="relative z-10 space-y-6">
                                                <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Warehouse <span className="text-secondary">Node Control</span></h3>
                                                <p className="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-widest max-w-lg">Monitor storage capacity, cold-vault integrity, and automated stock rotation protocols across the network.</p>
                                                <div className="flex gap-4 pt-4">
                                                    <button onClick={() => handleAction("Capacity Scan")} className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl">Initialize Scan</button>
                                                    <button onClick={() => handleAction("Sensor Sync")} className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">Sensor Sync</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Storage Nodes */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {[
                                                { label: "Cold Vault Alpha", cap: "82%", temp: "-4°C", humidity: "45%" },
                                                { label: "Dry Node Beta", cap: "45%", temp: "22°C", humidity: "12%" }
                                            ].map((node, i) => (
                                                <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl space-y-6 group hover:border-secondary transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                                            <ThermometerSun size={28} />
                                                        </div>
                                                        <span className="bg-primary/5 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-primary/40">Secure Node</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-black font-serif">{node.label}</h4>
                                                        <div className="mt-6 space-y-4">
                                                            <div className="flex justify-between items-end">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/40">Capacity Utilization</p>
                                                                <p className="text-lg font-black font-serif">{node.cap}</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                                                                <div className="h-full bg-secondary" style={{ width: node.cap }} />
                                                            </div>
                                                            <div className="flex justify-between pt-2">
                                                                <div className="flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase"><ThermometerSun size={12} /> {node.temp}</div>
                                                                <div className="flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase"><Droplets size={12} /> {node.humidity}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Options */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* QR & Manifests */}
                                <div className="bg-secondary p-12 rounded-[4rem] text-primary space-y-10 shadow-2xl relative overflow-hidden group">
                                    <QrCode className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
                                    <div className="relative z-10 space-y-6">
                                        <h4 className="text-3xl font-black font-serif italic leading-tight uppercase">Generate <br />Digital <span className="underline decoration-4">Manifest</span></h4>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 leading-relaxed">Encrypted blockchain manifest for node-to-node transit protocols.</p>
                                        <button onClick={() => handleAction("QR Manifest")} className="bg-primary text-white w-full py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">Encrypt & Broadcast</button>
                                    </div>
                                </div>

                                {/* Security Hub */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black font-serif uppercase italic">Clearance <br /><span className="text-secondary">Level 4</span></h3>
                                    </div>
                                    <p className="text-primary/40 text-[9px] font-black uppercase tracking-widest leading-relaxed">System scan complete. Your distribution node is authorized for inter-state and bulk transit protocol via the Echelon Network.</p>
                                    <div className="pt-6 border-t border-primary/5 grid gap-4">
                                        {[
                                            { label: "IoT Telemetry", status: "Active" },
                                            { label: "Echelon Sync", status: "Optimal" },
                                            { label: "Vulnerability Scan", status: "Passed" }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex justify-between items-center bg-cream/20 px-6 py-3 rounded-2xl">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{stat.label}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-green-600">{stat.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Terminal Access Card */}
                                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden cursor-pointer group" onClick={() => setActiveTab('terminal')}>
                                    <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white animate-pulse" />
                                    <div className="relative z-10 space-y-6">
                                        <h4 className="text-2xl font-black font-serif italic uppercase">Terminal <br /><span className="text-secondary">Insights</span></h4>
                                        <div className="space-y-4">
                                            {[
                                                { event: "Delivery Confirmed", loc: "Lekki Hub", time: "2h ago" },
                                                { event: "Fuel Subsidy Credit", loc: "+₦8,000", time: "5h ago" }
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0 group-hover:translate-x-1 transition-transform">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                                    <div className="flex-grow">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">{log.event}</p>
                                                        <div className="flex justify-between items-center w-full mt-1">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{log.loc}</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-secondary">{log.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /></svg>;
}
