"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    ArrowLeft,
    Edit,
    Trash2,
    Loader2,
    AlertTriangle,
    FileText,
    Calendar,
    User
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            const res = await fetch(getApiUrl("/api/blog"));
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/blog/${id}`), { method: "DELETE" });
            if (res.ok) fetchPosts();
        } catch (error) {
            alert("Error deleting post");
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Farm <span className="text-secondary italic">Stories</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage your blog content and farm updates.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative hidden md:block">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                                <input
                                    type="text"
                                    placeholder="Search stories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none shadow-sm"
                                />
                            </div>
                            <Link href="/admin/blog/new" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
                                <Plus size={18} /> New Story
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50/50 border-b border-primary/5">
                                    <tr>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Story</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Author</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Status</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Date</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin text-secondary mx-auto" size={40} /></td></tr>
                                    ) : filteredPosts.map(post => (
                                        <tr key={post.id} className="border-b border-primary/5 hover:bg-neutral-50/50 transition-colors group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden relative border border-primary/5 shrink-0">
                                                        {post.image ? <img src={post.image} className="object-cover w-full h-full" /> : <FileText className="m-auto text-primary/20" />}
                                                    </div>
                                                    <span className="font-bold text-primary">{post.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-sm font-medium text-primary/60">
                                                <div className="flex items-center gap-2"><User size={14} /> {post.author?.name || 'Admin'}</div>
                                            </td>
                                            <td className="py-6 px-8 text-sm font-medium">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-sm font-medium text-primary/40">
                                                <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/blog/${post.id}/edit`} className="p-2 text-primary/40 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit size={18} /></Link>
                                                    <button onClick={() => handleDelete(post.id)} className="p-2 text-primary/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPosts.length === 0 && !loading && (
                                        <tr><td colSpan={5} className="py-20 text-center text-primary/20 font-bold uppercase tracking-widest"><AlertTriangle className="mx-auto mb-4" /> No Stories Found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
