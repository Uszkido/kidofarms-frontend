"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Loader2,
    ArrowLeft,
    X,
    ImagePlus,
    Search,
    Clock,
    User,
    Play
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminStoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        vendorId: "602d1f40-4f51-4d3e-9c7a-369b768e7ec9", // Fallback system vendor
        mediaUrl: "",
        mediaType: "image",
        caption: ""
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch(getApiUrl("/api/stories"));
            if (res.ok) setStories(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl("/api/stories"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ ...formData, mediaUrl: "", caption: "" });
                fetchStories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm("Remove this story?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/stories/${id}`), { method: "DELETE" });
            if (res.ok) fetchStories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, mediaUrl: reader.result as string, mediaType: "image" });
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredStories = stories.filter(s =>
        s.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#06120e] text-[#E6EDF3] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-secondary mb-4 transition-all">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">
                            Horizon <span className="text-secondary italic">Stories</span>
                        </h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Manage the visual heartbeat of the network.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-secondary/30 outline-none backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Create Story Form */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 rounded-[4rem] p-10 border border-white/5 backdrop-blur-md shadow-2xl">
                            <h2 className="text-3xl font-black font-serif uppercase italic mb-8">Post <span className="text-secondary">Update</span></h2>
                            <form onSubmit={handleCreateStory} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Media Source</label>
                                    <div className="space-y-4">
                                        {formData.mediaUrl && (
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                                                <img src={formData.mediaUrl} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, mediaUrl: "" })}
                                                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-red-500 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <label className="flex-grow cursor-pointer bg-white/5 border border-white/10 hover:border-secondary/30 rounded-2xl p-4 transition-all flex items-center justify-center gap-2 group">
                                                <ImagePlus className="text-white/20 group-hover:text-secondary" />
                                                <span className="text-xs font-bold text-white/40 group-hover:text-white">Upload Picture</span>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        </div>
                                        <input
                                            placeholder="Or paste media URL..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white"
                                            value={formData.mediaUrl}
                                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Caption</label>
                                    <textarea
                                        rows={3}
                                        placeholder="What's happening at the node?"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white"
                                        value={formData.caption}
                                        onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!formData.mediaUrl}
                                    className="w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10 disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    <Play size={18} fill="currentColor" /> Broadcast Story
                                </button>
                            </form>
                        </div>

                        <div className="bg-primary rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-4">
                            <h3 className="text-xl font-bold font-serif text-white">Story <span className="text-secondary italic">Protocol</span></h3>
                            <p className="text-white/40 text-[10px] leading-relaxed font-medium uppercase tracking-widest">Stories disappear after 24 hours. Use them for real-time harvest updates, farm walkthroughs, and organic verification videos.</p>
                        </div>
                    </div>

                    {/* Stories Feed */}
                    <div className="lg:col-span-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-40">
                                <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredStories.map((story) => (
                                    <div key={story.id} className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-md hover:border-secondary/30 transition-all group">
                                        <div className="relative aspect-[4/5]">
                                            <img src={story.mediaUrl} alt="Story" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                                                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-xs">
                                                        {story.vendor?.name?.charAt(0) || 'K'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{story.vendor?.name || 'System'}</p>
                                                        <p className="text-[8px] font-bold text-white/40 uppercase mt-1 flex items-center gap-1">
                                                            <Clock size={8} /> {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteStory(story.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all backdrop-blur-lg border border-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="absolute bottom-8 left-8 right-8">
                                                <p className="text-white font-bold leading-relaxed">{story.caption}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredStories.length === 0 && (
                                    <div className="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed">
                                        <ImagePlus size={64} className="mx-auto text-white/10 mb-6" />
                                        <h3 className="text-2xl font-black font-serif text-white uppercase italic">Silence in the Hub</h3>
                                        <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mt-2">Broadcast the first harvest update of the day.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
