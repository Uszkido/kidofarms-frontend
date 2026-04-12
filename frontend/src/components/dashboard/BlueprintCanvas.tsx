"use client";

import React from 'react';
import { Layers, Cpu, Radio, Zap, Activity } from 'lucide-react';

interface BlueprintCanvasProps {
    farmName: string;
    modules: any[];
}

export const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ farmName, modules }) => {
    return (
        <div className="relative w-full min-h-[500px] bg-[#0f172a] rounded-[3rem] overflow-hidden border border-[#1e293b] shadow-2xl font-mono">
            {/* Blueprint Grid Overlay */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(#334155 1px, transparent 1px),
            linear-gradient(90deg, #334155 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* HUD Headers */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#38bdf8] text-[10px] uppercase font-black tracking-[0.3em]">
                        <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                        Live Node telemetry
                    </div>
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter">
                        {farmName} <span className="text-[#38bdf8]/50 italic">Blueprint_v1.0</span>
                    </h3>
                </div>

                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-xl text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={14} className="text-[#38bdf8]" /> CPU: 12%
                    </div>
                    <div className="px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-xl text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                        <Radio size={14} className="text-[#fb923c]" /> Latency: 24ms
                    </div>
                </div>
            </div>

            {/* Central Canvas Rendering Nodes */}
            <div className="relative h-full w-full p-24 flex items-center justify-center gap-12 flex-wrap">

                {/* Parent Farm Node */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-[#38bdf8]/10 rounded-full blur-2xl group-hover:bg-[#38bdf8]/20 transition-all duration-700" />
                    <div className="relative w-40 h-40 rounded-full border-2 border-[#38bdf8] border-dashed flex items-center justify-center bg-[#0f172a] shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                        <div className="text-center">
                            <Layers className="text-[#38bdf8] mx-auto mb-2" size={32} />
                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Main Node</p>
                        </div>
                    </div>

                    {/* Connection Lines (Visual Decor) */}
                    <div className="absolute top-1/2 left-full w-12 h-[2px] bg-gradient-to-r from-[#38bdf8] to-transparent opacity-30" />
                    <div className="absolute top-1/2 right-full w-12 h-[2px] bg-gradient-to-l from-[#38bdf8] to-transparent opacity-30" />
                </div>

                {/* Dynamic Modules */}
                {modules.map((mod, i) => (
                    <div key={i} className="relative mt-8 group">
                        <div className="absolute -inset-2 bg-white/5 rounded-3xl blur-xl group-hover:bg-[#fb923c]/10 transition-all" />
                        <div className="relative w-48 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl hover:border-[#fb923c] transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mod.status === 'online' ? 'bg-[#38bdf8]/10 text-[#38bdf8]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                                    {mod.type === 'sensor' ? <Activity size={16} /> : <Zap size={16} />}
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${mod.status === 'online' ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                                    {mod.status}
                                </span>
                            </div>
                            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">{mod.name}</h4>
                            <p className="text-[#38bdf8] text-[10px] font-bold">{mod.value}</p>

                            <div className="mt-4 pt-4 border-t border-[#334155] space-y-2">
                                <div className="h-1 w-full bg-[#0f172a] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#fb923c]" style={{ width: mod.signal || '80%' }} />
                                </div>
                                <p className="text-[8px] text-white/20 font-black uppercase">Signal Strength</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Decorative Grid Lines */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-[#334155] to-transparent" />
            </div>

            {/* Side HUD Panel */}
            <div className="absolute right-8 bottom-8 top-32 w-64 bg-[#1e293b]/50 backdrop-blur-md border border-[#334155] rounded-[2rem] p-8 hidden lg:block">
                <h5 className="text-[#fb923c] text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Activity size={12} /> System_Log
                </h5>
                <div className="space-y-4">
                    {[
                        { time: 'T-04:02', msg: 'Syncing Layer_4 Protocol' },
                        { time: 'T-02:15', msg: 'Actuator_01 calibration' },
                        { time: 'T-00:45', msg: 'Mesh network established' },
                        { time: 'T-now', msg: 'Monitoring sequence live' },
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 text-[9px] font-mono leading-tight">
                            <span className="text-[#38bdf8] shrink-0 font-black">{log.time}</span>
                            <span className="text-white/60 lowercase italic">{log.msg}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Visual Auth */}
            <div className="absolute bottom-8 left-8">
                <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
                    Kido_Sovereign_System // auth_verified
                </div>
            </div>
        </div>
    );
};
