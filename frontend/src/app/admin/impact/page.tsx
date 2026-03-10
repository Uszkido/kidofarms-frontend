"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, Activity, MapPin, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminImpactPage() {
    const [metrics, setMetrics] = useState({
        acresCultivated: 0,
        farmersSupported: 0,
        productionCapacity: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(getApiUrl("/api/impact"))
            .then(res => res.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch(getApiUrl("/api/impact"), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(metrics)
            });

            if (res.ok) {
                setMessage("Metrics updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to update metrics.");
            }
        } catch (err) {
            setMessage("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-secondary" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 px-6 py-24">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12">
                    <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all mb-4">
                        <ArrowLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-primary">Edit <span className="text-secondary italic">Impact</span></h1>
                    <p className="text-primary/40 font-medium text-sm mt-2">Update the metrics displayed on the public landing page.</p>
                </div>

                <form onSubmit={handleSave} className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl space-y-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                <MapPin size={14} className="text-secondary" /> Acres Cultivated
                            </label>
                            <input
                                type="number"
                                value={metrics.acresCultivated}
                                onChange={e => setMetrics({ ...metrics, acresCultivated: parseInt(e.target.value) })}
                                className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-8 py-5 text-2xl font-black font-serif outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                <Users size={14} className="text-secondary" /> Farmers Supported
                            </label>
                            <input
                                type="number"
                                value={metrics.farmersSupported}
                                onChange={e => setMetrics({ ...metrics, farmersSupported: parseInt(e.target.value) })}
                                className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-8 py-5 text-2xl font-black font-serif outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                <BarChart3 size={14} className="text-secondary" /> Production Capacity
                            </label>
                            <input
                                type="text"
                                value={metrics.productionCapacity}
                                placeholder="e.g. 5,000 Tons"
                                onChange={e => setMetrics({ ...metrics, productionCapacity: e.target.value })}
                                className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-8 py-5 text-2xl font-black font-serif outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                        <div className="flex items-center gap-3">
                            {message && (
                                <div className={`flex items-center gap-2 text-sm font-bold ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                                    {message.includes('successfully') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {message}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
