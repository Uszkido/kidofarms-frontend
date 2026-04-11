"use client";

import { useState, useEffect } from "react";
import { Sprout, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2, MapPin, Phone, Database, Ghost, Mail, UserCircle, Search, Eye, FileText, Zap, RotateCcw } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function FarmersAdminPage() {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/farmers"));
            const data = await res.json();
            setFarmers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setPendingId(id);
        try {
            const res = await fetch(getApiUrl(`/api/farmers/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                // Optimistic update + refresh
                setFarmers(prev => prev.map(f => f.id === id ? { ...f, status } : f));
                await fetchFarmers();
            } else {
                alert('Failed to update status. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error. Is the backend running?');
        } finally {
            setPendingId(null);
        }
    };

    const filteredFarmers = farmers.filter(f =>
        (f.farmName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (f.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (f.farmLocationState?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-left">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Biotic Asset Governance</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Grower <span className="text-secondary block">Vault Hub</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search growers by name or state..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <button
                            onClick={fetchFarmers}
                            className="bg-white/5 px-8 rounded-[2rem] border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl hover:bg-secondary hover:text-primary transition-all group/sync"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-secondary group-hover/sync:bg-primary group-hover/sync:text-secondary flex items-center justify-center text-primary shadow-xl transition-all ${loading ? 'animate-spin' : ''}`}>
                                <RotateCcw size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover/sync:text-primary/40 leading-none mb-1">Global Assets</h4>
                                <p className="text-xs font-black uppercase tracking-widest">Synchronize</p>
                            </div>
                        </button>
                    </div>
                </header>

                {/* 📊 GROWER LEDGER */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Soil Records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Harvest Entity (Farm)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">AI Trust Score</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Network Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredFarmers.map((farmer) => (
                                        <tr key={farmer.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                        <Sprout size={40} />
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-2">{farmer.farmName}</p>
                                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-4">
                                                            <UserCircle size={12} className="text-secondary" /> {farmer.userName}
                                                            <Phone size={12} className="text-secondary ml-2" /> {farmer.phone || 'NO COMM'}
                                                            <MapPin size={12} className="text-secondary ml-2" /> {farmer.farmLocationState}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Zap size={14} className={farmer.aiConfidenceScore > 80 ? 'text-secondary' : 'text-white/20'} />
                                                        <span className="text-xl font-black font-serif italic text-white">{farmer.aiConfidenceScore || 0}%</span>
                                                    </div>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${farmer.aiConfidenceScore > 80 ? 'bg-secondary' : farmer.aiConfidenceScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            style={{ width: `${farmer.aiConfidenceScore || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${farmer.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    farmer.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {farmer.status === 'approved' ? <CheckCircle size={14} /> :
                                                        farmer.status === 'pending' ? <Shield size={14} className="animate-pulse" /> :
                                                            <ShieldAlert size={14} />}
                                                    {farmer.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => setSelectedFarmer(farmer)}
                                                        className="h-12 px-6 bg-white/5 text-white/60 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-2"
                                                    >
                                                        <Eye size={18} /> Review Node
                                                    </button>
                                                    {farmer.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'approved')}
                                                            disabled={pendingId === farmer.id}
                                                            className="h-12 px-8 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                                        >
                                                            {pendingId === farmer.id ? (
                                                                <><Loader2 size={16} className="animate-spin" /> Synchronizing...</>
                                                            ) : (
                                                                <><CheckCircle size={18} /> Approve</>
                                                            )}
                                                        </button>
                                                    )}
                                                    {farmer.status === 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'suspended')}
                                                            disabled={pendingId === farmer.id}
                                                            className="h-12 px-8 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {pendingId === farmer.id ? (
                                                                <><Loader2 size={16} className="animate-spin" /> Synchronizing...</>
                                                            ) : (
                                                                <><XCircle size={18} /> Suspend</>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 🌌 GROWER FOOTER */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-secondary/5 rounded-full blur-[150px] -translate-y-48 translate-x-48 group-hover:bg-secondary/10 transition-colors" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 text-center lg:text-left">
                            <h3 className="text-4xl lg:text-5xl font-black font-serif italic text-white uppercase tracking-tighter">Harvest <span className="text-secondary italic">Infrastructure</span></h3>
                            <p className="max-w-2xl text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed text-white/30 italic">
                                GROWERS APPROVED HERE GAIN DEEP-COMM ACCESS TO THE KIDO NETWORK. THEY ARE THE FOUNDATION OF OUR SOVEREIGN FOOD HUB. VERIFY DOCUMENTS AND LIVE HARVEST DATA BEFORE AUTHORIZATION.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 hover:text-secondary group-hover:scale-110 transition-all border border-white/5">
                                <Database size={40} />
                            </div>
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 hover:text-white group-hover:scale-110 transition-all border border-white/5">
                                <Ghost size={40} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 📄 DOCUMENT VIEWER MODAL */}
            {selectedFarmer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setSelectedFarmer(null)} />
                    <div className="relative bg-[#040d0a] w-full max-w-5xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[85vh] animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tighter">{selectedFarmer.farmName}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Node Documentation Review</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFarmer(null)} className="p-4 bg-white/5 rounded-full text-white/20 hover:text-white transition-colors">
                                <XCircle size={32} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-12 space-y-12">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Biological Data</h4>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">User Name</p>
                                            <p className="text-xl font-bold">{selectedFarmer.userName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Experience</p>
                                            <p className="text-xl font-bold">{selectedFarmer.yearsOfExperience || '0'} Seasons</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Bank Node</p>
                                            <p className="text-xl font-bold uppercase">{selectedFarmer.bankName || 'NOT LINKED'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Account Number</p>
                                            <p className="text-xl font-mono">{selectedFarmer.accountNumber || '********'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Trust Assurance</h4>
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-2">AI Confidence Level</p>
                                            <p className="text-4xl font-black font-serif italic uppercase text-secondary">{selectedFarmer.aiConfidenceScore || 0}%</p>
                                        </div>
                                        <div className="w-20 h-20 rounded-full border-4 border-secondary/20 flex items-center justify-center">
                                            <Zap size={32} className="text-secondary" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Uploaded Credentials</h4>
                                {selectedFarmer.verificationDocuments?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {selectedFarmer.verificationDocuments.map((doc: string, idx: number) => (
                                            <div key={idx} className="group relative aspect-square bg-white/5 rounded-3xl border border-white/5 overflow-hidden hover:border-secondary/40 transition-all">
                                                <img src={doc} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100" />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-[8px] font-black uppercase tracking-widest">Credential_{idx + 1}.PNG</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center space-y-4">
                                        <Ghost className="mx-auto text-white/10" size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/10">No visual credentials uploaded to node</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-6">
                            <button
                                onClick={() => { updateStatus(selectedFarmer.id, 'approved'); setSelectedFarmer(null); }}
                                disabled={pendingId === selectedFarmer.id}
                                className="flex-1 py-7 bg-secondary text-primary rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {pendingId === selectedFarmer.id ? <Loader2 size={16} className="animate-spin" /> : null}
                                Authorize Protocol
                            </button>
                            <button
                                onClick={() => { updateStatus(selectedFarmer.id, 'suspended'); setSelectedFarmer(null); }}
                                disabled={pendingId === selectedFarmer.id}
                                className="flex-1 py-7 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                Reject Node
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
