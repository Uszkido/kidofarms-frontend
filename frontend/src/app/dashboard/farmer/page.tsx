"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    LayoutDashboard,
    Sprout,
    Droplets,
    ThermometerSun,
    TrendingUp,
    ShoppingBag,
    Plus,
    ArrowRight,
    CheckCircle2,
    Calendar,
    MapPin,
    Search,
    Zap,
    Camera,
    Brain,
    Loader2,
    X,
    AlertTriangle,
    ShieldCheck,
    QrCode,
    Mic,
    Check,
    Building2,
    Globe,
    RefreshCw,
    GraduationCap,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function FarmerDashboard() {
    const [sensors, setSensors] = useState<any[]>([]);
    const [loadingSensors, setLoadingSensors] = useState(true);
    const [isAgronomistOpen, setIsAgronomistOpen] = useState(false);
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [diagnosing, setDiagnosing] = useState(false);
    const [isVoiceListingOpen, setIsVoiceListingOpen] = useState(false);
    const [voiceResult, setVoiceResult] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Horizon Phase 5 States
    const [horizonTab, setHorizonTab] = useState('pods');
    const [pods, setPods] = useState<any[]>([]);
    const [exports, setExports] = useState<any[]>([]);
    const [circular, setCircular] = useState<any>(null);
    const [academy, setAcademy] = useState<any[]>([]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch(getApiUrl("/api/sensors"));
                if (res.ok) setSensors(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSensors(false);
            }
        };
        fetchSensors();
    }, []);

    useEffect(() => {
        const fetchHorizon = async () => {
            try {
                const [pRes, eRes, cRes, aRes] = await Promise.all([
                    fetch(getApiUrl("/api/horizon/pods")),
                    fetch(getApiUrl("/api/horizon/exports")),
                    fetch(getApiUrl("/api/horizon/circular")),
                    fetch(getApiUrl("/api/horizon/academy"))
                ]);
                if (pRes.ok) setPods(await pRes.json());
                if (eRes.ok) setExports(await eRes.json());
                if (cRes.ok) setCircular(await cRes.json());
                if (aRes.ok) setAcademy(await aRes.json());
            } catch (err) {
                console.error("Horizon fetch failed", err);
            }
        };
        fetchHorizon();
    }, []);

    const handleVoiceListing = async () => {
        setIsRecording(true);
        // Simulate record time
        setTimeout(async () => {
            try {
                const res = await fetch(getApiUrl("/api/voice/parse"), { method: "POST" });
                if (res.ok) setVoiceResult(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setIsRecording(false);
            }
        }, 3000);
    };

    const handleDiagnose = async (cropType: string) => {
        setDiagnosing(true);
        try {
            const res = await fetch(getApiUrl("/api/agronomist/diagnose"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cropType, description: "Leaves turning yellow with purple spots." })
            });
            if (res.ok) setDiagnosis(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setDiagnosing(false);
        }
    };

    const getSensorVal = (type: string) => sensors.find(s => s.type === type)?.value || "--";

    return (
        <div className="flex flex-col min-h-screen">
            <Header />            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <div className="relative h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80"
                                alt="Farm Harvest"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Sprout className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
                                        Soil Integrity Verified
                                    </div>
                                    <h1 className="text-3xl md:text-6xl font-black font-serif text-white leading-tight">Farmer <br /><span className="text-secondary italic">Command Center</span></h1>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none border-2 border-primary/5 px-8 py-4 rounded-2xl font-black text-sm hover:bg-cream transition-all flex items-center justify-center gap-3">
                                        Edit Farm Profile
                                    </button>
                                    <Link href="/dashboard/farmer/harvest/new" className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                        <Plus size={18} /> List New Harvest
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Critical Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Yield", value: "2.4 Tons", icon: Sprout, color: "bg-green-500", detail: "+12% vs last cycle" },
                                { label: "Est. Revenue", value: "₦4.8M", icon: TrendingUp, color: "bg-secondary", detail: "Next payout: Friday" },
                                { label: "Soil Moisture", value: getSensorVal('moisture') + (getSensorVal('moisture') !== '--' ? '%' : ''), icon: Droplets, color: "bg-blue-500", detail: "Optimal range: 60-75%" },
                                { label: "Soil Temp", value: getSensorVal('temperature') + (getSensorVal('temperature') !== '--' ? '°C' : ''), icon: ThermometerSun, color: "bg-orange-500", detail: "Optimal range: 18-24°C" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black font-serif text-primary">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{stat.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[10px] font-bold text-primary/60">
                                        <CheckCircle2 size={12} className="text-secondary" />
                                        {stat.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory & Tracking Grid */}
                        {/* Inventory & Tracking Grid */}
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Live Harvest Status */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <h2 className="text-3xl font-black font-serif text-primary">Live <span className="text-secondary italic">Harvest Tracking</span></h2>
                                    <Link href="/track-harvest" className="text-xs font-black uppercase tracking-widest text-secondary hover:underline underline-offset-8 transition-all">View Public Node</Link>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { crop: "Yellow Maize", stage: "Late Growing", progress: 85, health: "Optimal", location: "Sector 4A" },
                                        { crop: "Bulk Onions", stage: "Seedling", progress: 15, health: "Monitoring", location: "Sector 2B" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-lg group hover:border-secondary transition-all">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                        <Sprout size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black font-serif">{item.crop}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{item.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black font-serif text-primary">{item.progress}%</span>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic">{item.stage}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5 flex-grow">
                                                        <div
                                                            className="h-full bg-secondary rounded-full transition-all duration-[2000ms]"
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                    <Link href={`/trace/KD-2026-${i}`} className="bg-primary text-white p-2 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-lg flex items-center justify-center">
                                                        <QrCode size={16} />
                                                    </Link>
                                                </div>
                                                <div className="mt-4 flex gap-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40">
                                                        <Droplets size={12} className="text-blue-500" /> Moisture: 72%
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40">
                                                        <ThermometerSun size={12} className="text-orange-500" /> Temp: 28°C
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications & Action Center */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black font-serif px-4">Farm <span className="text-secondary italic">Alerts</span></h2>
                                <div className="bg-primary rounded-[3rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
                                    {[
                                        { title: "Price Surge: Grains", desc: "Regional demand for maize rose 15% today.", icon: TrendingUp },
                                        { title: "Weather Alert", desc: "Heavy rainfall expected in Jos district.", icon: ThermometerSun },
                                    ].map((alert, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                <alert.icon size={18} />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="font-black text-sm">{alert.title}</h5>
                                                <p className="text-[10px] text-white/40 font-medium leading-relaxed">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full bg-white/10 border border-white/10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                                        Clear All Notifications
                                    </button>
                                </div>

                                <div className="bg-primary rounded-[3rem] p-8 text-white space-y-4 shadow-xl relative group cursor-pointer overflow-hidden" onClick={() => setIsVoiceListingOpen(true)}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
                                    <h4 className="text-xl font-black font-serif leading-tight">Voice Command <br /><span className="text-secondary italic">List by Speaking</span></h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">No typing needed. Just tell Kido what you harvested.</p>
                                    <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest border-b-2 border-secondary/20 hover:border-secondary transition-all pb-1">
                                        Open Mic Center <Mic size={14} className="text-secondary" />
                                    </button>
                                </div>

                                <div className="bg-secondary rounded-[3rem] p-8 text-primary space-y-4 shadow-xl relative group cursor-pointer" onClick={() => setIsAgronomistOpen(true)}>
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="text-xl font-black font-serif leading-tight">AI Agronomist <br /><span className="italic">Ready for Scan</span></h4>
                                    <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Upload a photo to detect pest and diseases in seconds.</p>
                                    <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
                                        Open Diagnostic Node <Brain size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Kido Horizon Expansion (Phase 5) */}
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-4xl font-black font-serif text-primary">Kido <span className="text-secondary italic">Horizon Expansion</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Phase 5: Global Infrastructure Layer</p>
                                </div>
                                <div className="flex bg-white p-2 rounded-[2rem] border border-primary/5 shadow-xl overflow-x-auto max-w-full">
                                    {[
                                        { id: 'pods', label: 'City-Nodes', icon: Building2 },
                                        { id: 'exports', label: 'Global-Bridge', icon: Globe },
                                        { id: 'circular', label: 'Circular Wealth', icon: RefreshCw },
                                        { id: 'academy', label: 'Mastery Academy', icon: GraduationCap }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setHorizonTab(tab.id)}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${horizonTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-cream'}`}
                                        >
                                            <tab.icon size={14} /> {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-12 border border-primary/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                    <Sparkles size={300} />
                                </div>

                                {horizonTab === 'pods' && (
                                    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {pods.map(pod => (
                                            <div key={pod.id} className="bg-cream/30 p-8 rounded-[3rem] border border-primary/5 space-y-6 relative group overflow-hidden">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <h4 className="text-2xl font-black font-serif">{pod.name}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 flex items-center gap-2">
                                                            <MapPin size={10} className="text-secondary" /> {pod.location}
                                                        </p>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${pod.health > 95 ? 'bg-green-100 text-green-600' : 'bg-secondary/20 text-primary'}`}>
                                                        <Zap size={10} className="animate-pulse" /> {pod.health}% Health
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-primary/30">Current Crop</p>
                                                            <p className="text-sm font-black italic text-secondary">{pod.crop}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-primary/30">Nutrients</p>
                                                            <p className="text-sm font-black">{pod.nutrients} PPM</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 text-right">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-primary/30">Moisture</p>
                                                            <p className="text-sm font-black">{pod.moisture}%</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-primary/30">System Status</p>
                                                            <p className="text-sm font-black text-green-500 flex items-center justify-end gap-1">
                                                                <CheckCircle2 size={12} /> Live
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="w-full bg-white/50 border border-primary/5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                                    Open Remote Pod Console
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {horizonTab === 'exports' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="bg-primary p-8 rounded-[2.5rem] text-white space-y-2 shadow-xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Pending Revenue</p>
                                                <p className="text-3xl font-black font-serif">$12,450.00</p>
                                            </div>
                                            <div className="bg-secondary p-8 rounded-[2.5rem] text-primary space-y-2 shadow-xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Active Routes</p>
                                                <p className="text-3xl font-black font-serif">4 Nodes</p>
                                            </div>
                                            <div className="bg-cream p-8 rounded-[2.5rem] border border-primary/5 space-y-2 shadow-xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Compliance Score</p>
                                                <p className="text-3xl font-black font-serif text-primary">94/100</p>
                                            </div>
                                        </div>
                                        <div className="bg-cream/30 rounded-[3rem] overflow-hidden border border-primary/5">
                                            <table className="w-full text-left">
                                                <thead className="bg-primary/5">
                                                    <tr>
                                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40">Harvest Block</th>
                                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40">Destination</th>
                                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40">Est. Price</th>
                                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40">Terminal Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-primary/5">
                                                    {exports.map(exp => (
                                                        <tr key={exp.id} className="group hover:bg-white transition-all">
                                                            <td className="px-8 py-6 font-black text-sm">{exp.product} <span className="text-[10px] text-primary/30 ml-2">({exp.volume})</span></td>
                                                            <td className="px-8 py-6 text-sm font-medium italic">{exp.destination}</td>
                                                            <td className="px-8 py-6 font-black text-primary">{exp.price}</td>
                                                            <td className="px-8 py-6 italic">
                                                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{exp.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'circular' && (
                                    <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="space-y-8">
                                            <h3 className="text-4xl font-black font-serif leading-tight">Zero Waste <br /><span className="text-secondary italic">Circular Dashboard</span></h3>
                                            <p className="text-primary/60 text-sm leading-relaxed">Your farm is currently recycling 84% of all harvest waste. You've earned <strong>450 Kido Energy Credits</strong> this month.</p>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 bg-cream rounded-2xl border border-primary/5 text-center">
                                                    <RefreshCw className="mx-auto mb-3 text-secondary" size={24} />
                                                    <p className="text-[8px] font-black uppercase text-primary/30">Waste Diverted</p>
                                                    <p className="text-xl font-black font-serif">{circular?.totalWasteRecycled || '0.0 Tons'}</p>
                                                </div>
                                                <div className="p-6 bg-cream rounded-2xl border border-primary/5 text-center">
                                                    <Zap className="mx-auto mb-3 text-orange-500" size={24} />
                                                    <p className="text-[8px] font-black uppercase text-primary/30">Energy Yield</p>
                                                    <p className="text-xl font-black font-serif">{circular?.energyGenerated || '0 kWh'}</p>
                                                </div>
                                            </div>
                                            <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                                Schedule Waste Pick-up
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="w-full aspect-square rounded-[4rem] bg-cream p-12 overflow-hidden relative shadow-2xl">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center space-y-6">
                                                    <div className="w-48 h-48 rounded-full border-[12px] border-secondary flex items-center justify-center relative">
                                                        <div className="absolute inset-4 rounded-full border-4 border-primary/5 border-dashed" />
                                                        <p className="text-5xl font-black font-serif">84<span className="text-xl">%</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Circular Integrity</p>
                                                        <p className="text-xs font-bold text-secondary italic mt-2">World Class Sustainability Tier</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'academy' && (
                                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="md:col-span-1 space-y-8">
                                            <div className="bg-cream p-10 rounded-[3rem] border border-primary/5 space-y-6">
                                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-secondary">
                                                    <GraduationCap size={32} />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Current Rank</p>
                                                    <h4 className="text-3xl font-black font-serif italic text-primary">Master Farmer</h4>
                                                </div>
                                                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                                                    <div className="w-[85%] h-full bg-secondary" />
                                                </div>
                                                <p className="text-[10px] font-bold text-primary/40 italic">150 points to "Landscape Legend"</p>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-8">
                                            <h3 className="text-3xl font-black font-serif px-4">Available <span className="text-secondary italic">Mastery Modules</span></h3>
                                            <div className="grid gap-4">
                                                {academy.map(course => (
                                                    <div key={course.id} className="bg-cream/30 p-8 rounded-[2.5rem] border border-primary/5 flex justify-between items-center group hover:bg-white transition-all">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-white transition-all text-primary">
                                                                <Zap size={20} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-black text-sm uppercase tracking-widest">{course.title}</h5>
                                                                <p className="text-[10px] text-primary/30 font-bold uppercase">{course.category} • {course.duration}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <p className="text-sm font-black text-secondary">+{course.points}</p>
                                                                <p className="text-[8px] font-black uppercase text-primary/20">Skill Pts</p>
                                                            </div>
                                                            <button className="bg-primary text-white p-3 rounded-xl hover:bg-secondary hover:text-primary transition-all">
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isAgronomistOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative">
                        <button onClick={() => { setIsAgronomistOpen(false); setDiagnosis(null); }} className="absolute top-10 right-10 text-primary/20 hover:text-primary">
                            <X size={28} />
                        </button>

                        <div className="mb-10 text-center">
                            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary shadow-xl">
                                <Brain size={40} />
                            </div>
                            <h3 className="text-3xl font-black font-serif">Kido <span className="text-secondary italic">Agronomist</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Precision Disease Diagnosis</p>
                        </div>

                        {!diagnosis ? (
                            <div className="space-y-8">
                                <div className="border-4 border-dashed border-primary/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 group hover:border-secondary transition-all cursor-pointer">
                                    <div className="w-16 h-16 rounded-3xl bg-cream flex items-center justify-center text-primary group-hover:bg-secondary group-hover:scale-110 transition-all">
                                        <Camera size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-sm uppercase tracking-widest">Select Crop Photo</p>
                                        <p className="text-[10px] text-primary/30 font-bold">Supported: Maize, Onions, Peppers</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Maize', 'Onion', 'Pepper'].map(crop => (
                                        <button
                                            key={crop}
                                            onClick={() => handleDiagnose(crop)}
                                            disabled={diagnosing}
                                            className="bg-cream hover:bg-secondary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                                        >
                                            {crop}
                                        </button>
                                    ))}
                                </div>
                                {diagnosing && (
                                    <div className="flex items-center justify-center gap-3 text-secondary">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">AI is analyzing tissue...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-bottom-6">
                                <div className="p-8 bg-cream rounded-[2.5rem] border border-secondary/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <AlertTriangle size={64} className="text-primary" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2">Diagnosis Result</p>
                                    <h4 className="text-2xl font-black font-serif text-primary italic mb-4">{diagnosis.diagnosis}</h4>
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase mb-6">
                                        <ShieldCheck size={10} strokeWidth={3} /> {Math.round(diagnosis.confidence * 100)}% Confidence
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-primary/40">Treatment Plan</p>
                                        <p className="text-sm font-medium leading-relaxed italic border-l-2 border-secondary pl-6">{diagnosis.treatment}</p>
                                    </div>
                                </div>
                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                    Save to Field Log
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isVoiceListingOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-2xl">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative text-center">
                        <button onClick={() => { setIsVoiceListingOpen(false); setVoiceResult(null); }} className="absolute top-10 right-10 text-primary/20 hover:text-primary">
                            <X size={28} />
                        </button>

                        <div className="mb-10">
                            <h3 className="text-3xl font-black font-serif">Kido <span className="text-secondary italic">Voice Assistant</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Natural Language Listing</p>
                        </div>

                        {!voiceResult ? (
                            <div className="space-y-12">
                                <div
                                    onClick={handleVoiceListing}
                                    className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${isRecording ? 'bg-secondary scale-110 shadow-[0_0_50px_rgba(255,215,0,0.5)]' : 'bg-primary shadow-xl hover:scale-105'}`}
                                >
                                    <Mic size={48} className={isRecording ? 'text-primary animate-pulse' : 'text-white'} />
                                </div>

                                <div className="space-y-2">
                                    <p className="font-black text-sm uppercase tracking-widest">
                                        {isRecording ? "Listening to your field report..." : "Tap to start speaking"}
                                    </p>
                                    <p className="text-[10px] text-primary/30 font-bold max-w-xs mx-auto">
                                        E.g., "List 50 baskets of tomatoes from Sector B. Price 5000 naira each."
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="bg-cream/50 p-8 rounded-[2.5rem] border border-primary/5 text-left space-y-6">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Text Extracted</p>
                                        <div className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase">
                                            {Math.round(voiceResult.confidence * 100)}% Confidence
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium italic text-primary/80">"{voiceResult.audioTranscript}"</p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Product</p>
                                            <p className="text-sm font-black">{voiceResult.product}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Quantity</p>
                                            <p className="text-sm font-black">{voiceResult.quantity} {voiceResult.unit}s</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Unit Price</p>
                                            <p className="text-sm font-black">₦{voiceResult.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Location</p>
                                            <p className="text-sm font-black">{voiceResult.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setVoiceResult(null)} className="flex-1 bg-cream py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all">
                                        Retry
                                    </button>
                                    <button className="flex-2 bg-primary text-white py-5 px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-2">
                                        <Check size={16} /> Confirm & List
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

