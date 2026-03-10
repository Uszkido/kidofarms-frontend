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
    Camera
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function VendorStoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mocking merchant ID for now - in production this would come from session
    const merchantId = "vendor_id_here";

    const [formData, setFormData] = useState({
        vendorId: "", // Will set this on submit or from session
        mediaUrl: "",
        caption: "",
        mediaType: "image",
    });

    useEffect(() => {
        // In a real app, we'd fetch the current user first
        const fetchCurrentUser = async () => {
            // Mocking current vendor
            setFormData(prev => ({ ...prev, vendorId: "v1" })); // Example vendor ID
        };
        fetchCurrentUser();
        fetchMyStories();
    }, []);

    const fetchMyStories = async () => {
        try {
            const res = await fetch(getApiUrl("/api/stories"));
            if (res.ok) {
                const allStories = await res.json();
                // Filter for current vendor - in a real app the API would do this
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
                setIsModalOpen(false);
                setFormData({ ...formData, mediaUrl: "", caption: "" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <Link href="/dashboard/vendor" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-all">
                                    <ArrowLeft size={14} /> Back to Hub
                                </Link>
                                <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter">
                                    Horizon <span className="text-secondary italic">Feed</span>
                                </h1>
                                <p className="text-primary/40 font-medium text-sm mt-2">Publish live updates of your farm's harvest to all customers.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary text-white px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 shadow-2xl shadow-primary/20"
                            >
                                <Camera size={20} /> Create Story
                            </button>
                        </div>

                        {/* Stories Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-40">
                                <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {/* Create New Card */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="aspect-[9/16] rounded-[3rem] border-4 border-dashed border-primary/5 hover:border-secondary/40 hover:bg-white transition-all flex flex-col items-center justify-center gap-4 group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-primary/20">New Story</span>
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
                                                <span className="bg-secondary text-primary px-2 py-0.5 rounded">{story.mediaType}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-md">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 -translate-y-32 translate-x-32" />

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold font-serif tracking-tighter uppercase">Post <span className="text-secondary italic">Update</span></h1>
                                <p className="text-primary/40 font-medium text-sm mt-2">What's happening on the farm right now?</p>
                            </div>

                            <form onSubmit={handlePublish} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Media URL</label>
                                    <div className="relative">
                                        <input
                                            type="url" required placeholder="https://..."
                                            value={formData.mediaUrl}
                                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Caption</label>
                                    <textarea
                                        required maxLength={100} rows={3} placeholder="Tell your customers about this harvest..."
                                        value={formData.caption}
                                        onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                                        className={`py-4 rounded-2xl border flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.mediaType === 'image' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-primary/5 bg-neutral-50 text-primary/40'}`}
                                    >
                                        <ImageIcon size={14} /> Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                                        className={`py-4 rounded-2xl border flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.mediaType === 'video' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-primary/5 bg-neutral-50 text-primary/40'}`}
                                    >
                                        <Video size={14} /> Video
                                    </button>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:bg-neutral-50 transition-all"
                                    >
                                        Later
                                    </button>
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Publish Now"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
