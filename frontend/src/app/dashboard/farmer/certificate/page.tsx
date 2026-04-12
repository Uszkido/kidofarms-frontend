"use client";

import { ShieldCheck, Leaf, Globe, Share2, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SustainabilityCertificate() {
    return (
        <div className="min-h-screen bg-[#06120e] text-white p-6 md:p-10 font-sans flex items-center justify-center pt-24">
            <div className="max-w-4xl w-full">
                <Link href="/dashboard/farmer" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-bold text-sm uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                {/* Certificate Container */}
                <div className="bg-[#1a2d24]/50 border border-[#C5A059]/30 rounded-[3rem] p-8 md:p-16 relative overflow-hidden backdrop-blur-xl shadow-2xl">
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                        <Globe className="w-96 h-96 text-[#C5A059]" />
                    </div>

                    <div className="relative z-10 space-y-12 text-center">
                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center justify-center p-4 bg-[#C5A059]/10 rounded-full text-[#C5A059] mb-6 shadow-xl">
                                <ShieldCheck className="w-12 h-12" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-serif italic text-white leading-tight">
                                Global Sustainability <br />
                                <span className="text-[#C5A059]">Sovereign Certificate</span>
                            </h1>
                            <p className="text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-4 text-sm">Issued by Kido Farms Horizon Network</p>
                        </div>

                        {/* Certification Body */}
                        <div>
                            <p className="text-gray-300 text-lg md:text-2xl font-serif max-w-2xl mx-auto leading-relaxed border-y border-white/10 py-8">
                                This certifies that <strong className="text-white text-3xl block mt-2">Kido Alpha Node</strong> <br />
                                has met the rigorous socio-environmental compliance standards for the current planting cycle, implementing optimal water conservation, ethical labor parity, and Zero-Chemical protocols.
                            </p>
                        </div>

                        {/* Metric Checkmarks */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/10">
                            {[
                                { label: "Water Efficiency", val: "94%" },
                                { label: "Carbon Offset", val: "1.2 Tons" },
                                { label: "Soil Integrity", val: "Optimal" },
                                { label: "Zero Pesticide", val: "Verified" }
                            ].map((metric, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <Leaf className="text-green-400 w-6 h-6" />
                                    <p className="text-xs font-black uppercase text-gray-400">{metric.label}</p>
                                    <p className="text-lg font-bold text-white">{metric.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer Signatures */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8">
                            <div className="text-left w-full md:w-auto">
                                <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-2 border-b border-[#C5A059]/30 pb-2 inline-block">Issuer ID</p>
                                <p className="font-mono text-sm text-gray-300">#KIDO-GS-2026-X89</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" title="Print Certificate">
                                    <Printer className="text-white w-6 h-6" />
                                </button>
                                <button className="px-6 py-4 bg-[#C5A059] text-[#06120e] rounded-xl hover:bg-white transition-colors flex items-center gap-2 font-black uppercase text-xs shadow-lg shadow-[#C5A059]/20" title="Share via Global Bridge">
                                    <Share2 className="w-5 h-5" /> Share compliance
                                </button>
                            </div>

                            <div className="text-right w-full md:w-auto">
                                <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-2 border-b border-[#C5A059]/30 pb-2 inline-block w-full text-right">Validation Period</p>
                                <p className="font-mono text-sm text-gray-300">Apr 2026 - Dec 2026</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
