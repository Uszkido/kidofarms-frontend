"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, MessageSquare, Plus, Edit3, Trash2, ShieldCheck, Globe, Zap, Database, ArrowRight, Save, Loader2, Radio, Palette, Layout, Monitor, Cpu, Activity, TrendingUp, DollarSign, Fingerprint } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

interface ContentItem {
    id: string;
    title: string;
    body: string;
    type: string;
    category: string;
    section: "vault" | "exchange";
    status: string;
    isLive: boolean;
    createdAt?: string;
}

export default function AdminSovereigntyManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"vault" | "exchange" | "content" | "visuals" | "architect" | "stats">("vault");
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [items, setItems] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState<any>({});
    const [globalSettings, setGlobalSettings] = useState<any>(null);
    const [landingSections, setLandingSections] = useState<any>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = (session?.user as any)?.accessToken;
            const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

            if (activeTab === "vault" || activeTab === "exchange") {
                const res = await fetch(getApiUrl(`/api/admin/intel?section=${activeTab}`), { headers });
                if (res.ok) setItems(await res.json());
            } else if (activeTab === "visuals") {
                const res = await fetch(getApiUrl("/api/admin/settings"), { headers });
                if (res.ok) setGlobalSettings(await res.json());
            } else if (activeTab === "content") {
                const res = await fetch(getApiUrl("/api/landing"), { headers });
                if (res.ok) setLandingSections(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to sync with repository nodes");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) fetchData();
    }, [activeTab, isOpen, (session?.user as any)?.accessToken]);

    const handleSaveIntel = async () => {
        try {
            const token = (session?.user as any)?.accessToken;
            const url = isCreating ? getApiUrl("/api/admin/intel") : getApiUrl(`/api/admin/intel/${selectedItem.id}`);
            const method = isCreating ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(selectedItem)
            });

            if (res.ok) {
                toast.success(`Node ${isCreating ? 'Initialized' : 'Updated'}`);
                setIsEditing(false);
                fetchData();
            }
        } catch (error) {
            toast.error("Protocol violation during save");
        }
    };

    const handleSaveSettings = async (data: any) => {
        try {
            const token = (session?.user as any)?.accessToken;
            const res = await fetch(getApiUrl("/api/admin/settings"), {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success("Global Aesthetic Override Successful");
                fetchData();
            }
        } catch (error) {
            toast.error("Link Failure");
        }
    };

    const handleSaveSection = async (id: string, content: any) => {
        try {
            const token = (session?.user as any)?.accessToken;
            const res = await fetch(getApiUrl(`/api/landing/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                toast.success(`${id.toUpperCase()} Node Reconfigured`);
                fetchData();
            }
        } catch (error) {
            toast.error("Broadcast Logic Failure");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-primary/95 backdrop-blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-7xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
                {/* HEADER */}
                <div className="bg-secondary p-10 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter leading-none">Sovereignty Control</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Prime Command Interface: Contents, Visuals, Data</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-primary/5 px-6 py-3 rounded-2xl hidden lg:block">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40">Authority Node: <span className="text-primary">{session?.user?.name || "ROOT"}</span></p>
                        </div>
                        <button onClick={onClose} className="p-4 bg-primary/5 hover:bg-primary/10 rounded-full transition-all">
                            <X size={24} className="text-primary" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* SIDEBAR NAVIGATION */}
                    <div className="w-80 bg-neutral-50 border-r border-primary/5 p-8 flex flex-col justify-between shrink-0">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest pl-4">Intel Management</h4>
                                <div className="space-y-2">
                                    <button onClick={() => setActiveTab("vault")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "vault" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <BookOpen size={20} /> <span className="text-[11px] font-black uppercase">Sovereign Vault</span>
                                    </button>
                                    <button onClick={() => setActiveTab("exchange")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "exchange" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <MessageSquare size={20} /> <span className="text-[11px] font-black uppercase">Intel Exchange</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest pl-4">Admin Sovereignty</h4>
                                <div className="space-y-2">
                                    <button onClick={() => setActiveTab("content")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "content" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <Edit3 size={20} /> <span className="text-[11px] font-black uppercase">Dashboard Content</span>
                                    </button>
                                    <button onClick={() => setActiveTab("visuals")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "visuals" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <Palette size={20} /> <span className="text-[11px] font-black uppercase">Visual Aesthetic</span>
                                    </button>
                                    <button onClick={() => setActiveTab("architect")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "architect" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <Layout size={20} /> <span className="text-[11px] font-black uppercase">Layout Architect</span>
                                    </button>
                                    <button onClick={() => setActiveTab("stats")} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "stats" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}>
                                        <Activity size={20} /> <span className="text-[11px] font-black uppercase">Logic & Stats</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {(activeTab === "vault" || activeTab === "exchange") && (
                            <button onClick={() => { setSelectedItem({ section: activeTab, type: "Technical", status: "draft" }); setIsCreating(true); setIsEditing(true); }} className="w-full bg-secondary text-primary p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all">
                                <Plus size={18} /> New Protocol Node
                            </button>
                        )}
                    </div>

                    {/* DYNAMIC CONTENT AREA */}
                    <div className="flex-1 p-10 md:p-16 overflow-y-auto space-y-12 bg-white relative">
                        <div className="flex justify-between items-end relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Command Interface</h3>
                                <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter flex items-center gap-4">
                                    {activeTab === "vault" ? "Knowledge Repository" : activeTab === "exchange" ? "Community Advisories" : activeTab === "content" ? "Sovereign Dashboard CMS" : activeTab === "visuals" ? "Global Visual Registry" : activeTab === "architect" ? "Template Architect Node" : "Ghost Analytics & Simulation"}
                                    {isLoading && <Loader2 size={24} className="animate-spin text-secondary" />}
                                </h2>
                            </div>
                        </div>

                        {/* --- VIEW: INTEL (VAULT/EXCHANGE) --- */}
                        {(activeTab === "vault" || activeTab === "exchange") && (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-neutral-50 p-6 rounded-[2rem] border border-primary/5 flex items-center justify-between group hover:border-secondary transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shadow-sm">
                                                {activeTab === "vault" ? <Globe size={20} /> : <Zap size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black font-serif text-primary uppercase italic tracking-tighter">{item.title}</h4>
                                                <p className="text-[8px] font-black uppercase text-primary/30">{item.category} • {item.isLive ? 'LIVE' : 'OFFLINE'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedItem(item); setIsCreating(false); setIsEditing(true); }} className="p-3 bg-primary text-secondary rounded-xl hover:scale-110 transition-all"><Edit3 size={16} /></button>
                                            <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:scale-110 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- VIEW: DASHBOARD CONTENT --- */}
                        {activeTab === "content" && landingSections && (
                            <div className="space-y-12">
                                {Object.entries(landingSections).map(([id, content]: [string, any]) => (
                                    <div key={id} className="p-10 bg-neutral-50 rounded-[3rem] border border-primary/5 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary underline underline-offset-8">Section: {id}</h4>
                                            <button onClick={() => handleSaveSection(id, content)} className="bg-primary text-secondary px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                                                <Save size={14} /> Update Section
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {Object.entries(content).map(([key, val]: [string, any]) => (
                                                typeof val === 'string' && (
                                                    <div key={key} className="space-y-2">
                                                        <label className="text-[9px] font-black uppercase text-primary/30 ml-4">{key.replace(/([A-Z])/g, ' $1')}</label>
                                                        <textarea
                                                            value={val}
                                                            onChange={(e) => {
                                                                const newContent = { ...content, [key]: e.target.value };
                                                                setLandingSections({ ...landingSections, [id]: newContent });
                                                            }}
                                                            className="w-full bg-white border border-primary/5 rounded-2xl p-4 outline-none focus:border-secondary transition-all text-sm font-bold h-20"
                                                        />
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- VIEW: VISUAL AESTHETIC --- */}
                        {activeTab === "visuals" && globalSettings && (
                            <div className="space-y-16">
                                <div className="p-10 bg-neutral-50 rounded-[3.5rem] border border-primary/5 space-y-10">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Core Theme Engine</h4>
                                        <button onClick={() => handleSaveSettings(globalSettings)} className="bg-primary text-secondary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg">
                                            <Zap size={16} /> Broadcast Brand Update
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-primary/30 ml-4 italic">Primary Chroma (Dark)</label>
                                            <input
                                                type="color"
                                                value={globalSettings.themeConfig?.primaryColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, primaryColor: e.target.value } })}
                                                className="w-full h-24 rounded-[2rem] cursor-pointer border-4 border-white shadow-xl"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-primary/30 ml-4 italic">Secondary Accent (Gold)</label>
                                            <input
                                                type="color"
                                                value={globalSettings.themeConfig?.secondaryColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, secondaryColor: e.target.value } })}
                                                className="w-full h-24 rounded-[2rem] cursor-pointer border-4 border-white shadow-xl"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-primary/30 ml-4 italic">Interaction Layer</label>
                                            <input
                                                type="color"
                                                value={globalSettings.themeConfig?.accentColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, accentColor: e.target.value } })}
                                                className="w-full h-24 rounded-[2rem] cursor-pointer border-4 border-white shadow-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-10">
                                        <label className="text-[10px] font-black uppercase text-primary/30 ml-2">Internal Typography Grid</label>
                                        <select
                                            value={globalSettings.themeConfig?.fontFamily}
                                            onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, fontFamily: e.target.value } })}
                                            className="w-full bg-white border border-primary/5 rounded-[2rem] p-6 outline-none font-black uppercase tracking-widest text-primary/80 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="Outfit, sans-serif">OUTFIT (Modern Sovereign)</option>
                                            <option value="'Playfair Display', serif">PLAYFAIR (Heritage Organic)</option>
                                            <option value="Inter, sans-serif">INTER (Technical Grid)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-10 bg-neutral-50 rounded-[3.5rem] border border-primary/5 space-y-10">
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Branding & Logistics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Site Name Overlay</label>
                                            <input
                                                value={globalSettings.siteName}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, siteName: e.target.value })}
                                                className="w-full bg-white border border-primary/5 rounded-2xl p-5 outline-none font-black text-primary text-lg"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Network Currency</label>
                                            <input
                                                value={globalSettings.currency}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, currency: e.target.value })}
                                                className="w-full bg-white border border-primary/5 rounded-2xl p-5 outline-none font-black text-primary text-lg text-center"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: TEMPLATE ARCHITECT --- */}
                        {activeTab === "architect" && globalSettings && (
                            <div className="space-y-16 animate-in fade-in duration-700">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <PresetCard
                                        title="Neo-Digital"
                                        desc="Sharp, high-contrast, technical grid aesthetic."
                                        active={globalSettings.themeConfig?.templateId === 'neo_digital'}
                                        onClick={() => handleSaveSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, templateId: 'neo_digital', primaryColor: '#040d0a', secondaryColor: '#C5A059', accentColor: '#1a3c34', borderRadius: '2.5rem', fontFamily: 'Outfit, sans-serif' } })}
                                        icon={<Monitor size={32} />}
                                    />
                                    <PresetCard
                                        title="Heritage Organic"
                                        desc="Classic serif, earth tones, and soft rounded nodes."
                                        active={globalSettings.themeConfig?.templateId === 'heritage_organic'}
                                        onClick={() => handleSaveSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, templateId: 'heritage_organic', primaryColor: '#2b1a11', secondaryColor: '#8b4513', accentColor: '#228b22', borderRadius: '0.75rem', fontFamily: "'Playfair Display', serif" } })}
                                        icon={<Globe size={32} />}
                                    />
                                    <PresetCard
                                        title="Cyber-Agriculture"
                                        desc="Vibrant green phosphors on deep matrix black."
                                        active={globalSettings.themeConfig?.templateId === 'cyber_agri'}
                                        onClick={() => handleSaveSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, templateId: 'cyber_agri', primaryColor: '#000000', secondaryColor: '#00ff00', accentColor: '#333333', borderRadius: '0rem', fontFamily: 'Inter, sans-serif' } })}
                                        icon={<Cpu size={32} />}
                                    />
                                </div>

                                <div className="p-10 bg-neutral-50 rounded-[4rem] border border-primary/5 space-y-12">
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Granular Logic Configuration</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Node Curvature</label>
                                                <span className="text-[10px] font-black text-primary">{globalSettings.themeConfig?.borderRadius || '2.5rem'}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                step="0.5"
                                                value={parseFloat(globalSettings.themeConfig?.borderRadius || '2.5')}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, borderRadius: `${e.target.value}rem` } })}
                                                className="w-full accent-secondary"
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Glassmorphism Intensity</label>
                                                <span className="text-[10px] font-black text-primary">{globalSettings.themeConfig?.glassIntensity || '10'}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="40"
                                                value={globalSettings.themeConfig?.glassIntensity || '10'}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, themeConfig: { ...globalSettings.themeConfig, glassIntensity: e.target.value } })}
                                                className="w-full accent-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveSettings(globalSettings)}
                                        className="w-full bg-primary text-secondary py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:scale-[1.02] transition-all"
                                    >
                                        Seal Architecture Logic
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: LOGIC & STATS --- */}
                        {activeTab === "stats" && globalSettings && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-700">
                                <div className="p-10 bg-neutral-50 rounded-[4rem] border border-primary/5 space-y-10">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Ghost Analytics Protocol</h4>
                                            <p className="text-[9px] font-bold text-primary/30 uppercase mt-1">Override platform metrics with simulated data layers</p>
                                        </div>
                                        <button
                                            onClick={() => handleSaveSettings({ ...globalSettings, mockStats: { ...globalSettings.mockStats, useMock: !globalSettings.mockStats?.useMock } })}
                                            className={`px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${globalSettings.mockStats?.useMock ? 'bg-secondary text-primary shadow-xl' : 'bg-primary/5 text-primary/20 hover:bg-primary/10'}`}
                                        >
                                            {globalSettings.mockStats?.useMock ? 'Simulation Active' : 'Real-time Data'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <StatField
                                            label="Simulated Liquidity"
                                            icon={<DollarSign size={16} />}
                                            value={globalSettings.mockStats?.revenue}
                                            onChange={(val: any) => setGlobalSettings({ ...globalSettings, mockStats: { ...globalSettings.mockStats, revenue: Number(val) } })}
                                        />
                                        <StatField
                                            label="Network Population"
                                            icon={<Fingerprint size={16} />}
                                            value={globalSettings.mockStats?.users}
                                            onChange={(val: any) => setGlobalSettings({ ...globalSettings, mockStats: { ...globalSettings.mockStats, users: Number(val) } })}
                                        />
                                        <StatField
                                            label="Transaction Volume"
                                            icon={<TrendingUp size={16} />}
                                            value={globalSettings.mockStats?.orders}
                                            onChange={(val: any) => setGlobalSettings({ ...globalSettings, mockStats: { ...globalSettings.mockStats, orders: Number(val) } })}
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleSaveSettings(globalSettings)}
                                        className="w-full bg-primary text-secondary py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:scale-[1.02] transition-all"
                                    >
                                        Commit Simulation Parameters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* EDIT/CREATE MODAL FOR INTEL */}
            <AnimatePresence>
                {isEditing && (activeTab === "vault" || activeTab === "exchange") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[2100] flex items-center justify-center p-12 bg-primary/40 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[4rem] w-full max-w-2xl p-16 space-y-10 shadow-3xl overflow-hidden relative">
                            <div className="flex justify-between items-start">
                                <h3 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">Protocol Editor</h3>
                                <button onClick={() => setIsEditing(false)} className="p-3 bg-neutral-100 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                <input value={selectedItem.title} onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })} className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none font-serif italic font-black text-xl text-primary" placeholder="Title..." />
                                <input value={selectedItem.category} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-5 outline-none font-black uppercase text-[10px] tracking-widest text-primary/60" placeholder="Category..." />
                                <textarea value={selectedItem.body} onChange={(e) => setSelectedItem({ ...selectedItem, body: e.target.value })} className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none h-40 resize-none text-primary/80" placeholder="Intel Content..." />
                            </div>
                            <button onClick={handleSaveIntel} className="w-full bg-primary text-secondary py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Submit Protocol Update</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


function StatField({ label, icon, value, onChange }: any) {
    return (
        <div className="space-y-3 group">
            <label className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-primary/30 ml-4 group-focus-within:text-primary transition-colors">
                {icon} {label}
            </label>
            <input
                type="number"
                value={value || 0}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white border border-primary/5 rounded-[1.5rem] px-8 py-5 outline-none focus:border-secondary transition-all font-black text-xl text-primary"
            />
        </div>
    );
}

function PresetCard({ title, desc, active, onClick, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-10 rounded-[3rem] border transition-all text-left space-y-6 group relative overflow-hidden ${active
                ? 'bg-primary text-secondary border-secondary shadow-2xl scale-105'
                : 'bg-neutral-50 border-primary/5 text-primary/40 hover:border-secondary hover:text-primary'
                }`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-secondary text-primary' : 'bg-white text-primary group-hover:bg-secondary group-hover:scale-110'}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-xl font-black font-serif italic uppercase tracking-tighter mb-2">{title}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-60">{desc}</p>
            </div>
            {active && (
                <div className="absolute top-6 right-6">
                    <Zap size={16} fill="currentColor" className="text-secondary animate-pulse" />
                </div>
            )}
        </button>
    );
}
