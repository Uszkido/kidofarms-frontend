"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
    Tag,
    Plus,
    Search,
    ArrowLeft,
    Edit,
    Trash2,
    Loader2,
    FolderTree,
    AlertTriangle,
    Save
} from "lucide-react";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: ""
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch(getApiUrl("/api/categories"));
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = editingCategory ? "PATCH" : "POST";
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";

        try {
            const res = await fetch(getApiUrl(url), {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                if (editingCategory) {
                    setCategories(categories.map(c => c.id === data.id ? data : c));
                } else {
                    setCategories([...categories, data]);
                }
                setIsModalOpen(false);
                setFormData({ name: "", description: "", image: "" });
                setEditingCategory(null);
            }
        } catch (error) {
            alert("Failed to save category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This may affect products in this category.")) return;
        try {
            const res = await fetch(getApiUrl(`/api/categories/${id}`), { method: "DELETE" });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const openEditModal = (category: any) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            image: category.image || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter">Taxonomy <span className="text-secondary italic">Hub</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage product classifications and catalog groups.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setFormData({ name: "", description: "", image: "" });
                                setIsModalOpen(true);
                            }}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
                        >
                            <Plus size={18} /> Add Category
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={48} className="animate-spin text-secondary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <div key={category.id} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-neutral-100 relative overflow-hidden border border-primary/5 shrink-0">
                                            {category.image ? (
                                                <Image src={category.image} alt={category.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary/20"><Tag size={24} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black font-serif uppercase">{category.name}</h3>
                                            <p className="text-xs font-bold text-primary/40 mt-1 uppercase tracking-widest">Classification</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-primary/5 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-3 text-primary/30 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-3 text-primary/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-primary/5">
                                    <FolderTree size={48} className="mx-auto text-primary/20 mb-4" />
                                    <h3 className="text-xl font-black font-serif">Empty Hub</h3>
                                    <p className="text-primary/40 font-medium">Create your first product classification.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-primary/20">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 -translate-y-32 translate-x-32" />

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold font-serif tracking-tighter uppercase">{editingCategory ? "Edit" : "New"} <span className="text-secondary italic">Classification</span></h1>
                                <p className="text-primary/40 font-medium text-sm mt-2">Define how products are grouped in the market.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Category Name</label>
                                    <input
                                        type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Image URL</label>
                                    <input
                                        type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Description (Optional)</label>
                                    <textarea
                                        rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:bg-neutral-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={isSaving}
                                        className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        {isSaving ? "Saving..." : editingCategory ? "Update Classification" : "Create Classification"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
