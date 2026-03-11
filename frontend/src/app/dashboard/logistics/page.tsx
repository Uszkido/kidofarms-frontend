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
    Fuel,
    Star,
    ChevronRight,
    Zap,
    Warehouse as WarehouseIcon,
    ThermometerSun,
    Droplets,
    BarChart3,
    ArrowUpRight,
    Settings,
    X,
    Filter,
    Layers,
    Navigation2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function LogisticsDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // States
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [hubs, setHubs] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("fleet");
    const [stats, setStats] = useState({
        fuelCredits: "₦142,500",
        emissionOffset: "1.2 Tons",
        activeRoutes: 0,
        fulfillmentRate: "98.4%"
    });

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchAllLogisticsData();
        }
    }, [(session?.user as any)?.id]);

    const fetchAllLogisticsData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Shipments (Fleet)
            const shipRes = await fetch(getApiUrl(`/api/horizon/logistics/shipments/${(session?.user as any)?.id}`));
            const shipData = await shipRes.json();
            if (Array.isArray(shipData)) setDeliveries(shipData);

            // 2. Fetch Storage Nodes (Hubs & Vaults)
            const storageRes = await fetch(getApiUrl('/api/admin/storage'));
            const storageData = await storageRes.json();
            if (Array.isArray(storageData)) {
                setHubs(storageData.map(node => ({
                    name: node.name,
                    capacity: `${Math.round((node.currentLoad || 0) / (node.capacity || 100) * 100)}%`,
                    activeShipments: node.activeShipmentCount || 0,
                    status: node.status || 'Stable',
                    location: node.location
                })));
                setStats(prev => ({ ...prev, activeRoutes: storageData.length }));
            }

            // 3. Fetch Registry Logs
            const logsRes = await fetch(getApiUrl('/api/admin/logs'));
            const logsData = await logsRes.json();
            if (Array.isArray(logsData)) setLogs(logsData);

        } catch (err) {
            console.error('Logistics Sync Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#06120e] flex flex-col items-center justify-center gap-12">
            <div className="relative">
                <div className="absolute inset-0 border-4 border-secondary/20 rounded-full animate-spin duration-[3000ms] border-t-secondary" />
                <Truck size={80} className="text-secondary p-4 animate-pulse" />
            </div>
            <div className="space-y-4 text-center px-6">
                <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-secondary">Synchronizing Logistics Mesh</p>
                <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-white/20 italic">Authorizing Echelon II Clearance...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Status Header */}
                        <header className="relative py-12 md:py-16 px-6 md:px-12 bg-primary rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <Navigation className="absolute -bottom-20 -right-20 text-white/5 w-96 h-96 -rotate-12 group-hover:rotate-0 transition-all duration-[3000ms]" />
                            <div className="absolute top-10 right-20 w-[30rem] h-[30rem] bg-secondary rounded-full blur-[150px] opacity-10 animate-pulse" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl">
                                        <Globe size={14} className="animate-spin duration-[5000ms]" /> Sovereign Dispatch Command
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl md:text-9xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">
                                        Last-Mile <br />
                                        <span className="text-secondary italic">Control</span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button onClick={() => handleAction("Broadcast Route")} className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-3">
                                            <Navigation2 size={18} /> New Transit Node
                                        </button>
                                        <button onClick={() => handleAction("Manifest Export")} className="bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-3">
                                            <BarChart3 size={18} /> Global Export Ledger
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10 w-full max-w-sm">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleAction("Fuel Registry")}>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-secondary mb-1">Fuel Credits Pool</p>
                                                <p className="text-3xl font-black font-serif text-white">{stats.fuelCredits}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                                <Fuel size={24} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleAction("Emission Audit")}>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Carbon Offset Mesh</p>
                                                <p className="text-3xl font-black font-serif text-white">{stats.emissionOffset}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/60 group-hover:scale-110 transition-transform">
                                                <Activity size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-white/10">
                                        <button className="w-full bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans">
                                            Optimize Transit Fuel Nodes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Network Snapshot Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Active Nodes", value: stats.activeRoutes, icon: MapPin, color: "text-blue-500 bg-blue-50", detail: "Authorized Mesh" },
                                { label: "Fulfillment Rate", value: stats.fulfillmentRate, icon: ShieldCheck, color: "text-green-500 bg-green-50", detail: "SLA Compliant" },
                                { label: "Network Trust", value: "4.9★", icon: Star, color: "text-amber-500 bg-amber-50", detail: "Rating: Platinum" },
                                { label: "Transit Latency", value: "14ms", icon: Zap, color: "text-secondary bg-secondary/10", detail: "Real-time Sync" },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-xl space-y-4 group hover:shadow-2xl hover:border-secondary transition-all cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <s.icon size={26} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif text-primary uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{s.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/40 italic">
                                        <Activity size={10} className="text-secondary" /> {s.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {[
                                { id: "fleet", label: "Fleet Telemetry", icon: Truck },
                                { id: "hubs", label: "Distribution Hubs", icon: Layers },
                                { id: "warehouse", label: "Sovereign Vaults", icon: WarehouseIcon },
                                { id: "routes", label: "Route Optimizer", icon: Navigation },
                                { id: "logs", label: "Registry Logs", icon: Clock },
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

                        {/* Content Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-12 space-y-8">
                                <div className="bg-[#05110d] p-10 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                                        <Globe className="w-[600px] h-[600px] text-secondary/30 animate-[spin_60s_linear_infinite]" />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                        <div className="space-y-6 text-center md:text-left">
                                            <h3 className="text-4xl md:text-6xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">Global <br /><span className="text-secondary">Supply Mesh</span></h3>
                                            <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] italic">Real-time Node Connectivity: <span className="text-green-500">OPTIMAL</span></p>
                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                                <button onClick={() => handleAction("Global Mesh Refresh")} className="px-8 py-4 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Pulse Network</button>
                                                <button onClick={() => handleAction("Export Mesh Data")} className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Export KML</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full md:w-auto">
                                            {hubs.length > 0 ? hubs.slice(0, 8).map((node, i) => (
                                                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md group hover:border-secondary transition-all">
                                                    <p className="text-[8px] font-black uppercase text-white/30 mb-1">{node.name}</p>
                                                    <p className="text-[9px] font-black tracking-widest text-green-500 uppercase italic leading-none">● {node.status}</p>
                                                    <p className="text-[7px] font-black text-white/20 mt-1 uppercase tracking-tighter">Loc: {node.location}</p>
                                                </div>
                                            )) : (
                                                <div className="col-span-full py-10 text-center text-white/10 uppercase font-black text-[10px] tracking-widest italic">
                                                    No active nodes detected in local mesh.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Stream Area */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "fleet" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl md:text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Fleet <span className="text-secondary italic">Stream</span></h2>
                                            <div className="flex gap-4">
                                                <button className="p-3 bg-white rounded-2xl border border-primary/5 hover:bg-neutral-50 transition-all"><Filter size={18} className="text-primary/20" /></button>
                                                <button className="p-3 bg-primary text-secondary rounded-2xl shadow-xl hover:scale-105 transition-all"><BarChart3 size={18} /></button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {deliveries.length > 0 ? deliveries.map((d, i) => (
                                                <div key={d.id} className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all cursor-pointer relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform" />

                                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 w-full md:w-auto">
                                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-cream rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                                <Truck size={36} />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">#{d.id.slice(0, 8)}</p>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                                                </div>
                                                                <h3 className="text-2xl md:text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">{d.productName || "Generic Cargo"}</h3>
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest italic">{d.temperature || "---"} Cold-Chain</p>
                                                                    <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">Nodes: {d.origin} → {d.destination}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow flex items-center justify-center gap-4 md:gap-10 group-hover:gap-14 transition-all text-center">
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-primary/10 tracking-[0.2em]">Logistics Status</p>
                                                                <p className="text-[12px] font-black uppercase text-primary group-hover:text-secondary mb-1">In Transit</p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-8 md:pt-0 mt-2 md:mt-0 border-primary/5">
                                                            <span className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg bg-primary text-white animate-pulse">{d.status}</span>
                                                            <p className="text-xl font-black font-serif italic text-primary mt-4">SEQ: {d.id.slice(0, 4)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-10 h-2 w-full bg-cream rounded-full overflow-hidden p-0.5 border border-primary/5">
                                                        <div className="h-full rounded-full transition-all duration-[3000ms] bg-secondary" style={{ width: `65%` }} />
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-primary/5 group hover:border-secondary transition-all">
                                                    <Truck size={48} className="mx-auto text-primary/5 group-hover:text-secondary transition-all mb-4" />
                                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/20 italic">No assigned shipments found in registry logs.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "hubs" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Distribution <span className="text-secondary italic">Hubs</span></h2>
                                            <button onClick={() => handleAction("Global Balance")} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 hover:text-secondary underline underline-offset-8 transition-colors">Balance Capacity</button>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {hubs.map((hub, i) => (
                                                <div key={i} className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl space-y-8 group hover:border-secondary transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                            <Layers size={32} />
                                                        </div>
                                                        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${hub.status === 'High Demand' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{hub.status}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl md:text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">{hub.name}</h4>
                                                        <div className="mt-8 space-y-6">
                                                            <div className="flex justify-between items-end">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Node Capacity Utilization</p>
                                                                <p className="text-2xl font-black font-serif italic text-primary">{hub.capacity}</p>
                                                            </div>
                                                            <div className="h-2 w-full bg-cream rounded-full overflow-hidden p-0.5 border border-primary/5">
                                                                <div className="h-full bg-secondary rounded-full" style={{ width: hub.capacity }} />
                                                            </div>
                                                            <div className="flex justify-between pt-4 border-t border-primary/5">
                                                                <div>
                                                                    <p className="text-[8px] font-black uppercase text-primary/20 mb-1">Active Batches</p>
                                                                    <p className="text-xl font-black font-serif text-primary italic font-sans">{hub.activeShipments}</p>
                                                                </div>
                                                                <button onClick={() => handleAction(`Inspect ${hub.name}`)} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline underline-offset-4">Vault Detail <ArrowUpRight size={12} className="inline ml-1" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "warehouse" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="bg-primary p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] text-white space-y-10 relative overflow-hidden shadow-2xl">
                                            <WarehouseIcon className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 opacity-40 rotate-12 transition-transform hover:rotate-0 duration-[3000ms]" />
                                            <div className="relative z-10 space-y-6">
                                                <h3 className="text-3xl md:text-5xl font-black font-serif leading-none italic uppercase tracking-tighter">Cold-Vault <br /><span className="text-secondary italic">Registry</span></h3>
                                                <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic max-w-xl">Synchronized IoT sensors across 12 Sovereign Vaults. Automating inventory rotation and spoilage prevention protocols.</p>
                                                <div className="flex gap-4 pt-6">
                                                    <button onClick={() => handleAction("Capacity Scan")} className="bg-secondary text-primary px-12 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-white transition-all shadow-2xl font-sans">Initialize Full Node Scan</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-8">
                                            {[
                                                { label: "O2 Saturation", value: "98.4%", icon: Activity, color: "text-blue-500" },
                                                { label: "Temp Delta", value: "±0.2°C", icon: ThermometerSun, color: "text-red-500" },
                                                { label: "Humidity Sink", value: "45%", icon: Droplets, color: "text-green-500" },
                                            ].map((sensor, i) => (
                                                <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-primary/5 shadow-xl text-center space-y-4 group hover:border-secondary transition-all">
                                                    <div className={`w-12 h-12 ${sensor.color} bg-cream rounded-2xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform`}>
                                                        <sensor.icon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{sensor.label}</p>
                                                        <p className="text-4xl font-black font-serif text-primary italic font-sans">{sensor.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "routes" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Route <span className="text-secondary italic">Optimizer</span></h2>
                                            <button onClick={() => handleAction("Recalculate All")} className="bg-primary text-secondary px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Recalculate Mesh</button>
                                        </div>
                                        <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl space-y-8 relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                                <MapPin className="absolute top-10 left-10 w-40 h-40 rotate-12" />
                                                <Navigation className="absolute bottom-10 right-10 w-40 h-40 -rotate-12" />
                                            </div>
                                            <div className="relative z-10 space-y-8">
                                                <div className="p-8 bg-cream/30 rounded-[3rem] border border-primary/5 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Active Optimization Vector</p>
                                                        <span className="text-green-500 text-[8px] font-black uppercase tracking-widest animate-pulse">Efficiency: +18.4%</span>
                                                    </div>
                                                    <p className="text-2xl font-black font-serif text-primary uppercase italic">Kano-Lagos Express Mesh</p>
                                                    <div className="flex gap-4">
                                                        <div className="px-4 py-2 bg-white rounded-xl text-[8px] font-black uppercase tracking-widest border border-primary/5">3 Waypoints</div>
                                                        <div className="px-4 py-2 bg-white rounded-xl text-[8px] font-black uppercase tracking-widest border border-primary/5">420km Total</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {[
                                                        { route: "Abuja - Port Harcourt", status: "Congested", delay: "+45m", color: "text-red-500" },
                                                        { route: "Jos - Onitsha Hub", status: "Optimal", delay: "±0m", color: "text-green-500" }
                                                    ].map((r, i) => (
                                                        <div key={i} className="p-6 bg-white border border-primary/5 rounded-[2.5rem] flex justify-between items-center hover:border-secondary transition-all cursor-pointer">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase text-primary mb-1">{r.route}</p>
                                                                <p className={`text-[8px] font-black uppercase tracking-widest ${r.color}`}>{r.status}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-black font-serif italic text-primary">{r.delay}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "logs" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Registry <span className="text-secondary italic">Logs</span></h2>
                                            <button onClick={() => handleAction("Export CSV")} className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary underline underline-offset-8 transition-colors">Download History</button>
                                        </div>
                                        <div className="bg-[#06120e] p-10 rounded-[4rem] shadow-2xl border border-white/5 space-y-6 font-mono">
                                            {logs.length > 0 ? logs.map((log, i) => (
                                                <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-6 text-[10px] hover:bg-white/5 p-4 rounded-xl transition-all group">
                                                    <span className="text-secondary/40 group-hover:text-secondary">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                                    <span className="text-white font-black group-hover:text-secondary">[{log.action}]</span>
                                                    <span className="text-white/20">@{log.userName || log.userEmail?.split('@')[0]}</span>
                                                    <span className="text-white/40 italic flex-grow text-right">{log.entity}: {JSON.stringify(log.details).slice(0, 50)}...</span>
                                                </div>
                                            )) : (
                                                <div className="py-20 text-center text-white/5 uppercase font-black text-[12px] tracking-[0.6em] italic">
                                                    Registry Log Buffer Empty.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Area */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Digital Manifest Generator */}
                                <div className="bg-secondary p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-primary space-y-10 shadow-2xl relative overflow-hidden group">
                                    <QrCode className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
                                    <div className="relative z-10 space-y-6">
                                        <h4 className="text-3xl md:text-4xl font-black font-serif italic leading-tight uppercase tracking-tighter">Broadcast <br />Digital <span className="underline decoration-4">Manifest</span></h4>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic leading-relaxed">Secure Node-to-Node blockchain manifest generation. Required for all Inter-Hub transit protocols.</p>
                                        <button onClick={() => handleAction("QR Manifest")} className="bg-primary text-white w-full py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] hover:bg-white hover:text-primary transition-all shadow-xl font-sans">Initialize Broadcast</button>
                                    </div>
                                </div>

                                {/* Security Clearance */}
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 shadow-inner group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={36} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black font-serif uppercase italic leading-none">Security <br /><span className="text-secondary tracking-tighter">Authorized</span></h3>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Clearance Level: Tier 4 Sovereign</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: "IoT Telemetry Mesh", status: "Active" },
                                            { label: "Encryption Vector", status: "Optimal" },
                                            { label: "Risk Mitigation", status: "100%" }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex justify-between items-center bg-cream/20 px-8 py-5 rounded-[2rem] border border-primary/5 hover:bg-white hover:shadow-xl transition-all">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{stat.label}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-green-600 italic">{stat.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-5 border-4 border-dashed border-primary/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 hover:text-secondary hover:border-secondary transition-all italic">Upgrade Node Clearance</button>
                                </div>

                                {/* Network Terminal Log */}
                                <div className="bg-primary rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('logs')}>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-2xl font-black font-serif italic uppercase tracking-tighter leading-none">Terminal <br /><span className="text-secondary italic">Pulse</span></h4>
                                            <Activity className="text-secondary animate-pulse" size={24} />
                                        </div>
                                        <div className="space-y-6">
                                            {[
                                                { event: "Hub Sync Complete", loc: "Lagos Atlantic", time: "2m ago" },
                                                { event: "Thermal Delta Check", loc: "Vault Alpha", time: "14m ago" },
                                                { event: "Route Recalculated", loc: "Sector 4-B", time: "42m ago" }
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-6 items-start group-hover:translate-x-2 transition-transform">
                                                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                                    <div className="flex-grow space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{log.event}</p>
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">{log.loc}</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-secondary">{log.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="flex items-center gap-3 text-secondary text-[10px] font-black uppercase tracking-[0.2em] pt-4 group-hover:translate-x-4 transition-all">
                                            Access Full History <ArrowRight size={14} />
                                        </button>
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
