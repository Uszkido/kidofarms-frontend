"use client";

import { useState, useEffect } from "react";
import {
    CheckSquare,
    Clock,
    AlertCircle,
    Loader2,
    User,
    LayoutDashboard,
    Search,
    Filter,
    ArrowRight,
    MessageSquare,
    Calendar
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TeamDashboard() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchTasks();
        }
    }, [(session?.user as any)?.id]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/team/tasks/all?userId=${(session?.user as any)?.id}`));
            if (res.ok) setTasks(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/team/tasks/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTasks = tasks.filter(t => filter === "all" || t.status === filter);

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Welcome */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black font-serif uppercase tracking-tighter">
                                    Team <span className="text-secondary italic">Terminal</span>
                                </h1>
                                <p className="text-primary/40 font-bold text-sm tracking-widest uppercase mt-2">Personal workflow and node assignments</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xl font-black font-serif">{(session?.user as any)?.role?.replace('_', ' ')}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Active Status</p>
                                </div>
                                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                    <User size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Tasks", value: tasks.length, icon: CheckSquare, color: "bg-blue-50 text-blue-600" },
                                { label: "Pending", value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
                                { label: "Completed", value: tasks.filter(t => t.status === 'completed').length, icon: CheckSquare, color: "bg-green-50 text-green-600" },
                                { label: "High Priority", value: tasks.filter(t => t.priority === 'high').length, icon: AlertCircle, color: "bg-red-50 text-red-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Task List */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Active <span className="text-secondary italic">Node Tasks</span></h2>
                                <div className="flex gap-2 bg-cream/30 p-1.5 rounded-2xl border border-primary/5">
                                    {["all", "pending", "in_progress", "completed"].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFilter(s)}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                                        >
                                            {s.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-20 flex justify-center"><Loader2 size={48} className="animate-spin text-secondary opacity-20" /></div>
                            ) : (
                                <div className="grid gap-6">
                                    {filteredTasks.map(task => (
                                        <div key={task.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-primary/5 shadow-xl group hover:border-secondary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                            <div className="space-y-4 flex-grow">
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            task.priority === 'medium' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                'bg-gray-50 text-gray-600 border border-gray-100'
                                                        }`}>
                                                        {task.priority} Priority
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center gap-2">
                                                        <Calendar size={12} /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black font-serif group-hover:text-secondary transition-colors">{task.title}</h3>
                                                    <p className="text-sm text-primary/40 font-medium leading-relaxed max-w-2xl mt-2">{task.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 shrink-0">
                                                {task.status !== 'completed' && (
                                                    <button
                                                        onClick={() => updateTaskStatus(task.id, 'completed')}
                                                        className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-500/10 hover:bg-green-600 transition-all"
                                                    >
                                                        Mark Done
                                                    </button>
                                                )}
                                                {task.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 hover:bg-secondary hover:text-primary transition-all"
                                                    >
                                                        Start Now
                                                    </button>
                                                )}
                                                {task.status === 'completed' && (
                                                    <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                                                        <CheckSquare size={16} /> Completed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {filteredTasks.length === 0 && (
                                        <div className="py-20 text-center bg-cream/20 rounded-[3rem] border-2 border-dashed border-primary/5">
                                            <p className="text-primary/20 font-black uppercase tracking-[0.2em] text-sm italic">All nodes cleared. No active tasks found.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
