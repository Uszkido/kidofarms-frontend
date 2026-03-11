"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Ticket,
    Search,
    Filter,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreHorizontal,
    MessageSquare,
    User,
    ShieldAlert,
    Database
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/tickets/admin/all"));
            const data = await res.json();
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Citizen Support Grid</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Support <span className="text-secondary block">Protocols</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search intercepts by Citizen or Subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* 📊 TICKET Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <StatusVital label="Active Intercepts" value={tickets.filter(t => t.status === 'open').length} icon={<Clock size={28} />} color="text-amber-500" />
                    <StatusVital label="Pending Oversight" value={tickets.filter(t => t.status === 'pending').length} icon={<AlertCircle size={28} />} color="text-secondary" />
                    <StatusVital label="Resolved Nodes" value={tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length} icon={<CheckCircle2 size={28} />} color="text-green-400" />
                    <div className="bg-secondary p-10 rounded-[3rem] text-primary shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                        <Database className="absolute -bottom-8 -right-8 text-primary/10 w-40 h-40 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Network Trust Score</h4>
                        <p className="text-4xl font-black font-serif italic uppercase">99.2%</p>
                    </div>
                </div>

                {/* 📋 TICKETS LEDGER */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Communication Channels...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol ID (Ticket)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Citizen Origin</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Priority Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Current State</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Governance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTickets.map(ticket => (
                                        <tr key={ticket.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-black font-serif italic text-white uppercase tracking-tight">{ticket.subject}</h3>
                                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">ID: #{ticket.id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white/60 uppercase">{ticket.userName || 'Unknown Citizen'}</p>
                                                        <p className="text-[10px] font-bold text-white/20">{ticket.userEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-400/20'
                                                    }`}>
                                                    {ticket.priority} Protocol
                                                </span>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${ticket.status === 'open' ? 'text-amber-500 animate-pulse' :
                                                    ticket.status === 'pending' ? 'text-secondary' :
                                                        'text-green-500'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-amber-500' :
                                                        ticket.status === 'pending' ? 'bg-secondary' :
                                                            'bg-green-500'
                                                        }`} />
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <Link
                                                    href={`/admin/tickets/${ticket.id}`}
                                                    className="px-8 py-4 bg-white/5 text-white/60 hover:bg-secondary hover:text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 w-fit ml-auto shadow-xl group-hover:shadow-2xl active:scale-95"
                                                >
                                                    Intercept Auth <MessageSquare size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {filteredTickets.length === 0 && !loading && (
                    <div className="p-32 text-center bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl">
                        <ShieldAlert size={64} className="mx-auto text-white/10 mb-6" />
                        <h3 className="text-3xl font-black font-serif italic text-white uppercase">Silence in the Hub</h3>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-4">All citizen nodes are currently in sync</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatusVitalProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatusVital({ label, value, icon, color }: StatusVitalProps) {
    return (
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl flex items-center justify-between group">
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">{label}</h4>
                <p className="text-5xl font-black font-serif italic text-white leading-none">{value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-white/[0.02] ${color} group-hover:bg-white/5 transition-colors`}>
                {icon}
            </div>
        </div>
    );
}
