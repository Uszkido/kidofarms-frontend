"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Droplets,
    ThermometerSun,
    Wind,
    Zap,
    TrendingUp,
    MapPin,
    Globe,
    Cpu,
    CheckCircle2,
    Clock,
    Fingerprint
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function MonitoringPage() {
    const [sensors, setSensors] = useState<any[]>([]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch(getApiUrl("/api/sensors"));
                if (res.ok) setSensors(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        fetchSensors();
        const interval = setInterval(fetchSensors, 5000);
        return () => clearInterval(interval);
    }, []);

    const getSensorVal = (type: string) => sensors.find(s => s.type === type)?.value || "--";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black font-serif text-primary uppercase italic tracking-tighter">Precision <span className="text-secondary italic underline decoration-secondary/30 decoration-4 underline-offset-8">Node</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 font-sans">Satellite & In-Field IoT Sensory Mesh</p>
                </div>
                <div className="bg-white px-8 py-5 rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40 border border-primary/5 shadow-2xl backdrop-blur-md">
                    <Activity size={14} className="text-secondary animate-pulse" /> Node Status: Authorized
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 text-secondary flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp size={36} />
                        </div>
                        <h4 className="text-3xl font-black font-serif uppercase tracking-tighter mb-3 italic">Yield Prediction</h4>
                        <p className="text-primary/30 text-[9px] font-black uppercase tracking-[0.3em] mb-12">Neural Estimated Regional Output</p>
                    </div>
                    <div className="flex items-end gap-4 text-primary relative">
                        <span className="text-8xl font-black font-serif italic tracking-tighter leading-none font-sans">4.2</span>
                        <div className="pb-3">
                            <p className="text-xs font-black opacity-20 tracking-widest uppercase mb-1">Grade Alpha</p>
                            <p className="text-xs font-black opacity-20 tracking-widest uppercase">Tons / HA</p>
                        </div>
                        <ArrowUpRight size={32} className="absolute top-0 right-0 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-500 flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform">
                            <MapPin size={36} />
                        </div>
                        <h4 className="text-3xl font-black font-serif uppercase tracking-tighter mb-3 italic">NDVI Spectral</h4>
                        <p className="text-primary/30 text-[9px] font-black uppercase tracking-[0.3em] mb-12">Photosynthetic Vegetation Analysis</p>
                    </div>
                    <div className="flex items-end gap-4 text-green-500">
                        <span className="text-8xl font-black font-serif italic tracking-tighter leading-none font-sans">0.82</span>
                        <div className="pb-3 text-primary/20">
                            <p className="text-xs font-black tracking-widest uppercase mb-1">Health Index</p>
                            <p className="text-xs font-black tracking-widest uppercase font-sans">Optimal Range</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary p-12 rounded-[4rem] shadow-2xl text-white flex flex-col items-center justify-center space-y-10 text-center relative overflow-hidden group border border-white/10">
                    <Fingerprint className="text-secondary/5 absolute inset-0 w-full h-full p-12 group-hover:scale-110 transition-transform duration-[5000ms]" />
                    <div className="relative z-10 space-y-10">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 mx-auto shadow-2xl">
                            <Fingerprint size={56} className="text-secondary animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-3">Node Biometrics</p>
                            <h4 className="text-3xl font-black font-serif italic uppercase tracking-tighter">Identity <br /><span className="text-secondary">Verified</span></h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-16 border border-primary/5 shadow-2xl mx-4 space-y-16">
                <div className="flex justify-between items-center border-b border-primary/5 pb-10">
                    <h3 className="text-2xl font-black font-serif italic uppercase text-primary">Live IoT <span className="text-secondary italic underline decoration-2 underline-offset-8">Sensory Mesh</span></h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 font-sans">Real-time Sync</span>
                        </div>
                        <div className="flex items-center gap-3 bg-neutral-50 px-6 py-3 rounded-2xl border border-primary/5">
                            <Clock size={14} className="text-primary/20" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 font-sans">Node Refresh: 5S</span>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: "Moisture Node", value: getSensorVal('moisture') + (getSensorVal('moisture') !== '--' ? '%' : ''), icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Ambient Temp", value: getSensorVal('temperature') + (getSensorVal('temperature') !== '--' ? '°C' : ''), icon: ThermometerSun, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: "Wind Velocity", value: getSensorVal('wind') + (getSensorVal('wind') !== '--' ? ' km/h' : ''), icon: Wind, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Solar Energy", value: getSensorVal('solar') + (getSensorVal('solar') !== '--' ? ' W/m²' : ''), icon: Zap, color: "text-secondary", bg: "bg-secondary/10" },
                    ].map((sensor, i) => (
                        <div key={i} className="space-y-8 p-10 bg-neutral-50 rounded-[3rem] border border-primary/5 group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className="flex justify-between items-center">
                                <div className={`w-14 h-14 rounded-2xl ${sensor.bg} ${sensor.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    <sensor.icon size={28} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary/20 bg-white px-3 py-1.5 rounded-full border border-primary/5 shadow-sm">Sensor #80{i}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 mb-2 font-sans">{sensor.label}</p>
                                <p className="text-4xl font-black font-serif text-primary italic font-sans">{sensor.value}</p>
                            </div>
                            <div className="pt-6 border-t border-primary/5 flex items-center gap-3 text-[9px] font-black uppercase text-primary/40">
                                <CheckCircle2 size={12} className="text-green-500" /> Operational
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/5 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 border border-primary/5">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                            <Cpu size={40} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black font-serif italic text-primary uppercase tracking-tighter">AI Node <span className="text-secondary italic">Diagnostics</span></h4>
                            <p className="text-primary/40 text-xs font-medium max-w-md mt-2 leading-relaxed">Continuous edge computing active. Node performance currently at <span className="text-primary font-black italic">99.8% stability</span>.</p>
                        </div>
                    </div>
                    <button onClick={() => alert("Full diagnostic batch initiated.")} className="bg-primary text-secondary px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-secondary hover:text-primary transition-all">Run Full Scan</button>
                </div>
            </div>
        </div>
    );
}

function ArrowUpRight({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>;
}
