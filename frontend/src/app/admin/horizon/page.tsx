"use client";

import { useState, useEffect } from "react";
import {
    Globe,
    ArrowLeft,
    Plus,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    RefreshCw,
    Search,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminHorizonPage() {
    const [exports, setExports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        destination: "",
        sourceNode: "Kano Depot",
        status: "pending",
        trackingId: "",
        expectedArrival: ""
    });

    useEffect(() => {
        fetchExports();
    }, []);

    const fetchExports = async () => {
        try {
            const res = await fetch(getApiUrl("/api/horizon/exports"));
            if (res.ok) setExports(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/horizon/exports"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchExports();
                setIsModalOpen(false);
                setFormData({
                    destination: "",
                    sourceNode: "Kano Depot",
                    status: "pending",
                    trackingId: "",
                    expectedArrival: ""
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteExport = async (id: string) => {
        if (!confirm("Cancel this export route?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/horizon/exports/${id}`), { method: "DELETE" });
            if (res.ok) fetchExports();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredExports = exports.filter(e =>
        e.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.sourceNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a1a15] text-[#E6EDF3] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-secondary mb-4 transition-all">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">
                            Global <span className="text-secondary italic">Bridge</span>
                        </h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Manage international exports and customs compliance.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search exports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-secondary/30 outline-none backdrop-blur-md"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-secondary/10"
                        >
                            <Plus size={18} /> New Shipment
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExports.map((route) => (
                            <div key={route.id} className="bg-white/5 rounded-[3rem] border border-white/5 p-8 space-y-6 backdrop-blur-md hover:border-secondary/30 transition-all group">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                        <Globe size={28} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${route.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                                        route.status === 'in_transit' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-white/5 text-white/20'
                                        }`}>
                                        {route.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black font-serif text-white">{route.sourceNode}</h3>
                                    <div className="flex items-center gap-4 text-white/20">
                                        <div className="h-px flex-grow bg-white/10" />
                                        <ArrowLeft className="rotate-180" size={14} />
                                        <div className="h-px flex-grow bg-white/10" />
                                    </div>
                                    <h3 className="text-2xl font-black font-serif text-secondary italic">{route.destination}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/5">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">Tracking ID</p>
                                        <p className="text-xs font-bold text-white/60">#{route.trackingId || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">Expected</p>
                                        <p className="text-xs font-bold text-white/60">{route.expectedArrival ? new Date(route.expectedArrival).toLocaleDateString() : 'TBD'}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Route Details</button>
                                    <button
                                        onClick={() => handleDeleteExport(route.id)}
                                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredExports.length === 0 && (
                            <div className="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border border-white/5 backdrop-blur-md">
                                <Building2 size={64} className="mx-auto text-white/10 mb-6" />
                                <h3 className="text-2xl font-black font-serif text-white uppercase italic">No Active Routes</h3>
                                <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mt-2">Open new global supply paths from here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Shipment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#0E1116]/80 text-white">
                    <div className="bg-[#161B22] w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold font-serif tracking-tighter uppercase">New <span className="text-secondary italic">Shipment</span></h1>
                                <p className="text-white/40 font-medium text-sm mt-2">Initialize international supply route.</p>
                            </div>

                            <form onSubmit={handleCreateExport} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Source Node</label>
                                        <input required value={formData.sourceNode} onChange={e => setFormData({ ...formData, sourceNode: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Destination Hub</label>
                                        <input required value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tracking ID</label>
                                    <input required value={formData.trackingId} onChange={e => setFormData({ ...formData, trackingId: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Initial Status</label>
                                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white appearance-none">
                                            <option value="pending" className="bg-[#161B22]">Pending</option>
                                            <option value="in_transit" className="bg-[#161B22]">In Transit</option>
                                            <option value="delivered" className="bg-[#161B22]">Delivered</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Expected Arrival</label>
                                        <input type="date" value={formData.expectedArrival} onChange={e => setFormData({ ...formData, expectedArrival: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white" />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl text-white/40 font-black uppercase tracking-widest hover:bg-white/5">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] bg-secondary text-primary py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10 flex items-center justify-center gap-2">
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Launch Route"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
