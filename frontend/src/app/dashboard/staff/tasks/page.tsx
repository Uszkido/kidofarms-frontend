"use client";

import { useState, useEffect } from "react";
import {
    ClipboardList,
    ArrowLeft,
    Loader2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    BadgeCheck,
    Briefcase,
    Zap,
    Filter,
    Search
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function StaffMyTasksPage() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchMyTasks = async () => {
        if (!session?.user) return;
        setLoading(true);
        try {
            const userId = (session.user as any).id;
            const res = await fetch(getApiUrl(`/api/admin/tasks/user/${userId}`));
            if (res.ok) {
                setTasks(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTasks();
    }, [session]);

    const handleUpdateStatus = async (taskId: string, newStatus: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/admin/tasks/${taskId}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchMyTasks();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading && !tasks.length) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">My Directives Ledger</h2>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Active <span className="text-secondary block">Assigned Nodes</span>
                        </h1>
                    </div>

                    <div className="bg-secondary/10 px-6 py-4 rounded-3xl border border-secondary/20 flex items-center gap-4">
                        <Briefcase className="text-secondary" size={20} />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Operational Sync</p>
                            <p className="text-sm font-black text-white italic">{tasks.filter(t => t.status !== 'completed').length} Pending Sequences</p>
                        </div>
                    </div>
                </header>

                {/* 🔍 FILTERS */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            placeholder="Scan Directives (Title, Description)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 outline-none focus:border-secondary transition-all font-bold text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === status ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📊 TASKS LIST */}
                <div className="grid md:grid-cols-2 gap-8">
                    {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                        <div key={task.id} className="bg-white/5 border border-white/10 rounded-[3rem] p-8 lg:p-10 space-y-8 hover:border-secondary/40 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px]" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                task.priority === 'medium' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {task.priority} Priority
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black font-serif italic uppercase text-white tracking-widest">{task.title}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed font-bold">{task.description}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${task.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-secondary/10 text-secondary'}`}>
                                    {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Sync Deadline</p>
                                    <div className="flex items-center gap-2 text-[11px] font-black text-white/60">
                                        <Calendar size={12} className="text-secondary" />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Current Protocol</p>
                                    <p className="text-[11px] font-black text-secondary uppercase italic">{task.status}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex gap-4 relative z-10">
                                {task.status !== 'completed' && (
                                    <>
                                        {task.status !== 'in_progress' && (
                                            <button
                                                onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                                                className="flex-1 bg-white/5 border border-white/5 hover:border-secondary hover:text-secondary py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Initiate Sync
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleUpdateStatus(task.id, 'completed')}
                                            className="flex-1 bg-secondary text-primary py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                        >
                                            Confirm Objective
                                        </button>
                                    </>
                                )}
                                {task.status === 'completed' && (
                                    <div className="flex-1 flex items-center justify-center gap-3 text-green-400 font-black uppercase tracking-widest text-[10px]">
                                        <BadgeCheck size={16} /> Objective Synchronized Successfully
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 opacity-10">
                            <ClipboardList size={120} />
                            <h3 className="text-3xl font-black font-serif italic uppercase">Registry Empty</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
