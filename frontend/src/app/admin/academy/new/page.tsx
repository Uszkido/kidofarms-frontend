"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, ArrowRight, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import { ActionStatus } from "@/components/ActionStatus";

export default function NewAcademyModule() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const [formData, setFormData] = useState({
        title: "",
        category: "Soil",
        description: "",
        content: "",
        points: 10
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setActionState({
            isOpen: true,
            title: "Initializing Academy Node",
            message: "Broadcasting course data to the regional network...",
            status: "processing"
        });

        try {
            const token = (session?.user as any)?.accessToken;
            const res = await fetch(getApiUrl("/api/admin/academy/modules"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setActionState({
                    isOpen: true,
                    title: "Node Active",
                    message: "Course module has been successfully synchronized with the Mastery Academy.",
                    status: "success"
                });
                setTimeout(() => router.push("/admin"), 2000);
            } else {
                throw new Error("Failed to create module");
            }
        } catch (err) {
            setActionState({
                isOpen: true,
                title: "Neural Error",
                message: "Deployment protocol failed. Check network integrity.",
                status: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#040d0a]">
            <Header />
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />

            <main className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-[1000px] mx-auto space-y-16">
                    {/* Header */}
                    <header className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Academy Infrastructure</h2>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black font-serif italic text-white leading-none uppercase tracking-tighter">
                            Deploy New <br />
                            <span className="text-secondary italic">Mastery Module</span>
                        </h1>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            Authorized Administrator Clearance Required
                        </p>
                    </header>

                    {/* Form Component */}
                    <div className="bg-white/5 rounded-[4rem] p-10 lg:p-16 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Module Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Organic Soil Biology v4"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-sans"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Skill Category</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-sans appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {['Soil', 'Tech', 'Logistics', 'Finance', 'Energy', 'Compliance'].map(c => <option key={c} value={c} className="bg-primary text-white">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Orbital Description (Short)</label>
                                <textarea
                                    required
                                    placeholder="Brief summary of the learning objectives..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-sans"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Learning Assets & Resources (JSON/Markdown)</label>
                                <textarea
                                    required
                                    placeholder="Paste links, text, or structured content nodes..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-sans"
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-white/10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                                        <Zap size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Credential Value</p>
                                        <div className="flex gap-4 mt-1">
                                            {[10, 25, 50, 100].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, points: p })}
                                                    className={`px-4 py-1 rounded-full text-[10px] font-black border transition-all ${formData.points === p ? 'bg-secondary border-secondary text-primary' : 'bg-white/5 border-white/10 text-white/40 hover:border-secondary'}`}
                                                >
                                                    {p} XP
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto bg-white text-primary px-16 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-secondary transition-all shadow-2xl flex items-center justify-center gap-4 group"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
                                    Deploy Module <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Pre-Deployment Checklist */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Quality Sync', desc: 'All assets verified for regional accuracy.', icon: <CheckCircle2 size={24} /> },
                            { title: 'Public Reach', desc: 'Module visible to all verified Farmers.', icon: <CheckCircle2 size={24} /> },
                            { title: 'Audit Trail', desc: 'Deployment logged in direct activity ledger.', icon: <CheckCircle2 size={24} /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md space-y-4">
                                <div className="text-secondary">{item.icon}</div>
                                <h4 className="font-black font-serif italic text-white uppercase">{item.title}</h4>
                                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
