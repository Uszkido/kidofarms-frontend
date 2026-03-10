"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Info, ShoppingBag } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getApiUrl } from "@/lib/api";

export default function VendorNewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        unit: "piece",
        farmSource: "",
    });
    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Mocking merchant ID
    const userId = "demo-vendor-id";

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch(getApiUrl("/api/categories"));
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) setForm(f => ({ ...f, category: data[0].name }));
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...form,
                price: form.price,
                stock: Number(form.stock),
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"],
                ownerId: userId
            };

            const res = await fetch(getApiUrl("/api/products"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create listing");
            }

            router.push("/dashboard/vendor");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/dashboard/vendor" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black font-serif uppercase tracking-tighter text-primary">Merchant <span className="text-secondary italic">Listing</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Add a new commodity to your digital shop front.</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <Info size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Item Details</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Product Name</label>
                                    <input
                                        type="text" name="name" required value={form.name} onChange={handleChange}
                                        placeholder="e.g. Premium White Corn"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Category</label>
                                    <select
                                        name="category" value={form.category} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Description</label>
                                <textarea
                                    name="description" required rows={4} value={form.description} onChange={handleChange}
                                    placeholder="Briefly describe your product..."
                                    className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Market Placement</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Price (₦)</label>
                                    <input
                                        type="number" name="price" required value={form.price} onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Quantity</label>
                                    <input
                                        type="number" name="stock" required value={form.stock} onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Unit</label>
                                    <select
                                        name="unit" value={form.unit} onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none appearance-none"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="basket">Basket</option>
                                        <option value="piece">Piece</option>
                                        <option value="bag">Bag</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h2 className="text-xl font-black font-serif">Product Gallery</h2>
                            <ImageUpload
                                value={images}
                                onChange={(urls) => setImages(urls)}
                                onRemove={(url) => setImages(images.filter(i => i !== url))}
                            />
                        </div>

                        <div className="flex justify-end gap-4 p-8 bg-white rounded-[3rem] border border-primary/5 shadow-xl">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {loading ? "Syncing..." : "Launch Listing"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
