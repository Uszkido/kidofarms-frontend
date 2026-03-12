"use client";

import { useState } from "react";
import {
    Truck,
    Navigation,
    Clock,
    CheckCircle2,
    Activity,
    MapPin,
    ArrowRight,
    Box,
    AlertCircle,
    Package
} from "lucide-react";
import Link from "next/link";

export default function CarrierDashboard() {
    const [tasks] = useState([
        { id: "NODE-Lagos-092", route: "Ikorodu → Lekki", item: "Bulbous Onions", deadline: "2h 40m", status: "Incoming", value: "₦4,500" },
        { id: "NODE-Lagos-085", route: "Epe → Victoria Island", item: "Live Catfish", deadline: "1h 15m", status: "Priority", value: "₦6,200" },
    ]);

    const [isBroadcasting, setIsBroadcasting] = useState(true);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            {/* Command Summary */}
            <div className="grid lg:grid-cols-3 gap-12">

                {/* Active Task Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/5">
                        <div className="flex gap-6 items-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isBroadcasting ? 'bg-secondary text-primary animate-pulse' : 'bg-neutral-200 text-neutral-400'}`}>
                                <Navigation size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-serif text-primary uppercase italic">Active Live Sync</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Lagos-Center Infrastructure Node</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsBroadcasting(!isBroadcasting)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isBroadcasting
                                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                    : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                                }`}
                        >
                            {isBroadcasting ? 'Broadcasting Active' : 'Radio Silence'}
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm space-y-8 hover:shadow-2xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">{task.id}</p>
                                        <h4 className="text-2xl font-black font-serif text-primary uppercase italic">{task.item}</h4>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${task.status === 'Priority' ? 'bg-red-500 text-white' : 'bg-secondary text-primary dark:bg-primary dark:text-secondary'}`}>
                                        {task.status}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cream/50 flex items-center justify-center text-primary/40 group-hover:bg-secondary group-hover:text-primary transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Delivery Protocol</p>
                                            <p className="text-xs font-bold text-primary">{task.route}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cream/50 flex items-center justify-center text-primary/40 group-hover:bg-secondary group-hover:text-primary transition-colors">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Node Deadline</p>
                                            <p className="text-xs font-black text-secondary">{task.deadline}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                    Accept Dispatch <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Alerts / Tips */}
                <div className="space-y-8">
                    <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />
                        <div className="flex items-center gap-4 mb-6">
                            <AlertCircle className="text-secondary" />
                            <h3 className="text-xl font-black font-serif uppercase italic tracking-tight">Vessel Protocol</h3>
                        </div>
                        <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest">
                            Ensure your cold-chain unit is calibrated to -2°C for the upcoming fish dispatches. Optimal delivery window: 04:00 - 09:00.
                        </p>
                        <div className="h-px bg-white/10 w-full" />
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-secondary leading-none">
                            <span>Logistics Level: 04</span>
                            <span>92 XP to Next Node</span>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl space-y-8">
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-green-500" />
                            <h3 className="text-xl font-black font-serif text-primary uppercase italic">Network Status</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Lagos Mesh", status: "Optimal", color: "bg-green-500" },
                                { label: "Abuja Bridge", status: "Dense Traffic", color: "bg-orange-500" },
                                { label: "Kano Node", status: "Harvest Peak", color: "bg-blue-500" },
                            ].map((mesh, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-help">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">{mesh.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-primary/60">{mesh.status}</span>
                                        <div className={`w-2 h-2 rounded-full ${mesh.color} animate-pulse`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
