"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Search, Loader2, Save, CheckCircle, RefreshCw, UserPlus, Lock, Unlock, Eye } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const ALL_PERMISSIONS = [
    { key: "orders", label: "Orders", desc: "View and manage customer orders" },
    { key: "inventory", label: "Inventory", desc: "Add/edit products and stock levels" },
    { key: "users", label: "Citizens", desc: "View and manage user accounts" },
    { key: "finance", label: "Finance", desc: "Access escrow, credits, and payout controls" },
    { key: "promos", label: "Promotions", desc: "Create and manage discount campaigns" },
    { key: "content", label: "Content", desc: "Edit blog, landing page, and reviews" },
    { key: "logistics", label: "Logistics", desc: "Manage fleet, carriers, and shipments" },
    { key: "reports", label: "Reports", desc: "Access intelligence and analytics reports" },
    { key: "global_data_command", label: "Root Access", desc: "Full platform configuration (Danger Zone)" },
];

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<any | null>(null);
    const [perms, setPerms] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/users"));
            const data = await res.json();
            setStaff(data.filter((u: any) => ['admin', 'sub-admin', 'team_member', 'staff'].includes(u.role)));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStaff(); }, []);

    const openEdit = (member: any) => {
        setEditing(member);
        setPerms(Array.isArray(member.permissions) ? member.permissions : []);
    };

    const togglePerm = (key: string) => setPerms(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);

    const grantAll = () => setPerms(ALL_PERMISSIONS.map(p => p.key));
    const revokeAll = () => setPerms([]);

    const savePerms = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/users/${editing.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions: perms })
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
                setEditing(null);
                fetchStaff();
            }
        } finally { setSaving(false); }
    };

    const filtered = staff.filter(s =>
        (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(search.toLowerCase())
    );

    const roleColor: any = { admin: "text-red-400 bg-red-500/10 border-red-500/20", "sub-admin": "text-secondary bg-secondary/10 border-secondary/20", team_member: "text-blue-400 bg-blue-500/10 border-blue-500/20", staff: "text-white/40 bg-white/5 border-white/10" };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4"><span className="w-16 h-1.5 bg-secondary rounded-full" /><h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Access Control Matrix</h2></div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Staff <span className="text-secondary block">Network</span>
                        </h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                            <input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)}
                                className="w-72 bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm" />
                        </div>
                        <Link href="/admin/users/new" className="flex items-center gap-2 bg-secondary text-primary px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                            <UserPlus size={18} /> Onboard Staff
                        </Link>
                    </div>
                </header>

                {/* STAFF GRID */}
                {loading ? (
                    <div className="py-32 flex justify-center"><Loader2 size={48} className="animate-spin text-secondary/30" /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(member => (
                            <div key={member.id} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 hover:border-secondary/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-[80px]" />

                                {/* Card Header */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                                        <Shield size={28} />
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${roleColor[member.role] || roleColor.staff}`}>
                                        {member.role}
                                    </span>
                                </div>

                                {/* Identity */}
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black font-serif italic uppercase tracking-tight text-white">{member.name}</h3>
                                    <p className="text-[10px] font-mono text-white/30 mt-1">{member.email}</p>
                                </div>

                                {/* Permissions Preview */}
                                <div className="relative z-10 space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Active Permissions ({(member.permissions || []).length}/{ALL_PERMISSIONS.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ALL_PERMISSIONS.map(p => (
                                            <span key={p.key} className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${(member.permissions || []).includes(p.key) ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/[0.02] text-white/15 border-white/5'}`}>
                                                {p.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-white/5 relative z-10">
                                    {member.role !== 'admin' && (
                                        <button onClick={() => openEdit(member)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-secondary hover:text-primary text-white/50 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                            <Lock size={14} /> Configure
                                        </button>
                                    )}
                                    <Link href={`/admin/staff/${member.id}/tasks`} className="flex items-center justify-center gap-2 px-4 py-4 bg-white/5 text-white/30 hover:text-secondary rounded-2xl transition-all">
                                        <Eye size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PERMISSIONS MODAL */}
            {editing && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditing(null)} />
                    <div className="bg-[#0b1612] border-2 border-secondary/20 rounded-[3rem] p-12 max-w-2xl w-full relative z-10 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Access Control Matrix</p>
                                <h3 className="text-4xl font-black font-serif italic uppercase text-white mt-2">{editing.name}</h3>
                                <p className="text-white/30 text-xs font-mono mt-1">{editing.role} · {editing.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={grantAll} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                                    <Unlock size={12} /> Grant All
                                </button>
                                <button onClick={revokeAll} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                    <Lock size={12} /> Revoke All
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {ALL_PERMISSIONS.map(p => {
                                const active = perms.includes(p.key);
                                return (
                                    <button key={p.key} onClick={() => togglePerm(p.key)}
                                        className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${active ? 'bg-secondary/10 border-secondary/30 hover:border-secondary' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
                                        <div>
                                            <p className={`font-black text-sm uppercase tracking-wide ${active ? 'text-secondary' : 'text-white/40'}`}>{p.label}</p>
                                            <p className="text-[10px] text-white/20 mt-1 font-mono">{p.desc}</p>
                                        </div>
                                        <div className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${active ? 'bg-secondary justify-end' : 'bg-white/10 justify-start'}`}>
                                            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <button onClick={() => setEditing(null)} className="py-5 bg-white/5 text-white/30 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                            <button onClick={savePerms} disabled={saving}
                                className="py-5 bg-secondary text-primary hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl">
                                {saving ? <Loader2 className="animate-spin" size={16} /> : saved ? <><CheckCircle size={16} /> Saved</> : <><Save size={16} /> Save Permissions</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
