"use client";

import { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Shield,
    ShieldAlert,
    User,
    Mail,
    Phone,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Search,
    Trash2,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
        phone: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await fetch(getApiUrl("/api/users"));
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/users"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setUsers([data, ...users]);
                setIsModalOpen(false);
                setFormData({ name: "", email: "", password: "", role: "customer", phone: "" });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateRole = async (userId: string, nextRole: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/users/${userId}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: nextRole })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: nextRole } : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;

        try {
            const res = await fetch(getApiUrl(`/api/users/${id}`), { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            alert("An error occurred while deleting");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter">User <span className="text-secondary italic">Access</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage roles and credentials for the Kido Farms Network.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 hidden md:block">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 bg-white border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none shadow-sm"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
                            >
                                <UserPlus size={18} /> Create New User
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={48} className="animate-spin text-secondary" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-[2.5rem] flex items-center gap-4">
                            <ShieldAlert size={24} />
                            <p className="font-bold">{error}</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 -translate-y-12 translate-x-12 blur-3xl opacity-10 ${user.role === 'admin' ? 'bg-red-500' : 'bg-secondary'}`} />

                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-secondary/10 text-secondary'}`}>
                                            {user.role === 'admin' ? <Shield size={28} /> : <User size={28} />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-primary/40'}`}>
                                                {user.role}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black font-serif line-clamp-1">{user.name}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-primary/40">
                                                <Mail size={12} />
                                                <span className="text-xs font-bold truncate">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 mt-1 text-primary/40">
                                                    <Phone size={12} />
                                                    <span className="text-xs font-bold">{user.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-primary/5 flex justify-between items-center gap-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateRole(user.id, e.target.value)}
                                                className="text-[10px] font-black uppercase tracking-widest text-secondary bg-transparent border-none outline-none cursor-pointer hover:underline"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                                <option value="farmer">Farmer</option>
                                                <option value="vendor">Vendor</option>
                                                <option value="subscriber">Subscriber</option>
                                                <option value="wholesale_buyer">Wholesale</option>
                                                <option value="retailer">Retailer</option>
                                                <option value="distributor">Distributor</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-primary/5">
                                    <AlertTriangle size={48} className="mx-auto text-amber-500/20 mb-4" />
                                    <h3 className="text-xl font-black font-serif">No Users Found</h3>
                                    <p className="text-primary/40 font-medium">Try searching for a different name or email.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-primary/20">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 -translate-y-32 translate-x-32" />

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold font-serif tracking-tighter uppercase">New <span className="text-secondary italic">Account</span></h1>
                                <p className="text-primary/40 font-medium text-sm mt-2">Assign roles and network permissions.</p>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Full Name</label>
                                    <input
                                        type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Email Address</label>
                                        <input
                                            type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Phone (Optional)</label>
                                        <input
                                            type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Initial Password</label>
                                        <input
                                            type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Role</label>
                                        <select
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium appearance-none"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Administrator</option>
                                            <option value="farmer">Verified Farmer</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="subscriber">Subscriber</option>
                                            <option value="wholesale_buyer">Wholesale Buyer</option>
                                            <option value="retailer">Retailer</option>
                                            <option value="distributor">Distributor</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-primary/40 hover:bg-neutral-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
