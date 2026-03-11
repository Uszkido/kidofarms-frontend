"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Truck, MapPin, Navigation, Shield, CheckCircle2,
    Bell, Settings, Clock, Box, ArrowRight, TrendingUp,
    Package, MessageSquare, Fuel, Star, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ReportIssueModal from "@/components/ReportIssueModal";
import { motion } from "framer-motion";

const shipments = [
    { id: "LOG-942", destination: "Abuja Central Market", load: "Fresh Veggie Cluster", status: "In Transit", time: "Arriving 2pm", progress: 70 },
    { id: "LOG-881", destination: "Lagos Port Terminal", load: "Export Grade Grains", status: "Loading", time: "Departing 4pm", progress: 20 },
    { id: "LOG-772", destination: "Kano Cold Storage", load: "Perishable Fruits", status: "Delayed", time: "Check Protocol", progress: 45 }
];

export default function DistributorDashboard() {
    const { data: session } = useSession();
    const [activeShipment, setActiveShipment] = useState<any>(null);

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Status Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <Navigation className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 rotate-12" />
                            <div className="relative z-10 flex items-center gap-8">
                                <div className="w-20 h-20 rounded-[2rem] bg-secondary flex items-center justify-center text-primary shadow-xl">
                                    <Truck size={40} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black font-serif uppercase tracking-tighter italic">Logistics <span className="text-secondary">Nexus</span></h1>
                                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Active Agent: {session?.user?.name || "Distributor Node"}</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex gap-6 mt-8 md:mt-0">
                                <div className="text-right">
                                    <p className="text-2xl font-black font-serif">{shipments.filter(s => s.status === 'In Transit').length} <span className="text-secondary">Active</span></p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Deliveries in Stream</p>
                                </div>
                                <div className="w-px h-12 bg-white/10 mx-2" />
                                <div className="text-right">
                                    <p className="text-2xl font-black font-serif text-secondary">98.4%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Fulfillment Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Fuel Credits", value: "₦42,000", icon: Fuel, color: "text-green-500 bg-green-50" },
                                { label: "Avg Delivery", value: "2.4 hrs", icon: Clock, color: "text-blue-500 bg-blue-50" },
                                { label: "Total Routes", value: "38", icon: MapPin, color: "text-purple-500 bg-purple-50" },
                                { label: "Trust Rating", value: "4.9★", icon: Star, color: "text-secondary bg-secondary/10" },
                            ].map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                                        <s.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black font-serif">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Grid */}
                        <div className="grid lg:grid-cols-3 gap-10">
                            {/* Fleet Stream */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black font-serif uppercase italic tracking-tight">Fleet <span className="text-secondary">Stream</span></h2>
                                    <Link href="/dashboard/logistics" className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors flex items-center gap-2">
                                        Full Portal <ChevronRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    {shipments.map((ship, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                            className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl hover:scale-[1.01] transition-all group cursor-pointer"
                                            onClick={() => setActiveShipment(activeShipment?.id === ship.id ? null : ship)}>
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div className="flex items-center gap-8 w-full">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${ship.status === 'Delayed' ? 'bg-red-50 text-red-500' : ship.status === 'In Transit' ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'}`}>
                                                        <Box size={24} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">{ship.id}</p>
                                                        <h3 className="text-xl font-black font-serif">{ship.destination}</h3>
                                                        <p className="text-xs font-bold text-primary/40 mt-1">{ship.load}</p>
                                                        {/* Progress bar */}
                                                        <div className="mt-3 h-1.5 w-full bg-cream rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }} animate={{ width: `${ship.progress}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                                                                className={`h-full rounded-full ${ship.status === 'Delayed' ? 'bg-red-400' : 'bg-secondary'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className={`text-sm font-black uppercase italic ${ship.status === 'Delayed' ? 'text-red-500' : 'text-secondary'}`}>{ship.status}</p>
                                                    <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">{ship.time}</p>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {activeShipment?.id === ship.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 pt-8 border-t border-primary/5 grid grid-cols-2 gap-4">
                                                    <Link href="/dashboard/logistics" className="bg-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-secondary hover:text-primary transition-all">
                                                        View Tracking
                                                    </Link>
                                                    <button className="bg-cream py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary hover:bg-secondary transition-all">
                                                        Update Status
                                                    </button>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                <div className="bg-secondary rounded-[3rem] p-10 shadow-2xl space-y-6">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary shadow-inner">
                                        <Shield size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black font-serif leading-tight text-primary">Logistics <span className="italic block">Clearance</span></h3>
                                    <p className="text-primary/60 text-xs font-black uppercase tracking-widest leading-relaxed">System scan complete. Your distribution node is <span className="text-primary underline">Authorized</span> for inter-state and bulk transit protocol.</p>
                                    <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-widest italic">
                                        <CheckCircle2 size={16} /> Verified Protocol Active
                                    </div>
                                </div>

                                <div className="bg-white rounded-[4rem] p-10 border border-primary/5 shadow-xl space-y-8">
                                    <h3 className="text-xl font-black font-serif uppercase tracking-tighter">Recent <span className="text-secondary italic">Terminal Logs</span></h3>
                                    <div className="space-y-6">
                                        {[
                                            { event: "Delivery Confirmed", loc: "Lekki Hub", time: "2h ago" },
                                            { event: "Fuel Subsidy Credit", loc: "Wallet +₦8,000", time: "5h ago" },
                                            { event: "Route Optimized", loc: "Fast Path 4 → A1", time: "Yesterday" }
                                        ].map((log, i) => (
                                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-primary/5 last:border-0 last:pb-0">
                                                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-primary">{log.event}</p>
                                                    <div className="flex justify-between items-center w-full min-w-[150px] mt-1">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/30">{log.loc}</span>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/20">{log.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/dashboard/logistics" className="block w-full text-center text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors py-2 border-t border-primary/5 pt-6">
                                        View Full Portal →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ReportIssueModal />
        </div>
    );
}
