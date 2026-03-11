"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    MessageSquare,
    Users,
    ShieldAlert,
    CheckSquare,
    Clock,
    AlertCircle,
    Loader2,
    Search,
    Filter,
    ArrowRight,
    User,
    Calendar,
    Settings,
    ShieldCheck,
    BarChart3,
    Activity,
    Flag,
    CheckCircle2,
    LifeBuoy,
    Zap,
    Briefcase
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import Link from "next/link";

export default function StaffDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // States
    const [activeTab, setActiveTab] = useState("command");
    const [tasks, setTasks] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchStaffData();
        }
    }, [(session?.user as any)?.id]);

    const fetchStaffData = async () => {
        try {
            const [tRes, sRes] = await Promise.all([
                fetch(getApiUrl(`/api/team/tasks/all?userId=${(session?.user as any)?.id}`)),
                fetch(getApiUrl(`/api/tickets/all`)) // Assuming endpoint for all tickets
            ]);
            if (tRes.ok) setTasks(await tRes.json());
            if (sRes.ok) setTickets(await sRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Operations Header */}
                        <header className="relative py-16 px-12 bg-primary rounded-[4rem] overflow-hidden shadow-2xl group">
                            <Briefcase className="absolute -bottom-10 -right-10 text-white/5 w-80 h-80 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-10 animate-pulse" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl">
                                        <ShieldCheck size={14} className="animate-pulse" /> Platform Operations Node
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-black font-serif text-white tracking-tighter leading-none">
                                        Staff <br />
                                        <span className="text-secondary italic">Terminal</span>
                                    </h1>
                                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Authorized Personnel: {session?.user?.name || "Operations Agent"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black uppercase text-white/30 mb-2">My Pending Tasks</p>
                                        <p className="text-4xl font-black font-serif text-white">{tasks.filter(t => t.status === 'pending').length} <span className="text-secondary tracking-widest text-[9px] uppercase">ACTVE</span></p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black uppercase text-white/30 mb-2">Support Tickets</p>
                                        <p className="text-4xl font-black font-serif text-secondary">{tickets.length > 0 ? tickets.length : "0"} <span className="text-white tracking-widest text-[9px] uppercase">OPEN</span></p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "command", label: "Workflow Command", icon: CheckSquare },
                                { id: "support", label: "Support Desk", icon: MessageSquare },
                                { id: "users", label: "User Registry", icon: Users },
                                { id: "moderation", label: "Market Control", icon: ShieldAlert },
                                { id: "reports", label: "Incident Hub", icon: Flag }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Main Display */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "command" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif italic text-primary">Active <span className="text-secondary">Assigned Tasks</span></h2>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary underline underline-offset-8">New Task Entry</button>
                                        </div>

                                        {loading ? (
                                            <div className="py-20 flex flex-col items-center gap-4 text-primary/20">
                                                <Loader2 className="animate-spin" size={48} />
                                                <p className="text-[9px] font-black uppercase tracking-widest italic">Decrypting Workflow...</p>
                                            </div>
                                        ) : tasks.length > 0 ? (
                                            <div className="grid gap-6">
                                                {tasks.map((task, i) => (
                                                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl group hover:border-secondary transition-all flex flex-col md:flex-row justify-between items-center gap-8">
                                                        <div className="space-y-4 flex-grow">
                                                            <div className="flex items-center gap-4">
                                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-primary/5 text-primary/40'}`}>{task.priority} Priority</span>
                                                                <span className="text-[9px] font-bold text-primary/20 uppercase tracking-widest italic">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                            <h3 className="text-3xl font-black font-serif text-primary group-hover:text-secondary transition-colors leading-none">{task.title}</h3>
                                                            <p className="text-xs text-primary/40 font-medium leading-relaxed max-w-2xl">{task.description}</p>
                                                        </div>
                                                        <div className="flex gap-4 w-full md:w-auto">
                                                            <button onClick={() => handleAction(`Action Task ${task.id}`)} className="flex-1 md:flex-none bg-primary text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-secondary hover:text-primary transition-all">Proceed</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-24 text-center bg-cream/10 border-4 border-dashed border-primary/5 rounded-[4rem] group hover:border-secondary transition-all cursor-pointer">
                                                <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-primary/10 group-hover:text-secondary group-hover:scale-110 shadow-inner mb-6 transition-all">
                                                    <CheckCircle2 size={40} />
                                                </div>
                                                <h3 className="text-2xl font-black font-serif text-primary uppercase italic">No Pending Node Tasks</h3>
                                                <p className="text-[10px] text-primary/30 font-bold mt-2 uppercase tracking-widest">All protocols currently operational.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "support" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif italic text-primary">Support <span className="text-secondary">Incident Desk</span></h2>
                                            <div className="flex gap-4">
                                                <button className="text-[10px] font-black uppercase text-primary/20 hover:text-secondary">Open</button>
                                                <button className="text-[10px] font-black uppercase text-primary/20 hover:text-secondary">Closed</button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {tickets.length > 0 ? (
                                                tickets.map((ticket, i) => (
                                                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl group hover:border-secondary transition-all flex flex-col md:flex-row justify-between items-center gap-8">
                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="w-16 h-16 bg-cream rounded-[2.2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0 shadow-inner">
                                                                <MessageSquare size={28} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-1">#{ticket.id?.substring(0, 8)} • {ticket.category || 'Support'}</p>
                                                                <h3 className="text-2xl font-black font-serif text-primary">{ticket.subject}</h3>
                                                                <p className="text-sm font-bold text-secondary mt-1 uppercase tracking-widest italic">{ticket.userName || 'Unknown User'}</p>
                                                            </div>
                                                        </div>
                                                        <Link href={`/dashboard/staff/support/${ticket.id}`} className="bg-primary text-white w-full md:w-16 h-16 rounded-[1.5rem] flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                                            <ArrowRight size={24} />
                                                        </Link>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-24 text-center bg-cream/10 border-4 border-dashed border-primary/5 rounded-[4rem]">
                                                    <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-primary/10 mb-6">
                                                        <LifeBuoy size={40} />
                                                    </div>
                                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic">No Incident Reports</h3>
                                                    <p className="text-[10px] text-primary/30 font-bold mt-2 uppercase tracking-widest">Network signal clear. Monitoring heartbeat.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Options */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Network Watch */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black font-serif uppercase italic tracking-tight">Network <span className="text-secondary underline underline-offset-4 decoration-2">Heartbeat</span></h3>
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                                    </div>

                                    <div className="grid gap-4">
                                        {[
                                            { label: "Active Connections", value: "4,209", color: "text-blue-500" },
                                            { label: "Platform Load", value: "34%", color: "text-green-500" },
                                            { label: "Verification Queue", value: "12", color: "text-amber-500" },
                                            { label: "Mod Activity", value: "High", color: "text-purple-500" }
                                        ].map((node, i) => (
                                            <div key={i} className="flex justify-between items-end p-5 bg-cream/20 rounded-2xl border border-primary/5 group hover:bg-primary hover:text-white transition-all duration-500">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40">{node.label}</p>
                                                <p className={`text-sm font-black italic ${node.color} group-hover:text-secondary transition-colors`}>{node.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => handleAction("System Deep Scan")} className="w-full py-5 border-2 border-dashed border-primary/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-primary/20 hover:text-secondary hover:border-secondary transition-all">
                                        Initialize Deep Scan
                                    </button>
                                </div>

                                {/* Quick Controls */}
                                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                    <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white animate-pulse" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-3xl font-black font-serif italic uppercase leading-none">Security <br /><span className="text-secondary italic">Protocols</span></h4>
                                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-relaxed">Instant terminal access for high-level moderation and emergency lockouts.</p>
                                        </div>
                                        <div className="grid gap-3">
                                            <button onClick={() => handleAction("Global Halt")} className="w-full bg-white/10 border border-white/20 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-all">Global Halt</button>
                                            <button onClick={() => handleAction("Mod Alert")} className="w-full bg-secondary text-primary py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Broadcast Mod Alert</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}
