"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Sparkles, X, Check, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export default function VoiceHarvestWizard({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-NG"; // Nigerian English flair support

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            if (transcript) handleParse();
        } else {
            setTranscript("");
            setParsedData(null);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleParse = async () => {
        setIsParsing(true);
        try {
            const res = await fetch(getApiUrl("/api/ai/parse-harvest-voice"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript })
            });
            const data = await res.json();
            setParsedData(data);
        } catch (error) {
            console.error("Parsing failed", error);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/products"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: parsedData.name,
                    description: parsedData.description,
                    price: parsedData.price,
                    category: parsedData.category || "Vegetables",
                    stock: parsedData.quantity,
                    unit: parsedData.unit,
                    farmSource: parsedData.farmSource,
                    images: ["https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800"] // Default
                })
            });
            if (res.ok) {
                onComplete();
                onClose();
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/95 backdrop-blur-3xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="bg-white w-full max-w-2xl rounded-[4rem] border border-primary/5 p-12 relative z-10 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none">
                            <Mic size={160} />
                        </div>

                        <div className="relative space-y-10">
                            <header className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="text-secondary" size={18} />
                                        <h3 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">Voice <span className="text-secondary">Listing</span></h3>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Alpha Protocol: Speech-to-Market Synthesis</p>
                                </div>
                                <button onClick={onClose} className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-2xl transition-all">
                                    <X size={20} className="text-primary/40" />
                                </button>
                            </header>

                            {/* RECORDER SECTION */}
                            {!parsedData ? (
                                <div className="flex flex-col items-center py-10 space-y-10">
                                    <button
                                        onClick={toggleListening}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all relative group shadow-2xl ${isListening ? 'bg-secondary text-primary scale-110' : 'bg-primary text-white hover:bg-secondary hover:text-primary'
                                            }`}
                                    >
                                        {isListening && (
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-secondary rounded-full"
                                            />
                                        )}
                                        {isListening ? <Mic size={48} /> : <MicOff size={48} />}
                                    </button>

                                    <div className="w-full bg-neutral-50 rounded-3xl p-8 border border-primary/5 min-h-[120px] relative overflow-hidden">
                                        <p className="text-xl font-bold font-serif italic text-primary/40 leading-relaxed text-center">
                                            {isListening ? (transcript || "Speak now... 'I just harvested 20 baskets of tomatoes...'") : (transcript || "Tap the mic to report your harvest.")}
                                        </p>
                                    </div>

                                    {isParsing && (
                                        <div className="flex items-center gap-3 text-secondary animate-pulse">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">AI Nodes Parsing Transcript...</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-secondary/10 p-10 rounded-[3rem] border border-secondary/20 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Verified AI Extraction</h4>
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-primary/30">Product Name</p>
                                                <p className="text-2xl font-black font-serif italic text-primary underline decoration-secondary/30 decoration-4 underline-offset-4">{parsedData.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-primary/30">Inventory Node</p>
                                                <p className="text-2xl font-black font-serif italic text-primary">{parsedData.quantity} {parsedData.unit}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-primary/30">Fair-Trade Base</p>
                                                <p className="text-2xl font-black font-serif italic text-secondary">₦{parsedData.price}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-primary/30">Source Node</p>
                                                <p className="text-2xl font-black font-serif italic text-primary tracking-tighter">{parsedData.farmSource}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-secondary/10">
                                            <p className="text-[8px] font-black uppercase text-primary/30 mb-2">Internal Meta Summary</p>
                                            <p className="text-xs font-medium text-primary/60 italic leading-relaxed">{parsedData.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex-grow bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3"
                                        >
                                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            {isSaving ? "Syncing Batch..." : "Commit To Marketplace"}
                                        </button>
                                        <button
                                            onClick={() => setParsedData(null)}
                                            className="px-8 bg-neutral-100 text-primary/40 hover:text-primary rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
