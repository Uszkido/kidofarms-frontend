"use client";

export const dynamic = 'force-dynamic';

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
                // NextAuth returns "CredentialsSignin" for auth fails
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

            // Redirect to OTP verification
            router.push(`/verify-account?email=${encodeURIComponent(form.email)}`);
        } catch (err: any) {
            if (err.message?.includes("fetch") || err.name === "TypeError") {
                setError("Cannot reach server. Please check your connection and try again.");
            } else {
                setError(err.message || "Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const triggerGoogleModal = () => setShowGoogleRoleModal(true);

    const executeGoogleLogin = async () => {
        setLoading(true);
        setShowGoogleRoleModal(false);
        try {
            // Drop a cookie that NextAuth can read server-side during the callback
            document.cookie = `pending_social_role=${selectedGoogleRole}; path=/;`;
            await signIn("google", { callbackUrl: "/dashboard/consumer" }); // Redirection is handled locally next
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
                                type="button"
                                onClick={() => setMode("login")}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${mode === 'login' ? 'text-primary border-secondary' : 'text-gray-300 border-transparent'}`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("signup")}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${mode === 'signup' ? 'text-primary border-secondary' : 'text-gray-300 border-transparent'}`}
                            >
                                SignUp
                            </button>
                        </div>
                        <h2 className="text-4xl font-black font-serif text-primary uppercase tracking-tighter italic">
                            {mode === 'login' ? 'Welcome Back' : 'Join Kido Farms'}
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
                            {mode === 'login' && (
                                <div className="flex justify-end mt-2">
                                    <Link href="/forgot-password" id="forgot-password" className="text-[9px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                                        Forgot Security Key?
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'Authorize Access' : 'Register Core'}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 italic" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-[9px] font-black uppercase tracking-widest text-gray-300">Or Mesh With Social</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={triggerGoogleModal}
                            className="w-full bg-white border border-gray-100 text-primary py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-gray-50 hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.48,10.92V14.51h6.64a5.67,5.67,0,0,1-2.47,3.72l3.05,2.37a10.42,10.42,0,0,0,3.3-8.68,10.87,10.87,0,0,0-.17-1.12H12.48Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#FBBC05" d="M12.48,23.97a10.74,10.74,0,0,0,7.38-2.69l-3.05-2.37a6.76,6.76,0,0,1-4.33,1.3A6.87,6.87,0,0,1,6,15.68l-3.15,2.44A11.13,11.13,0,0,0,12.48,23.97Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#34A853" d="M6,15.68A7.3,7.3,0,0,1,5.67,12,7.3,7.3,0,0,1,6,8.32L2.85,5.88A11.12,11.12,0,0,0,1.48,12a11.12,11.12,0,0,0,1.37,6.12L6,15.68Z" transform="translate(-0.48 -0.05)" />
                                <path fill="#4285F4" d="M12.48,3.53a5.94,5.94,0,0,1,4.2,1.65l3.14-3.14A10.8,10.8,0,0,0,12.48.05a11.13,11.13,0,0,0-9.63,5.83L6,8.32A6.87,6.87,0,0,1,12.48,3.53Z" transform="translate(-0.48 -0.05)" />
                            </svg>
                            Continue with Google
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

            {/* Google Role Selection Modal */}
            {showGoogleRoleModal && (
                <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6 shadow-2xl relative">
                        <button onClick={() => setShowGoogleRoleModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary transition-all">
                            <X size={20} />
                        </button>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black font-serif text-primary">SELECT ROLE</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Choose your network node before entering</p>
                        </div>
                        <div className="space-y-3">
                            {['customer', 'farmer', 'vendor', 'carrier', 'affiliate'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setSelectedGoogleRole(r)}
                                    className={`w-full py-4 px-6 rounded-2xl border-2 text-left flex justify-between items-center transition-all ${selectedGoogleRole === r ? 'border-secondary bg-secondary/10' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">{r}</span>
                                    {selectedGoogleRole === r && <div className="w-3 h-3 rounded-full bg-secondary" />}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={executeGoogleLogin}
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 hover:bg-secondary hover:text-primary transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Continue with Google"}
                        </button>
                    </div>
                </div>
            )}
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
