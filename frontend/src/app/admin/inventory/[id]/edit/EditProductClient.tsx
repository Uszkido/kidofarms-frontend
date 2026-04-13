"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Package, Tag, Info, Star } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getApiUrl } from "@/lib/api";

export function EditProductClient() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Fruits",
        stock: "",
        unit: "piece",
        farmSource: "",
        isFeatured: false,
    });
    const [images, setImages] = useState<string[]>([]);
    const [growthJournal, setGrowthJournal] = useState<{ date: string, milestone: string, imageUrl: string }[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch(getApiUrl("/api/categories"));
            if (res.ok) setCategories(await res.json());
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            try {
                const res = await fetch(getApiUrl(`/api/products/${params.id}`));
                const data = await res.json();
                if (res.ok) {
                    setForm({
                        name: data.name,
                        description: data.description,
                        price: data.price.toString(),
                        category: data.category,
                        stock: data.stock.toString(),
                        unit: data.unit || "piece",
                        farmSource: data.farmSource || "",
                        isFeatured: data.isFeatured || false,
                    });
                    setImages(data.images || []);
                    setGrowthJournal(data.growthJournal || []);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError("Failed to load product data");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const payload = {
                ...form,
                price: form.price.toString(),
                stock: parseInt(form.stock) || 0,
                images: images,
                growthJournal: growthJournal,
            };

            const res = await fetch(getApiUrl(`/api/products/${params.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update product");
            }

            router.push("/admin/inventory");
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
                    <Link href="/admin/inventory" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Inventory
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Edit <span className="text-secondary italic">Product</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Modify details for {form.name}.</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <Info size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Basic Information</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Product Name</label>
                                    <input
                                        type="text" name="name" required value={form.name} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Category</label>
                                    <select
                                        name="category" value={form.category} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all appearance-none"
                                    >
                                        {Array.isArray(categories) && categories.map(cat => (
                                            <option key={cat?.id || cat?.name} value={cat?.name}>{cat?.name}</option>
                                        ))}
                                        {(!Array.isArray(categories) || categories.length === 0) && (
                                            <option value={form.category}>{form.category}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Description</label>
                                <textarea
                                    name="description" required rows={4} value={form.description} onChange={handleChange}
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Pricing & Inventory</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Price (₦)</label>
                                    <input
                                        type="number" name="price" required min="0" value={form.price} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Stock</label>
                                    <input
                                        type="number" name="stock" required min="0" value={form.stock} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Unit</label>
                                    <select
                                        name="unit" value={form.unit} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all appearance-none"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="basket">Basket</option>
                                        <option value="piece">Piece</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Media</h2>
                            <ImageUpload
                                value={images}
                                onChange={(urls) => setImages(urls)}
                                onRemove={(url) => setImages(images.filter(i => i !== url))}
                            />
                        </div>

                        {/* 🌱 GROWTH JOURNAL */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black font-serif">Growth Journal</h2>
                                    <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Document the lifecycle of this harvest</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setGrowthJournal([...growthJournal, { date: new Date().toISOString().split('T')[0], milestone: "Sprouted", imageUrl: "" }])}
                                    className="px-6 py-3 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2"
                                >
                                    <Tag size={14} /> Add Milestone
                                </button>
                            </div>

                            <div className="space-y-6">
                                {growthJournal.map((entry, idx) => (
                                    <div key={idx} className="p-8 bg-neutral-50 rounded-3xl border border-primary/5 flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40">Milestone</label>
                                                <input
                                                    type="text"
                                                    value={entry.milestone}
                                                    placeholder="E.g. Seedling Stage"
                                                    onChange={(e) => {
                                                        const newJournal = [...growthJournal];
                                                        newJournal[idx].milestone = e.target.value;
                                                        setGrowthJournal(newJournal);
                                                    }}
                                                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40">Date</label>
                                                <input
                                                    type="date"
                                                    value={entry.date}
                                                    onChange={(e) => {
                                                        const newJournal = [...growthJournal];
                                                        newJournal[idx].date = e.target.value;
                                                        setGrowthJournal(newJournal);
                                                    }}
                                                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={entry.imageUrl}
                                                    placeholder="Snapshot URL"
                                                    onChange={(e) => {
                                                        const newJournal = [...growthJournal];
                                                        newJournal[idx].imageUrl = e.target.value;
                                                        setGrowthJournal(newJournal);
                                                    }}
                                                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setGrowthJournal(growthJournal.filter((_, i) => i !== idx))}
                                            className="p-3 bg-red-50 text-red-400 hover:bg-red-400 hover:text-white rounded-xl transition-all self-center md:self-end"
                                        >
                                            <ArrowLeft size={16} className="rotate-45" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin/inventory" className="px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:text-primary transition-all">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3"
                            >
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {saving ? "Saving..." : "Update Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
