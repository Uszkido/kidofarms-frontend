"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft, Download, Loader2, TrendingUp, TrendingDown, ShoppingCart,
    Users, Package, BarChart3, RefreshCw, Calendar, DollarSign
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface DayPoint { date: string; revenue: number; orders: number; }

function MiniRevenueChart({ data }: { data: DayPoint[] }) {
    if (!data.length) return null;
    const maxRev = Math.max(...data.map(d => d.revenue), 1);
    const width = 100 / data.length;

    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Line chart via SVG */}
            <svg viewBox={`0 0 ${data.length * 10} 100`} className="w-full h-40 overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-secondary, #7FBA00)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-secondary, #7FBA00)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Area fill */}
                <polyline
                    fill="url(#grad)"
                    stroke="none"
                    points={[
                        ...data.map((d, i) => `${i * 10 + 5},${100 - (d.revenue / maxRev) * 90}`),
                        `${(data.length - 1) * 10 + 5},100`,
                        `5,100`
                    ].join(" ")}
                />
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#7FBA00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={data.map((d, i) => `${i * 10 + 5},${100 - (d.revenue / maxRev) * 90}`).join(" ")}
                />
                {/* Dots */}
                {data.map((d, i) => (
                    <circle key={i} cx={i * 10 + 5} cy={100 - (d.revenue / maxRev) * 90}
                        r="2" fill="#7FBA00" opacity="0.8" />
                ))}
            </svg>

            {/* Bar chart row */}
            <div className="flex items-end gap-0.5 h-24 border-b border-white/10">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                        <div
                            className="w-full bg-secondary/30 hover:bg-secondary/60 transition-all rounded-sm cursor-pointer"
                            style={{ height: `${Math.max((d.revenue / maxRev) * 100, 4)}%` }}
                            title={`${d.date}: ₦${d.revenue.toLocaleString()} · ${d.orders} orders`}
                        />
                    </div>
                ))}
            </div>

            {/* X-axis labels — show every ~7th label */}
            <div className="flex justify-between text-[8px] text-white/20 font-mono px-1">
                {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map(d => (
                    <span key={d.date}>{d.date.slice(5)}</span>
                ))}
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const [chartData, setChartData] = useState<DayPoint[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(30);
    const [exporting, setExporting] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [chartRes, statsRes] = await Promise.all([
                fetch(getApiUrl(`/api/admin/revenue-chart?days=${period}`)),
                fetch(getApiUrl("/api/admin/stats"))
            ]);
            if (chartRes.ok) setChartData(await chartRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [period]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = chartData.reduce((s, d) => s + d.orders, 0);
    const avgOrderVal = totalOrders ? totalRevenue / totalOrders : 0;

    const prevHalf = chartData.slice(0, Math.floor(chartData.length / 2)).reduce((s, d) => s + d.revenue, 0);
    const currHalf = chartData.slice(Math.floor(chartData.length / 2)).reduce((s, d) => s + d.revenue, 0);
    const trend = prevHalf > 0 ? (((currHalf - prevHalf) / prevHalf) * 100).toFixed(1) : null;

    const exportCSV = () => {
        setExporting(true);
        const rows = [["Date", "Revenue (NGN)", "Orders"]];
        chartData.forEach(d => rows.push([d.date, `${d.revenue}`, `${d.orders}`]));
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `revenue-intelligence-${period}d-${Date.now()}.csv`; a.click();
        setTimeout(() => setExporting(false), 1000);
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4"><span className="w-16 h-1.5 bg-secondary rounded-full" /><h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Economic Surveillance</h2></div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Yield <span className="text-secondary block">Intelligence</span>
                        </h1>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                        {/* Period selector */}
                        <div className="flex gap-1 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10">
                            {[7, 14, 30, 60, 90].map(d => (
                                <button key={d} onClick={() => setPeriod(d)}
                                    className={`px-5 py-3 rounded-[1rem] text-[9px] font-black uppercase tracking-widest transition-all ${period === d ? 'bg-secondary text-primary' : 'text-white/30 hover:text-white'}`}>
                                    {d}D
                                </button>
                            ))}
                        </div>
                        <button onClick={exportCSV} disabled={exporting} className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">
                            <Download size={16} /> {exporting ? "Exporting..." : "Export CSV"}
                        </button>
                        <button onClick={fetchAll} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary hover:text-secondary transition-all">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </header>

                {/* KPI STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: "text-secondary" },
                        { label: "Total Orders", value: totalOrders.toLocaleString(), icon: <ShoppingCart size={22} />, color: "text-blue-400" },
                        { label: "Avg Order Value", value: `₦${Math.round(avgOrderVal).toLocaleString()}`, icon: <BarChart3 size={22} />, color: "text-purple-400" },
                        { label: `${period}-day Trend`, value: trend ? `${parseFloat(trend) >= 0 ? '+' : ''}${trend}%` : "—", icon: parseFloat(trend || "0") >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />, color: parseFloat(trend || "0") >= 0 ? "text-green-400" : "text-red-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-5">
                            <div className={`p-4 rounded-2xl bg-white/5 ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                                <p className={`text-2xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MAIN CHART + SIDE STATS */}
                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black font-serif italic text-white uppercase tracking-tight">Revenue <span className="text-secondary">Trajectory</span></h3>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Last {period} days · Daily breakdown</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-secondary" />
                                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Daily Revenue</span>
                            </div>
                        </div>
                        {loading ? (
                            <div className="h-64 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-secondary/30" /></div>
                        ) : (
                            <MiniRevenueChart data={chartData} />
                        )}
                    </div>

                    {/* SIDE PLATFORM VITALS */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6">
                            <h3 className="text-base font-black font-serif italic text-white uppercase">Platform <span className="text-secondary">Vitals</span></h3>
                            <div className="space-y-5">
                                {[
                                    { label: "Total Users", value: stats?.totalUsers || "—", color: "text-white" },
                                    { label: "Active Orders", value: stats?.pendingOrders || "—", color: "text-orange-400" },
                                    { label: "Farmers", value: stats?.farmers?.total || "—", color: "text-green-400" },
                                    { label: "Vendors", value: stats?.vendors?.total || "—", color: "text-blue-400" },
                                    { label: "Products Live", value: stats?.totalProducts || "—", color: "text-secondary" },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                                        <p className={`text-xl font-black font-serif italic ${s.color}`}>{s.value?.toLocaleString?.() ?? s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-secondary rounded-[3rem] p-8 text-primary relative overflow-hidden group">
                            <BarChart3 className="absolute -bottom-4 -right-4 w-32 h-32 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Period Total</p>
                                <p className="text-4xl font-black font-serif italic">₦{totalRevenue.toLocaleString()}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">{totalOrders} orders · {period} days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DAILY TABLE */}
                <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="font-black text-sm uppercase tracking-widest text-white">Daily Revenue Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-[#040d0a]">
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-white/20">Date</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Revenue</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Orders</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Avg/Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[...chartData].reverse().map(d => (
                                    <tr key={d.date} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-4 font-mono text-sm text-white/40">{d.date}</td>
                                        <td className="px-8 py-4 text-right font-black text-secondary font-serif italic">₦{d.revenue.toLocaleString()}</td>
                                        <td className="px-8 py-4 text-right text-white/40 font-mono">{d.orders}</td>
                                        <td className="px-8 py-4 text-right text-white/30 font-mono text-sm">₦{d.orders ? Math.round(d.revenue / d.orders).toLocaleString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
