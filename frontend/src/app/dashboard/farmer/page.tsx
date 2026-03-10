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
    Sparkles,
    Activity
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
            <Header />
            <main className="flex-grow pt-32 pb-24 bg-cream/10">
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
                        <div className="grid lg:grid-cols-3 gap-12">
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
                                            </div>
                                            <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5 mt-4">
                                                <div
                                                    className="h-full bg-secondary rounded-full transition-all duration-[2000ms]"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-3xl font-black font-serif px-4">Farm <span className="text-secondary italic">Alerts</span></h2>
                                <div className="bg-primary rounded-[3rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                                    {[
                                        { title: "Price Surge: Grains", desc: "Regional demand for maize rose 15% today.", icon: TrendingUp },
                                        { title: "Weather Alert", desc: "Heavy rainfall expected in Jos district.", icon: ThermometerSun },
                                    ].map((alert, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <alert.icon size={18} />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="font-black text-sm">{alert.title}</h5>
                                                <p className="text-[10px] text-white/40 font-medium leading-relaxed">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-primary rounded-[3rem] p-8 text-white space-y-4 shadow-xl cursor-pointer" onClick={() => setIsVoiceListingOpen(true)}>
                                    <h4 className="text-xl font-black font-serif leading-tight">Voice Command <br /><span className="text-secondary italic">List by Speaking</span></h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Natural language listing center.</p>
                                    <Mic size={24} className="text-secondary" />
                                </div>

                                <div className="bg-secondary rounded-[3rem] p-8 text-primary space-y-4 shadow-xl cursor-pointer" onClick={() => setIsAgronomistOpen(true)}>
                                    <h4 className="text-xl font-black font-serif leading-tight">AI Agronomist <br /><span className="italic">Disease Scan</span></h4>
                                    <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest">Detect pests and diseases via camera.</p>
                                    <Brain size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Precision Monitoring Section */}
                        <div className="bg-primary/5 p-12 rounded-[4rem] border border-primary/5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div>
                                    <h2 className="text-4xl font-black font-serif text-primary">Precision <span className="text-secondary italic">Monitoring</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Satellite & In-Field Data Layers</p>
                                </div>
                                <div className="bg-white px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 border border-primary/5 shadow-sm">
                                    <Activity size={12} className="text-secondary" /> Sensor Network: Connected
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm group hover:border-secondary transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h4 className="text-xl font-black font-serif mb-2">Yield Prediction</h4>
                                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mb-6">AI-Estimated Harvest Output</p>
                                    <div className="flex items-end gap-2 text-primary">
                                        <span className="text-5xl font-black font-serif italic">4.2</span>
                                        <span className="text-sm font-black opacity-20 mb-2">Tons / Ha</span>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm group hover:border-secondary transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                                        <MapPin size={24} />
                                    </div>
                                    <h4 className="text-xl font-black font-serif mb-2">NDVI Analysis</h4>
                                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mb-6">Vegetation Health Index</p>
                                    <div className="flex items-end gap-2 text-green-500">
                                        <span className="text-5xl font-black font-serif italic">0.82</span>
                                        <span className="text-sm font-black opacity-20 mb-2">Optimal</span>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 rounded-full border-4 border-cream border-t-secondary animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Synching Field Data...</p>
                                </div>
                            </div>
                        </div>

                        {/* Kido Horizon (Phase 5) */}
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-4xl font-black font-serif text-primary">Kido <span className="text-secondary italic">Horizon</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Phase 5: Global Infrastructure</p>
                                </div>
                                <div className="flex bg-white p-2 rounded-[2rem] border border-primary/5 shadow-xl overflow-x-auto">
                                    {['pods', 'exports', 'circular', 'academy'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setHorizonTab(tab)}
                                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${horizonTab === tab ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-cream'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-12 border border-primary/5 shadow-2xl relative overflow-hidden">
                                {horizonTab === 'pods' && (
                                    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in">
                                        {pods.map(pod => (
                                            <div key={pod.id} className="bg-cream/30 p-8 rounded-[3rem] border border-primary/5 space-y-6">
                                                <h4 className="text-2xl font-black font-serif">{pod.name}</h4>
                                                <div className="grid grid-cols-2 gap-6 text-sm">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase text-primary/30">Crop</p>
                                                        <p className="font-black italic text-secondary">{pod.crop}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase text-primary/30">Health</p>
                                                        <p className="font-black">{pod.health}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {horizonTab === 'exports' && <p className="text-center py-20 text-primary/20 font-black uppercase">Global Route Network Active</p>}
                                {horizonTab === 'circular' && <p className="text-center py-20 text-primary/20 font-black uppercase">Waste-to-Wealth Stream Live</p>}
                                {horizonTab === 'academy' && <p className="text-center py-20 text-primary/20 font-black uppercase">Skill Mastery Academy Ready</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Modals */}
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
                        </div>
                        {!diagnosis ? (
                            <div className="space-y-8">
                                <div className="border-4 border-dashed border-primary/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 group hover:border-secondary cursor-pointer">
                                    <Camera size={32} />
                                    <p className="font-black text-sm uppercase">Upload Crop Photo</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Maize', 'Onion', 'Pepper'].map(crop => (
                                        <button key={crop} onClick={() => handleDiagnose(crop)} className="bg-cream hover:bg-secondary py-4 rounded-2xl font-black text-[10px] uppercase">
                                            {crop}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-cream rounded-[2.5rem] space-y-4">
                                <h4 className="text-2xl font-black font-serif italic">{diagnosis.diagnosis}</h4>
                                <p className="text-sm font-medium leading-relaxed">{diagnosis.treatment}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isVoiceListingOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-2xl text-center text-white">
                    <div className="bg-white/10 p-12 rounded-[4rem] border border-white/10 w-full max-w-lg">
                        <button onClick={() => setIsVoiceListingOpen(false)} className="absolute top-10 right-10"><X /></button>
                        <div className="w-32 h-32 rounded-full mx-auto bg-secondary flex items-center justify-center mb-8 cursor-pointer" onClick={handleVoiceListing}>
                            <Mic size={48} className={isRecording ? 'animate-pulse' : ''} />
                        </div>
                        <h4 className="text-2xl font-black font-serif">Voice Assistant</h4>
                        <p className="mt-4 text-white/40">{isRecording ? "Listening..." : "Tap the mic to start listing"}</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
