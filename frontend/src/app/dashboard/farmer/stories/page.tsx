"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Plus,
    Trash2,
    Loader2,
    ArrowLeft,
    Image as ImageIcon,
    Video,
    Search,
    ChevronRight,
    Camera,
    Sparkles,
    Zap,
    Circle,
    CheckCircle2,
    X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FarmerStoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: "farmer_v1", // Using farmer as a vendor for stories feed
        mediaUrl: "",
        caption: "",
        mediaType: "image",
    });

    useEffect(() => {
        fetchMyStories();
    }, []);

    const fetchMyStories = async () => {
        try {
            const res = await fetch(getApiUrl("/api/stories"));
            if (res.ok) {
                const allStories = await res.json();
                setStories(allStories);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/stories"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newStory = await res.json();
                setStories([newStory, ...stories]);
                setSuccess(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccess(false);
                    setPreview(null);
                    setFormData({ ...formData, mediaUrl: "", caption: "" });
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <Link href="/dashboard/farmer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-all">
                                    <ArrowLeft size={14} /> Farmer Command
                                </Link>
                                <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter">
                                    Farm <span className="text-secondary italic">Horizon</span>
                                </h1>
                                <p className="text-primary/40 font-medium text-sm mt-2">Broadcast your farm's productivity live to the storefront.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary text-white px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 shadow-2xl shadow-primary/20"
                            >
                                <Camera size={20} /> Create Story
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-40">
                                <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="aspect-[9/16] rounded-[3rem] border-4 border-dashed border-primary/5 hover:border-secondary/40 hover:bg-white transition-all flex flex-col items-center justify-center gap-4 group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-primary/20">Add Harvest Update</span>
                                </button>

                                {stories.map((story) => (
                                    <div key={story.id} className="aspect-[9/16] rounded-[3rem] border border-primary/5 bg-white overflow-hidden shadow-xl group relative">
                                        <Image
                                            src={story.mediaUrl}
                                            alt="Story"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-8 flex flex-col justify-end">
                                            <p className="text-white font-serif italic text-lg line-clamp-2 mb-4">"{story.caption}"</p>
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                                                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                                <span className="bg-secondary text-primary px-2 py-0.5 rounded uppercase tracking-widest text-[8px] font-black">{story.mediaType}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] bg-black text-white p-6 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex justify-between items-center">
                            <button onClick={() => { setIsModalOpen(false); setPreview(null); setSuccess(false); }} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                                <X size={24} />
                            </button>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Broadcasting Live</h2>
                            <div className="w-10 h-10" />
                        </div>

                        <div className="aspect-[9/16] bg-neutral-900 rounded-[3rem] border-4 border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                            {!preview ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary animate-pulse">
                                        <Camera size={32} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Camera Node Initializing...</p>

                                    <button
                                        onClick={() => {
                                            const demoUrl = "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80";
                                            setPreview(demoUrl);
                                            setFormData({ ...formData, mediaUrl: demoUrl, caption: "Live Harvest Update from Kido Farms!" });
                                        }}
                                        className="mt-8 text-secondary font-black text-xs uppercase tracking-widest bg-white/5 py-3 px-6 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Activate Feed
                                    </button>
                                </div>
                            ) : (
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                            )}

                            {/* Camera Interface Overlay */}
                            <div className="absolute inset-x-0 bottom-12 px-8 flex flex-col items-center gap-6">
                                {isSubmitting ? (
                                    <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-4 text-center">
                                        <Loader2 className="animate-spin text-secondary" size={32} />
                                        <p className="text-xs font-black uppercase tracking-widest">Broadcasting Harvest to Network...</p>
                                    </div>
                                ) : success ? (
                                    <div className="bg-secondary p-8 rounded-[2rem] flex flex-col items-center gap-4 text-center w-full shadow-2xl">
                                        <CheckCircle2 className="text-primary animate-bounce pt-2" size={36} />
                                        <p className="text-sm font-black uppercase tracking-widest text-primary pb-2">Transmission Successful</p>
                                    </div>
                                ) : (
                                    <>
                                        {preview && (
                                            <div className="w-full bg-black/60 backdrop-blur-md p-4 rounded-2xl mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a live caption..."
                                                    value={formData.caption}
                                                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                                    className="w-full bg-transparent text-white font-serif italic text-lg outline-none placeholder:text-white/40 text-center"
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-6">
                                            <button className="p-5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all">
                                                <Sparkles size={24} className="text-secondary" />
                                            </button>
                                            <button
                                                className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center p-1 cursor-default opacity-50"
                                            >
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                                    <Circle size={16} className="text-red-500 fill-red-500" />
                                                </div>
                                            </button>
                                            <button className="p-5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all">
                                                <Zap size={24} className="text-secondary" />
                                            </button>
                                        </div>
                                        {preview && (
                                            <button
                                                onClick={handlePublish}
                                                className="w-full bg-secondary text-primary py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-white transition-all animate-in slide-in-from-bottom-4 flex items-center justify-center gap-2"
                                            >
                                                <Zap size={16} /> Broadcast Story
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Tags Overlay */}
                            <div className="absolute top-12 left-8 space-y-2">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <Circle size={8} className="text-red-500 fill-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sector Live</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Mobile Feed Link Active</p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
