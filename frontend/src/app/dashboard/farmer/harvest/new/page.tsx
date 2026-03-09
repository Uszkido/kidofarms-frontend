"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Sprout,
    ArrowLeft,
    Loader2,
    Calendar,
    MapPin,
    TrendingUp,
    Globe,
    Save,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function NewHarvestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        cropName: "",
        farmName: "",
        region: "Kano",
        status: "planted",
        progress: 0,
        estimatedReadyDate: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/harvests"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    progress: Number(form.progress),
                    estimatedReadyDate: form.estimatedReadyDate ? new Date(form.estimatedReadyDate) : null
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/farmer"), 2000);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to register harvest");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl space-y-8">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black font-serif text-primary uppercase">Harvest <span className="text-secondary italic">Logged!</span></h1>
                    <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">Your growth node has been published to the track harvest ledger.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] pb-24 px-6 md:px-10">
            <div className="max-w-4xl mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-12">
                    <div className="space-y-4">
                        <Link href="/dashboard/farmer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 hover:text-primary transition-all mb-4">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                            <TrendingUp size={14} /> Growth Node Initialization
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black font-serif text-primary leading-none">Register <br /><span className="text-secondary italic">Live Harvest</span></h1>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[100px] opacity-10" />

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Crop Variety</label>
                                        <div className="relative">
                                            <Sprout className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                            <input
                                                type="text" required placeholder="e.g. Yellow Hybrid Maize"
                                                className="w-full bg-cream/10 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none"
                                                value={form.cropName} onChange={e => setForm({ ...form, cropName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Farm Entity</label>
                                        <div className="relative">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                            <input
                                                type="text" required placeholder="e.g. Kano Valley Organics"
                                                className="w-full bg-cream/10 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none"
                                                value={form.farmName} onChange={e => setForm({ ...form, farmName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Harvest Region</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                            <select
                                                className="w-full bg-cream/10 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none appearance-none"
                                                value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}
                                            >
                                                <option value="Kano">Kano State</option>
                                                <option value="Jos">Jos (Plateau)</option>
                                                <option value="Benue">Benue State</option>
                                                <option value="Kaduna">Kaduna State</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Current Cycle Status</label>
                                        <select
                                            className="w-full bg-cream/10 border-2 border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none appearance-none"
                                            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="planted">Just Planted</option>
                                            <option value="growing">Growing / Maturing</option>
                                            <option value="harvesting">Harvesting Stage</option>
                                            <option value="ready">Ready for Dispatch</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Growth Progress ({form.progress}%)</label>
                                        <span className="text-lg font-black font-serif text-secondary">{form.progress}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        className="w-full h-2 bg-cream rounded-full appearance-none cursor-pointer accent-secondary"
                                        value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-2">Estimated Yield Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                        <input
                                            type="date"
                                            className="w-full bg-cream/10 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none"
                                            value={form.estimatedReadyDate} onChange={e => setForm({ ...form, estimatedReadyDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row items-center gap-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {loading ? "Initializing..." : "Publish Growth Node"}
                                </button>
                                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic">{error}</p>}
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-primary text-white p-10 rounded-[3.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
                            <ShieldCheck className="text-secondary" size={32} />
                            <h4 className="text-2xl font-black font-serif italic">Ledger Verification</h4>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                Once published, this node becomes visible on the Track Harvest page. Real-time updates build trust with elite subscribers and marketplace vendors.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Protocol Guidelines</h4>
                            <div className="space-y-4">
                                {[
                                    "Accuracy in yield estimations",
                                    "Regular progress updates",
                                    "Region-specific verification"
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-3 items-center text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
