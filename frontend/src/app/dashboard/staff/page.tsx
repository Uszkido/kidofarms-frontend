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
    Briefcase,
    X,
    MoreHorizontal,
    Maximize2,
    Trash2,
    RotateCcw,
    FileText,
    Mail
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
    const [userRegistry, setUserRegistry] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchStaffData();
        }
    }, [(session?.user as any)?.id]);

    const fetchStaffData = async () => {
        try {
            const [tRes, sRes, uRes] = await Promise.all([
                fetch(getApiUrl(`/api/team/tasks/all?userId=${(session?.user as any)?.id}`)),
                fetch(getApiUrl(`/api/tickets/all`)),
                fetch(getApiUrl(`/api/admin/users?limit=10`))
            ]);
            if (tRes.ok) setTasks(await tRes.json());
            if (sRes.ok) setTickets(await sRes.json());
            if (uRes.ok) setUserRegistry((await uRes.json()).users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Master Node synchronization in progress.`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Sovereign Operations Header */}
                        <header className="relative py-12 md:py-16 px-6 md:px-12 bg-primary rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <Briefcase className="absolute -bottom-20 -right-20 text-white/5 w-96 h-96 -rotate-12 group-hover:rotate-0 transition-all duration-[3000ms]" />
                            <div className="absolute top-10 right-20 w-80 h-80 bg-secondary rounded-full blur-[150px] opacity-10 animate-pulse" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl">
                                        <ShieldCheck size={14} className="animate-spin duration-[5000ms]" /> Sovereign Operations Hub
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl md:text-9xl font-black font-serif text-white tracking-tighter leading-none">
                                        Staff <br />
                                        <span className="text-secondary italic">Command</span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button onClick={() => handleAction("Broadcast Notice")} className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-3">
                                            <Zap size={18} /> Global Notice
                                        </button>
                                        <button onClick={() => handleAction("Security Audit")} className="bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-3">
                                            <ShieldAlert size={18} /> Full System Audit
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10 w-full max-w-sm">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] font-black uppercase text-white/30 mb-2">Node Tasks</p>
                                                <p className="text-5xl font-black font-serif text-white">{tasks.length}</p>
                                                <p className="text-[9px] font-black text-secondary uppercase tracking-widest mt-1">Pending Sync</p>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] font-black uppercase text-white/30 mb-2">Help Desk</p>
                                                <p className="text-5xl font-black font-serif text-secondary">{tickets.length}</p>
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Active Threads</p>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-white/10">
                                            <button onClick={() => setActiveTab('moderation')} className="w-full bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans">
                                                Access Moderation Terminal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Top Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Network Pulse", value: "99.9%", icon: Activity, color: "text-green-500 bg-green-50", detail: "Uptime Nominal" },
                                { label: "Dispute Delta", value: "0.2%", icon: Flag, color: "text-red-500 bg-red-50", detail: "Sector Low" },
                                { label: "Mod Efficiency", value: "94s", icon: Zap, color: "text-secondary bg-secondary/10", detail: "Avg Response" },
                                { label: "Staff Sync", value: "12/12", icon: Users, color: "text-blue-500 bg-blue-50", detail: "Nodes Online" },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-xl space-y-4 group hover:shadow-2xl hover:border-secondary transition-all cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <s.icon size={26} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif text-primary uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{s.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/40 italic">
                                        <CheckCircle2 size={10} className="text-secondary" /> {s.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {[
                                { id: "command", label: "Workflow Command", icon: CheckSquare },
                                { id: "support", label: "Incident Desk", icon: MessageSquare },
                                { id: "users", label: "Sovereign Registry", icon: Users },
                                { id: "moderation", label: "Terminal Control", icon: ShieldAlert },
                                { id: "reports", label: "Network Logs", icon: BarChart3 },
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

                        {/* Main Interaction Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Command Stream Area */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "command" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl md:text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Workflow <span className="text-secondary italic">Matrix</span></h2>
                                            <button onClick={() => handleAction("New Activity Node")} className="bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={18} /></button>
                                        </div>

                                        <div className="grid gap-6">
                                            {loading ? (
                                                <div className="py-24 flex flex-col items-center gap-4 text-primary/20">
                                                    <Loader2 className="animate-spin" size={64} />
                                                    <p className="text-[12px] font-black uppercase tracking-[0.4em] italic">Synchronizing Matrix...</p>
                                                </div>
                                            ) : tasks.length > 0 ? tasks.map((task, i) => (
                                                <div key={i} className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col md:flex-row justify-between items-center gap-10">
                                                    <div className="space-y-6 flex-grow">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100 shadow-sm animate-pulse' : 'bg-primary/5 text-primary/40'}`}>
                                                                {task.priority} Severity
                                                            </div>
                                                            <span className="text-[9px] font-black text-primary/20 uppercase tracking-[0.2em] italic">Vect: {task.id?.substring(0, 6)}</span>
                                                        </div>
                                                        <h3 className="text-2xl md:text-4xl font-black font-serif text-primary group-hover:text-secondary transition-colors tracking-tighter uppercase italic leading-none">{task.title}</h3>
                                                        <p className="text-sm text-primary/40 font-medium leading-relaxed max-w-2xl">{task.description}</p>
                                                    </div>
                                                    <div className="flex gap-4 w-full md:w-auto">
                                                        <button onClick={() => handleAction(`Execute ${task.id}`)} className="flex-grow bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-secondary hover:text-primary transition-all font-sans">Initialize Protocol</button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-32 text-center bg-cream/20 border-4 border-dashed border-primary/10 rounded-[2.5rem] md:rounded-[4rem] group hover:border-secondary transition-all cursor-pointer">
                                                    <CheckCircle2 size={80} className="mx-auto text-primary/5 group-hover:text-secondary group-hover:scale-110 transition-all mb-8" />
                                                    <h3 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">Protocols Optimal</h3>
                                                    <p className="text-[10px] text-primary/30 font-black mt-2 uppercase tracking-widest">No assigned nodes detected in matrix.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "support" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl md:text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Help <span className="text-secondary italic">Terminal</span></h2>
                                            <div className="flex flex-wrap gap-4 pt-4 md:pt-0">
                                                <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary border-b-2 border-transparent hover:border-secondary transition-all pb-1">Open Pulse</button>
                                                <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary border-b-2 border-transparent hover:border-secondary transition-all pb-1">Archived Nodes</button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {tickets.length > 0 ? (
                                                tickets.map((ticket, i) => (
                                                    <div key={i} className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col md:flex-row justify-between items-center gap-10">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 w-full md:w-auto">
                                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-cream rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0 shadow-inner">
                                                                <MessageSquare size={36} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-2 italic">Ref: #{ticket.id?.substring(0, 8)} • {ticket.category || 'SUPPORT-X'}</p>
                                                                <h3 className="text-2xl md:text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">{ticket.subject}</h3>
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <span className="text-[11px] font-black text-secondary uppercase tracking-widest italic">{ticket.userName || 'Sovereign User'}</span>
                                                                    <span className="text-[11px] font-black text-primary/20 uppercase tracking-widest">Signal: Active</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Link href={`/dashboard/staff/support/${ticket.id}`} className="bg-primary text-white w-full md:w-20 md:h-20 h-20 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-2xl">
                                                            <ArrowRight size={32} />
                                                        </Link>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-32 text-center bg-cream/20 border-4 border-dashed border-primary/10 rounded-[2.5rem] md:rounded-[4rem]">
                                                    <LifeBuoy size={80} className="mx-auto text-primary/5 mb-8" />
                                                    <h3 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">Incident Quiet</h3>
                                                    <p className="text-[10px] text-primary/30 font-black mt-2 uppercase tracking-widest">No emergency pings detected globally.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "users" && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                                            <h2 className="text-3xl md:text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Sovereign <span className="text-secondary italic">Registry</span></h2>
                                            <div className="relative group w-full md:w-auto">
                                                <input
                                                    placeholder="Search Mesh (Name/ID/Bio)..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="bg-white border border-primary/5 rounded-2xl px-10 py-4 outline-none focus:border-secondary transition-all font-sans text-xs font-black uppercase tracking-widest w-full md:w-80 shadow-xl"
                                                />
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl overflow-hidden p-6 md:p-10">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[700px]">
                                                    <thead>
                                                        <tr className="border-b border-primary/5 text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 text-left">
                                                            <th className="px-8 py-6">Identity Node</th>
                                                            <th className="px-8 py-6">Tier Level</th>
                                                            <th className="px-8 py-6 text-right">Registry Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-primary/5">
                                                        {userRegistry.map((user, i) => (
                                                            <tr key={i} className="group hover:bg-cream/30 transition-all cursor-pointer">
                                                                <td className="px-8 py-10 flex items-center gap-6">
                                                                    <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center font-serif font-black text-2xl shadow-xl group-hover:scale-110 transition-transform shrink-0">{user.name?.[0]}</div>
                                                                    <div>
                                                                        <p className="font-black font-serif text-2xl italic uppercase tracking-tighter text-primary">{user.name}</p>
                                                                        <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest mt-1 italic">{user.email}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-10">
                                                                    <span className="bg-neutral-50 border border-primary/5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary italic shadow-sm whitespace-nowrap">{user.role} Node</span>
                                                                </td>
                                                                <td className="px-8 py-10 text-right">
                                                                    <button onClick={() => handleAction(`Inspect ${user.id}`)} className="p-4 bg-primary/5 text-primary/20 rounded-2xl hover:bg-primary hover:text-white transition-all"><Maximize2 size={20} /></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Terminal Controls */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Network Watcher Hub */}
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] border border-primary/5 shadow-2xl space-y-12">
                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-2xl md:text-3xl font-black font-serif uppercase italic text-primary leading-none tracking-tighter">System <br /><span className="text-secondary underline decoration-4 underline-offset-8">Heartbeat</span></h3>
                                        <div className="w-4 h-4 bg-green-500 rounded-full animate-ping shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                                    </div>

                                    <div className="grid gap-6">
                                        {[
                                            { label: "Matrix Connections", value: "4,209", icon: Activity, color: "text-blue-500" },
                                            { label: "CPU Sync", value: "34%", icon: Zap, color: "text-green-500" },
                                            { label: "Latency Node", value: "12ms", icon: Clock, color: "text-amber-500" },
                                            { label: "Mod Intensity", value: "High", icon: ShieldAlert, color: "text-red-500" }
                                        ].map((node, i) => (
                                            <div key={i} className="flex justify-between items-center p-6 bg-cream/30 rounded-[1.5rem] md:rounded-[2rem] border border-primary/5 group hover:bg-primary transition-all duration-700">
                                                <div className="flex items-center gap-4">
                                                    <node.icon size={20} className={`${node.color} group-hover:text-secondary group-hover:scale-110 transition-all`} />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40">{node.label}</p>
                                                </div>
                                                <p className={`text-sm font-black italic ${node.color} group-hover:text-secondary font-sans`}>{node.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => handleAction("System Deep Scan")} className="w-full py-6 border-4 border-dashed border-primary/10 rounded-[2rem] md:rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] text-primary/20 hover:text-secondary hover:border-secondary transition-all italic">
                                        Broadcast Deep Node Scan
                                    </button>
                                </div>

                                {/* Rapid Operations Terminal */}
                                <div className="bg-primary rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-[3000ms]" />
                                    <div className="relative z-10 space-y-10">
                                        <div className="space-y-6">
                                            <h4 className="text-3xl md:text-4xl font-black font-serif italic uppercase leading-none tracking-tighter">Rapid <br /><span className="text-secondary italic">Terminal</span></h4>
                                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed italic">Direct emergency override vector. Authorized STAFF clearance only.</p>
                                        </div>
                                        <div className="grid gap-4">
                                            <button onClick={() => handleAction("Global Flush")} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:border-red-500 transition-all shadow-xl">Matrix Flush</button>
                                            <button onClick={() => handleAction("Emergency Lock")} className="w-full bg-secondary text-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl">Hardware Lock</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Audit Notifications */}
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <h3 className="text-2xl font-black font-serif italic uppercase text-primary px-2 tracking-tighter leading-none">Registry <br /><span className="text-secondary italic">Pulse</span></h3>
                                    <div className="space-y-8">
                                        {[
                                            { title: "Escrow Protocol", desc: "Batch #KB-902 released to Peer Node.", type: "financial", time: "2m ago" },
                                            { title: "Identity Match", desc: "Biometrics verified for Node #UA-01.", type: "security", time: "14m ago" }
                                        ].map((alert, i) => (
                                            <div key={i} className="flex gap-4 md:gap-6 p-6 bg-neutral-50 rounded-[1.5rem] md:rounded-[2rem] border border-primary/5 hover:bg-white hover:shadow-2xl transition-all cursor-pointer group">
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform shadow-xl">
                                                    {alert.type === 'financial' ? <Zap size={22} /> : <ShieldCheck size={22} />}
                                                </div>
                                                <div className="space-y-2 flex-grow">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[11px] font-black uppercase tracking-tight text-primary leading-none italic">{alert.title}</p>
                                                        <span className="text-[8px] font-black uppercase text-primary/20">{alert.time}</span>
                                                    </div>
                                                    <p className="text-[10px] font-medium text-primary/40 leading-relaxed uppercase italic">{alert.desc}</p>
                                                </div>
                                            </div>
                                        ))}
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

function Plus({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
}
