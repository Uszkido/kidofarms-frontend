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
    Activity,
    Warehouse,
    Fingerprint
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

import { ActionStatus } from "@/components/ActionStatus";

export default function FarmerDashboard() {
    const router = useRouter();
    useEffect(() => {
        router.push("/dashboard/supplier");
    }, [router]);

    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const [sensors, setSensors] = useState<any[]>([]);
    const [loadingSensors, setLoadingSensors] = useState(true);
    const [isAgronomistOpen, setIsAgronomistOpen] = useState(false);
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [diagnosing, setDiagnosing] = useState(false);
    const [isVoiceListingOpen, setIsVoiceListingOpen] = useState(false);
    const [voiceResult, setVoiceResult] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [farmProfile, setFarmProfile] = useState({
        name: "Kido Alpha Node",
        location: "Kano State, Nigeria",
        description: "Leading producer of organic grains and tubers in the northern belt.",
        crops: ["Maize", "Onion", "Pepper", "Rice"],
        profileImg: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80"
    });

    const handleAction = (label: string) => {
        if (label === "Edit Farm Profile") {
            setIsEditProfileOpen(true);
            return;
        }

        setActionState({
            isOpen: true,
            title: label,
            message: "Node synchronization in progress...",
            status: "processing"
        });

        setTimeout(() => {
            setActionState(prev => ({
                ...prev,
                message: `${label} protocol successfully initiated. Node synchronization complete.`,
                status: "success"
            }));
        }, 2000);
    };

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
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />
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
                                    <h1 className="text-3xl md:text-6xl font-black font-serif text-white leading-tight">{farmProfile.name} <br /><span className="text-secondary italic">Command Center</span></h1>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => handleAction("Edit Farm Profile")}
                                        className="flex-1 md:flex-none border-2 border-primary/5 px-8 py-4 rounded-2xl font-black text-sm hover:bg-cream transition-all flex items-center justify-center gap-3"
                                    >
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

                                <Link href="/dashboard/farmer/stories" className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-xl flex flex-col justify-between min-h-[200px] group">
                                    <Activity className="text-secondary group-hover:rotate-12 transition-transform" size={32} />
                                    <div>
                                        <h4 className="text-xl font-black font-serif italic mb-1">Horizon Story</h4>
                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Broadcast live farm sessions.</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest">
                                        Open Horizon <Camera size={14} />
                                    </div>
                                </Link>
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

                        {/* Kido Horizon (Phase 5: The Sovereign System) */}
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-4xl font-black font-serif text-primary">Kido <span className="text-secondary italic">Horizon 5.0</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">The Sovereign Food Infrastructure</p>
                                </div>
                                <div className="flex bg-white p-2 rounded-[2rem] border border-primary/5 shadow-xl overflow-x-auto">
                                    {['shield', 'bridge', 'energy', 'academy', 'oracle', 'logistics'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setHorizonTab(tab)}
                                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${horizonTab === tab ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-neutral-50'}`}
                                        >
                                            {tab === 'shield' ? 'Yield-Shield' : tab === 'bridge' ? 'Global Bridge' : tab === 'energy' ? 'Sovereign Energy' : tab === 'academy' ? 'Mastery Academy' : tab === 'oracle' ? 'Price Oracle' : 'Logistics Node'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-12 border border-primary/5 shadow-2xl relative overflow-hidden min-h-[500px]">
                                {horizonTab === 'shield' && (
                                    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
                                        <div className="space-y-8">
                                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <ShieldCheck size={14} /> Active Protection
                                            </div>
                                            <h3 className="text-5xl font-black font-serif text-primary">Yield <br /><span className="text-secondary italic">Shield Node</span></h3>
                                            <p className="text-primary/40 text-sm font-medium leading-relaxed">Your farm is protected by parametric micro-insurance. If local IoT sensors detect climate anomalies, your survival credits are released automatically.</p>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 bg-neutral-50 rounded-[2rem] border border-primary/5">
                                                    <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Risk Score</p>
                                                    <p className="text-3xl font-black font-serif text-primary italic">12.4%</p>
                                                </div>
                                                <div className="p-6 bg-neutral-50 rounded-[2rem] border border-primary/5">
                                                    <p className="text-[8px] font-black uppercase text-primary/30 mb-1">Coverage</p>
                                                    <p className="text-3xl font-black font-serif text-primary italic">₦5.0M</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-primary rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-[80px]" />
                                            <div className="space-y-6 relative">
                                                <h4 className="text-xl font-black font-serif">Satellite Lock <br /><span className="text-secondary">Sentinel-2 Analysis</span></h4>
                                                <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <Globe className="mx-auto text-secondary mb-2 animate-pulse" size={32} />
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Visualizing Sector 4A...</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAction("Risk Report Download")}
                                                className="bg-secondary text-primary py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all relative"
                                            >
                                                Download Risk Report
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'bridge' && (
                                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                                        <div className="md:col-span-2 space-y-8">
                                            <h3 className="text-5xl font-black font-serif text-primary">Global <br /><span className="text-secondary italic">Export Bridge</span></h3>
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
                                                    <RefreshCw className="text-primary/20 animate-spin-slow" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-secondary rounded-[3rem] p-10 flex flex-col justify-between">
                                            <h4 className="text-2xl font-black font-serif italic text-primary">Active Routes</h4>
                                            <div className="space-y-4">
                                                {['Lagos Node -> London Hub', 'Kano Node -> Dubai Fresh', 'Jos Node -> NYC Bio'].map((route, i) => (
                                                    <div key={route} className="flex items-center gap-3 text-[10px] font-black uppercase text-primary/60">
                                                        <div className="w-2 h-2 rounded-full bg-primary" /> {route}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleAction("Global Export Application")}
                                                className="w-full bg-primary text-white py-5 rounded-xl font-black text-xs uppercase hover:bg-white hover:text-primary transition-all"
                                            >
                                                Apply for Export
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'energy' && (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-5xl font-black font-serif text-primary">Sovereign <br /><span className="text-secondary italic">Energy Node</span></h3>
                                                <p className="text-primary/40 mt-2 text-sm font-medium">Trade your waste-to-wealth credits for next-gen farm tech.</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-primary/30 mb-1">Accumulated Waste Credits</p>
                                                <p className="text-4xl font-black font-serif text-secondary italic">4,280 <span className="text-lg">Cr</span></p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {[
                                                { name: 'Solar Kit v2', cost: 1200, icon: Zap, img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80' },
                                                { name: 'Biogas Unit', cost: 2500, icon: RefreshCw, img: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80' },
                                                { name: 'Eco-Irrigation', cost: 800, icon: Droplets, img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80' }
                                            ].map(item => (
                                                <div key={item.name} className="group bg-neutral-50 rounded-[3rem] overflow-hidden border border-primary/5 hover:border-secondary transition-all shadow-xl">
                                                    <div className="h-40 relative">
                                                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary border border-primary/5">
                                                            {item.cost} Cr
                                                        </div>
                                                    </div>
                                                    <div className="p-8 space-y-4">
                                                        <h4 className="font-black font-serif text-xl">{item.name}</h4>
                                                        <button
                                                            onClick={() => handleAction(`Redeem Credit for ${item.name}`)}
                                                            className="w-full bg-primary text-white py-3 rounded-xl font-black text-[10px] uppercase hover:bg-secondary hover:text-primary transition-all"
                                                        >
                                                            Redeem Credit
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'academy' && (
                                    <div className="grid md:grid-cols-12 gap-12 animate-in fade-in duration-500">
                                        <div className="md:col-span-4 space-y-8">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-secondary flex items-center justify-center text-primary shadow-2xl relative">
                                                <GraduationCap size={48} />
                                                <div className="absolute -bottom-2 -right-2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-4 border-white">
                                                    4
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-black font-serif text-primary">Mastery <br /><span className="text-secondary italic">Level 4</span></h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Rank: Elite Specialist</p>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Active Achievements</p>
                                                <div className="flex gap-3">
                                                    {[Sparkles, ShieldCheck, MapPin].map((Icon, i) => (
                                                        <div key={i} className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-secondary border border-primary/5">
                                                            <Icon size={20} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="flex justify-between items-center px-4">
                                                <h4 className="text-2xl font-black font-serif italic text-primary">Skill Modules</h4>
                                                <span className="text-[10px] font-black uppercase text-secondary">2,400 XP to Level 5</span>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { title: "Climate-Smart Irrigation", progress: 85, status: "Advanced" },
                                                    { title: "Sovereign Supply Management", progress: 40, status: "Intermediate" },
                                                    { title: "Export Quality Compliance", progress: 100, status: "Mastered" }
                                                ].map(skill => (
                                                    <div
                                                        key={skill.title}
                                                        onClick={() => handleAction(`Mastery Module: ${skill.title}`)}
                                                        className="bg-neutral-50 p-8 rounded-[2.5rem] border border-primary/5 space-y-4 group hover:border-secondary transition-all cursor-pointer shadow-sm hover:shadow-xl"
                                                    >
                                                        <div className="flex justify-between items-center text-sm font-black uppercase">
                                                            <p className="flex items-center gap-2"> <Sparkles size={14} className="text-secondary" /> {skill.title}</p>
                                                            <span className="text-primary/30 italic">{skill.status}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                                                            <div className="h-full bg-secondary transition-all duration-[2000ms]" style={{ width: `${skill.progress}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'oracle' && (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-5xl font-black font-serif text-primary italic">Kido <span className="text-secondary tracking-tighter">Price Oracle</span></h3>
                                                <p className="text-primary/40 mt-2 text-sm font-medium">Neural market predictions for next-cycle harvests.</p>
                                            </div>
                                            <div className="bg-primary/5 px-6 py-4 rounded-[2rem] border border-primary/5">
                                                <p className="text-[10px] font-black uppercase text-secondary mb-1">Oracle Trust Index</p>
                                                <p className="text-2xl font-black font-serif text-primary">98.4%</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {[
                                                { crop: 'Maize (Yellow)', current: '₦450/kg', predicted: '₦520/kg', trend: 'up' },
                                                { crop: 'Onions (Red)', current: '₦320/kg', predicted: '₦280/kg', trend: 'down' },
                                                { crop: 'Rice (Short)', current: '₦650/kg', predicted: '₦690/kg', trend: 'up' }
                                            ].map(item => (
                                                <div key={item.crop} className="bg-neutral-50 p-10 rounded-[3rem] border border-primary/5 space-y-6 group hover:border-secondary transition-all">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-black font-serif text-2xl">{item.crop}</h4>
                                                        {item.trend === 'up' ? <TrendingUp className="text-green-500" /> : <TrendingUp className="text-red-500 rotate-180" />}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase text-primary/30">Current</p>
                                                            <p className="text-xl font-black font-serif text-primary">{item.current}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase text-secondary/40">Predicted</p>
                                                            <p className="text-xl font-black font-serif text-secondary italic">{item.predicted}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-primary text-white p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10">
                                            <div className="space-y-4">
                                                <h4 className="text-3xl font-black font-serif italic text-secondary">Neural Insight</h4>
                                                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xl">"Localized supply shortages in Plateau district indicate a potential price spike for Grains in Q3. Recommendation: Optimize storage Node for late-release."</p>
                                            </div>
                                            <button className="bg-white text-primary px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shrink-0">Connect Price Feed</button>
                                        </div>
                                    </div>
                                )}

                                {horizonTab === 'logistics' && (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <div className="flex justify-between items-center px-4">
                                            <h3 className="text-5xl font-black font-serif text-primary">Last-Mile <br /><span className="text-secondary italic">Logistics Node</span></h3>
                                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                                <MapPin size={32} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="bg-neutral-50 p-12 rounded-[4rem] border border-primary/5 space-y-8">
                                                <h4 className="text-2xl font-black font-serif italic text-primary">Active Shipments</h4>
                                                <div className="space-y-6">
                                                    {[
                                                        { id: '#NODE-LGS-42', dest: 'Lagos Main Hub', status: 'In Transit', progress: 65 },
                                                        { id: '#NODE-PH-09', dest: 'P/Harcourt Node', status: 'Pending Pickup', progress: 5 }
                                                    ].map(shipment => (
                                                        <div key={shipment.id} className="space-y-3 bg-white p-6 rounded-2xl border border-primary/5">
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                                <p className="text-primary">{shipment.dest}</p>
                                                                <span className="text-secondary">{shipment.status}</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                                                <div className="h-full bg-secondary" style={{ width: `${shipment.progress}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-secondary hover:text-primary transition-all">Book Global Shipment</button>
                                            </div>
                                            <div className="bg-primary/5 rounded-[4rem] border border-primary/5 p-12 flex flex-col items-center justify-center space-y-8 text-center">
                                                <Globe className="text-secondary animate-spin-slow" size={64} />
                                                <div>
                                                    <h4 className="text-2xl font-black font-serif italic text-primary uppercase">Track Node</h4>
                                                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-2">Open the visual tracking portal</p>
                                                </div>
                                                <Link href="/dashboard/logistics" className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Enter Tracking System</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                <label className="border-4 border-dashed border-primary/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 group hover:border-secondary cursor-pointer transition-all">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleDiagnose("Uploaded Image Analysis");
                                            }
                                        }}
                                        accept="image/*"
                                    />
                                    <div className="relative">
                                        {diagnosing ? (
                                            <Loader2 size={32} className="animate-spin text-secondary" />
                                        ) : (
                                            <Camera size={32} className="text-primary/20 group-hover:text-secondary group-hover:scale-110 transition-all" />
                                        )}
                                    </div>
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary/40 group-hover:text-primary transition-all">
                                        {diagnosing ? "Analyzing Bio-Data..." : "Upload Crop Scan"}
                                    </p>
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {['Maize', 'Onion', 'Pepper', 'Rice', 'Wheat', 'Cocoa', 'Cassava', 'Yam', 'Tomato', 'Ginger', 'Cashew', 'Sorghum'].map(crop => (
                                        <button
                                            key={crop}
                                            onClick={() => handleDiagnose(crop)}
                                            className="bg-cream/50 hover:bg-secondary hover:text-primary py-4 rounded-2xl font-black text-[8px] uppercase tracking-widest transition-all border border-primary/5 hover:border-secondary shadow-sm hover:shadow-xl"
                                        >
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

            {isEditProfileOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/95 backdrop-blur-xl transition-all">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -translate-y-32 translate-x-32" />

                        <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-10 right-10 text-primary/20 hover:text-primary z-50">
                            <X size={28} />
                        </button>

                        <div className="space-y-10 relative z-10">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Profile Configuration</h2>
                                <h3 className="text-4xl font-black font-serif uppercase tracking-tighter italic">Edit <span className="text-secondary">Farm Node</span></h3>
                            </div>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsEditProfileOpen(false); handleAction("Horizon Node Update"); }}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Farm Identity Name</label>
                                        <input
                                            value={farmProfile.name}
                                            onChange={(e) => setFarmProfile({ ...farmProfile, name: e.target.value })}
                                            className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black uppercase tracking-widest text-[10px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Geographic Node (Location)</label>
                                        <input
                                            value={farmProfile.location}
                                            onChange={(e) => setFarmProfile({ ...farmProfile, location: e.target.value })}
                                            className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black uppercase tracking-widest text-[10px]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Node Bio (Description)</label>
                                    <textarea
                                        value={farmProfile.description}
                                        onChange={(e) => setFarmProfile({ ...farmProfile, description: e.target.value })}
                                        className="w-full h-32 bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-medium text-xs leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4 text-center block">Visual Auth (Profile Logo)</label>
                                    <label className="border-4 border-dashed border-primary/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 group hover:border-secondary cursor-pointer transition-all">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setIsEditProfileOpen(false);
                                                    handleAction("Visual Data Upload");
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        <Camera size={32} className="text-primary/20 group-hover:text-secondary group-hover:scale-110 transition-all" />
                                        <p className="font-black text-[10px] uppercase tracking-widest text-primary/40 group-hover:text-primary">Change Profile Photo</p>
                                    </label>
                                </div>

                                <button type="submit" className="w-full bg-primary text-secondary py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-2xl">
                                    Broadcast Profile Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
