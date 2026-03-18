"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export function BlogPostDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/blog/${id}`));
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-neutral-50">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-secondary" size={48} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!post || !post.title) {
        return (
            <div className="flex flex-col min-h-screen bg-neutral-50">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                    <h1 className="text-4xl font-serif font-black">Post Not Found</h1>
                    <p className="text-primary/60">This story might have been moved or archived.</p>
                    <Link href="/blog" className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 selection:bg-secondary/30">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <article className="container mx-auto px-6 max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary/40 hover:text-secondary font-black uppercase tracking-widest text-[10px] mb-12 transition-colors">
                        <ArrowLeft size={14} /> Back to Stories
                    </Link>

                    <header className="mb-16 space-y-8">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40">
                            <span className="flex items-center gap-2 py-1 px-3 bg-white rounded-full border border-primary/5">
                                <Calendar size={12} className="text-secondary" /> {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 py-1 px-3 bg-white rounded-full border border-primary/5">
                                <User size={12} className="text-secondary" /> {post.author?.name || 'Kido Farms Admin'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black font-serif leading-[1.1] text-primary">
                            {post.title}
                        </h1>
                    </header>

                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl shadow-primary/10 group">
                        <Image
                            src={post.image || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-12">
                        <div className="prose prose-neutral prose-lg prose-primary max-w-none">
                            <div className="whitespace-pre-line text-primary/80 leading-relaxed font-medium">
                                {post.content}
                            </div>
                        </div>

                        <aside className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
                            <div className="p-2 bg-white rounded-3xl border border-primary/5 flex flex-col gap-2 shadow-xl shadow-primary/5">
                                <button className="p-3 hover:bg-neutral-50 rounded-2xl transition-colors text-primary/40 hover:text-secondary"><Share2 size={20} /></button>
                                <button className="p-3 hover:bg-neutral-50 rounded-2xl transition-colors text-primary/40 hover:text-[#1877F2]"><Facebook size={20} /></button>
                                <button className="p-3 hover:bg-neutral-50 rounded-2xl transition-colors text-primary/40 hover:text-[#1DA1F2]"><Twitter size={20} /></button>
                                <button className="p-3 hover:bg-neutral-50 rounded-2xl transition-colors text-primary/40 hover:text-secondary"><Link2 size={20} /></button>
                            </div>
                        </aside>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
