"use client";

import { useState } from "react";
import {
    LifeBuoy,
    X,
    Send,
    Loader2,
    ShieldAlert,
    CheckCircle2,
    MessageSquare,
    AlertCircle
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function ReportIssueModal() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        priority: "medium"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = (session?.user as any)?.id;
        if (!userId) return alert("System Auth required for Reporting.");

        setIsSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/tickets"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    ...formData
                })
            });
            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setIsSuccess(false);
                    setFormData({ subject: "", message: "", priority: "medium" });
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 z-[150] bg-secondary text-primary p-6 rounded-full shadow-[0_20px_50px_rgba(197,160,89,0.3)] hover:scale-110 active:scale-90 transition-all group"
                title="Support Hub"
            >
                <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-10">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => !isSubmitting && setIsOpen(false)} />

                    <div className="bg-[#0b1612] w-full max-w-xl rounded-[3.5rem] border-2 border-secondary/20 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        {isSuccess ? (
                            <div className="p-16 flex flex-col items-center text-center space-y-8">
                                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                    <CheckCircle2 size={48} className="animate-in zoom-in duration-1000" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tight">Report Logged</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest max-w-xs leading-relaxed">
                                        Your protocol intercept has been logged in the Sovereign Registry. An Admin agent will respond via your Hub shortly.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 lg:p-14 space-y-12">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="text-secondary" size={16} />
                                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Sovereign Support</h2>
                                        </div>
                                        <h3 className="text-4xl font-black font-serif italic text-white uppercase tracking-tighter">Report <span className="text-secondary italic">Anomaly</span></h3>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">Incident Subject</label>
                                        <input
                                            required
                                            placeholder="Brief description of the issue..."
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-bold text-white/80"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">Incident Intensity (Priority)</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['low', 'medium', 'high'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p })}
                                                    className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-secondary text-primary border-secondary shadow-lg' : 'bg-white/5 border-white/5 text-white/20'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">Full Transmission Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Provide technical details about the issue..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-medium text-white/80 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-secondary text-primary py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <> <Send size={18} /> Transmit Report </>}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
