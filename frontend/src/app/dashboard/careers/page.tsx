"use client";

import { useState } from "react";
import {
    Briefcase,
    FileText,
    Clock,
    CheckCircle2,
    Activity,
    MapPin,
    ArrowRight,
    Search,
    Filter,
    Zap,
    Trophy,
    Target
} from "lucide-react";
import Link from "next/link";

export default function CareerDashboard() {
    const [applications] = useState([
        { id: "APP-KIDO-001", position: "Orchard Manager", location: "Jos Node", status: "Under Review", date: "2026-03-10", nextStep: "Technical Interview" },
        { id: "APP-KIDO-002", position: "Farm Operations Lead", location: "Kano Node", status: "Shadowing", date: "2026-02-28", nextStep: "Final Authorization" },
    ]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            {/* Talent Pulse */}
            <div className="grid lg:grid-cols-3 gap-12">

                {/* Active Applications */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/5">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg animate-pulse">
                                <Target size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-serif text-primary uppercase italic">Mission Status</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Active Deployment Applications</p>
                            </div>
                        </div>
                        <div className="bg-secondary/10 text-secondary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">
                            Live Tracking Active
                        </div>
                    </div>

                    <div className="grid gap-8">
                        {applications.map(app => (
                            <div key={app.id} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm space-y-8 hover:shadow-2xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">{app.id}</p>
                                            <span className="bg-primary/5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-primary/40 italic">{app.date}</span>
                                        </div>
                                        <h4 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter leading-none">{app.position}</h4>
                                    </div>
                                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Shadowing' ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>
                                        {app.status}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 pt-4 border-t border-primary/5">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Deployment Node</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-secondary" />
                                            <p className="text-sm font-bold text-primary">{app.location}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Next Protocol</p>
                                        <div className="flex items-center gap-2">
                                            <Activity size={14} className="text-secondary" />
                                            <p className="text-sm font-bold text-primary">{app.nextStep}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end md:justify-end">
                                        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center gap-3">
                                            View Protocol <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Talent Sidebar */}
                <div className="space-y-8">
                    <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />
                        <div className="flex items-center gap-4 mb-6">
                            <Trophy className="text-secondary" />
                            <h3 className="text-xl font-black font-serif uppercase italic tracking-tight leading-none">Career <br />Authority</h3>
                        </div>
                        <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest italic">
                            Your skill node "Precision Logistics" has been validated by the Staff Command. You've earned +45 Network Authority.
                        </p>
                        <div className="h-px bg-white/10 w-full" />
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-secondary leading-none">
                            <span>Talent Level: 02</span>
                            <span>Leveling... 85%</span>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl space-y-8">
                        <div className="flex items-center gap-4">
                            <Zap className="text-secondary" />
                            <h3 className="text-xl font-black font-serif text-primary uppercase italic tracking-tight leading-none">Critical <br />Mission Openings</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Agronomy Node", status: "Kano", color: "bg-green-500" },
                                { label: "Cold-Vault Op", status: "Lagos", color: "bg-blue-500" },
                                { label: "Security Node", status: "Jos", color: "bg-red-500" },
                            ].map((job, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-primary/5 pb-4 last:border-0">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">{job.label}</span>
                                        <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest italic">Live in {job.status}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-primary/10 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 hover:text-secondary hover:border-secondary transition-all">
                            Scan All Missions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
