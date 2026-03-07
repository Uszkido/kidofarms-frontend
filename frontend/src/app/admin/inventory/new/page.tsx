"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Info } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getApiUrl } from "@/lib/api";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
    // In a real app we would upload the image to an S3 bucket or Cloudinary and get the URL back.
    // For this demo, we'll just allow setting a URL string directly or default to a placeholder.
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch(getApiUrl("/api/categories"));
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                    if (data.length > 0) setForm(f => ({ ...f, category: data[0].name }));
                } else {
                    console.error("Categories API did not return an array:", data);
                }
            }
        };
        fetchCategories();
    }, []);

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
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"], // Fallback image
            };

            const res = await fetch(getApiUrl("/api/products"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create product");
            }

            router.push("/admin/inventory");
            router.refresh();
        } catch (err: any) {
            console.error("Product submission error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/admin/inventory" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Inventory
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">New <span className="text-secondary italic">Listing</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Publish a new product to the marketplace.</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <Info size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Basic Info */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Basic Information</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Product Name</label>
                                    <input
                                        type="text" name="name" required value={form.name} onChange={handleChange}
                                        placeholder="e.g. Fresh Ripe Tomatoes"
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
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Description</label>
                                <textarea
                                    name="description" required rows={4} value={form.description} onChange={handleChange}
                                    placeholder="Describe the product, its origin, and freshness..."
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Pricing & Inventory</h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Price (₦)</label>
                                    <input
                                        type="number" name="price" required min="0" value={form.price} onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Available Stock</label>
                                    <input
                                        type="number" name="stock" required min="0" value={form.stock} onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Unit of Measurement</label>
                                    <select
                                        name="unit" value={form.unit} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all appearance-none"
                                    >
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="basket">Basket</option>
                                        <option value="piece">Piece</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Farm Source (Optional)</label>
                                    <input
                                        type="text" name="farmSource" value={form.farmSource} onChange={handleChange}
                                        placeholder="e.g. Kido Farms North"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-4 bg-neutral-50 p-6 rounded-2xl border border-primary/10 h-full mt-6 md:mt-0">
                                    <input
                                        type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                                        className="w-5 h-5 rounded text-secondary focus:ring-secondary/50 accent-secondary"
                                    />
                                    <div>
                                        <label htmlFor="isFeatured" className="font-bold text-primary cursor-pointer">Feature on Homepage</label>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mt-1">Highlight this product in trending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Product Media</h2>
                            <ImageUpload
                                value={images}
                                onChange={(urls) => setImages(urls)}
                                onRemove={(url) => setImages(images.filter(i => i !== url))}
                            />
                        </div>

                        {/* Submit Action */}
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/inventory" className="px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:text-primary hover:bg-neutral-100 transition-all">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 size={20} className="animate-spin" />}
                                <Save size={20} />
                                {loading ? "Publishing..." : "Publish Item"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
