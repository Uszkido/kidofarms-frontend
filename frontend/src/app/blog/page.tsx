"use client";

import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(getApiUrl("/api/blog"));
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                        <span className="bg-secondary text-primary px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest">Community Hub</span>
                        <h1 className="text-6xl font-black font-serif leading-tight">Farm <span className="text-secondary italic">Stories</span></h1>
                        <p className="text-primary/60 font-medium leading-relaxed">Updates from our fields, sustainable living tips, and community highlights.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" size={48} /></div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {posts.map(post => (
                                <Link href={`/blog/${post.id}`} key={post.id} className="group bg-white rounded-[3rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={post.image || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800"}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-10 flex flex-col flex-grow space-y-4">
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/30">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><User size={12} /> {post.author?.name || 'Admin'}</span>
                                        </div>
                                        <h3 className="text-2xl font-black font-serif leading-tight group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h3>
                                        <p className="text-primary/60 text-sm font-medium line-clamp-3 leading-relaxed">{post.content}</p>
                                        <div className="mt-auto pt-6 border-t border-primary/5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary">
                                            Read More <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && posts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[4rem] border border-primary/5">
                            <p className="text-primary/20 font-black uppercase tracking-widest">No stories published yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
