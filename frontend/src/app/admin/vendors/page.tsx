"use client";

import { useState, useEffect } from "react";
import { Users, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2, Database, Ghost, Mail, UserCircle, Search, Eye, FileText, Zap, Phone, MapPin, RotateCcw } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/vendors"));
            const data = await res.json();
            setVendors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setPendingId(id);
        try {
            const res = await fetch(getApiUrl(`/api/vendors/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
                await fetchVendors();
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

    const filteredVendors = vendors.filter(v =>
        (v.businessName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (v.userEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Node Verification Protocol</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Vendor <span className="text-secondary block">Guild Control</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search guilds by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <button
                            onClick={fetchVendors}
                            className="bg-white/5 px-8 rounded-[2rem] border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl hover:bg-secondary hover:text-primary transition-all group/sync"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-secondary group-hover/sync:bg-primary group-hover/sync:text-secondary flex items-center justify-center text-primary shadow-xl transition-all ${loading ? 'animate-spin' : ''}`}>
                                <RotateCcw size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover/sync:text-primary/40 leading-none mb-1">Commercial Assets</h4>
                                <p className="text-xs font-black uppercase tracking-widest">Synchronize</p>
                            </div>
                        </button>
                    </div>
                </header>

                {/* 📊 GUILD LEDGER */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Commercial Nodes...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Guild Entity (Business)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">AI Trust Index</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Verification Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Goverance Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-secondary group-hover:text-primary transition-all relative overflow-hidden">
                                                        {vendor.logo ? <img src={vendor.logo} className="w-full h-full object-cover" /> : <UserCircle size={40} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-2">{vendor.businessName}</p>
                                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-3">
                                                            <Mail size={12} className="text-secondary" /> {vendor.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Zap size={14} className={vendor.aiConfidenceScore > 80 ? 'text-secondary' : 'text-white/20'} />
                                                        <span className="text-xl font-black font-serif italic text-white">{vendor.aiConfidenceScore || 0}%</span>
                                                    </div>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${vendor.aiConfidenceScore > 80 ? 'bg-secondary' : vendor.aiConfidenceScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            style={{ width: `${vendor.aiConfidenceScore || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${vendor.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    vendor.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {vendor.status === 'approved' ? <CheckCircle size={12} /> :
                                                        vendor.status === 'pending' ? <Shield size={12} className="animate-pulse" /> :
                                                            <ShieldAlert size={12} />}
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => setSelectedVendor(vendor)}
                                                        className="h-12 px-6 bg-white/5 text-white/60 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-2"
                                                    >
                                                        <Eye size={18} /> Review Node
                                                    </button>
                                                    {vendor.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'approved')}
                                                            disabled={pendingId === vendor.id}
                                                            className="h-12 px-6 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                                        >
                                                            {pendingId === vendor.id ? (
                                                                <><Loader2 size={16} className="animate-spin" /> Synchronizing...</>
                                                            ) : (
                                                                <><CheckCircle size={16} /> Authorize</>
                                                            )}
                                                        </button>
                                                    )}
                                                    {vendor.status === 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'suspended')}
                                                            disabled={pendingId === vendor.id}
                                                            className="h-12 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {pendingId === vendor.id ? (
                                                                <><Loader2 size={16} className="animate-spin" /> Synchronizing...</>
                                                            ) : (
                                                                <><XCircle size={16} /> Suspend</>
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

                {/* 🌌 GUILD FOOTER */}
                <div className="bg-secondary rounded-[4rem] p-12 text-primary shadow-[0_0_100px_rgba(197,160,89,0.1)] relative overflow-hidden group">
                    <Database className="absolute -bottom-20 -right-20 text-primary/10 w-96 h-96 -rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter">Guild <span className="text-primary italic">Governance</span></h3>
                            <p className="max-w-xl text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-60">
                                Authorized vendors gain direct access to the Sovereign Supply Network, enabling them to fulfill orders, manage cold-vault assets, and list digital harvests.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary/40 group-hover:scale-110 transition-transform">
                                <Ghost size={40} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 📄 DOCUMENT VIEWER MODAL */}
            {selectedVendor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setSelectedVendor(null)} />
                    <div className="relative bg-[#040d0a] w-full max-w-5xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[85vh] animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tighter">{selectedVendor.businessName}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Guild Accreditation Review</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedVendor(null)} className="p-4 bg-white/5 rounded-full text-white/20 hover:text-white transition-colors">
                                <XCircle size={32} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-12 space-y-12">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Commercial Ledger</h4>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Business Name</p>
                                            <p className="text-xl font-bold">{selectedVendor.businessName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Commission Node</p>
                                            <p className="text-xl font-bold">{selectedVendor.commissionRate || '10.00'}%</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-1">Focus Segments</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedVendor.categories?.map((cat: string) => (
                                                    <span key={cat} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-secondary uppercase tracking-widest">{cat}</span>
                                                )) || "Global"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Accreditation Trust</h4>
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white/20 mb-2">AI Trust Index</p>
                                            <p className="text-4xl font-black font-serif italic uppercase text-secondary">{selectedVendor.aiConfidenceScore || 0}%</p>
                                        </div>
                                        <div className="w-24 h-5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-secondary" style={{ width: `${selectedVendor.aiConfidenceScore || 0}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Accreditation Documents</h4>
                                {selectedVendor.verificationDocuments?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {selectedVendor.verificationDocuments.map((doc: string, idx: number) => (
                                            <div key={idx} className="group relative aspect-square bg-white/5 rounded-3xl border border-white/5 overflow-hidden hover:border-secondary/40 transition-all">
                                                <img src={doc} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100" />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-[8px] font-black uppercase tracking-widest">Doc_Node_{String(idx + 1).padStart(3, '0')}.SVG</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center space-y-4">
                                        <Ghost className="mx-auto text-white/10" size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/10">No visual protocols uploaded for this guild</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-6">
                            <button
                                onClick={() => { updateStatus(selectedVendor.id, 'approved'); setSelectedVendor(null); }}
                                className="flex-1 py-7 bg-secondary text-primary rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-xl"
                            >
                                Authorize Protocol
                            </button>
                            <button
                                onClick={() => { updateStatus(selectedVendor.id, 'rejected'); setSelectedVendor(null); }}
                                className="flex-1 py-7 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs"
                            >
                                Decommission
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
