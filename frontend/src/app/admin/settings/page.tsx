"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Activity, Save, ArrowLeft, Loader2, Globe, Mail, Coins } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("config");
    const [config, setConfig] = useState<any>({
        siteName: "Kido Farms",
        contactEmail: "",
        currency: "NGN",
        taxRate: "0"
    });
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [settingsRes, logsRes] = await Promise.all([
                fetch(getApiUrl("/api/security/settings")),
                fetch(getApiUrl("/api/security/logs"))
            ]);

            const settingsData = await settingsRes.json();
            const logsData = await logsRes.json();

            if (settingsData && Object.keys(settingsData).length > 0) setConfig(settingsData);
            setLogs(logsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/security/settings"), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            if (res.ok) alert("Settings synchronized across nodes!");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">System <span className="text-primary/40 italic">Control</span></h1>
                            <p className="text-sm font-medium text-primary/40">Global configuration and activity oversight</p>
                        </div>
                    </div>
                </header>

                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-primary/5 w-fit">
                    <button
                        onClick={() => setActiveTab("config")}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'config' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                    >
                        Config
                    </button>
                    <button
                        onClick={() => setActiveTab("logs")}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                    >
                        Audit Logs
                    </button>
                </div>

                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl p-10">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-primary/20">
                            <Loader2 className="animate-spin" size={40} />
                            <p className="font-black text-[10px] uppercase tracking-widest">Intercepting System Stream...</p>
                        </div>
                    ) : activeTab === 'config' ? (
                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center gap-2">
                                        <Globe size={12} /> Site Name
                                    </label>
                                    <input
                                        value={config.siteName}
                                        onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center gap-2">
                                        <Mail size={12} /> Contact Email
                                    </label>
                                    <input
                                        value={config.contactEmail}
                                        onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center gap-2">
                                        <Coins size={12} /> Currency
                                    </label>
                                    <select
                                        value={config.currency}
                                        onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                    >
                                        <option value="NGN">Naira (₦)</option>
                                        <option value="USD">Dollar ($)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center gap-2">
                                        <Shield size={12} /> Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={config.taxRate}
                                        onChange={(e) => setConfig({ ...config, taxRate: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                    />
                                </div>
                            </div>
                            <button
                                disabled={saving}
                                type="submit"
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary transition-all"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Synchronize Updates
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {logs.map((log: any) => (
                                <div key={log.id} className="flex gap-6 pb-6 border-b border-primary/5 last:border-0">
                                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                        <Activity size={18} className="text-secondary" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs font-black uppercase tracking-tight text-primary">
                                                {log.userName} <span className="text-primary/30 font-medium">performed</span> {log.action}
                                            </p>
                                            <span className="text-[8px] font-black text-primary/10 uppercase tracking-widest">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-primary/40 font-medium mt-1">Entity: {log.entity}</p>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-center py-10 opacity-20">
                                    <Shield size={48} className="mx-auto mb-4" />
                                    <p className="font-black text-[10px] uppercase">No suspicious activity recorded.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
