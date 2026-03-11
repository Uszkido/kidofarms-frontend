"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Sprout,
    ShoppingBag,
    TrendingUp,
    Plus,
    ArrowRight,
    Search,
    Brain,
    Loader2,
    ShieldCheck,
    QrCode,
    Mic,
    Building2,
    Globe,
    RefreshCw,
    GraduationCap,
    Warehouse,
    Activity,
    DollarSign,
    Box,
    Clock,
    BarChart3,
    Wallet,
    MapPin,
    Package,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    Calendar,
    ThermometerSun,
    Droplets,
    Zap,
    Camera,
    X,
    Filter,
    Users,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    ShieldAlert,
    Fingerprint
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function SupplierDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // States from Farmer
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

    // Horizon Phase 5 States
    const [horizonTab, setHorizonTab] = useState('shield');
    const [pods, setPods] = useState<any[]>([]);
    const [exports, setExports] = useState<any[]>([]);
    const [circular, setCircular] = useState<any>(null);
    const [academy, setAcademy] = useState<any[]>([]);

    // Vendor Stats
    const [stats, setStats] = useState({
        totalSales: "₦1.8M",
        activeOrders: 15,
        stockItems: 52,
        harvestProgress: "64%",
        growth: "+22%"
    });

    // Tab State
    const [activeTab, setActiveTab] = useState("overview");

    // Dynamic Role Detection
    const isFarmer = userRole === 'farmer' || userRole === 'admin';
    const isVendor = userRole === 'vendor' || userRole === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sRes = await fetch(getApiUrl("/api/sensors"));
                if (sRes.ok) setSensors(await sRes.json());

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
                console.error(err);
            } finally {
                setLoadingSensors(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

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
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Hero Section - Combined */}
                        <header className="relative py-12 md:py-16 px-6 md:px-10 bg-primary rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-secondary/10 -skew-x-12 translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-[3000ms]" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-20 animate-pulse" />

                            <img
                                src={farmProfile.profileImg}
                                alt="Farm Profile"
                                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[5000ms]"
                            />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-white">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Sprout size={14} /> {farmProfile.name} • Sovereign Node
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-serif leading-none tracking-tighter">
                                        Supplier <br />
                                        <span className="text-secondary italic">Console</span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link href="/dashboard/supplier/products/new" className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-2">
                                            <Plus size={16} /> New Harvest Listing
                                        </Link>
                                        <button onClick={() => setIsEditProfileOpen(true)} className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md">
                                            Edit Node Profile
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 w-full max-w-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Available Payout</p>
                                                <p className="text-4xl font-black font-serif text-white leading-none">{stats.totalSales}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                                <Wallet size={24} />
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest">
                                            <span>Network Sync: High</span>
                                            <span className="text-secondary">{stats.growth}</span>
                                        </div>
                                        <Link href="/dashboard/supplier/cashout" className="block w-full text-center bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans">
                                            Access Funds Node
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Mixed Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Yield", value: "2.4 Tons", icon: Sprout, color: "bg-green-500", detail: "+12% vs last cycle" },
                                { label: "Moisture Node", value: getSensorVal('moisture') + (getSensorVal('moisture') !== '--' ? '%' : ''), icon: Droplets, color: "bg-secondary", detail: "Sector 4A Optimal" },
                                { label: "Active Orders", value: stats.activeOrders, icon: ShoppingBag, color: "bg-blue-500", detail: "Awaiting Logistics" },
                                { label: "Stock Items", value: stats.stockItems, icon: Box, color: "bg-orange-500", detail: "Warehouse Active" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={26} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif text-primary uppercase">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{stat.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[8px] font-black uppercase text-primary/60">
                                        <CheckCircle2 size={10} className="text-secondary" /> {stat.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {[
                                { id: "overview", label: "Command Center", icon: LayoutDashboard },
                                { id: "inventory", label: "Inventory Vault", icon: ShoppingBag },
                                { id: "horizon", label: "Horizon 5.0", icon: Sparkles },
                                { id: "monitoring", label: "Precision Node", icon: Activity },
                                { id: "financials", label: "Payout Registry", icon: Wallet },
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

                        {/* Main Content Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Feed Display */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "overview" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif italic text-primary">Live <span className="text-secondary">Harvest Tracking</span></h2>
                                            <Link href="/dashboard/supplier/stories" className="text-xs font-black uppercase tracking-widest text-secondary hover:underline underline-offset-8 transition-all">Go Live on Horizon <Camera size={14} className="inline ml-1" /></Link>
                                        </div>
                                        <div className="grid gap-6">
                                            {[
                                                { crop: "Yellow Maize", stage: "Late Growing", progress: 85, health: "Optimal", location: "Sector 4A" },
                                                { crop: "Bulk Onions", stage: "Seedling", progress: 15, health: "Monitoring", location: "Sector 2B" },
                                            ].map((item, i) => (
                                                <div key={i} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-xl group hover:border-secondary transition-all">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                                <Sprout size={28} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-2xl font-black font-serif">{item.crop}</h4>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{item.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-3xl font-black font-serif text-primary">{item.progress}%</span>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic">{item.stage}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5">
                                                        <div className={`h-full bg-secondary rounded-full transition-all duration-[3000ms]`} style={{ width: `${item.progress}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Oracle Snippet */}
                                        <div className="bg-primary p-12 rounded-[4rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                                            <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                                            <h3 className="text-2xl md:text-4xl font-black font-serif italic leading-none uppercase">Kido <span className="text-secondary">Price Oracle</span></h3>
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-lg italic">Neural market surge detected for Root Tubers in Lagos Node. Recommendation: Initiate early listing protocols for Premium Yam harvests.</p>
                                            <button onClick={() => setHorizonTab('oracle')} className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl">View Market Oracle</button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "inventory" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex items-center justify-between px-4">
                                            <h2 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">Product <span className="text-secondary">Lifecycle</span></h2>
                                            <div className="flex gap-4">
                                                <button className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all"><Search size={18} className="text-primary/20" /></button>
                                                <Link href="/dashboard/supplier/products/new" className="bg-primary text-white p-3 rounded-xl shadow-lg hover:bg-secondary hover:text-primary transition-all"><Plus size={18} /></Link>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl overflow-hidden p-6 md:p-10">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px]">
                                                    <thead>
                                                        <tr className="border-b border-primary/5 text-left text-[10px] font-black uppercase tracking-widest text-primary/20">
                                                            <th className="px-6 py-6 font-black">Product Node</th>
                                                            <th className="px-6 py-6 font-black">Vault Status</th>
                                                            <th className="px-6 py-6 text-right font-black">Listed Revenue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-primary/5">
                                                        {[
                                                            { name: "Organic Honey Extract", stock: 124, price: "₦4,500", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80" },
                                                            { name: "Dried Plantain Chips", stock: 56, price: "₦1,200", img: "https://images.unsplash.com/photo-1613511721526-78810e7b886c?auto=format&fit=crop&q=80" },
                                                            { name: "Cold Pressed Palm Oil", stock: 12, price: "₦8,900", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80" }
                                                        ].map((item, i) => (
                                                            <tr key={i} className="group hover:bg-cream/20 transition-colors cursor-pointer" onClick={() => handleAction(`Edit ${item.name}`)}>
                                                                <td className="px-6 py-8 flex items-center gap-6">
                                                                    <img src={item.img} className="w-16 h-16 rounded-2xl object-cover shadow-xl group-hover:scale-110 transition-transform" />
                                                                    <div>
                                                                        <p className="font-black text-xl text-primary font-serif italic uppercase">{item.name}</p>
                                                                        <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1">Sovereign Batch #00{i + 1}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-8">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`w-3 h-3 rounded-full ${item.stock < 20 ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500'}`} />
                                                                        <span className="text-xs font-black uppercase tracking-widest">{item.stock} Units</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-8 text-right font-black text-lg text-primary">{item.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="pt-10 flex justify-center">
                                                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 hover:text-secondary transition-all">Access Complete Inventory Ledger</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "horizon" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                                            <h2 className="text-4xl font-black font-serif text-primary uppercase italic tracking-tighter">Horizon <span className="text-secondary tracking-tighter">5.0</span></h2>
                                            <div className="flex bg-white p-2 rounded-[2.5rem] border border-primary/5 shadow-xl overflow-x-auto no-scrollbar scroll-smooth">
                                                {['shield', 'bridge', 'energy', 'academy', 'oracle', 'logistics'].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setHorizonTab(tab)}
                                                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${horizonTab === tab ? 'bg-primary text-white shadow-lg' : 'text-primary/30 hover:bg-neutral-50'}`}
                                                    >
                                                        {tab === 'shield' ? 'Yield-Shield' : tab === 'bridge' ? 'Global Bridge' : tab === 'energy' ? 'Sovereign Energy' : tab === 'academy' ? 'Mastery Academy' : tab === 'oracle' ? 'Price Oracle' : 'Logistics Node'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-primary/5 shadow-2xl relative overflow-hidden min-h-[500px]">
                                            {horizonTab === 'shield' && (
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
                                                        <button onClick={() => handleAction("Risk Protocol Download")} className="bg-secondary text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl mt-8">
                                                            Download Integrity Report
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Other Horizon Tabs placeholders would be here similarly as in Farmer Dashboard */}
                                            {horizonTab === 'oracle' && (
                                                <div className="space-y-12 animate-in fade-in duration-500">
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-4">
                                                            <h3 className="text-3xl md:text-5xl font-black font-serif text-primary italic uppercase tracking-tighter">Kido <span className="text-secondary italic">Price Oracle</span></h3>
                                                            drum
                                                            <p className="text-primary/40 text-xs font-black uppercase tracking-widest">Global Neural Market Intelligence</p>
                                                        </div>
                                                        <div className="bg-primary/5 px-8 py-5 rounded-[2.5rem] border border-primary/5 shadow-inner">
                                                            <p className="text-[9px] font-black uppercase text-secondary mb-1">Node Accuracy</p>
                                                            <p className="text-3xl font-black font-serif text-primary italic font-sans animate-pulse">98.4%</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-8">
                                                        {[
                                                            { crop: 'Maize (Yellow)', current: '₦450/kg', predicted: '₦520/kg', trend: 'up' },
                                                            { crop: 'Onions (Red)', current: '₦320/kg', predicted: '₦280/kg', trend: 'down' },
                                                            { crop: 'Rice (Short)', current: '₦650/kg', predicted: '₦690/kg', trend: 'up' }
                                                        ].map(item => (
                                                            <div key={item.crop} className="bg-neutral-50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 space-y-8 group hover:border-secondary transition-all shadow-sm hover:shadow-2xl">
                                                                drum
                                                                <div className="flex justify-between items-center">
                                                                    <h4 className="font-black font-serif text-2xl uppercase tracking-tighter">{item.crop}</h4>
                                                                    {item.trend === 'up' ? <TrendingUp className="text-green-500 bg-green-50 p-1.5 rounded-lg" size={32} /> : <TrendingUp className="text-red-500 bg-red-50 p-1.5 rounded-lg rotate-180" size={32} />}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-6">
                                                                    <div>
                                                                        <p className="text-[9px] font-black uppercase text-primary/20 mb-1">Index Price</p>
                                                                        <p className="text-2xl font-black font-serif text-primary italic font-sans">{item.current}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[9px] font-black uppercase text-secondary/30 mb-1">Predicted</p>
                                                                        <p className="text-2xl font-black font-serif text-secondary italic font-sans">{item.predicted}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "monitoring" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 px-4">
                                            <div>
                                                <h2 className="text-4xl font-black font-serif text-primary italic uppercase tracking-tighter">Precision <span className="text-secondary italic">Monitoring Hub</span></h2>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Satellite & In-Field IoT Sensory Mesh</p>
                                            </div>
                                            <div className="bg-white px-8 py-5 rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40 border border-primary/5 shadow-xl">
                                                <Activity size={14} className="text-secondary animate-pulse" /> Node Connectivity: Authorized
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-8">
                                            <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between">
                                                <div>
                                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-10 shadow-lg">
                                                        <TrendingUp size={32} />
                                                    </div>
                                                    <h4 className="text-2xl font-black font-serif uppercase tracking-tighter mb-2 italic">Yield Prediction</h4>
                                                    <p className="text-primary/30 text-[9px] font-black uppercase tracking-widest mb-10">Neural estimated node output</p>
                                                </div>
                                                <div className="flex items-end gap-3 text-primary">
                                                    <span className="text-6xl font-black font-serif italic tracking-tighter">4.2</span>
                                                    <span className="text-sm font-black opacity-20 mb-3 tracking-widest uppercase">Tons / HA</span>
                                                </div>
                                            </div>
                                            <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between">
                                                <div>
                                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-10 shadow-lg">
                                                        <MapPin size={32} />
                                                    </div>
                                                    <h4 className="text-2xl font-black font-serif uppercase tracking-tighter mb-2 italic">NDVI Spectral</h4>
                                                    <p className="text-primary/30 text-[9px] font-black uppercase tracking-widest mb-10">Vegetation Health Indexing</p>
                                                </div>
                                                <div className="flex items-end gap-3 text-green-500">
                                                    <span className="text-6xl font-black font-serif italic tracking-tighter">0.82</span>
                                                    <span className="text-sm font-black opacity-20 mb-3 tracking-widest uppercase">Optimal Grade</span>
                                                </div>
                                            </div>
                                            <div className="bg-primary p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center justify-center space-y-6 text-center">
                                                <Fingerprint className="text-secondary animate-pulse" size={64} />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Node Biometrics</p>
                                                    <h4 className="text-2xl font-black font-serif italic mt-2">Identity Verified</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "financials" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">Sovereign <span className="text-secondary">Settlements</span></h2>
                                            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">Batch Summary Request</button>
                                        </div>
                                        <div className="bg-secondary p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] space-y-10 shadow-2xl">
                                            <div className="grid gap-6">
                                                {[
                                                    { date: "Oct 28", amount: "₦420,000", status: "Processing", id: "#ST-902-X" },
                                                    { date: "Oct 21", amount: "₦185,500", status: "Settled", id: "#ST-884-X" },
                                                    { date: "Oct 14", amount: "₦310,000", status: "Settled", id: "#ST-871-X" },
                                                ].map((pay, i) => (
                                                    <div key={i} className="flex justify-between items-center bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 group hover:bg-white transition-all shadow-sm">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                                                                <DollarSign size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xl font-black font-serif italic uppercase text-primary">{pay.amount}</p>
                                                                <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1">Registry ID: {pay.id}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${pay.status === 'Settled' ? 'bg-green-500 text-white' : 'bg-primary text-white animate-pulse'}`}>{pay.status}</span>
                                                            <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest mt-3">{pay.date}, 2026</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Options Cache */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Network Watcher */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black font-serif italic uppercase tracking-tighter">Network <span className="text-secondary underline decoration-2 underline-offset-4">Watch</span></h3>
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                                    </div>
                                    <div className="grid gap-4">
                                        {[
                                            { label: "Regional Demand", value: "+15%", icon: TrendingUp, color: "text-green-500" },
                                            { label: "Node Latency", value: "14ms", icon: Activity, color: "text-blue-500" },
                                            { label: "Chain Integrity", value: "99.8%", icon: ShieldCheck, color: "text-purple-500" },
                                        ].map((n, i) => (
                                            <div key={i} className="flex justify-between items-center p-6 bg-cream/20 rounded-[2rem] border border-primary/5 group hover:bg-primary transition-all duration-500">
                                                <div className="flex items-center gap-4">
                                                    <n.icon size={16} className={`${n.color}`} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40">{n.label}</p>
                                                </div>
                                                <p className={`text-xs font-black italic ${n.color} group-hover:text-secondary`}>{n.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsAgronomistOpen(true)} className="w-full bg-primary text-secondary py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 font-sans">
                                        <Brain size={18} /> Disease Pulse Scan
                                    </button>
                                </div>

                                {/* Voice Console Mini */}
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <Mic className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:rotate-12 transition-transform duration-1000" />
                                    <div className="relative z-10 space-y-6">
                                        <h4 className="text-2xl font-black font-serif italic uppercase tracking-tighter">Voice <br /><span className="text-secondary italic">Command</span></h4>
                                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-relaxed italic max-w-xs">Broadcast your harvest data using natural language. Encrypted voice-to-listing protocol.</p>
                                        <div className="w-14 h-14 bg-secondary rounded-[1.5rem] flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
                                            <Mic size={28} />
                                        </div>
                                    </div>
                                </div>

                                {/* Alerts Registry */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-8">
                                    <h3 className="text-xl font-black font-serif italic uppercase px-2 text-primary">Alert <span className="text-secondary">Notifications</span></h3>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Price Surge", desc: "Grain nodes see 15% regional hike.", type: "market" },
                                            { title: "Weather Delta", desc: "Heavy rain expected in 24h.", type: "climate" }
                                        ].map((alert, i) => (
                                            <div key={i} className="flex gap-4 p-4 border-b border-primary/5 last:border-0 pb-6">
                                                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                                                    {alert.type === 'market' ? <TrendingUp size={18} /> : <ThermometerSun size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-primary leading-none">{alert.title}</p>
                                                    <p className="text-[9px] font-medium text-primary/30 leading-relaxed uppercase">{alert.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Modals Bridge */}
            {isAgronomistOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-primary/90 backdrop-blur-2xl">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => { setIsAgronomistOpen(false); setDiagnosis(null); }} className="absolute top-10 right-10 text-primary/10 hover:text-primary transition-colors">
                            <X size={32} />
                        </button>
                        <div className="text-center mb-10 space-y-6">
                            <div className="w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                                <Brain size={48} />
                            </div>
                            <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter leading-none">AI <span className="text-secondary">Agronomist</span></h3>
                        </div>

                        {!diagnosis ? (
                            <div className="space-y-10">
                                <label className="border-4 border-dashed border-primary/5 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-6 group hover:border-secondary cursor-pointer transition-all bg-cream/10">
                                    <input type="file" className="hidden" onChange={() => handleDiagnose("Uploaded Node Mapping")} />
                                    {diagnosing ? <Loader2 size={40} className="animate-spin text-secondary" /> : <Camera size={40} className="text-primary/10 group-hover:text-secondary group-hover:scale-110 transition-all" />}
                                    <p className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/30 group-hover:text-primary transition-all">Capture Bio-Data Node</p>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Maize', 'Onion', 'Rice', 'Spice', 'Cocoa', 'Bean'].map(crop => (
                                        <button key={crop} onClick={() => handleDiagnose(crop)} className="bg-neutral-50 border border-primary/5 hover:bg-secondary hover:text-primary py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                                            {crop}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 bg-cream/30 rounded-[3rem] border border-primary/5 space-y-6 animate-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <CheckCircle size={24} className="text-green-500" />
                                    <h4 className="text-2xl font-black font-serif italic text-primary uppercase leading-none">{diagnosis.diagnosis}</h4>
                                </div>
                                <p className="text-xs font-medium leading-relaxed text-primary/60">{diagnosis.treatment}</p>
                                <button onClick={() => setDiagnosis(null)} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">New Analysis Batch</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isVoiceListingOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-primary/95 backdrop-blur-3xl text-white">
                    <div className="bg-white/10 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 w-full max-w-lg shadow-2xl relative text-center space-y-10">
                        <button onClick={() => setIsVoiceListingOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
                        <div className={`w-36 h-36 rounded-full mx-auto flex items-center justify-center transition-all duration-700 cursor-pointer shadow-2xl ${isRecording ? 'bg-secondary animate-pulse scale-110' : 'bg-white/10 hover:bg-white/20'}`} onClick={handleVoiceListing}>
                            <Mic size={56} className={isRecording ? 'text-primary' : 'text-secondary'} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-3xl font-black font-serif italic uppercase tracking-tighter">Voice <span className="text-secondary">Assistant</span></h4>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] font-sans">
                                {isRecording ? "Listening for Production Data..." : "Tap Node to Initialized Listening"}
                            </p>
                        </div>
                        {voiceResult && (
                            <div className="p-8 bg-white text-primary rounded-[3rem] space-y-4 animate-in zoom-in-95">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Node Identified:</p>
                                <p className="text-2xl font-black font-serif italic">{voiceResult.original}</p>
                                <button className="w-full bg-secondary text-primary py-4 rounded-xl font-black text-[10px] uppercase tracking-widest mt-4">Broadcast to Vault</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isEditProfileOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-primary/95 backdrop-blur-2xl transition-all">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] -translate-y-40 translate-x-40" />
                        <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-10 right-10 text-primary/10 hover:text-primary z-50 transition-colors">
                            <X size={32} />
                        </button>

                        <div className="space-y-12 relative z-10">
                            <div className="space-y-4">
                                <h3 className="text-5xl font-black font-serif uppercase tracking-tighter leading-none italic">Edit <span className="text-secondary">Node Identity</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Profile & Geographic Hub Configuration</p>
                            </div>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsEditProfileOpen(false); alert("Horizon Node Updated."); }}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Node Primary Name</label>
                                        <input
                                            value={farmProfile.name}
                                            onChange={(e) => setFarmProfile({ ...farmProfile, name: e.target.value })}
                                            className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-8 py-5 outline-none focus:border-secondary font-black uppercase tracking-widest text-[10px] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Geographic Anchor</label>
                                        <input
                                            value={farmProfile.location}
                                            onChange={(e) => setFarmProfile({ ...farmProfile, location: e.target.value })}
                                            className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-8 py-5 outline-none focus:border-secondary font-black uppercase tracking-widest text-[10px] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Node Description & Bio</label>
                                    <textarea
                                        value={farmProfile.description}
                                        onChange={(e) => setFarmProfile({ ...farmProfile, description: e.target.value })}
                                        className="w-full h-36 bg-cream/10 border border-primary/5 rounded-[2rem] px-8 py-6 outline-none focus:border-secondary font-medium text-xs leading-relaxed transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary text-secondary py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-2xl">
                                    Broadcast Update To Kido Mesh
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}
