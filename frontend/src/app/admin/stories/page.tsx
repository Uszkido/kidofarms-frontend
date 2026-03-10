"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Plus,
    Trash2,
    Loader2,
    ArrowLeft,
    Image as ImageIcon,
    Type,
    ExternalLink,
    Search,
    Video,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

export default function AdminStoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        vendorId: "",
        mediaUrl: "",
        caption: "",
        mediaType: "image",
    });

    useEffect(() => {
        fetchStories();
        fetchVendors();
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

    const fetchVendors = async () => {
        try {
            const res = await fetch(getApiUrl("/api/users?role=vendor"));
            if (res.ok) {
                const data = await res.json();
                // Filter specifically for vendors if the API doesn't filter by query
                setVendors(data.filter((u: any) => u.role === 'vendor'));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateStory = async (e: React.FormEvent) => {
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
                setIsModalOpen(false);
                setFormData({ vendorId: "", mediaUrl: "", caption: "", mediaType: "image" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm("Remove this story from the network?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/stories/${id}`), { method: "DELETE" });
            if (res.ok) {
                setStories(stories.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredStories = stories.filter(s =>
        s.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3] p-6 lg:p-10">
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
                        <p className="text-white/40 font-medium text-sm mt-2">Manage live visual updates from the Kido Farm network.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0 hidden md:block">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-secondary/30 outline-none backdrop-blur-md"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-secondary/10"
                        >
                            <Plus size={18} /> New Broadcast
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredStories.map((story) => (
                            <div key={story.id} className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden group hover:border-secondary/30 transition-all shadow-2xl backdrop-blur-md">
                                <div className="relative aspect-[9/16] bg-neutral-900">
                                    <Image
                                        src={story.mediaUrl}
                                        alt="Story Content"
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-primary">
                                                    {story.vendor?.name?.charAt(0)}
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-white tracking-widest truncate max-w-[80px]">
                                                    {story.vendor?.name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteStory(story.id)}
                                                className="w-10 h-10 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all backdrop-blur-md border border-red-500/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-white font-serif text-lg italic leading-tight line-clamp-3">
                                                "{story.caption}"
                                            </p>
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                                                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                                <span className="text-secondary">{story.mediaType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredStories.length === 0 && (
                            <div className="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border border-white/5 backdrop-blur-md">
                                <Activity size={64} className="mx-auto text-white/10 mb-6" />
                                <h3 className="text-2xl font-black font-serif text-white uppercase italic">No Active Stories</h3>
                                <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mt-2">Broadcast some live harvests to the community.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Story Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#0E1116]/80 text-white">
                    <div className="bg-[#161B22] w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-white/5 animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 -translate-y-32 translate-x-32" />

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold font-serif tracking-tighter uppercase">New <span className="text-secondary italic">Broadcast</span></h1>
                                <p className="text-white/40 font-medium text-sm mt-2">Publish live updates to the Horizon Story Feed.</p>
                            </div>

                            <form onSubmit={handleCreateStory} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Source (Vendor)</label>
                                    <select
                                        required
                                        value={formData.vendorId}
                                        onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm appearance-none"
                                    >
                                        <option value="" className="bg-[#161B22]">Choose Vendor...</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id} className="bg-[#161B22]">{v.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Media URL</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://images.unsplash.com/..."
                                            value={formData.mediaUrl}
                                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm"
                                        />
                                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Media Type</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                                                className={`flex-1 py-4 rounded-2xl border flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.mediaType === 'image' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-white/5 bg-white/5 text-white/20'}`}
                                            >
                                                <ImageIcon size={14} /> Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                                                className={`flex-1 py-4 rounded-2xl border flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.mediaType === 'video' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-white/5 bg-white/5 text-white/20'}`}
                                            >
                                                <Video size={14} /> Video
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Caption</label>
                                        <input
                                            required
                                            placeholder="Harvesting now..."
                                            value={formData.caption}
                                            onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium text-white backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all text-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-secondary text-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Publish Horizon"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

