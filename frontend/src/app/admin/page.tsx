"use client";

import { useState, useEffect } from "react";
import {
    Users,
    ShoppingCart,
    Activity,
    ArrowRight,
    Globe,
    ImagePlus,
    Loader2,
    TrendingUp,
    FileText,
    Zap,
    DollarSign,
    Box,
    KeyRound,
    Bell,
    Map,
    Sprout,
    ShieldAlert,
    Package,
    Settings2,
    Star,
    LayoutDashboard,
    Sliders,
    Warehouse,
    ShieldCheck,
    Briefcase,
    Building2,
    BookOpen,
    Truck,
    Shield,
    ZapOff,
    UserCircle,
    Cpu,
    Lock,
    Scale,
    CreditCard,
    Palette,
    MessageSquare,
    Fingerprint,
    Database,
    Phone
} from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [impersonationId, setImpersonationId] = useState("");
    const [isImpersonating, setIsImpersonating] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(getApiUrl("/api/admin/stats"));
                if (res.ok) setStats(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleImpersonate = async () => {
        if (!impersonationId) return;
        setIsImpersonating(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/impersonate"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: impersonationId })
            });
            const data = await res.json();
            if (data.token) {
                // NextAuth sign-in with the impersonated token logic would go here
                // For now, we simulate the 'Power' by alerting or redirecting
                alert(`IMPERSONATION PROTOCOL ACTIVE: Entering node ${data.user.name}`);
                window.location.href = `/login?token=${data.token}`;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsImpersonating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto space-y-20">
                {/* 🌌 COMMAND HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Sovereign Control Node</h2>
                        </div>
                        <h1 className="text-7xl lg:text-[10rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            The <span className="text-secondary block">Command</span> <span className="text-white">Nexus</span>
                        </h1>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity size={14} className="text-secondary animate-pulse" /> Live Regional Infrastructure Access: JOS-01-NG
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <Link href="/admin/settings" className="bg-white/5 p-6 rounded-[2.5rem] border border-secondary/30 hover:bg-secondary hover:text-primary backdrop-blur-3xl flex items-center gap-5 shadow-2xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 group-hover:bg-white/20 flex items-center justify-center text-secondary shadow-xl transition-colors">
                                <Palette size={28} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-primary/60">Design Hub</h4>
                                <p className="text-[10px] font-black font-serif italic text-white group-hover:text-primary uppercase tracking-widest">Logo & Theme</p>
                            </div>
                        </Link>
                        <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl flex items-center gap-5 shadow-2xl">
                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                                <Users size={28} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Citizen Volume</h4>
                                <p className="text-2xl font-black font-serif italic text-white">{stats?.users || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl flex items-center gap-5 shadow-2xl">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-secondary shadow-xl">
                                <Activity size={28} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Network Growth</h4>
                                <p className="text-2xl font-black font-serif italic text-secondary">{stats?.lastMonthGrowth || '+0%'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 🚀 QUICK ACTION PROTOCOLS */}
                <div className="bg-white/5 rounded-[4rem] p-10 lg:p-12 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <MetricCard
                        label="Platform Liquidity"
                        value={`₦${(stats?.revenue || 0).toLocaleString()}`}
                        icon={<DollarSign size={20} />}
                        color="bg-primary text-secondary"
                        loading={loading}
                    />
                    <MetricCard
                        label="Network Traffic"
                        value={stats?.orders || 0}
                        icon={<Activity size={20} />}
                        color="bg-white/5 text-secondary border border-white/5"
                        loading={loading}
                    />
                    <MetricCard
                        label="Active Citizens"
                        value={stats?.users || 0}
                        icon={<Users size={20} />}
                        color="bg-white/5 text-blue-400 border border-white/5"
                        loading={loading}
                    />
                    <MetricCard
                        label="Verified Assets"
                        value={stats?.totalProducts || 120}
                        icon={<Box size={20} />}
                        color="bg-white/5 text-green-400 border border-white/5"
                        loading={loading}
                    />
                </div>

                {/* ⚡ DIRECT ACTION PROTOCOLS (THE 'ADD/EDIT' POWER) */}
                <div className="mb-16 bg-[#1a3c34]/40 p-8 md:p-12 rounded-[3.5rem] border border-secondary/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
                    <div className="flex justify-between items-center mb-8 relative z-10 w-full">
                        <div className="flex items-center gap-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary border-l-4 border-secondary pl-4">Direct Action Protocols</h2>
                            <span className="bg-secondary/10 text-secondary text-[8px] font-black px-2 py-1 rounded-full uppercase">Instant Write Access</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
                        <ActionBtn href="/admin/inventory/new" icon={<Package size={20} />} label="Inject Asset" permission="inventory" />
                        <ActionBtn href="/admin/users/new" icon={<Users size={20} />} label="Register Citizen" permission="users" />
                        <ActionBtn href="/admin/landing" icon={<ImagePlus size={20} />} label="Design Portal" permission="content" />
                        <ActionBtn href="/admin/inventory" icon={<Warehouse size={20} />} label="Global Restock" permission="inventory" />
                        <ActionBtn href="/admin/orders" icon={<ShoppingCart size={20} />} label="Audit Orders" permission="orders" />
                        <ActionBtn href="/admin/promotions/new" icon={<TrendingUp size={20} />} label="Deploy Promo" permission="promos" />
                    </div>
                </div>

                {/* 🛡️ MASTER UTILITY RACK (THE 14+ LOGIC NODES) */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-8 border-l-4 border-secondary pl-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Sovereign Utility Nodes</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase">
                            <Lock size={12} /> Root Access Confirmed
                        </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        <SmallMenuLink href="/dashboard/supplier" label="Supplier Portal" icon={<Briefcase size={20} />} />
                        <SmallMenuLink href="/dashboard/buyer" label="Buyer Portal" icon={<ShoppingCart size={20} />} />
                        <SmallMenuLink href="/dashboard/logistics" label="Logistics Portal" icon={<Truck size={20} />} />
                        <SmallMenuLink href="/dashboard/staff" label="Staff Terminal" icon={<ShieldCheck size={20} />} />
                        <div className="col-span-full h-px bg-white/5 my-4" />
                        <SmallMenuLink href="/admin/finance/escrow" label="Escrow Node" icon={<Lock size={20} />} permission="finance" />
                        <SmallMenuLink href="/admin/market/pricing" label="Pricing Oracle" icon={<Zap size={20} />} permission="finance" />
                        <SmallMenuLink href="/admin/warehouse" label="Warehouse Mesh" icon={<Warehouse size={20} />} permission="inventory" />
                        <SmallMenuLink href="/admin/otps" label="OTP Gate" icon={<KeyRound size={20} />} permission="users" />
                        <SmallMenuLink href="/admin/promotions" label="Network Promos" icon={<Zap size={20} />} permission="promos" />
                        <SmallMenuLink href="/admin/landing" label="Landing CMS" icon={<Settings2 size={20} />} permission="content" />
                        <SmallMenuLink href="/admin/reviews" label="Trust Matrix" icon={<Star size={20} />} permission="content" />
                        <SmallMenuLink href="/admin/reports" label="Neural Intel" icon={<Activity size={20} />} permission="finance" />
                        <SmallMenuLink href="/admin/users" label="Citizen Registry" icon={<Users size={20} />} permission="users" />
                    </div>
                </div>

                {/* 🧬 SOVEREIGN NETWORK NODES (STATUS MAP) */}
                <div className="mb-20 space-y-10">
                    <div className="flex items-center gap-4 border-l-4 border-secondary pl-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Sovereign Network Nodes</h2>
                        <span className="text-[10px] font-black text-white/20 uppercase">Global Sync Status</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        <NodeStatus label="Distributors" status="Optimal" health={98} icon={<Truck size={14} />} />
                        <NodeStatus label="Retailers" status="Active" health={92} icon={<Box size={14} />} />
                        <NodeStatus label="Wholesale" status="Critical" health={45} icon={<Database size={14} />} />
                        <NodeStatus label="Hotels/B2B" status="Optimal" health={99} icon={<Building2 size={14} />} />
                        <NodeStatus label="Logistics" status="Syncing" health={88} icon={<Map size={14} />} />
                        <NodeStatus label="Team Nodes" status="Root" health={100} icon={<ShieldCheck size={14} />} />
                    </div>
                </div>

                {/* 🧬 HORIZON 5.0 VITALITY (RESTORED FEATURES) */}
                <div className="mb-20 space-y-10">
                    <div className="bg-[#1a3c34]/20 rounded-[4rem] p-12 border border-secondary/10 backdrop-blur-xl shadow-2xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-pulse" />
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black font-serif uppercase tracking-tight text-white">Horizon 5.0 <span className="text-secondary italic">Vitality</span></h2>
                                <p className="text-[10px] font-black uppercase text-secondary/40 tracking-widest mt-1">Sovereign Infrastructure Monitoring</p>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                                <span className="w-2 h-2 bg-secondary rounded-full animate-ping" />
                                <span className="text-[10px] font-black uppercase text-secondary font-mono tracking-widest">Heartbeat: 42ms</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <HorizonWidget label="Insurance Risk" value="Low (12%)" detail="Yield-Shield Active" icon={<Shield size={18} />} color="text-green-400" />
                            <HorizonWidget label="Cold-Vault Status" value="-2°C / 65%" detail="All Nodes Optimal" icon={<Warehouse size={18} />} color="text-blue-400" />
                            <HorizonWidget label="DNA Passports" value="4,280" detail="85% Batch Verified" icon={<Activity size={18} />} color="text-secondary" />
                            <HorizonWidget label="Energy Credits" value="2.8 Tons" detail="480 Waste Credits" icon={<Zap size={18} />} color="text-orange-400" />
                        </div>
                    </div>
                </div>

                {/* 🏗️ SYSTEM INFRASTRUCTURE & FINANCE OVERRIDES */}
                <div className="grid xl:grid-cols-12 gap-10 pb-20">
                    <div className="xl:col-span-8 space-y-10">
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary mb-8 border-l-4 border-secondary pl-4">Network Governance</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InfrastructureCard
                                    href="/admin/users"
                                    title="Citizen Directory"
                                    sub="Farmer, Vendor, B2B, Consumer Matrix"
                                    icon={<Users size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/staff"
                                    title="Staff Network"
                                    sub="Core Team, Node Managers & Task Assignments"
                                    icon={<Shield size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/warehouse"
                                    title="Warehouse Nodes"
                                    sub="Storage, Cold-Chain & Stock Inventory"
                                    icon={<Warehouse size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/otps"
                                    title="OTP Master Intercept"
                                    sub="Universal Verification Recall"
                                    icon={<ShieldAlert size={24} />}
                                    warning
                                />
                                <InfrastructureCard
                                    href="/admin/finance"
                                    title="Liquidity Control"
                                    sub="Manual Credit Lines & B2B Loans"
                                    icon={<Scale size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/maintenance"
                                    title="Global Kill-Switch"
                                    sub="Emergency Site Maintenance"
                                    icon={<ZapOff size={24} />}
                                    warning
                                />
                            </div>
                        </section>

                        <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 backdrop-blur-md shadow-2xl space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-white">Network <span className="text-secondary italic">Operations</span></h2>
                                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">Full System Audit</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Ref Code</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Protocol Status</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(stats?.recentOrders || []).map((order: any) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 text-xs font-bold text-white/60 tracking-mono">{order.id}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-400' : 'bg-secondary/10 text-secondary'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-xs font-black text-right text-white">₦{Number(order.totalAmount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-8">
                        {/* 💰 FINANCIAL NODE */}
                        <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                            <CreditCard className="absolute -bottom-10 -right-10 text-primary/5 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-black font-serif leading-none italic uppercase tracking-tighter">Finance <br />Controller</h3>
                                <p className="text-primary/60 text-[10px] font-black uppercase leading-relaxed tracking-widest">Approve high-value B2B credits and manual wire transfers instantly.</p>
                                <Link href="/admin/finance" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl text-center block">
                                    Manage Credits
                                </Link>
                            </div>
                        </div>

                        {/* 🚩 ACTIVE ALERTS */}
                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl space-y-6 text-[#E6EDF3]">
                            <h3 className="text-2xl font-black font-serif uppercase italic">Security <span className="text-secondary">Directives</span></h3>
                            <div className="space-y-4">
                                {[
                                    { msg: "Unauthorized access attempt: Node 09-X", type: "urgent" },
                                    { msg: "Storage humidity deviation detected", type: "warning" },
                                    { msg: "Yield-Shield payout authorized via ledger", type: "info" }
                                ].map((alert, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${alert.type === 'warning' ? 'bg-orange-400' :
                                            alert.type === 'urgent' ? 'bg-red-400' : 'bg-blue-400'
                                            }`} />
                                        <p className="text-[10px] font-bold text-white/40 tracking-tight leading-snug">{alert.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🌌 NEBULA TICKER MASTER (FLOATING CONTROLLER) */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[800px] animate-in slide-in-from-bottom-10 duration-700">
                    <div className="bg-[#1a3c34] border-2 border-secondary/20 rounded-[2.5rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex items-center justify-between gap-6 group">
                        <div className="flex items-center gap-4 pl-4 overflow-hidden">
                            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center shrink-0 animate-pulse">
                                <TrendingUp size={20} className="text-primary" />
                            </div>
                            <div className="hidden md:block">
                                <h4 className="text-[10px] font-black uppercase tracking-tighter text-secondary leading-none mb-1">Live <span className="italic">Price strip</span></h4>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Broadcast: </span>
                                    <span className="text-[10px] font-black text-white italic">"Kido Market Ticker Responsive 24/7"</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/landing?tab=ticker"
                                className="bg-white/5 border border-white/10 hover:bg-secondary hover:text-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white flex items-center gap-2"
                            >
                                <Settings2 size={14} /> Edit Floating Text
                            </Link>
                            <button
                                className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                onClick={() => alert("Ticker broadcast halted. (Protocol Zero)")}
                            >
                                <ZapOff size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- RESTORED & NEW UI COMPONENTS ---

function NodeStatus({ label, status, health, icon }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-secondary transition-all group cursor-help">
            <div className="flex justify-between items-center">
                <div className="p-3 rounded-xl bg-[#1a3c34] text-secondary group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${health > 90 ? 'bg-green-500' : health > 50 ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`} />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-white uppercase">{status}</span>
                    <span className="text-[8px] font-bold text-white/10">{health}%</span>
                </div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${health > 90 ? 'bg-green-500' : health > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${health}%` }} />
            </div>
        </div>
    );
}

// --- RESTORED & NEW UI COMPONENTS ---

function HorizonWidget({ label, value, detail, icon, color }: any) {
    return (
        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3 hover:bg-white/10 transition-all cursor-crosshair group">
            <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{label}</p>
                <div className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</div>
            </div>
            <h4 className="text-xl font-black font-serif text-white italic">{value}</h4>
            <p className={`text-[9px] font-bold ${color} uppercase tracking-tight`}>{detail}</p>
        </div>
    );
}

function MetricCard({ label, value, icon, color, loading }: any) {
    return (
        <div className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-40 transition-all border border-white/5 ${color.includes('bg-white') ? color : color + ' shadow-xl shadow-secondary/10 hover:border-secondary/20'}`}>
            <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg bg-white/10`}>{icon}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{label}</span>
            </div>
            <div>
                <h3 className="text-3xl font-black font-serif tracking-tight text-white uppercase">
                    {loading ? <Loader2 className="animate-spin text-secondary" size={24} /> : value}
                </h3>
            </div>
        </div>
    );
}

function SmallMenuLink({ href, label, icon, permission }: any) {
    const { data: session } = useSession();
    const userPermissions = (session?.user as any)?.permissions || [];
    const role = (session?.user as any)?.role;

    if (role === 'sub-admin' && permission && !userPermissions.includes(permission)) return null;

    return (
        <Link href={href} className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-secondary transition-all group text-white hover:text-primary shadow-xl cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#1a3c34] group-hover:bg-white/20 flex items-center justify-center transition-colors">
                {icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-primary leading-tight text-center">{label}</span>
        </Link>
    );
}

function ActionBtn({ href, icon, label, permission }: any) {
    const { data: session } = useSession();
    const userPermissions = (session?.user as any)?.permissions || [];
    const role = (session?.user as any)?.role;

    if (role === 'sub-admin' && permission && !userPermissions.includes(permission)) return null;

    return (
        <Link href={href} className="flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-secondary border border-white/5 hover:border-secondary p-6 rounded-3xl transition-all group text-white hover:text-primary shadow-lg cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-[#1a3c34] group-hover:bg-white/20 flex items-center justify-center transition-colors shadow-inner">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{label}</span>
        </Link>
    );
}

function InfrastructureCard({ href, title, sub, icon, warning }: any) {
    return (
        <Link href={href} className={`group p-8 rounded-[2.5rem] border ${warning ? 'bg-red-500/5 border-red-500/20 hover:border-red-500 focus:ring-red-500' : 'bg-white/5 border-white/5 hover:border-secondary focus:ring-secondary'
            } transition-all shadow-xl backdrop-blur-md outline-none`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${warning ? 'bg-red-500/20 text-red-500' : 'bg-[#1a3c34] text-secondary'
                }`}>
                {icon}
            </div>
            <h3 className="text-xl font-black font-serif text-white uppercase italic mb-2 tracking-tight">{title}</h3>
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-secondary group-hover:gap-6 transition-all">
                {sub} <ArrowRight size={14} />
            </div>
        </Link>
    );
}
