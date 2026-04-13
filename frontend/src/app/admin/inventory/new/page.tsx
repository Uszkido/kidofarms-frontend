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
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-x-hidden">
            <main className="max-w-[1200px] mx-auto space-y-16 py-12">
                <div className="space-y-6">
                    <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Inventory
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="w-16 h-1.5 bg-secondary rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Asset Provisioning</h2>
                    </div>
                    <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                        Inject <span className="text-secondary">Asset</span>
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-4">
                        <Info size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                    {/* Basic Info */}
                    <div className="bg-white/5 p-12 lg:p-16 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black font-serif italic uppercase text-white">Protocol Metadata</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Define the core attributes of the new asset</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Asset Designation</label>
                                <input
                                    type="text" name="name" required value={form.name} onChange={handleChange}
                                    placeholder="e.g. Premium Highland Coffee"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Category Node</label>
                                <select
                                    name="category" value={form.category} onChange={handleChange}
                                    className="w-full bg-[#0b1612] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none text-white appearance-none"
                                >
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <option key={cat?.id || cat?.name} value={cat?.name}>{cat?.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Asset Intel (Description)</label>
                            <textarea
                                name="description" required rows={4} value={form.description} onChange={handleChange}
                                placeholder="Details about origin, quality, and harvest methods..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white/5 p-12 lg:p-16 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black font-serif italic uppercase text-white">Logistics & Value</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Configure supply chain and pricing parameters</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Unit Value (₦)</label>
                                <input
                                    type="number" name="price" required min="0" value={form.price} onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Active Reserves</label>
                                <input
                                    type="number" name="stock" required min="0" value={form.stock} onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Quantum Unit</label>
                                <select
                                    name="unit" value={form.unit} onChange={handleChange}
                                    className="w-full bg-[#0b1612] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none text-white appearance-none"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="basket">Basket</option>
                                    <option value="piece">Piece</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary/60 ml-4">Origin Node (Farm)</label>
                                <input
                                    type="text" name="farmSource" value={form.farmSource} onChange={handleChange}
                                    placeholder="e.g. Kido Farms North-East"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:border-secondary transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 mt-6 md:mt-0">
                                <input
                                    type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                                    className="w-6 h-6 rounded-lg text-secondary focus:ring-secondary/50 accent-secondary bg-black"
                                />
                                <div>
                                    <label htmlFor="isFeatured" className="text-xs font-black uppercase tracking-widest text-white cursor-pointer">Prime Priority Selection</label>
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Elevate asset to Global Featured List</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white/5 p-12 lg:p-16 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black font-serif italic uppercase text-white">Visual DNA</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Securely upload asset imagery to the distributed ledger</p>
                        </div>
                        <ImageUpload
                            value={images}
                            onChange={(urls) => setImages(urls)}
                            onRemove={(url) => setImages(images.filter(i => i !== url))}
                        />
                    </div>

                    {/* Submit Action */}
                    <div className="flex justify-end gap-6 pt-10">
                        <Link href="/admin/inventory" className="px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">
                            Abort Sequence
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary text-primary px-16 py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            <Save size={16} />
                            {loading ? "Processing..." : "Commit Asset to Registry"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
