"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function LoginPage({ initialRole = "customer" }: { initialRole?: string }) {
    const router = useRouter();
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

            const redirectPath = role === "admin" ? "/admin" :
                role === "farmer" ? "/dashboard/farmer" :
                    role === "vendor" ? "/dashboard/vendor" :
                        role === "subscriber" ? "/dashboard/subscriber" :
                            role === "business" ? "/dashboard/business" :
                                role === "distributor" ? "/dashboard/distributor" :
                                    role === "retailer" ? "/dashboard/retailer" :
                                        role === "wholesale_buyer" ? "/dashboard/wholesaler" :
                                            role === "team_member" ? "/dashboard/team" :
                                                role === "affiliate" ? "/dashboard/affiliate" :
                                                    "/dashboard/consumer";

            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
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
            // Auto login after signup
            await signIn("credentials", { redirect: false, email: form.email, password: form.password });

            // Redirect based on role
            const redirectPath = role === "farmer" ? "/dashboard/farmer" :
                role === "vendor" ? "/dashboard/vendor" :
                    role === "subscriber" ? "/dashboard/subscriber" :
                        role === "business" ? "/dashboard/business" :
                            role === "distributor" ? "/dashboard/distributor" :
                                role === "retailer" ? "/dashboard/retailer" :
                                    role === "wholesale_buyer" ? "/dashboard/wholesaler" :
                                        role === "team_member" ? "/dashboard/team" :
                                            role === "affiliate" ? "/dashboard/affiliate" :
                                                "/dashboard/consumer";
            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-80 h-80 bg-secondary rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-60 h-60 bg-white rounded-full blur-[100px]" />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 z-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                        <Image src="/logo.svg" alt="Kido Farms" fill className="p-2 object-contain" />
                    </div>
                    <div>
                        <p className="text-white font-black text-xl tracking-tighter uppercase leading-none">Kido Farms</p>
                        <p className="text-secondary text-[9px] font-black uppercase tracking-[0.4em]">Network</p>
                    </div>
                </Link>

                {/* Center Quote */}
                <div className="space-y-8 z-10">
                    <div className="w-16 h-1 bg-secondary rounded-full" />
                    <h2 className="text-5xl font-black font-serif text-white leading-tight">
                        Farm Fresh. <br />
                        <span className="text-secondary italic">Delivered.</span>
                    </h2>
                    <p className="text-cream/40 text-lg leading-relaxed max-w-sm font-medium">
                        Kido Farms & Orchard was founded in 2020 by <span className="text-secondary font-bold">Usama Ado Shehu</span> with a bold vision — connecting Nigeria's most talented farmers directly with consumers through technology.
                    </p>
                    <div className="flex items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10">
                        <Leaf className="text-secondary shrink-0" size={28} />
                        <div>
                            <p className="text-white font-black text-sm">100% Organic Verified</p>
                            <p className="text-cream/40 text-xs font-medium">Every product, every farm, every harvest.</p>
                        </div>
                    </div>
                </div>

                <p className="text-cream/20 text-xs z-10">© {new Date().getFullYear()} Kido Farms & Orchard. Founded 2020. Jos, Nigeria.</p>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-neutral-50">
                <div className="w-full max-w-md space-y-10">

                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg">
                            <Image src="/logo.svg" alt="Kido Farms" fill className="p-1.5 object-contain" />
                        </div>
                        <span className="font-black text-lg uppercase text-primary">Kido Farms</span>
                    </Link>

                    {/* Tab Switch */}
                    <div className="bg-white rounded-2xl p-1.5 flex shadow-sm border border-primary/5">
                        {(["login", "signup"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(""); }}
                                className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === m ? "bg-primary text-white shadow-lg" : "text-primary/40 hover:text-primary"
                                    }`}
                            >
                                {m === "login" ? "Sign In" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black font-serif text-primary leading-tight">
                            {mode === "login" ? "Welcome back" : "Join Kido Farms"}
                        </h1>
                        <p className="text-primary/40 font-medium text-base">
                            {mode === "login"
                                ? "Sign in to your account to continue shopping."
                                : "Create your free account and start shopping fresh."}
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-5">
                        {mode === "signup" && (
                            <>
                                {initialRole === "customer" && (
                                    <div className="space-y-4 mb-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Register As</label>
                                        <div className="flex gap-3">
                                            {[
                                                { id: "customer", label: "Shopper", icon: "🛒" },
                                                { id: "farmer", label: "Farmer", icon: "👨‍🌾" },
                                                { id: "vendor", label: "Vendor", icon: "🏪" },
                                                { id: "subscriber", label: "Subscriber", icon: "📦" }
                                            ].map((r) => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(r.id)}
                                                    className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 shadow-sm ${role === r.id ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/5 scale-105" : "border-primary/5 bg-white hover:border-primary/10 hover:shadow-md"
                                                        }`}
                                                >
                                                    <span className="text-3xl filter grayscale-[0.5] group-hover:grayscale-0">{r.icon}</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${role === r.id ? "text-primary" : "text-primary/30"}`}>{r.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Full Name</label>
                                    <input
                                        name="name" type="text" required value={form.name} onChange={handleChange}
                                        placeholder="e.g. Aminu Musa"
                                        className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Phone Number</label>
                                    <input
                                        name="phone" type="tel" value={form.phone} onChange={handleChange}
                                        placeholder="+234 801 234 5678"
                                        className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Email Address</label>
                            <input
                                name="email" type="email" required value={form.email} onChange={handleChange}
                                placeholder="yourname@email.com"
                                className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Password</label>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? "text" : "password"} required value={form.password} onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 pr-14 text-primary font-medium focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all shadow-sm"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {mode === "login" && (
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 size={20} className="animate-spin" />}
                            {loading ? "Please wait..." : mode === "login" ? "Sign In to Kido Farms" : "Create My Account"}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-4">
                            <div className="flex-1 h-px bg-primary/10" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/20">or continue with</span>
                            <div className="flex-1 h-px bg-primary/10" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full bg-white border-2 border-primary/10 py-4 rounded-2xl font-black text-sm text-primary hover:border-secondary/50 transition-all flex items-center justify-center gap-3 shadow-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="text-center text-xs text-primary/30 font-medium">
                        By continuing you agree to our{" "}
                        <Link href="/terms" className="text-secondary hover:underline font-black">Terms</Link>{" "}
                        &{" "}
                        <Link href="/privacy" className="text-secondary hover:underline font-black">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
