"use client";

import { X, MapPin, Calendar, Sprout, ShieldCheck, User, QrCode, ArrowRight, ThumbsUp, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HarvestPassportProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        productName: string;
        farmerName: string;
        location: string;
        harvestDate: string;
        purityScore: string;
        soilType: string;
        certification: string;
        image: string;
        farmerBio: string;
    };
}

export function HarvestPassport({ isOpen, onClose, data }: HarvestPassportProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-primary/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-8 border-secondary/20"
                >
                    {/* Header Image & Farmer Identity */}
                    <div className="relative h-64 md:h-80 bg-primary overflow-hidden">
                        <img src={data.image} alt={data.productName} className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[5s]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />

                        <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all z-20">
                            <X size={24} />
                        </button>

                        <div className="absolute bottom-8 left-8 space-y-2 text-white">
                            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                <QrCode size={12} /> Harvest Node Authenticated
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black font-serif italic tracking-tighter uppercase leading-none">
                                {data.productName} <br />
                                <span className="text-secondary italic">Digital Passport</span>
                            </h2>
                        </div>
                    </div>

                    {/* Passport Content */}
                    <div className="p-8 md:p-12 space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar">

                        {/* Farmer Bio Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-cream flex items-center justify-center border-4 border-secondary/20 shrink-0 overflow-hidden shadow-2xl">
                                <div className="text-primary font-black font-serif italic text-5xl">{data.farmerName[0]}</div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 leading-none">The Producer</p>
                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic tracking-tight">{data.farmerName}</h3>
                                </div>
                                <p className="text-sm text-primary/60 font-medium leading-relaxed italic">
                                    "{data.farmerBio}"
                                </p>
                            </div>
                        </div>

                        {/* Node Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: MapPin, label: "Origin", value: data.location },
                                { icon: Calendar, label: "Harvested", value: data.harvestDate },
                                { icon: ShieldCheck, label: "Purity", value: data.purityScore },
                                { icon: Sprout, label: "Soil Type", value: data.soilType },
                            ].map((stat, i) => (
                                <div key={i} className="bg-cream/30 p-5 rounded-3xl border border-primary/5 space-y-3 group hover:bg-primary transition-all duration-500">
                                    <stat.icon size={20} className="text-secondary group-hover:scale-125 transition-transform" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-primary/30 group-hover:text-white/40">{stat.label}</p>
                                        <p className="text-[11px] font-black text-primary uppercase italic group-hover:text-secondary">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Certification & Blockchain Proof */}
                        <div className="p-8 bg-primary rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-[3s]" />
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20">
                                        <Leaf size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black font-serif italic tracking-tight uppercase leading-none">Organic Protocol V5</h4>
                                        <p className="text-[9px] font-black tracking-widest text-white/40 uppercase">Verified Verification Hash: #KB-902-X</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black font-serif text-secondary italic leading-none">{data.certification}</p>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Status: Active</p>
                                </div>
                            </div>
                        </div>

                        {/* Interaction Node */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <button className="flex-1 bg-secondary text-primary py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                Send Thanks to Farmer <ThumbsUp size={16} />
                            </button>
                            <button className="flex-1 bg-cream text-primary py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                Order More from this Node <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
