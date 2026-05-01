"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Filter,
    Shield,
    Activity,
    ArrowLeft,
    Loader2,
    Edit3,
    Trash2,
    ShieldCheck,
    Mail,
    UserCircle,
    Phone,
    KeyRound,
    X,
    Save,
    RotateCcw,
    Zap,
    Ghost,
    Database,
    Sprout,
    Building2,
    BadgeCheck,
    CheckSquare,
    Square,
    UserCheck,
    UserX,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const GHOST_KEY = "kf_ghost_data";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [extraDataLoading, setExtraDataLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const [ghostData, setGhostData] = useState<any>(null);
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchUsers();
        // Check ghost mode from JWT stored in localStorage
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.isImpersonated) setGhostData(payload);
            }
        } catch { /* not in ghost mode */ }
    }, []);

    const toggleSelect = (id: string) => setSelectedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const toggleAll = () => {
        if (selectedIds.size === filteredUsers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredUsers.map((u: any) => u.id)));
        }
    };

    const handleBulkAction = async (action: string) => {
        const ids = Array.from(selectedIds);
        if (!ids.length) return;
        const label = action === "delete" ? "permanently delete" : action;
        if (!confirm(`Are you sure you want to ${label} ${ids.length} selected node(s)?`)) return;
        setBulkLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/users/bulk"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userIds: ids })
            });
            const data = await res.json();
            alert(data.message || "Bulk action complete.");
            setSelectedIds(new Set());
            fetchUsers();
        } finally {
            setBulkLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/users"));
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (user: any) => {
        setSelectedUser(user);
        setEditData({ ...user, password: "" });
        setIsEditing(true);

        // If user is a farmer or vendor, fetch their specific profile
        if (user.role === 'farmer' || user.role === 'vendor') {
            setExtraDataLoading(true);
            try {
                const endpoint = user.role === 'farmer' ? `/api/farmers/user/${user.id}` : `/api/vendors/user/${user.id}`;
                const res = await fetch(getApiUrl(endpoint));
                if (res.ok) {
                    const extra = await res.json();
                    if (user.role === 'farmer') setEditData((prev: any) => ({ ...prev, farmerData: extra }));
                    else setEditData((prev: any) => ({ ...prev, vendorData: extra }));
                }
            } catch (err) {
                console.error("Failed to fetch extra profile data", err);
            } finally {
                setExtraDataLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/users/${selectedUser.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                alert("Citizen profile updated by Supreme Admin.");
                setIsEditing(false);
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error || "Save operation failed.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("RESTRICT ACCESS: Are you sure you want to decommission this citizen node?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/admin/users/${id}`), { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(u =>
        ((u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())) &&
        (!roleFilter || u.role === roleFilter)
    );

    const allRoles = [...new Set(users.map((u: any) => u.role))].sort();

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-hidden">

            {/* 👻 GHOST MODE BANNER */}
            {ghostData && (
                <div className="fixed top-0 left-0 right-0 z-[300] bg-yellow-500 text-black py-3 px-6 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl">
                    <Ghost size={16} />
                    GHOST MODE ACTIVE — You are viewing this network as <strong className="mx-1">{ghostData.name}</strong> ({ghostData.role.toUpperCase()}). Accessed by: {ghostData.impersonatedBy}.
                    <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/admin"; }} className="ml-4 bg-black text-yellow-400 px-4 py-1.5 rounded-full text-[9px] hover:bg-black/80 transition-all">Exit Ghost Mode</button>
                </div>
            )}

            <div className={`max-w-[1600px] mx-auto space-y-12 relative z-10 ${ghostData ? 'mt-12' : ''}`}>

                {/* 🌌 COMMAND HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Citizen Infrastructure</h2>
                        </div>
                        <h1 className="text-7xl lg:text-[10rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Global <span className="text-secondary block">Registry</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Scan Registry for Citizen (Name, ID, Email)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-sovereign pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-sovereign px-8 py-6 outline-none focus:border-secondary transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer text-white/40">
                            <option value="">All Roles</option>
                            {allRoles.map((r: any) => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                        </select>
                        <button
                            onClick={fetchUsers}
                            className="bg-white/5 px-8 rounded-sovereign border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl hover:bg-secondary hover:text-primary transition-all group/sync"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-secondary group-hover/sync:bg-primary group-hover/sync:text-secondary flex items-center justify-center text-primary shadow-xl transition-all ${loading ? 'animate-spin' : ''}`}>
                                <RotateCcw size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover/sync:text-primary/40 leading-none mb-1">Global Registry</h4>
                                <p className="text-xs font-black uppercase tracking-widest">Synchronize</p>
                            </div>
                        </button>
                        <Link href="/admin/users/new" className="bg-secondary text-primary px-10 py-6 rounded-sovereign font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                            Register Citizen
                        </Link>
                    </div>
                </header>

                {/* 📊 REGISTRY TABLE */}
                <div className="space-y-4">

                    {/* BULK ACTION BAR */}
                    {selectedIds.size > 0 && (
                        <div className="bg-secondary/10 border border-secondary/20 rounded-sovereign px-8 py-5 flex items-center gap-6 flex-wrap animate-in slide-in-from-top-4 duration-300">
                            <span className="text-secondary font-black text-xs uppercase tracking-widest">{selectedIds.size} node(s) selected</span>
                            <div className="flex gap-3 ml-auto flex-wrap">
                                <button disabled={bulkLoading} onClick={() => handleBulkAction("approve")} className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-all disabled:opacity-50">
                                    <UserCheck size={14} /> Bulk Approve
                                </button>
                                <button disabled={bulkLoading} onClick={() => handleBulkAction("suspend")} className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500/20 transition-all disabled:opacity-50">
                                    <UserX size={14} /> Bulk Suspend
                                </button>
                                <button disabled={bulkLoading} onClick={() => handleBulkAction("delete")} className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50">
                                    <Trash2 size={14} /> Bulk Delete
                                </button>
                                <button onClick={() => setSelectedIds(new Set())} className="px-6 py-3 bg-white/5 text-white/30 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                    <X size={14} /></button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 rounded-sovereign border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        {loading ? (
                            <div className="p-32 flex flex-col items-center gap-6">
                                <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Citizen Ledger...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02]">
                                            <th className="px-6 py-10">
                                                <button onClick={toggleAll} className="text-white/30 hover:text-secondary transition-colors">
                                                    {selectedIds.size === filteredUsers.length && filteredUsers.length > 0
                                                        ? <CheckSquare size={18} className="text-secondary" />
                                                        : <Square size={18} />}
                                                </button>
                                            </th>
                                            <th className="px-8 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Citizen / Biological Node</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Auth Protocol (Role)</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">System Status</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Emergency Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="group hover:bg-white/[0.03] transition-colors">
                                                <td className="px-6 py-10">
                                                    <button onClick={() => toggleSelect(user.id)} className="text-white/20 hover:text-secondary transition-colors">
                                                        {selectedIds.has(user.id)
                                                            ? <CheckSquare size={18} className="text-secondary" />
                                                            : <Square size={18} />}
                                                    </button>
                                                </td>
                                                <td className="px-8 py-10">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/10 overflow-hidden relative border border-white/5 group-hover:border-secondary/20 transition-all">
                                                            <UserCircle size={32} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-1">{user.name}</h3>
                                                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${user.role === 'admin' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-white/40'}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{user.isVerified ? 'Active Link' : 'Dormant'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => handleDelete(user.id)} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-primary rounded-2xl transition-all shadow-xl" title="Decommission Citizen">
                                                            <Trash2 size={20} />
                                                        </button>
                                                        <button onClick={() => handleEdit(user)} className="p-4 bg-white/5 text-white/60 hover:bg-secondary hover:text-primary rounded-2xl transition-all shadow-xl" title="Edit Profile">
                                                            <Edit3 size={20} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await fetch(getApiUrl("/api/admin/impersonate"), {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ userId: user.id })
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.token) {
                                                                        alert(`GHOST PROTOCOL: Synchronizing with ${user.name}'s node...`);
                                                                        window.location.href = `/login?token=${data.token}`;
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                }
                                                            }}
                                                            className="p-4 bg-secondary/10 text-secondary hover:bg-secondary hover:text-primary rounded-2xl transition-all shadow-xl"
                                                            title="Impersonate (Ghost Protocol)"
                                                        >
                                                            <Ghost size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🛡️ EDIT MODAL (GOD MODE) */}
                {isEditing && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-10">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsEditing(false)} />

                        <div className="bg-[#0b1612] w-full max-w-5xl rounded-[4rem] border-2 border-secondary/20 shadow-[0_0_100px_rgba(197,160,89,0.1)] overflow-hidden relative z-10 animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 flex flex-col max-h-[90vh]">

                            {/* Modal Header */}
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck className="text-secondary" />
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Biological Asset Override</h2>
                                    </div>
                                    <h3 className="text-4xl lg:text-6xl font-black font-serif italic text-white uppercase leading-none">Modify <span className="text-secondary">Nexus</span></h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-red-500/20 transition-all">
                                    <X size={32} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-10 lg:p-12 overflow-y-auto space-y-12">
                                {/* Base User Data */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <EditField label="Biological Name" icon={<UserCircle size={14} />} value={editData.name} onChange={(val: string) => setEditData({ ...editData, name: val })} />
                                    <EditField label="Secure Link (Email)" icon={<Mail size={14} />} value={editData.email} onChange={(val: string) => setEditData({ ...editData, email: val })} />
                                    <EditField label="Protocol Class (Role)" icon={<Shield size={14} />} isSelect options={['customer', 'admin', 'sub-admin', 'farmer', 'vendor', 'business', 'subscriber', 'affiliate', 'wholesale_buyer', 'retailer', 'distributor', 'team_member', 'hotel', 'logistics_distributor']} value={editData.role} onChange={(val: string) => setEditData({ ...editData, role: val })} />
                                    <EditField label="Override Password" icon={<KeyRound size={14} />} type="password" placeholder="•••••••• (Leave blank to keep current)" value={editData.password} onChange={(val: string) => setEditData({ ...editData, password: val })} />
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Account Access State (Suspend/Verify)</label>
                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setEditData({ ...editData, isVerified: true })} className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${editData.isVerified ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}>Active (Verified)</button>
                                            <button type="button" onClick={() => setEditData({ ...editData, isVerified: false })} className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${!editData.isVerified ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20 shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}>Suspended (Revoke Access)</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions Matrix */}
                                {(['admin', 'sub-admin', 'staff', 'team_member'].includes(editData.role)) && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-1 bg-secondary rounded-full" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Function Authorization Matrix</h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['inventory', 'orders', 'finance', 'users', 'warehouse', 'team', 'blog', 'settings', 'global_data_command'].map(perm => (
                                                <button
                                                    key={perm}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = editData.permissions || [];
                                                        const next = current.includes(perm)
                                                            ? current.filter((p: string) => p !== perm)
                                                            : [...current, perm];
                                                        setEditData({ ...editData, permissions: next });
                                                    }}
                                                    className={`py-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${editData.permissions?.includes(perm) ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                                                >
                                                    {perm}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Extra Profiles (Farmer/Vendor) */}
                                {(editData.role === 'farmer' || editData.role === 'vendor') && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-1 bg-secondary rounded-full" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                                                {editData.role === 'farmer' ? 'Agricultural Node Infrastructure' : 'Commercial Guild Infrastructure'}
                                            </h4>
                                        </div>

                                        {extraDataLoading ? (
                                            <div className="flex items-center gap-4 py-10 opacity-20">
                                                <Loader2 className="animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">Retrieving Sub-Ledger...</span>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-[3rem] border border-white/5">
                                                {editData.role === 'farmer' ? (
                                                    <>
                                                        <EditField label="Farm Designation" icon={<Sprout size={14} />} value={editData.farmerData?.farmName} onChange={(val: string) => setEditData({ ...editData, farmerData: { ...editData.farmerData, farmName: val } })} />
                                                        <EditField label="Geo-Location (State)" icon={<Activity size={14} />} value={editData.farmerData?.farmLocationState} onChange={(val: string) => setEditData({ ...editData, farmerData: { ...editData.farmerData, farmLocationState: val } })} />
                                                        <EditField label="Harvest Focus" value={editData.farmerData?.primaryProduce} onChange={(val: string) => setEditData({ ...editData, farmerData: { ...editData.farmerData, primaryProduce: val } })} />
                                                        <EditField label="Mastery Tier" type="number" value={editData.farmerData?.masteryLevel} onChange={(val: string) => setEditData({ ...editData, farmerData: { ...editData.farmerData, masteryLevel: Number(val) } })} />
                                                        <div className="space-y-2 col-span-1 md:col-span-2 mt-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Farmer Verification State</label>
                                                            <div className="flex gap-4">
                                                                {['pending', 'approved', 'suspended'].map(s => (
                                                                    <button
                                                                        key={s}
                                                                        type="button"
                                                                        onClick={() => setEditData({ ...editData, farmerData: { ...editData.farmerData, status: s } })}
                                                                        className={`flex-1 py-4 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${editData.farmerData?.status === s ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EditField label="Guild Business Name" icon={<Building2 size={14} />} value={editData.vendorData?.businessName} onChange={(val: string) => setEditData({ ...editData, vendorData: { ...editData.vendorData, businessName: val } })} />
                                                        <EditField label="Commission Ratio (%)" type="number" value={editData.vendorData?.commissionRate} onChange={(val: string) => setEditData({ ...editData, vendorData: { ...editData.vendorData, commissionRate: val } })} />
                                                        <EditField label="Guild Focus (Description)" value={editData.vendorData?.description} onChange={(val: string) => setEditData({ ...editData, vendorData: { ...editData.vendorData, description: val } })} />
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Verification State</label>
                                                            <div className="flex gap-4">
                                                                {['pending', 'approved', 'suspended'].map(s => (
                                                                    <button
                                                                        key={s}
                                                                        type="button"
                                                                        onClick={() => setEditData({ ...editData, vendorData: { ...editData.vendorData, status: s } })}
                                                                        className={`flex-1 py-4 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${editData.vendorData?.status === s ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-10 border-t border-white/5 bg-white/[0.04] flex gap-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <> <Save size={20} /> Commit Override </>}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-12 py-7 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all border border-white/5 shadow-xl"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface EditFieldProps {
    label: string;
    value: any;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    isSelect?: boolean;
    options?: string[];
}

function EditField({ label, value, onChange, type = "text", placeholder, icon, isSelect, options }: EditFieldProps) {
    return (
        <div className="space-y-3 group">
            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 group-focus-within:text-secondary transition-colors">
                {icon} {label}
            </label>
            {isSelect ? (
                <select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[#1a3c34]/20 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-black uppercase tracking-widest text-xs appearance-none cursor-pointer"
                >
                    {options?.map((opt: string) => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm text-white/80 placeholder:text-white/10 ring-0"
                />
            )}
        </div>
    );
}
