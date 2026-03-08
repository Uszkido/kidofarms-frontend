"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Info, FileText, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getApiUrl } from "@/lib/api";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        content: "",
        status: "published",
    });
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/admin/blog/${params.id}`));
                const data = await res.json();
                if (res.ok) {
                    setForm({
                        title: data.title,
                        content: data.content,
                        status: data.status,
                    });
                    if (data.image) setImages([data.image]);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError("Failed to load story data");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const payload = {
                ...form,
                image: images[0] || null,
            };

            const res = await fetch(getApiUrl(`/api/admin/blog/${params.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update story");
            }

            router.push("/admin/blog");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-neutral-50 items-center justify-center">
                <Loader2 size={48} className="animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/admin/blog" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Stories
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Edit <span className="text-secondary italic">Story</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Modify the story "{form.title}".</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <Info size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Basic Info */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif flex items-center gap-3">
                                <FileText className="text-secondary" /> Story Content
                            </h2>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Story Title</label>
                                <input
                                    type="text" name="title" required value={form.title} onChange={handleChange}
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Content</label>
                                <textarea
                                    name="content" required rows={10} value={form.content} onChange={handleChange}
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Status</label>
                                <select
                                    name="status" value={form.status} onChange={handleChange}
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all appearance-none"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif flex items-center gap-3">
                                <ImageIcon className="text-secondary" /> Featured Image
                            </h2>
                            <ImageUpload
                                value={images}
                                onChange={(urls) => setImages(urls)}
                                onRemove={(url) => setImages(images.filter(i => i !== url))}
                            />
                        </div>

                        {/* Submit Action */}
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/blog" className="px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:text-primary hover:bg-neutral-100 transition-all">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving && <Loader2 size={20} className="animate-spin" />}
                                <Save size={20} />
                                {saving ? "Updating..." : "Update Story"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
