"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    ShieldAlert,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Loader2,
    Eye,
    FileText,
    Zap,
    Search,
    Filter,
    Users,
    Sprout,
    Truck,
    Building2,
    RefreshCcw,
    Ghost
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export default function AdminVerificationPortal() {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [pendingActionId, setPendingActionId] = useState<string | null>(null);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/verifications/pending"));
            const data = await res.json();
            setVerifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, type: string, action: 'approved' | 'suspended') => {
        setPendingActionId(id);
        const endpoint = type === 'farmer' ? `/api/farmers/${id}/status` : type === 'vendor' ? `/api/vendors/${id}/status` : `/api/carriers/${id}/status`;
        try {
            const res = await fetch(getApiUrl(endpoint), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action })
            });

            if (res.ok) {
                setVerifications(prev => prev.filter(v => v.id !== id));
                setSelectedItem(null);
            } else {
                alert("Authorization protocol failed. Check network logs.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setPendingActionId(null);
        }
    };

    const filtered = verifications.filter(v => {
        const matchesSearch = (v.entityName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (v.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || v.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-12 font-sans relative overflow-hidden selection:bg-secondary selection:text-primary">
            {/* 🌌 ATMOSPHERIC BACKGROUND */}
            <div className="fixed top-0 right-0 w-[50rem] h-[50rem] bg-secondary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
            <div className="fixed bottom-0 left-0 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-[1700px] mx-auto space-y-12">

                {/* 🛡️ COMMAND HEADER */}
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Command Center
                        </Link>
                        <div className="flex items-center gap-5">
                            <span className="w-20 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.7em] text-secondary/60 italic">Central Verification Node</h2>
                        </div>
                        <h1 className="text-6xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Sovereign <span className="text-secondary block">Accreditation</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
                        <div className="relative group flex-1 md:flex-initial">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Scan ledger for pending nodes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button onClick={fetchVerifications} className="bg-white/5 border border-white/10 text-white/40 px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4">
                            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Sync Ledger
                        </button>
                    </div>
                </header>

                {/* 🧬 PORTAL GRID */}
                <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-start">

                    {/* 📊 PENDING LIST */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 mb-8">
                            {['all', 'farmer', 'vendor', 'carrier'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${filterType === t ? 'bg-secondary text-primary border-secondary shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'}`}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 opacity-30">
                                        <Loader2 size={64} className="animate-spin text-secondary" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Scanning global node lattice...</p>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="col-span-full py-40 border border-dashed border-white/10 rounded-[4rem] flex flex-col items-center justify-center gap-6 text-white/10">
                                        <ShieldCheck size={80} strokeWidth={1} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Global verification queue is empty</p>
                                    </div>
                                ) : filtered.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => setSelectedItem(item)}
                                        className={`group p-8 rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden backdrop-blur-3xl ${selectedItem?.id === item.id ? 'bg-secondary/10 border-secondary shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="space-y-4">
                                                <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${item.type === 'farmer' ? 'bg-green-500/10 text-green-400' : item.type === 'vendor' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                    {item.type === 'farmer' ? <Sprout size={10} /> : item.type === 'vendor' ? <Building2 size={10} /> : <Truck size={10} />}
                                                    {item.type} Node
                                                </div>
                                                <h3 className="text-3xl font-black font-serif italic text-white uppercase leading-none tracking-tighter truncate w-[250px]">{item.entityName}</h3>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.userName}</p>
                                                    <p className="text-[9px] font-medium text-white/20 italic">{item.userEmail}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-4">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-secondary transition-colors">
                                                    <Zap size={16} className="text-secondary mb-1" />
                                                    <span className="text-[10px] font-black font-serif italic text-white">{item.score || 0}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex gap-3 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                                                className="flex-1 bg-white/10 hover:bg-white text-white hover:text-primary h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <FileText size={14} /> Review Documents
                                            </button>
                                        </div>

                                        {/* BG DECOR */}
                                        <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                            {item.type === 'farmer' ? <Sprout size={120} /> : item.type === 'vendor' ? <Building2 size={120} /> : <Truck size={120} />}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 🛡️ REVIEW ANALYTICS SIDEBAR */}
                    <aside className="sticky top-12 space-y-8">
                        <AnimatePresence mode="wait">
                            {selectedItem ? (
                                <motion.div
                                    key={selectedItem.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-10 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-3xl shadow-2xl space-y-10"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Accreditation Protocol</h4>
                                            <h2 className="text-4xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">{selectedItem.entityName}</h2>
                                        </div>
                                        <button onClick={() => setSelectedItem(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    {/* 📈 TRUST INDEX */}
                                    <div className="p-8 bg-black/40 rounded-[2rem] border border-secondary/20 relative overflow-hidden group">
                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-secondary">AI Trust Confidence</p>
                                                <p className="text-4xl font-black font-serif italic text-white">{selectedItem.score || 0}%</p>
                                            </div>
                                            <div className="w-16 h-16 rounded-full border-4 border-secondary/20 flex items-center justify-center bg-secondary/10">
                                                <Zap className="text-secondary" size={24} />
                                            </div>
                                        </div>
                                        <div className="mt-6 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedItem.score || 0}%` }}
                                                className="h-full bg-secondary shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    {/* 📜 DOCUMENTS */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Uploaded Verification Assets</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedItem.documents?.length > 0 ? selectedItem.documents.slice(0, 4).map((doc: string, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-zoom-in"
                                                >
                                                    <img src={doc} alt="verification" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-[8px] font-black uppercase text-white/60 tracking-widest">Asset #{i + 1}</p>
                                                    </div>
                                                </motion.div>
                                            )) : (
                                                <div className="col-span-2 py-20 border border-dashed border-white/5 rounded-[2rem] flex flex-col items-center gap-4 text-white/10">
                                                    <Ghost size={40} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest">No documentation found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 grid grid-cols-2 gap-4">
                                        <button
                                            disabled={pendingActionId === selectedItem.id}
                                            onClick={() => handleAction(selectedItem.id, selectedItem.type, 'approved')}
                                            className="h-20 bg-secondary text-primary rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-secondary/5 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {pendingActionId === selectedItem.id ? <Loader2 size={18} className="animate-spin" /> : <> <ShieldCheck size={18} /> Authorize </>}
                                        </button>
                                        <button
                                            disabled={pendingActionId === selectedItem.id}
                                            onClick={() => handleAction(selectedItem.id, selectedItem.type, 'suspended')}
                                            className="h-20 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 border border-white/5 hover:border-red-500/20 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            <ShieldAlert size={18} /> Execute
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 border border-dashed border-white/5 rounded-[4rem] text-center space-y-8"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                                        <Users size={40} />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Governance Directive</h4>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-white/10 leading-relaxed italic">
                                            SELECT A NODE FROM THE DEEP LEDGER TO INITIATE ACCREDITATION PROTOCOLS. VERIFY BIOTIC AND COMMERCIAL CREDENTIALS BEFORE AUTHORIZATION.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </aside>
                </div>
            </div>
        </div>
    );
}
