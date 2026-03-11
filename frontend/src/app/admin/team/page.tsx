"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Edit3,
    Trash2,
    ArrowLeft,
    Loader2,
    Save,
    X,
    Image as ImageIcon,
    Linkedin,
    Twitter,
    Shield,
    Upload
} from "lucide-react";

import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminTeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image: "",
        twitter: "",
        linkedin: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);


    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/team"));
            const data = await res.json();
            setTeam(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member: any) => {
        setSelectedMember(member);
        setFormData({
            name: member.name || "",
            role: member.role || "",
            bio: member.bio || "",
            image: member.image || "",
            twitter: member.twitter || "",
            linkedin: member.linkedin || ""
        });
        setIsEditing(true);
    };

    const handleAdd = () => {
        setSelectedMember(null);
        setFormData({
            name: "",
            role: "",
            bio: "",
            image: "",
            twitter: "",
            linkedin: ""
        });
        setIsEditing(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const res = await fetch(getApiUrl("/api/upload"), {
                method: "POST",
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Network error during upload");
        } finally {
            setIsUploading(false);
        }
    };


    const handleSave = async () => {
        setIsSaving(true);
        try {
            const url = selectedMember
                ? getApiUrl(`/api/team/${selectedMember.id}`)
                : getApiUrl("/api/team");
            const method = selectedMember ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(selectedMember ? "Member updated." : "New mind added to Kido.");
                setIsEditing(false);
                fetchTeam();
            } else {
                alert("Operation failed in the neural bridge.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this mind from the Core Team?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/team/${id}`), { method: "DELETE" });
            if (res.ok) {
                setTeam(team.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Core Intelligence</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            The <span className="text-secondary block">Minds</span>
                        </h1>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        <Plus size={20} /> Add Node
                    </button>
                </header>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Neural Profiles...</p>
                        </div>
                    ) : team.map(member => (
                        <div key={member.id} className="group bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6 hover:border-secondary/40 transition-all relative overflow-hidden">
                            <div className="relative w-32 h-32 mx-auto rounded-3xl overflow-hidden border border-white/10 group-hover:border-secondary/40 transition-all shadow-2xl">
                                <img
                                    src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1a1a&color=facc15`}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black font-serif italic text-white uppercase tracking-tight leading-none">{member.name}</h3>
                                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.3em]">{member.role}</p>
                            </div>
                            <p className="text-white/30 text-[10px] leading-relaxed text-center font-bold px-4 line-clamp-3">{member.bio}</p>

                            <div className="flex justify-center gap-4 pt-4">
                                <button onClick={() => handleEdit(member)} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:bg-secondary hover:text-primary transition-all">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(member.id)} className="p-4 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-primary transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-10">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsEditing(false)} />

                        <div className="bg-[#0b1612] w-full max-w-4xl rounded-[4rem] border-2 border-secondary/20 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="space-y-2">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Neural Override</h2>
                                    <h3 className="text-4xl font-black font-serif italic text-white uppercase">{selectedMember ? "Modify" : "Integrate"} <span className="text-secondary text-5xl">Mind</span></h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-red-500/20 transition-all">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="p-10 lg:p-12 space-y-12">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Identification Name</label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                            placeholder="Enter Full Name"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Functional Role</label>
                                        <input
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                            placeholder="e.g. Chief Innovation Officer"
                                        />
                                    </div>
                                    <div className="col-span-full space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Biographical Data</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm resize-none"
                                            placeholder="Brief background on this core mind..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Visual ID (Image Upload)</label>
                                        <div className="relative group/upload">
                                            <div
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-10 outline-none focus:border-secondary transition-all font-bold text-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10"
                                            >
                                                {formData.image ? (
                                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-secondary/20 shadow-2xl">
                                                        <img
                                                            src={formData.image.startsWith('http') ? formData.image : (getApiUrl(formData.image).replace('/api/', '/'))}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                                            <Upload size={20} className="text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover/upload:text-secondary transition-colors">
                                                            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                                        </div>
                                                        <span className="text-[10px] text-white/20 uppercase tracking-widest group-hover/upload:text-white transition-colors">
                                                            {isUploading ? "Uploading Mind..." : "Initiate Upload"}
                                                        </span>
                                                    </div>
                                                )}
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                            {formData.image && (
                                                <div className="absolute -top-3 -right-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: "" }) }}
                                                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Professional Mesh (LinkedIn/Twitter)</label>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <Linkedin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                                                <input
                                                    value={formData.linkedin}
                                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                                    placeholder="LinkedIn"
                                                />
                                            </div>
                                            <div className="relative flex-1">
                                                <Twitter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                                                <input
                                                    value={formData.twitter}
                                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                                                    placeholder="Twitter"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-white/[0.04] flex gap-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <> <Save size={20} /> Commit to Core </>}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-12 py-7 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
