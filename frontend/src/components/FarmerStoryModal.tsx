"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, User, MapPin, Award, Sprout, Heart, Terminal } from "lucide-react";
import Image from "next/image";

interface FarmerStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    farmerName: string;
    bio: string;
    location: string;
    years: number;
    specialty: string;
    experience: string;
}

export default function FarmerStoryModal({
    isOpen,
    onClose,
    farmerName = "Kido Producer Hub",
    bio = "Committed to the regeneration of local soil ecosystems using bio-dynamic techniques passed down through generations, now enhanced by Kido V5 telemetry.",
    location = "Jos, Plateau State",
    years = 12,
    specialty = "Organic Tubers & Grains",
    experience = "Master Agronomist - Certified Sustainable Tech V1"
}: FarmerStoryModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* LEFT: VISUAL (FARMER PROFILE) */}
                        <div className="md:w-2/5 relative h-64 md:h-auto bg-neutral-100">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10" />
                            <div className="absolute bottom-10 left-10 z-20 space-y-2">
                                <div className="bg-secondary text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                                    Verified Producer
                                </div>
                                <h3 className="text-3xl font-black font-serif italic text-white leading-none uppercase tracking-tighter">
                                    {farmerName}
                                </h3>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                                <User size={200} strokeWidth={0.5} />
                            </div>
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="flex-1 p-10 md:p-16 space-y-10 overflow-y-auto max-h-[80vh]">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Biotic Signature</h4>
                                    <p className="text-xl font-black font-serif italic text-primary uppercase">Mission Protocol</p>
                                </div>
                                <button onClick={onClose} className="p-3 bg-neutral-50 rounded-full hover:bg-secondary hover:text-primary transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-lg text-primary/70 leading-relaxed font-medium">
                                "{bio}"
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-secondary">
                                        <MapPin size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Location</span>
                                    </div>
                                    <p className="font-bold text-primary">{location}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-secondary">
                                        <Sprout size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Soil Tenure</span>
                                    </div>
                                    <p className="font-bold text-primary">{years} Years Active</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-secondary">
                                        <Award size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Specialty</span>
                                    </div>
                                    <p className="font-bold text-primary">{specialty}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-secondary">
                                        <ShieldCheck size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Network Rank</span>
                                    </div>
                                    <p className="font-bold text-primary">Master Tier Node</p>
                                </div>
                            </div>

                            <div className="p-8 bg-neutral-50 rounded-[2rem] border border-primary/5 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Terminal size={20} className="text-secondary" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Credentials Registry</h5>
                                </div>
                                <ul className="space-y-3">
                                    {["Certified Organic (Kido Protocol)", "Rainwater Harvesting Optimized", "Regenerative Tillage Cycle Level 3", "Zero Carbon Logistics Verified"].map((line, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-primary/50 uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-4">
                                <Heart size={20} />
                                Support This Node
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
