"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { getApiUrl } from "@/lib/api";

function LoginForm({ initialRole = "customer" }: { initialRole?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const impersonationToken = searchParams.get("token");

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState(initialRole);
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
        const path = role === "admin" || role === "sub-admin" ? "/admin" :
            role === "farmer" ? "/dashboard/farmer" :
                role === "vendor" ? "/dashboard/vendor" :
                    role === "subscriber" ? "/dashboard/subscriber" :
                        role === "business" ? "/dashboard/business" :
                            role === "wholesale_buyer" ? "/dashboard/wholesale" :
                                role === "retailer" ? "/dashboard/retailer" :
                                    "/dashboard/consumer";
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
            if (res?.error) throw new Error(res.error);

            const session = await getSession();
            const role = (session?.user as any)?.role;
            redirectToDashboard(role);
        } catch (err: any) {
            setError(err.message || "Entrance denied.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(getApiUrl("/auth/signup"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await signIn("credentials", { redirect: false, email: form.email, password: form.password });
            const session = await getSession();
            const userRole = (session?.user as any)?.role || role;
            redirectToDashboard(userRole);
        } catch (err: any) {
            setError(err.message);
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
        <div className="min-h-screen flex">
            {/* Branding Panel */}
            <div className="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-80 h-80 bg-secondary rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-60 h-60 bg-white rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Leaf size={24} />
                        </div>
                        <span className="text-2xl font-black font-serif text-white tracking-tighter">KIDO FARMS</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <h1 className="text-7xl font-black font-serif text-white uppercase leading-none tracking-tighter">
                        Feed <br /> The <span className="text-secondary italic">Sovereign</span> <br /> Future
                    </h1>
                    <p className="text-white/60 max-w-md text-lg font-medium leading-relaxed">
                        Access our bio-digital nexus connecting local producers to the global table.
                    </p>
                </div>

                <div className="relative z-10 flex gap-12 text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <span>V5.0 NEURAL CORE</span>
                    <span>SECURE NODE: {form.email ? form.email.split('@')[0].toUpperCase() : 'ANON'}</span>
                </div>
            </div>

            {/* Auth Form Panel */}
            <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-20">
                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setMode("login")}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${mode === 'login' ? 'text-primary border-secondary' : 'text-gray-300 border-transparent'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setMode("signup")}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${mode === 'signup' ? 'text-primary border-secondary' : 'text-gray-300 border-transparent'}`}
                            >
                                SignUp
                            </button>
                        </div>
                        <h2 className="text-4xl font-black font-serif text-primary uppercase tracking-tighter italic">
                            {mode === 'login' ? 'Welcome Back' : 'Join The Nexus'}
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                            <ShieldAlert size={20} />
                            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Identity</label>
                                <input
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registry Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@email.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-[3.2rem] text-gray-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'Authorize Access' : 'Register Core'}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-gray-100 space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 text-center">Protocol Access Levels</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['farmer', 'vendor', 'subscriber', 'customer'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => handleRoleSelect(r)}
                                    className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-secondary border-secondary text-primary' : 'bg-transparent border-gray-100 text-gray-400 hover:border-secondary'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
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
