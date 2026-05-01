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
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const [formData, setFormData] = useState({
        vendorId: "farmer_v1", // Using farmer as a vendor for stories feed
        mediaUrl: "",
        caption: "",
        mediaType: "image",
    });

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });
            setStream(mediaStream);
            const video = document.getElementById('viewfinder') as HTMLVideoElement;
            if (video) video.srcObject = mediaStream;
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Sovereign Camera Access Required. Check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleBroadcast = async () => {
        setIsCountingDown(true);
        let count = 3;
        const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(interval);
                captureAndUpload();
            }
        }, 1000);
    };

    const captureAndUpload = async () => {
        const video = document.getElementById('viewfinder') as HTMLVideoElement;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);

        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.8));
        if (!blob) return;

        setIsSubmitting(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("image", blob, "horizon-broadcast.jpg");

            const uploadRes = await fetch(getApiUrl("/api/upload"), {
                method: "POST",
                body: formDataUpload
            });

            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                const postRes = await fetch(getApiUrl("/api/stories"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        mediaUrl: uploadData.url,
                        caption: formData.caption || "Live from the Kido Nexus Hub!"
                    }),
                });

                if (postRes.ok) {
                    const newStory = await postRes.json();
                    setStories([newStory, ...stories]);
                    setSuccess(true);
                    stopCamera();
                    setTimeout(() => {
                        setIsModalOpen(false);
                        setSuccess(false);
                        setFormData({ ...formData, mediaUrl: "", caption: "" });
                    }, 2000);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsCountingDown(false);
            setCountdown(3);
        }
    };

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
                            <button onClick={() => { stopCamera(); setIsModalOpen(false); setSuccess(false); }} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                                <X size={24} />
                            </button>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Broadcasting Live</h2>
                            <div className="w-10 h-10" />
                        </div>

                        <div className="aspect-[9/16] bg-neutral-900 rounded-[3rem] border-4 border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                            {success ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-secondary text-primary animate-in zoom-in duration-500">
                                    <CheckCircle2 size={64} />
                                    <h3 className="text-2xl font-black font-serif italic uppercase">Broadcast Live</h3>
                                    <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Session Propagated to Network</p>
                                </div>
                            ) : (
                                <>
                                    <video
                                        id="viewfinder"
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                    {!stream && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-black/80 backdrop-blur-sm">
                                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary shadow-[0_0_40px_rgba(197,160,89,0.3)]">
                                                <Camera size={32} />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h3 className="text-xl font-black font-serif italic">Camera Node Offline</h3>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Authorize hardware for real-time feed</p>
                                            </div>
                                            <button
                                                onClick={startCamera}
                                                className="bg-secondary text-primary px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Initialize Lens
                                            </button>
                                        </div>
                                    )}

                                    {stream && (
                                        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center px-10 space-y-6">
                                            {isCountingDown ? (
                                                <div className="text-8xl font-black font-serif italic text-secondary animate-ping">
                                                    {countdown}
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        placeholder="Enter Broadcast Intent..."
                                                        className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-secondary transition-all"
                                                        value={formData.caption}
                                                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                                    />
                                                    <button
                                                        disabled={isSubmitting}
                                                        onClick={handleBroadcast}
                                                        className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <> <Circle className="fill-white animate-pulse" size={14} /> Go Live Now </>}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
