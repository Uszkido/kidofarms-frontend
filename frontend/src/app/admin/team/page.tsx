"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Loader2, Trash2, Edit3, User, Globe, Save, X, Trash } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminTeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image: ""
    });

    const fetchTeam = async () => {
        try {
            const res = await fetch(getApiUrl("/api/team"));
            if (res.ok) setTeam(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingMember
            ? getApiUrl(`/api/team/${editingMember.id}`)
            : getApiUrl("/api/team");
        const method = editingMember ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingMember(null);
                setFormData({ name: "", role: "", bio: "", image: "" });
                fetchTeam();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this team member?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/team/${id}`), { method: "DELETE" });
            if (res.ok) fetchTeam();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3] px-6 py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary mb-4 transition-all">
                            <ArrowLeft size={14} /> Back to Hub
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">Team <span className="text-secondary italic">Management</span></h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Manage the public roster of Kido Farms leadership.</p>
                    </div>
                    <button
                        onClick={() => { setEditingMember(null); setFormData({ name: "", role: "", bio: "", image: "" }); setIsModalOpen(true); }}
                        className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-secondary/10"
                    >
                        <Plus size={18} /> Add Member
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-secondary" size={48} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map(member => (
                            <div key={member.id} className="bg-white/5 p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md group hover:border-secondary/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#161B22] overflow-hidden border border-white/10">
                                        <img src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=facc15&color=0a0a0a`} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingMember(member); setFormData(member); setIsModalOpen(true); }}
                                            className="p-2 text-white/20 hover:text-secondary hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black font-serif text-white truncate">{member.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-4">{member.role}</p>
                                <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-3">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0E1116]/80 backdrop-blur-md">
                    <div className="bg-[#161B22] w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 -translate-y-32 translate-x-32" />
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-all">
                            <X size={24} />
                        </button>

                        <div className="relative space-y-8">
                            <h2 className="text-3xl font-black font-serif uppercase tracking-tighter text-white">
                                {editingMember ? "Edit" : "New"} <span className="text-secondary italic">Member</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white backdrop-blur-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Role (e.g. Agronomist)</label>
                                    <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white backdrop-blur-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Bio / Description</label>
                                    <textarea required rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white backdrop-blur-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image URL (Optional)</label>
                                    <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white backdrop-blur-sm" />
                                </div>
                                <button type="submit" className="w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                    {editingMember ? "Update Roster" : "Add to Team"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
