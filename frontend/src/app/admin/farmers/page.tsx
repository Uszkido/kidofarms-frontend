"use client";

import { useState, useEffect } from "react";
import { Sprout, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function FarmersAdminPage() {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
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
        try {
            const res = await fetch(getApiUrl(`/api/farmers/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchFarmers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF9] p-6 lg:p-12">
            <div className="max-w-[1200px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all shadow-sm">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Grower <span className="text-secondary italic">Vault</span></h1>
                            <p className="text-sm font-medium text-primary/40 uppercase tracking-widest">Verify and Manage Network Farmers</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-10 animate-pulse" />

                    {loading ? (
                        <div className="p-24 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center">
                                <Loader2 className="animate-spin text-secondary" size={32} />
                            </div>
                            <p className="font-black text-xs uppercase tracking-widest text-primary/20">Syncing Soil Records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50/50 border-b border-primary/5">
                                    <tr>
                                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Farm Business</th>
                                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Location</th>
                                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Owner Details</th>
                                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Status</th>
                                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {farmers.map((farmer) => (
                                        <tr key={farmer.id} className="group hover:bg-neutral-50/50 transition-all">
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                                                        <Sprout size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg font-serif text-primary uppercase tracking-tight">{farmer.farmName}</p>
                                                        <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest leading-none mt-1">Reg: {new Date(farmer.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-2 text-primary/60 font-bold text-xs uppercase">
                                                    <MapPin size={14} className="text-secondary" />
                                                    {farmer.farmLocationState}
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="space-y-1">
                                                    <p className="font-black text-sm text-primary uppercase leading-tight">{farmer.userName}</p>
                                                    <p className="text-[9px] text-primary/40 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <Phone size={10} /> {farmer.phone || 'No phone'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm border ${farmer.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    farmer.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {farmer.status === 'approved' ? <CheckCircle size={12} strokeWidth={3} /> :
                                                        farmer.status === 'pending' ? <Shield size={12} strokeWidth={3} /> :
                                                            <ShieldAlert size={12} strokeWidth={3} />}
                                                    {farmer.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    {farmer.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'approved')}
                                                            className="h-10 px-4 bg-green-50 text-green-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={14} /> Approve
                                                        </button>
                                                    )}
                                                    {farmer.status !== 'suspended' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'suspended')}
                                                            className="h-10 px-4 bg-red-50 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                        >
                                                            <XCircle size={14} /> Suspend
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {farmers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 text-primary/10">
                                                    <Sprout size={64} strokeWidth={1} />
                                                    <p className="font-black text-xs uppercase tracking-widest">No harvesting nodes registered.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-primary p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />
                    <div className="space-y-4 text-center md:text-left relative">
                        <h3 className="text-3xl font-black font-serif italic text-secondary">Network Governance</h3>
                        <p className="max-w-md text-sm font-medium text-white/50 leading-relaxed uppercase tracking-widest">
                            Farmers approved here gain access to the Command Center and the ability to list live harvests on the public ledger.
                        </p>
                    </div>
                    <Link href="/admin" className="px-12 py-6 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary transition-all shadow-inner active:scale-95 whitespace-nowrap">
                        Back to Core
                    </Link>
                </div>
            </div>
        </div>
    );
}
