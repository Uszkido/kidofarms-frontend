"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Users,
    UserPlus,
    Shield,
    ShieldAlert,
    User,
    Mail,
    Phone,
    MoreVertical,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import Link from "next/link";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
        phone: ""
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
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
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok) {
                setUsers([data, ...users]);
                setShowModal(false);
                setForm({ name: "", email: "", password: "", role: "customer", phone: "" });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const nextRole = currentRole === "admin" ? "customer" : "admin";
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, role: nextRole })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: nextRole } : u));
            }
        } catch (err) {
            console.error(err);
        }
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
                            <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter">User <span className="text-secondary italic">Access</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage roles and credentials for the Kido Farms Network.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
                        >
                            <UserPlus size={18} /> Create New User
                        </button>
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
                            {users.map((user) => (
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

                                        <div className="pt-6 border-t border-primary/5 flex justify-between items-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                            <button
                                                onClick={() => toggleRole(user.id, user.role)}
                                                className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
                                            >
                                                Make {user.role === 'admin' ? 'Customer' : 'Admin'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-primary/20">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
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
                                        type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Email Address</label>
                                        <input
                                            type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Phone (Optional)</label>
                                        <input
                                            type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Initial Password</label>
                                        <input
                                            type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Role</label>
                                        <select
                                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-medium appearance-none"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Administrator</option>
                                            <option value="farmer">Verified Farmer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={() => setShowModal(false)}
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

            <Footer />
        </div>
    );
}
