"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft, Shield, Loader2, Search, RefreshCw,
    ChevronLeft, ChevronRight, AlertTriangle, Info,
    Trash2, Eye, UserCog, Settings, Zap, Database
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const ACTION_META: Record<string, { label: string; color: string; Icon: any }> = {
    ADMIN_USER_CREATE: { label: "User Created", color: "text-green-400", Icon: UserCog },
    ADMIN_IMPERSONATION_START: { label: "Ghost Protocol", color: "text-yellow-400", Icon: Eye },
    ADMIN_BULK_APPROVE: { label: "Bulk Approved", color: "text-green-400", Icon: Shield },
    ADMIN_BULK_SUSPEND: { label: "Bulk Suspended", color: "text-orange-400", Icon: AlertTriangle },
    ADMIN_BULK_DELETE: { label: "Bulk Deleted", color: "text-red-400", Icon: Trash2 },
    PAYMENT_APPROVE: { label: "Payment Approved", color: "text-green-400", Icon: Zap },
    AI_CONFIG_UPDATE: { label: "AI Config Updated", color: "text-secondary", Icon: Settings },
    USER_UPDATE: { label: "User Updated", color: "text-blue-400", Icon: UserCog },
    FARMER_VERIFY: { label: "Farmer Verified", color: "text-green-400", Icon: Shield },
    VENDOR_VERIFY: { label: "Vendor Verified", color: "text-green-400", Icon: Shield },
};

const PAGE_SIZE = 25;

export default function AuditLedgerPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);

    const fetchLogs = useCallback(async (p = page) => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/audit-logs?limit=${PAGE_SIZE}&offset=${p * PAGE_SIZE}`));
            const data = await res.json();
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchLogs(page); }, [page]);

    const filtered = logs.filter(l =>
        !search ||
        (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.actorName || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.actorEmail || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Security Infrastructure</h2>
                        </div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Audit <span className="text-secondary block">Ledger</span>
                        </h1>
                        <p className="text-white/30 text-sm font-mono max-w-sm">{total.toLocaleString()} total events logged across all admin nodes.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                            <input
                                placeholder="Search by actor or event..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <button onClick={() => fetchLogs(page)} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-secondary hover:text-secondary transition-all">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </header>

                {/* LOG TABLE */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={48} className="animate-spin text-secondary/30" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Decrypting Event Stream...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-32 text-center">
                            <Database size={48} className="mx-auto mb-6 text-white/10" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-xs">No events found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Timestamp</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Event</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Actor</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Entity</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map(log => {
                                        const meta = ACTION_META[log.action] || { label: log.action, color: "text-white/40", Icon: Info };
                                        const isExpanded = expanded === log.id;
                                        return (
                                            <>
                                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpanded(isExpanded ? null : log.id)}>
                                                    <td className="px-8 py-5">
                                                        <p className="text-[10px] font-mono text-white/30">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                        <p className="text-[10px] font-mono text-white/20">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className={`flex items-center gap-2 ${meta.color}`}>
                                                            <meta.Icon size={14} />
                                                            <span className="font-black text-[10px] uppercase tracking-widest">{meta.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="font-bold text-sm text-white/80">{log.actorName || "System"}</p>
                                                        <p className="text-[10px] text-white/30 font-mono">{log.actorEmail || "—"}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/5">{log.entity || "—"}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-white/20 text-[10px] font-mono max-w-[200px] truncate">
                                                        {isExpanded ? "↑ collapse" : JSON.stringify(log.details || {}).slice(0, 60) + "..."}
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr key={`${log.id}-expanded`} className="bg-black/30">
                                                        <td colSpan={5} className="px-8 py-6">
                                                            <pre className="text-[10px] font-mono text-secondary/80 bg-black/40 p-6 rounded-2xl overflow-x-auto whitespace-pre-wrap">
                                                                {JSON.stringify(log.details, null, 2)}
                                                            </pre>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/20">Page {page + 1} / {totalPages || 1}</span>
                    <div className="flex gap-3">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-secondary disabled:opacity-20 transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-secondary disabled:opacity-20 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
