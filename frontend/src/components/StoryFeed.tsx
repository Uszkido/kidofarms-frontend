"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";
import { X, ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from "lucide-react";

export function StoryFeed() {
    const [stories, setStories] = useState<any[]>([]);
    const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchStories = async () => {
            const res = await fetch(getApiUrl("/api/stories"));
            if (res.ok) setStories(await res.json());
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (activeStoryIdx !== null) {
            const interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        nextStory();
                        return 0;
                    }
                    return p + 1;
                });
            }, 50); // 5 sec per story Total
            return () => clearInterval(interval);
        }
    }, [activeStoryIdx]);

    const nextStory = () => {
        if (stories.length > 0 && activeStoryIdx !== null) {
            if (activeStoryIdx < stories.length - 1) {
                setActiveStoryIdx(activeStoryIdx + 1);
                setProgress(0);
            } else {
                setActiveStoryIdx(null);
            }
        }
    };

    if (stories.length === 0) return null;

    return (
        <div className="w-full py-8">
            <div className="container mx-auto px-6">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {stories.map((story, idx) => (
                        <button
                            key={story.id}
                            onClick={() => { setActiveStoryIdx(idx); setProgress(0); }}
                            className="flex-shrink-0 flex flex-col items-center gap-2 group"
                        >
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-secondary to-primary group-hover:scale-110 transition-transform">
                                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                                    <Image
                                        src={story.mediaUrl}
                                        alt="Story"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 truncate w-20 text-center">
                                {story.vendor?.name || "Kido Farm"}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {activeStoryIdx !== null && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <button onClick={() => setActiveStoryIdx(null)} className="absolute top-8 right-8 text-white/40 hover:text-white z-[210]">
                        <X size={32} />
                    </button>

                    <div className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-[3rem] overflow-hidden shadow-2xl">
                        {/* Progress Bar Container */}
                        <div className="absolute top-6 inset-x-8 z-20 flex gap-2">
                            {stories.map((_, i) => (
                                <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-secondary transition-all duration-100 ease-linear"
                                        style={{ width: i === activeStoryIdx ? `${progress}%` : i < activeStoryIdx ? '100%' : '0%' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Story Content */}
                        <Image
                            src={stories[activeStoryIdx].mediaUrl}
                            alt="Active Story"
                            fill
                            className="object-cover animate-in fade-in duration-500"
                        />

                        {/* Overlay Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 p-10 flex flex-col justify-between">
                            <div className="flex items-center gap-3 pt-6">
                                <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden relative">
                                    <Image src={stories[activeStoryIdx].mediaUrl} fill className="object-cover" alt="Avatar" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-sm tracking-tight">{stories[activeStoryIdx].vendor?.name}</h4>
                                    <p className="text-secondary font-black text-[8px] uppercase tracking-widest italic">Live from Harvest Node</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-white font-serif text-xl italic leading-tight">
                                    "{stories[activeStoryIdx].caption}"
                                </p>
                                <button className="w-full bg-secondary text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2">
                                    View Product Node <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
