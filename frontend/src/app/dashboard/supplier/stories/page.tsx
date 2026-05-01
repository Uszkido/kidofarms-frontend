"use client";

import { useState, useRef, useEffect } from "react";
import {
    Camera,
    X,
    Upload,
    Zap,
    Sparkles,
    Circle,
    ArrowLeft,
    Loader2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupplierStoriesPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        vendorId: "supplier_v1",
        mediaUrl: "",
        caption: "Live transmission from Supplier Node",
        mediaType: "image",
    });

    const handlePublish = async () => {
        setUploading(true);
        try {
            const res = await fetch("/api/stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, mediaUrl: preview || "" }),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard/supplier");
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-between items-center">
                    <Link href="/dashboard/supplier" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                        <X size={24} />
                    </Link>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Broadcasting Live</h2>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>

                <div className="aspect-[9/16] bg-neutral-900 rounded-[3rem] border-4 border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    {!preview ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary animate-pulse">
                                <Camera size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Camera Node Initializing...</p>
                        </div>
                    ) : (
                        <img src={preview} className="w-full h-full object-cover" />
                    )}

                    {/* Camera Interface Overlay */}
                    <div className="absolute inset-x-0 bottom-12 px-8 flex flex-col items-center gap-8">
                        {uploading ? (
                            <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-4 text-center">
                                <Loader2 className="animate-spin text-secondary" size={32} />
                                <p className="text-xs font-black uppercase tracking-widest">Broadcasting Harvest to Network...</p>
                            </div>
                        ) : success ? (
                            <div className="bg-secondary p-8 rounded-[2rem] flex flex-col items-center gap-4 text-center">
                                <CheckCircle2 className="text-primary animate-bounce" size={32} />
                                <p className="text-xs font-black uppercase tracking-widest text-primary">Transmission Successful</p>
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
                                        onClick={() => setPreview("https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80")}
                                        className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center p-1 hover:scale-110 transition-transform"
                                    >
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                            <Circle size={16} className={`text-red-500 fill-red-500 ${preview ? 'opacity-100' : 'opacity-0'}`} />
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
                            <span className="text-[10px] font-black uppercase tracking-widest">Sector 4A Live</span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Vertical Format Optimized for Mobile Nodes</p>
            </div>
        </div>
    );
}
