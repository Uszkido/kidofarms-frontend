"use client";

import { useState, useRef } from "react";
import { X, Camera, Scan, Brain, Sparkles, Loader2, AlertTriangle, CheckCircle2, FlaskConical, ThermometerSun, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgronomyVisionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AgronomyVisionModal({ isOpen, onClose }: AgronomyVisionModalProps) {
    const [step, setStep] = useState<"upload" | "scanning" | "analysis">("upload");
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setStep("scanning");
                simulateScanning();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateScanning = () => {
        setTimeout(() => setStep("analysis"), 4000);
    };

    const reset = () => {
        setStep("upload");
        setImage(null);
    };

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
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-4xl bg-white rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-2xl border-x-4 border-secondary/10"
                >
                    <div className="flex flex-col md:flex-row h-full min-h-[500px]">

                        {/* Vision Portal */}
                        <div className="w-full md:w-1/2 bg-neutral-900 relative overflow-hidden flex items-center justify-center p-8">
                            <AnimatePresence mode="wait">
                                {step === "upload" && (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center space-y-8"
                                    >
                                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-dashed border-white/20 flex items-center justify-center text-white/20 mx-auto hover:border-secondary hover:text-secondary transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                            <Camera size={48} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-white font-black font-serif italic text-2xl uppercase tracking-tighter">Initialize Vision Node</h3>
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] max-w-[200px] mx-auto">Upload crop leaf or soil sample for neural analysis</p>
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                                    </motion.div>
                                )}

                                {step === "scanning" && (
                                    <motion.div
                                        key="scanning"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full p-4 relative"
                                    >
                                        <img src={image!} alt="Scanning" className="w-full h-full object-cover rounded-3xl opacity-40 blur-sm" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
                                            <div className="relative">
                                                <Brain size={80} className="text-secondary animate-pulse" />
                                                <motion.div
                                                    animate={{ y: [0, 200, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="absolute -inset-4 border-t-2 border-secondary/50 shadow-[0_-10px_20px_rgba(255,184,74,0.3)] z-10"
                                                />
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <p className="text-secondary font-black font-serif italic text-xl uppercase tracking-widest">Neural Scan Active</p>
                                                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">Decoding Biological Signatures...</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "analysis" && (
                                    <motion.div
                                        key="analysis"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full relative"
                                    >
                                        <img src={image!} alt="Analyzed" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                                            <CheckCircle2 size={12} /> Scan Complete
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                                            <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-2 font-sans">Identified Subject</p>
                                            <h4 className="text-white text-3xl font-black font-serif italic uppercase tracking-tighter">Yellow Maize <span className="text-secondary">#Node4-A</span></h4>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Analysis Report */}
                        <div className="w-full md:w-1/2 p-10 md:p-16 space-y-10 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter leading-none">Kido <span className="text-secondary">Vision AI</span></h2>
                                    <p className="text-[10px] text-primary/30 font-black uppercase tracking-widest">Mastery Agronomy Intelligence</p>
                                </div>
                                <button onClick={onClose} className="w-12 h-12 bg-cream text-primary rounded-full flex items-center justify-center hover:bg-secondary transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {step === "upload" || step === "scanning" ? (
                                    <motion.div
                                        key="waiting"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-8 bg-cream/50 rounded-[2.5rem] border border-primary/5 space-y-4">
                                            <div className="flex gap-4 items-center mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                                    <Brain size={20} />
                                                </div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-primary">System Ready</h4>
                                            </div>
                                            <p className="text-xs text-primary/50 font-medium leading-relaxed italic">
                                                "Standing by for biological visual input. My neural engine is primed to detect 400+ crop pathologies and nutrient deficiencies across Nigeria's ecological zones."
                                            </p>
                                        </div>
                                        <ul className="space-y-4">
                                            {[
                                                { icon: FlaskConical, text: "Pathology Detection (Pests/Fungi)" },
                                                { icon: Droplets, text: "Nutrient Deficiency Mapping" },
                                                { icon: ThermometerSun, text: "Heat-Stress Index Analysis" }
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-primary/30">
                                                    <feature.icon size={14} className="text-secondary" /> {feature.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="report"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-green-800/40">Health Index</p>
                                                <p className="text-3xl font-black font-serif italic text-green-600">94.2%</p>
                                            </div>
                                            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-blue-800/40">Chlorophyll</p>
                                                <p className="text-3xl font-black font-serif italic text-blue-600">High</p>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 space-y-4">
                                            <div className="flex gap-4 items-center mb-2">
                                                <AlertTriangle size={20} className="text-orange-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-950/60 leading-none">Detection Alert: Nitrogen Node Low</h4>
                                            </div>
                                            <p className="text-xs text-orange-950/40 font-medium leading-relaxed italic">
                                                Minor yellowing at leaf margins detected (Nitrogen deficiency). Recommendation: Apply Urea-Mesh Grade 4 within 48 hours for recovery.
                                            </p>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button onClick={reset} className="flex-1 py-5 rounded-[2rem] bg-cream text-primary font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-all font-sans">
                                                Restart Scan
                                            </button>
                                            <button className="flex-1 py-5 rounded-[2rem] bg-secondary text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl font-sans">
                                                Order Fertilome
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
