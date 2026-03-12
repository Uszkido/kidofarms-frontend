"use client";

import { useState } from "react";
import {
    Users,
    ArrowLeft,
    Loader2,
    ShieldCheck,
    CheckCircle2,
    X,
    UserPlus,
    Mail,
    UserCircle,
    KeyRound
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { ActionStatus } from "@/components/ActionStatus";

export default function RegisterCitizenPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "consumer",
        password: "",
        permissions: [] as string[]
    });

    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setActionState({
            isOpen: true,
            title: "Citizen Registration",
            message: "Broadcasting identity node to network...",
            status: "processing"
        });

        try {
            const res = await fetch(getApiUrl("/api/admin/users/create"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setActionState(prev => ({
                    ...prev,
                    message: "Identity node successfully integrated into shadow registry.",
                    status: "success"
                }));
                setTimeout(() => {
                    router.push("/admin/users");
                }, 2000);
            } else {
                const error = await res.json();
                setActionState(prev => ({
                    ...prev,
                    message: error.msg || error.error || "Failed to broadcast identity node.",
                    status: "error"
                }));
            }
        } catch (err) {
            setActionState(prev => ({
                ...prev,
                message: "Network exception: Synchronized protocol failure.",
                status: "error"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />
            <div className="max-w-4xl mx-auto space-y-12">
                <Link href="/admin/users" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Registry
                </Link>

                <div className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary">Registry Protocol</h2>
                    <h1 className="text-6xl lg:text-8xl font-black font-serif uppercase tracking-tighter text-white leading-none italic">
                        Register <span className="text-secondary">Citizen</span>
                    </h1>
                </div>

                <div className="bg-white/5 rounded-[4rem] border border-white/10 p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4"><UserCircle size={12} /> Full Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="Enter citizen's full name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4"><Mail size={12} /> Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="citizen@network.com"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4"><ShieldCheck size={12} /> Account Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-[#1a3c34]/40 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-black uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    <option value="admin">System Admin</option>
                                    <option value="sub-admin">Sub-Admin (Restricted)</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="logistics_distributor">Logistics Distributor</option>
                                    <option value="hotel">Hotel / Hospitality</option>
                                    <option value="retailer">Retailer</option>
                                    <option value="wholesale_buyer">Wholesaler</option>
                                    <option value="business">Business</option>
                                    <option value="team_member">Team Member</option>
                                    <option value="affiliate">Affiliate</option>
                                    <option value="subscriber">Subscriber</option>
                                    <option value="consumer">Consumer</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4"><KeyRound size={12} /> Temporary Password</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {formData.role === 'sub-admin' && (
                            <div className="space-y-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Functional Access Privileges</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'view_financials', label: 'Finance: Read' },
                                        { id: 'edit_financials', label: 'Finance: Command' },
                                        { id: 'audit_financials', label: 'Finance: Audit' },
                                        { id: 'view_logistics', label: 'Logistics: Read' },
                                        { id: 'manage_dispatches', label: 'Logistics: Dispatch' },
                                        { id: 'fleet_control', label: 'Logistics: Fleet' },
                                        { id: 'inventory_read', label: 'Inventory: Read' },
                                        { id: 'inventory_edit', label: 'Inventory: Edit' },
                                        { id: 'stock_audit', label: 'Inventory: Audit' },
                                        { id: 'user_read', label: 'Users: Read' },
                                        { id: 'user_edit', label: 'Users: Edit' },
                                        { id: 'user_ban', label: 'Users: Ban Access' },
                                        { id: 'manage_roles', label: 'Users: Control Roles' },
                                        { id: 'content_publish', label: 'CMS: Publish' },
                                        { id: 'manage_tickets', label: 'Help Desk: Resolve' },
                                        { id: 'system_logs', label: 'System: Read Logs' },
                                        { id: 'system_config', label: 'System: Core Registry' },
                                        { id: 'global_data_command', label: 'Global Data: Command' }
                                    ].map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => {
                                                const perms = formData.permissions;
                                                const newPerms = perms.includes(p.id) ? perms.filter(id => id !== p.id) : [...perms, p.id];
                                                setFormData({ ...formData, permissions: newPerms });
                                            }}
                                            className={`p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between group ${formData.permissions.includes(p.id) ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                        >
                                            {p.label}
                                            {formData.permissions.includes(p.id) ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-secondary transition-colors" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 mt-8 border-b-4 border-black/20"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <> <UserPlus size={18} /> Authorize Registration </>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
