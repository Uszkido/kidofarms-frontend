"use client";

import { useState, useEffect } from "react";
import {
    Users,
    ArrowLeft,
    Search,
    Loader2,
    ShieldCheck,
    Edit3,
    Trash2,
    CheckCircle2,
    X,
    UserPlus,
    Filter,
    Shield
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "customer",
        isVerified: false,
        verificationMark: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(getApiUrl("/api/users"));
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl(`/api/users/${editingUser.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchUsers();
                setIsEditModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleVerify = async (user: any) => {
        try {
            const res = await fetch(getApiUrl(`/api/users/${user.id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isVerified: !user.isVerified,
                    verificationMark: !user.isVerified ? "Gold" : null
                })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#06120e] text-[#E6EDF3] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-secondary mb-4 transition-all">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">
                            Citizen <span className="text-secondary italic">Registry</span>
                        </h1>
                        <p className="text-white/40 font-medium text-sm mt-2">Manage user identities, roles, and verification states.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search users or roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-secondary/30 outline-none backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 size={48} className="animate-spin text-secondary opacity-20" />
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">User Identity</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Role Access</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Verification</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black font-serif">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{user.name}</p>
                                                        <p className="text-xs text-white/20">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                                    user.role === 'farmer' ? 'bg-green-500/10 text-green-400' :
                                                        user.role === 'vendor' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-white/5 text-white/40'
                                                    }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => toggleVerify(user)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${user.isVerified
                                                        ? 'bg-secondary text-primary shadow-lg shadow-secondary/20'
                                                        : 'bg-white/5 text-white/10 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <ShieldCheck size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {user.isVerified ? `Verified (${user.verificationMark})` : 'Unverified'}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setFormData({
                                                                name: user.name,
                                                                email: user.email,
                                                                role: user.role,
                                                                isVerified: user.isVerified,
                                                                verificationMark: user.verificationMark || ""
                                                            });
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-secondary transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0E1116]/80 backdrop-blur-md">
                    <div className="bg-[#161B22] w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-white/5">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-all">
                            <X size={24} />
                        </button>

                        <div className="relative space-y-8">
                            <h2 className="text-3xl font-black font-serif uppercase tracking-tighter text-white">
                                Edit <span className="text-secondary italic">Citizen</span>
                            </h2>

                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Role Access</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-medium text-white appearance-none"
                                    >
                                        <option value="customer" className="bg-[#161B22]">Customer</option>
                                        <option value="admin" className="bg-[#161B22]">Administrator</option>
                                        <option value="farmer" className="bg-[#161B22]">Farmer</option>
                                        <option value="vendor" className="bg-[#161B22]">Vendor</option>
                                        <option value="wholesale_buyer" className="bg-[#161B22]">Wholesaler</option>
                                        <option value="distributor" className="bg-[#161B22]">Distributor</option>
                                        <option value="retailer" className="bg-[#161B22]">Retailer</option>
                                        <option value="business" className="bg-[#161B22]">Business (Hotels/B2B)</option>
                                        <option value="team_member" className="bg-[#161B22]">Team Member</option>
                                        <option value="affiliate" className="bg-[#161B22]">Affiliate</option>
                                        <option value="subscriber" className="bg-[#161B22]">Subscriber</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Verification Mark</label>
                                        <input value={formData.verificationMark} onChange={e => setFormData({ ...formData, verificationMark: e.target.value })} placeholder="Gold, Citizen, etc." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 font-medium text-white" />
                                    </div>
                                    <div className="flex items-center gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isVerified: !formData.isVerified })}
                                            className={`flex-grow py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.isVerified ? 'bg-secondary text-primary' : 'bg-white/5 text-white/20'}`}
                                        >
                                            {formData.isVerified ? "Verified" : "Unverified"}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                    Save Protocol Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
