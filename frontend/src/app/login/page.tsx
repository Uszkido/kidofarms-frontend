"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Eye, EyeOff, Loader2, ShieldAlert, X, Bot } from "lucide-react";
import { getApiUrl } from "@/lib/api";

import { motion, AnimatePresence } from "framer-motion";

function LoginForm({ initialRole = "customer" }: { initialRole?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const impersonationToken = searchParams.get("token");

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState(initialRole);
    const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
    const [selectedGoogleRole, setSelectedGoogleRole] = useState("customer");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    useEffect(() => {
        if (impersonationToken) {
            handleImpersonationLogin();
        }
    }, [impersonationToken]);

    const handleImpersonationLogin = async () => {
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                token: impersonationToken,
                impersonation: "true"
            });

            if (res?.ok) {
                const session = await getSession();
                const role = (session?.user as any)?.role;
                redirectToDashboard(role);
            } else {
                setError("Ghost Protocol failed: Token invalid or expired.");
            }
        } catch (err) {
            setError("Spectral connection error.");
        } finally {
            setLoading(false);
        }
    };

    const redirectToDashboard = (role: string) => {
        const path = (role === "admin" || role === "sub-admin") ? "/admin" :
            (role === "farmer" || role === "vendor" || role === "farm_cooperative" || role === "producer") ? "/dashboard/supplier" :
                (role === "subscriber" || role === "business" || role === "wholesale_buyer" || role === "retailer" || role === "consumer" || role === "customer") ? "/dashboard/buyer" :
                    (role === "logistics" || role === "distributor" || role === "warehouse_staff") ? "/dashboard/logistics" :
                        (role === "staff" || role === "support" || role === "team" || role === "moderator" || role === "platform_moderator") ? "/dashboard/staff" :
                            "/dashboard/buyer";
        router.push(path);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });
            if (res?.error) {
                if (res.error === "CredentialsSignin") {
                    throw new Error("Invalid email or password.");
                }
                throw new Error(res.error);
            }

            const session = await getSession();
            const role = (session?.user as any)?.role;
            if (!role) throw new Error("Session could not be established. Please try again.");
            redirectToDashboard(role);
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(getApiUrl("/api/auth/signup"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed");

            router.push(`/verify-account?email=${encodeURIComponent(form.email)}`);
        } catch (err: any) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const triggerGoogleModal = () => setShowGoogleRoleModal(true);

    const executeGoogleLogin = async () => {
        setLoading(true);
        setShowGoogleRoleModal(false);
        try {
            document.cookie = `pending_social_role=${selectedGoogleRole}; path=/;`;
            await signIn("google", { callbackUrl: "/dashboard/consumer" });
        } catch (err) {
            setError("Google linkage failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = (selectedRole: string) => {
        if (selectedRole === "farmer") {
            router.push("/register/farmer");
        } else if (selectedRole === "vendor") {
            router.push("/register/vendor");
        } else if (selectedRole === "subscriber") {
            router.push("/subscriptions");
        } else {
            setRole("customer");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Branding Panel */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[45%] bg-primary flex flex-col justify-between p-8 md:p-16 relative overflow-hidden"
            >
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:rotate-[15deg] transition-all duration-500 shadow-xl">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black font-serif text-white tracking-widest uppercase">Kido Farms</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-10 my-12 md:my-0">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black font-serif text-white uppercase leading-[0.9] tracking-tighter"
                    >
                        Feed <br /> The <span className="text-secondary italic">Sovereign</span> <br /> Future
                    </motion.h1>
                    <p className="text-white/60 max-w-sm text-lg md:text-xl font-medium leading-relaxed italic">
                        Access our bio-digital nexus connecting local producers to the global table.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-8 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                        <span>V5.0 NEURAL CORE</span>
                    </div>
                    <span>NODE: {form.email ? form.email.split('@')[0].toUpperCase() : 'ANON'}</span>
                </div>
            </motion.div>

            {/* Auth Form Panel */}
            <div className="flex-1 bg-white flex items-center justify-center p-6 md:p-16 lg:p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md space-y-12 relative z-10"
                >
                    <div className="space-y-6">
                        <div className="flex gap-8 border-b border-gray-100">
                            {['login', 'signup'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMode(m as any)}
                                    className={`relative py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all ${mode === m ? 'text-primary' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    {m}
                                    {mode === m && (
                                        <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-serif text-primary uppercase tracking-tighter italic leading-none">
                            {mode === 'login' ? 'Welcome Back' : 'Join The Nexus'}
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4"
                            >
                                <ShieldAlert className="w-6 h-6 shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-8">
                        <div className="space-y-6">
                            {mode === 'signup' && (
                                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Identity</label>
                                    <input
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Legal Name"
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-secondary focus:bg-white transition-all font-bold text-primary placeholder:text-gray-300"
                                    />
                                </motion.div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registry Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="name@nexus.com"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-secondary focus:bg-white transition-all font-bold text-primary placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-3 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-secondary focus:bg-white transition-all font-bold text-primary placeholder:text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-8 top-[3.3rem] text-gray-300 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {mode === 'login' && (
                                    <div className="flex justify-end pr-4">
                                        <Link href="/forgot-password" line-0 className="text-[9px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                                            Bypass Security?
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] overflow-hidden relative shadow-2xl hover:shadow-secondary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 group-hover:text-primary flex items-center justify-center gap-4">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? 'Authorize' : 'Initialize'}
                            </span>
                        </button>

                        <div className="relative py-6 flex items-center gap-6">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 shrink-0">Social Linkage</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        <button
                            type="button"
                            onClick={triggerGoogleModal}
                            className="w-full bg-white border border-gray-100 text-primary py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-gray-50 hover:border-secondary transition-all shadow-sm flex items-center justify-center gap-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.48,10.92V14.51h6.64a5.67,5.67,0,0,1-2.47,3.72l3.05,2.37a10.42,10.42,0,0,0,3.3-8.68,10.87,10.87,0,0,0-.17-1.12H12.48Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#FBBC05" d="M12.48,23.97a10.74,10.74,0,0,0,7.38-2.69l-3.05-2.37a6.76,6.76,0,0,1-4.33,1.3A6.87,6.87,0,0,1,6,15.68l-3.15,2.44A11.13,11.13,0,0,0,12.48,23.97Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#34A853" d="M6,15.68A7.3,7.3,0,0,1,5.67,12,7.3,7.3,0,0,1,6,8.32L2.85,5.88A11.12,11.12,0,0,0,1.48,12a11.12,11.12,0,0,0,1.37,6.12L6,15.68Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#4285F4" d="M12.48,3.53a5.94,5.94,0,0,1,4.2,1.65l3.14-3.14A10.8,10.8,0,0,0,12.48.05a11.13,11.13,0,0,0-9.63,5.83L6,8.32A6.87,6.87,0,0,1,12.48,3.53Z" transform="translate(-0.48 -0.05)" />
                            </svg>
                            Google Connect
                        </button>
                    </form>

                    <div className="pt-10 border-t border-gray-100 flex flex-col items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Authority Levels</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['farmer', 'vendor', 'subscriber', 'customer'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => handleRoleSelect(r)}
                                    className={`px-6 py-3 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-secondary border-secondary text-primary shadow-lg shadow-secondary/20' : 'bg-transparent border-gray-100 text-gray-400 hover:border-secondary hover:text-primary'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showGoogleRoleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[999] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] p-12 max-w-md w-full space-y-10 shadow-[0_32px_64px_-16px_rgba(4,13,10,0.4)] relative border border-gray-100"
                        >
                            <button onClick={() => setShowGoogleRoleModal(false)} className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-cream rounded-full transition-all">
                                <X size={20} />
                            </button>

                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-2xl mx-auto flex items-center justify-center">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black font-serif text-primary uppercase tracking-tighter italic">Select Node</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 leading-relaxed mt-2">Identify your primary network role</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {['customer', 'farmer', 'vendor', 'carrier', 'affiliate'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setSelectedGoogleRole(r)}
                                        className={`w-full p-6 rounded-[1.5rem] border-2 text-left flex justify-between items-center transition-all ${selectedGoogleRole === r ? 'border-secondary bg-secondary/5' : 'border-gray-50 hover:border-gray-100 bg-gray-50/50'}`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{r} Node</span>
                                        {selectedGoogleRole === r && (
                                            <motion.div layoutId="role-dot" className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_12px_rgba(197,160,89,1)]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={executeGoogleLogin}
                                disabled={loading}
                                className="w-full bg-primary text-secondary py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Authorization"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LoginPage({ initialRole }: { initialRole?: string }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={64} />
            </div>
        }>
            <LoginForm initialRole={initialRole} />
        </Suspense>
    );
}
