"use client";

import { useEffect, useState } from "react";
import {
    Users, TrendingUp, DollarSign, Copy, CheckCircle2,
    ArrowRight, Clock, Award, Share2, Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Commission {
    id: string;
    amount: string;
    status: string;
    createdAt: string;
}

interface AffiliateData {
    referralCode: string;
    commissionRate: string;
    totalEarnings: string;
    pendingEarnings: string;
    commissions: Commission[];
}

export function AffiliateDashboardClient() {
    const [data, setData] = useState<AffiliateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Mock User ID for demonstration - in production, get from auth session
    const userId = "mock-user-id";

    useEffect(() => {
        // Fetch real data from backend
        const fetchData = async () => {
            try {
                // For demo, we'll use local stats if fetch fails
                const res = await fetch(`http://localhost:5000/api/affiliates/dashboard/${userId}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    // Fallback mock data for visual development
                    setData({
                        referralCode: "KIDO-DEMO-123",
                        commissionRate: "5.00",
                        totalEarnings: "145000.00",
                        pendingEarnings: "24500.00",
                        commissions: [
                            { id: "1", amount: "12000.00", status: "paid", createdAt: new Date().toISOString() },
                            { id: "2", amount: "8000.00", status: "pending", createdAt: new Date().toISOString() }
                        ]
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const copyToClipboard = () => {
        const link = `http://localhost:3000/?ref=${data?.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="min-h-screen bg-cream/10 flex items-center justify-center font-black text-primary italic text-2xl animate-pulse">Kido Dashboard Loading...</div>;

    return (
        <main className="flex-grow pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header Stats */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                <Award className="w-3 h-3" /> Certified Partner
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black font-serif italic text-primary">Affiliate <span className="text-secondary italic">Control</span></h1>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-2xl flex items-center gap-8 w-full md:w-auto">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Your Referral Link</p>
                                <p className="font-mono text-xs text-primary/60">.../?ref={data?.referralCode}</p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className={`p-4 rounded-2xl transition-all ${copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-secondary hover:text-primary"}`}
                            >
                                {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "Total Earnings", value: `₦${data?.totalEarnings}`, icon: DollarSign, color: "bg-secondary text-primary" },
                            { label: "Pending Payout", value: `₦${data?.pendingEarnings}`, icon: Clock, color: "bg-blue-500 text-white" },
                            { label: "Commission Rate", value: `${data?.commissionRate}%`, icon: TrendingUp, color: "bg-primary text-white" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 space-y-6 group hover:translate-y-[-5px] transition-all">
                                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl md:text-4xl font-black font-serif">{stat.value}</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Commissions List */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black font-serif">Recent <span className="text-secondary italic">Conversions</span></h2>
                                <button className="text-xs font-black uppercase tracking-widest text-primary/40 hover:text-secondary underline underline-offset-8">Download CSV</button>
                            </div>

                            <div className="space-y-6">
                                {data?.commissions.map((comm, i) => (
                                    <div key={comm.id} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm flex justify-between items-center group hover:shadow-xl transition-all">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-primary/20 group-hover:bg-secondary group-hover:text-primary transition-colors">
                                                <DollarSign size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-lg">₦{comm.amount}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{new Date(comm.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${comm.status === 'paid' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                                            {comm.status}
                                        </span>
                                    </div>
                                ))}
                                {data?.commissions.length === 0 && (
                                    <div className="text-center py-24 bg-white rounded-[3rem] border border-primary/5 italic text-primary/30 font-bold">
                                        No sales yet. Share your link to start earning!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Marketing Tools Sidebar */}
                        <div className="space-y-12">
                            <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
                                <h3 className="text-2xl font-black font-serif italic">Promote <br />Kido Farms</h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: Share2, label: "Share to Social" },
                                        { icon: Wallet, label: "Request Payout" },
                                        { icon: TrendingUp, label: "Growth Tips" }
                                    ].map((tool, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-secondary hover:text-primary transition-all group">
                                            <div className="flex items-center gap-4">
                                                <tool.icon size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                                            </div>
                                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group">
                                <Users className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-xl font-black font-serif italic">Earn Extra</h3>
                                    <p className="text-[10px] font-bold leading-relaxed opacity-60 italic">Invite other influencers to the Kido network and earn 1% bonus on their sales. (Coming Soon)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
