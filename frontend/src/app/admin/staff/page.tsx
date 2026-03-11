"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Shield,
    Activity,
    ArrowLeft,
    Loader2,
    Search,
    Plus,
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserPlus,
    KeyRound,
    Lock
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/users"));
            const data = await res.json();
            // Filter only staff, admin, and sub-admins
            const filteredStaff = data.filter((u: any) => ['staff', 'admin', 'sub-admin'].includes(u.role));
            setStaff(filteredStaff);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                            Staff <br /><span className="text-secondary">Network</span>
                        </h1>
                    </div>
                    <Link href="/admin/users/new" className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                        <UserPlus size={20} /> Onboard New Staff
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email or designation..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold uppercase tracking-wider"
                        />
                    </div>
                </div>

                {/* Staff List */}
                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <Loader2 className="animate-spin text-secondary" size={48} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStaff.map((member) => (
                            <div key={member.id} className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden group hover:border-secondary transition-all shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-white/10 flex items-center justify-center text-secondary shadow-inner relative overflow-hidden">
                                        {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <Shield size={32} />}
                                    </div>
                                    <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${member.role === 'admin' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                            member.role === 'sub-admin' ? 'bg-secondary/10 border-secondary text-secondary' :
                                                'bg-blue-500/10 border-blue-500 text-blue-500'
                                        }`}>
                                        {member.role}
                                    </div>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <h3 className="text-3xl font-black font-serif italic uppercase tracking-tighter text-white">{member.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{member.email}</p>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3 text-white/40">
                                        <Briefcase size={14} className="text-secondary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Assignments: {member.tasksCount || 0}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Current Security Protocol</p>
                                        <div className="flex items-center gap-2">
                                            <Lock size={12} className="text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tier {member.role === 'admin' ? 'Omega' : 'Alpha'} Encryption</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                                    <Link href={`/admin/users?edit=${member.id}`} className="px-6 py-2 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Configure Role</Link>
                                    <button className="text-[9px] font-black uppercase text-secondary hover:underline underline-offset-4">View Task Matrix</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
