"use client";

import { useState, useEffect } from "react";
import {
    Warehouse as WarehouseIcon,
    Plus,
    Search,
    MapPin,
    Thermometer,
    Droplets,
    Activity,
    Loader2,
    ShieldCheck,
    ArrowLeft,
    Power
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface StorageNode {
    id: string;
    name: string;
    location: string;
    capacity: string;
    currentLoad: string;
    temperature: string;
    humidity: string;
    isActive: boolean;
}

export default function WarehouseManagementPage() {
    const [nodes, setNodes] = useState<StorageNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchNodes = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/storage"));
            if (res.ok) {
                const data = await res.json();
                setNodes(data);
            }
        } catch (error) {
            console.error("Failed to fetch storage nodes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    const toggleNode = async (id: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/admin/storage/${id}/toggle`), { method: 'POST' });
            if (res.ok) {
                fetchNodes();
            }
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    const filteredNodes = nodes.filter(n =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-6 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black font-serif uppercase tracking-tighter leading-none italic">
                            Warehouse <br /><span className="text-secondary">Nodes</span>
                        </h1>
                    </div>
                    <button className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                        <Plus size={20} /> Initialize New Node
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 backdrop-blur-xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Scan by Node Name or Geospatial ID..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold uppercase tracking-wider"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-secondary transition-all">Export Metadata</button>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                        <Loader2 className="animate-spin text-secondary" size={48} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNodes.length > 0 ? filteredNodes.map((node) => (
                            <div key={node.id} className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden group hover:border-secondary transition-all shadow-2xl">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${node.isActive ? 'bg-secondary' : 'bg-red-500'}/10 rounded-full blur-[60px]`} />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${node.isActive ? 'bg-secondary text-primary' : 'bg-red-500/20 text-red-500'} group-hover:scale-110 transition-transform shadow-inner`}>
                                        <WarehouseIcon size={28} />
                                    </div>
                                    <button
                                        onClick={() => toggleNode(node.id)}
                                        className={`p-4 rounded-2xl border transition-all ${node.isActive ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-red-500/20 border-red-500 text-red-500'}`}
                                    >
                                        <Power size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <h3 className="text-3xl font-black font-serif italic uppercase tracking-tighter text-white">{node.name}</h3>
                                    <div className="flex items-center gap-2 text-white/30">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{node.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Temperature</p>
                                        <div className="flex items-center gap-2 text-secondary font-serif italic text-xl">
                                            <Thermometer size={14} /> {node.temperature || "2.4°C"}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Load Status</p>
                                        <div className="flex items-center gap-2 text-white font-serif italic text-xl">
                                            <Activity size={14} /> {node.currentLoad || "82%"}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-secondary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Encryption Active</span>
                                    </div>
                                    <Link href={`/admin/warehouse/${node.id}`} className="text-[10px] font-black uppercase text-secondary hover:underline underline-offset-4">Full Audit</Link>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full h-80 bg-white/5 rounded-[4rem] border border-white/10 border-dashed flex flex-col items-center justify-center space-y-4 opacity-40">
                                <WarehouseIcon size={48} />
                                <p className="font-black font-serif uppercase italic tracking-widest">No Active Nodes Detected</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
