"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    ArrowLeft,
    Loader2,
    CheckSquare,
    Clock,
    AlertCircle,
    Trash2,
    User,
    Calendar,
    Search,
    Filter,
    Activity,
    X
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        assignedToId: "",
        assignedById: "602d1f40-4f51-4d3e-9c7a-369b768e7ec9", // Fallback system admin
        title: "",
        description: "",
        priority: "medium",
        dueDate: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksRes, teamRes] = await Promise.all([
                fetch(getApiUrl("/api/team/tasks/all")),
                // For simplified POC, we just list users with 'team_member' or 'admin' roles
                fetch(getApiUrl("/api/users"))
            ]);

            if (tasksRes.ok) setTasks(await tasksRes.json());
            if (teamRes.ok) {
                const users = await teamRes.json();
                setTeam(users.filter((u: any) => u.role === 'team_member' || u.role === 'admin' || u.role === 'farmer'));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl("/api/team/tasks"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ ...formData, title: "", description: "", dueDate: "", assignedToId: "" });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#06120e] text-[#E6EDF3] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-secondary mb-4 transition-all">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">
                            Task <span className="text-secondary italic">Deployment</span>
                        </h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Deploy missions and monitor node activity.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-secondary/10"
                    >
                        <Plus size={18} /> Deploy Mission
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white/5 rounded-[3rem] p-10 border border-white/5 backdrop-blur-md hover:border-secondary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group">
                                <div className="space-y-4 flex-grow">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            task.priority === 'medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-white/5 text-white/40'
                                            }`}>
                                            {task.priority} Priority
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                                            <Calendar size={12} /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Immediate'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black font-serif text-white uppercase italic group-hover:text-secondary transition-colors">{task.title}</h3>
                                        <p className="text-sm text-white/40 font-medium leading-relaxed max-w-2xl mt-2">{task.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 shrink-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Assigned To</p>
                                        <p className="text-sm font-black text-secondary italic uppercase tracking-tighter">
                                            {team.find(u => u.id === task.assignedToId)?.name || 'Unknown Node'}
                                        </p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        task.status === 'in_progress' ? 'bg-secondary text-primary' :
                                            'bg-white/5 text-white/40'
                                        }`}>
                                        {task.status.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <div className="py-40 text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed">
                                <Activity size={64} className="mx-auto text-white/10 mb-6" />
                                <h3 className="text-2xl font-black font-serif text-white uppercase italic">Zero Missions Active</h3>
                                <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mt-2">Deploy the first task to start node operations.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Deploy Mission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0E1116]/80 backdrop-blur-md">
                    <div className="bg-[#161B22] w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-white/5">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-all">
                            <X size={24} />
                        </button>

                        <div className="relative space-y-8">
                            <h2 className="text-3xl font-black font-serif uppercase tracking-tighter text-white">
                                Deploy <span className="text-secondary italic">Mission</span>
                            </h2>

                            <form onSubmit={handleCreateTask} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Task Title</label>
                                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Assigned Node (Member)</label>
                                    <select
                                        required
                                        value={formData.assignedToId}
                                        onChange={e => setFormData({ ...formData, assignedToId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white appearance-none"
                                    >
                                        <option value="" className="bg-[#161B22]">Select Member...</option>
                                        {team.map(u => (
                                            <option key={u.id} value={u.id} className="bg-[#161B22]">{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white appearance-none"
                                        >
                                            <option value="low" className="bg-[#161B22]">Low</option>
                                            <option value="medium" className="bg-[#161B22]">Medium</option>
                                            <option value="high" className="bg-[#161B22]">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Due Date</label>
                                        <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
                                    <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white" />
                                </div>

                                <button type="submit" className="w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                    Authorize Deployment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
