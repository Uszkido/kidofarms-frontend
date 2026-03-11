"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    ArrowLeft,
    Loader2,
    Save,
    RotateCcw,
    Globe,
    Zap,
    Flag,
    Rocket
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminAboutCMS() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [content, setContent] = useState<any>({
        founded: "2020",
        title: "Born From Passion & Purpose",
        description: "Kido Farms & Orchard was founded in 2020 with a bold vision — connecting Nigeria's most talented farmers directly with consumers through technology.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop",
        missionTitle: "Our Mission & Vision",
        missionSubtitle: "Rooted in history, growing for the future. We believe in food that heals the body and respects the land.",
        pillars: [
            { title: "Farmer Empowerment", desc: "Equipping Nigerian farmers with technology, market access, and fair pricing to grow their businesses." },
            { title: "Tech Innovation", desc: "Leveraging modern greenhouse technology, hydroponics, and smart logistics to deliver freshness at scale." },
            { title: "Community Access", desc: "Making premium, organic farm produce affordable and accessible to every household across Nigeria." }
        ]
    });

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        try {
            const res = await fetch(getApiUrl("/api/landing"));
            const data = await res.json();
            if (data.about) {
                setContent(data.about);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/landing/about"), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                alert("About Page logic updated across the network.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const updatePillar = (index: number, field: string, value: string) => {
        const newPillars = [...content.pillars];
        newPillars[index] = { ...newPillars[index], [field]: value };
        setContent({ ...content, pillars: newPillars });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-6 lg:p-12 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* 🛡️ HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Bridge
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-1 bg-secondary rounded-full" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary/60">Registry.Origins</h2>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-serif italic uppercase tracking-tighter leading-[0.85]">
                            About <span className="text-secondary block">Page Node</span>
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-secondary text-primary px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Sync Origins
                    </button>
                </header>

                <div className="grid md:grid-cols-12 gap-12">
                    {/* 🧬 PRIMARY DATA */}
                    <div className="md:col-span-12 bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10">
                        <div className="flex items-center gap-4 text-secondary">
                            <Zap size={20} />
                            <h3 className="text-lg font-black uppercase tracking-widest">Foundational Values</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Established Year</label>
                                <input
                                    value={content.founded}
                                    onChange={(e) => setContent({ ...content, founded: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Legacy Title</label>
                                <input
                                    value={content.title}
                                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Narrative Core</label>
                            <textarea
                                value={content.description}
                                onChange={(e) => setContent({ ...content, description: e.target.value })}
                                rows={4}
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-5 outline-none focus:border-secondary transition-all font-bold resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Heritage Visual (HERO IMAGE)</label>
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-48 h-48 rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative">
                                    <img
                                        src={content.image?.startsWith('http') ? content.image : getApiUrl(content.image)}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-secondary" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <input
                                        type="file"
                                        id="aboutImage"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setIsUploading(true);
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await fetch(getApiUrl('/api/upload'), {
                                                    method: 'POST',
                                                    body: formData
                                                });
                                                if (res.ok) {
                                                    const { url } = await res.json();
                                                    setContent({ ...content, image: url });
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="aboutImage"
                                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-white hover:text-primary transition-all cursor-pointer"
                                    >
                                        <Zap size={14} className="text-secondary" /> {isUploading ? "Uploading Data..." : "Change Heritage Visual"}
                                    </label>
                                    <p className="text-[9px] font-bold text-white/20 italic uppercase tracking-widest">Recommended: Landscape orientation (1920x1080)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🎯 MISSION & VISION */}
                    <div className="md:col-span-12 bg-white/5 border border-white/10 rounded-[3.5rem] p-10 space-y-10">
                        <div className="flex items-center gap-4 text-secondary">
                            <Flag size={20} />
                            <h3 className="text-lg font-black uppercase tracking-widest">Mission Directives</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Objective Title</label>
                            <input
                                value={content.missionTitle}
                                onChange={(e) => setContent({ ...content, missionTitle: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Objective Brief</label>
                            <textarea
                                value={content.missionSubtitle}
                                onChange={(e) => setContent({ ...content, missionSubtitle: e.target.value })}
                                rows={2}
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-5 outline-none focus:border-secondary transition-all font-bold resize-none"
                            />
                        </div>
                    </div>

                    {/* 🏛️ PILLARS */}
                    <div className="md:col-span-12 space-y-8">
                        <div className="flex items-center gap-4 border-l-4 border-secondary pl-6">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Strategic <span className="text-secondary italic">Pillars</span></h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {content.pillars.map((pillar: any, i: number) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6 group hover:border-secondary transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                        <Rocket size={20} />
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            value={pillar.title}
                                            onChange={(e) => updatePillar(i, 'title', e.target.value)}
                                            placeholder="Pillar Title"
                                            className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-secondary transition-all font-black uppercase text-[12px] tracking-widest"
                                        />
                                        <textarea
                                            value={pillar.desc}
                                            onChange={(e) => updatePillar(i, 'desc', e.target.value)}
                                            placeholder="Pillar Description"
                                            rows={3}
                                            className="w-full bg-transparent py-2 outline-none focus:text-white transition-all text-[11px] font-medium text-white/40 leading-relaxed resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-6 opacity-30">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">Proprietary Kido Genesis Node</p>
                    <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                        <div className="w-2 h-2 rounded-full bg-secondary animate-ping delay-75" />
                        <div className="w-2 h-2 rounded-full bg-secondary animate-ping delay-150" />
                    </div>
                </div>
            </div>
        </div>
    );
}
