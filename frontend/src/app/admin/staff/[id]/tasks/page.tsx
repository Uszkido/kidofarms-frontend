"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    ClipboardList,
    ArrowLeft,
    Loader2,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    User,
    Shield,
    X,
    Save,
    Activity
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function StaffTaskMatrixPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        priority: "medium",
        dueDate: ""
    });

    const fetchData = async () => {
        try {
            const [userRes, tasksRes] = await Promise.all([
                fetch(getApiUrl(`/api/admin/users`)),
                fetch(getApiUrl(`/api/admin/tasks/user/${id}`))
            ]);

            if (userRes.ok) {
                const users = await userRes.json();
                setUser(users.find((u: any) => u.id === id));
            }
            if (tasksRes.ok) setTasks(await tasksRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/tasks"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...taskForm,
                    assignedToId: id,
                    assignedById: (session?.user as any)?.id
                })
            });
            if (res.ok) {
                setIsAddingTask(false);
                setTaskForm({ title: "", description: "", priority: "medium", dueDate: "" });
                fetchData();
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
            <ClipboardList size={80} className="text-white/10" />
            <h1 className="text-4xl font-black font-serif italic uppercase">Personnel Not Found</h1>
            <Link href="/admin/staff" className="text-secondary uppercase tracking-[0.3em] font-black text-[10px] hover:underline">Return to Hub</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto space-y-16 relative z-10">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin/staff" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Staff Registry
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">{user.name}'s Neural Hub</h2>
                        </div>
                        <h1 className="text-6xl lg:text-[10rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Task <span className="text-secondary block">Matrix</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        <Plus size={20} /> Deploy Directive
                    </button>
                </header>

                {/* 📊 TASK GRID */}
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Active Tasks */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between mb-4 border-l-4 border-secondary pl-4">
                            <h3 className="text-2xl font-black font-serif italic uppercase text-white">Directives <span className="text-secondary">Ledger</span></h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{tasks.length} Active Sequences</span>
                        </div>

                        <div className="space-y-6">
                            {tasks.length > 0 ? tasks.map((task) => (
                                <div key={task.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-secondary transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px]" />

                                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        task.priority === 'medium' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {task.priority} Priority
                                                </span>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${task.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <h4 className="text-3xl font-black font-serif italic uppercase text-white tracking-widest leading-none">{task.title}</h4>
                                            <p className="text-xs text-white/40 leading-relaxed font-bold">{task.description}</p>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-end gap-4 text-right">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Target Sync</p>
                                                <div className="flex items-center gap-2 text-white/60 font-black italic">
                                                    <Calendar size={14} className="text-secondary" />
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Deployed On</p>
                                                <p className="text-[10px] font-black text-white/40 italic">{new Date(task.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white/5 border-2 border-dashed border-white/5 rounded-[4rem] p-32 flex flex-col items-center justify-center space-y-6 opacity-20">
                                    <Activity size={80} />
                                    <p className="text-xl font-black font-serif italic uppercase tracking-widest">No Directives Assigned</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vitals Sidebar */}
                    <div className="space-y-10">
                        <div className="bg-secondary rounded-[3.5rem] p-10 text-primary shadow-2xl relative overflow-hidden group">
                            <Shield className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Citizen Profile</h4>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter leading-none">{user.name}</h3>
                                    <p className="text-[11px] font-black uppercase tracking-widest opacity-60">{user.email}</p>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                        <span className="opacity-40">Auth Level</span>
                                        <span className="text-primary">{user.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                        <span className="opacity-40">Sync Status</span>
                                        <span className="text-green-700">Verified</span>
                                    </div>
                                </div>
                                <Link href={`/admin/staff/${id}/configure`} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl text-center block">
                                    Modify Matrix
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Task Telemetry</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Completed</span>
                                    <span className="text-lg font-black font-serif italic text-white">{tasks.filter(t => t.status === 'completed').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Pending</span>
                                    <span className="text-lg font-black font-serif italic text-white">{tasks.filter(t => t.status === 'pending').length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-secondary"
                                        style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center">Protocol Efficiency: {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🏗️ ADD TASK MODAL */}
            {isAddingTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                    <div className="bg-[#0a1612] border-2 border-secondary/20 w-full max-w-2xl rounded-[4rem] p-12 shadow-[0_32px_128px_-32px_rgba(197,160,89,0.3)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />

                        <div className="mb-12 flex justify-between items-start relative z-10">
                            <div className="space-y-3">
                                <h2 className="text-5xl font-black font-serif italic uppercase text-white leading-none">Deploy <br /><span className="text-secondary">Directive</span></h2>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Broadcast global task to specific node</p>
                            </div>
                            <button onClick={() => setIsAddingTask(false)} className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-red-500/20 transition-all">
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-8 relative z-10">
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 group-focus-within:text-secondary transition-colors">Directive Title</label>
                                <input
                                    required
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    placeholder="Enter secure objective title..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 group-focus-within:text-secondary transition-colors">Manifest Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    placeholder="Detailed technical overview of target objective..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 group-focus-within:text-secondary transition-colors">Priority Tier</label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-black uppercase tracking-widest text-xs appearance-none"
                                    >
                                        <option value="low">LOW</option>
                                        <option value="medium">MEDIUM</option>
                                        <option value="high">HIGH</option>
                                    </select>
                                </div>
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 group-focus-within:text-secondary transition-colors">Sync Deadline</label>
                                    <input
                                        type="date"
                                        value={taskForm.dueDate}
                                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 pt-10">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <> <Save size={20} /> Deploy Protocol </>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingTask(false)}
                                    className="px-12 py-7 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all border border-white/5"
                                >
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
