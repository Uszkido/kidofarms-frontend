"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Shield,
    ArrowLeft,
    Loader2,
    Save,
    X,
    BadgeCheck,
    ShieldAlert,
    KeyRound,
    UserCircle,
    Mail,
    Activity,
    Lock
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function ConfigureStaffRolePage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/admin/users`));
                const data = await res.json();
                const found = data.find((u: any) => u.id === id);
                if (found) {
                    setUser(found);
                    setEditData({
                        ...found,
                        password: "",
                        permissions: found.permissions || []
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/users/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                alert("PROTOCOL UPDATED: Staff authorization matrix synced successfully.");
                router.push("/admin/staff");
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

    if (loading) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-[#040d0a] text-white flex flex-col items-center justify-center space-y-6">
            <ShieldAlert size={80} className="text-white/10" />
            <h1 className="text-4xl font-black font-serif italic uppercase">Personnel Not Found</h1>
            <Link href="/admin/staff" className="text-secondary uppercase tracking-[0.3em] font-black text-[10px] hover:underline">Return to Hub</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-16 relative z-10">

                {/* 🌌 HEADER */}
                <header className="space-y-6">
                    <Link href="/admin/staff" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Staff Registry
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="w-16 h-1.5 bg-secondary rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Config: {user.name}</h2>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                        Authorization <span className="text-secondary block">Matrix</span>
                    </h1>
                </header>

                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl p-10 lg:p-16 space-y-16">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6">
                                <UserCircle size={14} /> Biological Name
                            </label>
                            <input
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6">
                                <Mail size={14} /> Secure Link (Email)
                            </label>
                            <input
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6">
                                <Shield size={14} /> Protocol Class (Role)
                            </label>
                            <select
                                value={editData.role}
                                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-black uppercase tracking-widest text-xs appearance-none"
                            >
                                <option value="staff">STAFF</option>
                                <option value="sub-admin">SUB-ADMIN</option>
                                <option value="admin">ROOT ADMIN</option>
                            </select>
                        </div>
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6">
                                <KeyRound size={14} /> Access Re-Key (Password)
                            </label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current..."
                                value={editData.password}
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-secondary rounded-full" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Function Authorization Matrix</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['inventory', 'orders', 'finance', 'users', 'warehouse', 'team', 'blog', 'settings'].map(perm => (
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
                                    className={`py-6 rounded-3xl border text-[10px] font-black uppercase tracking-widest transition-all ${editData.permissions?.includes(perm) ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                                >
                                    {perm}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-6 pt-10 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <> <Save size={20} /> Commit Matrix Changes </>}
                        </button>
                        <button
                            onClick={() => router.push("/admin/staff")}
                            className="px-12 py-7 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all border border-white/5 shadow-xl"
                        >
                            Abort Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
