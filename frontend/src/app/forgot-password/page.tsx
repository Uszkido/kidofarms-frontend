"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [requiresOtp, setRequiresOtp] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(getApiUrl("/api/auth/forgot-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setRequiresOtp(data.requiresOtp);
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.error || "Failed to request reset. Please check your email.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/auth/reset-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: requiresOtp ? otp : undefined, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(3);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-cream/10 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl border border-primary/5">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black font-serif text-primary">Password Reset!</h1>
                        <p className="text-primary/60 font-medium">Your password has been successfully updated.</p>
                    </div>
                    <Link href="/login" className="inline-flex w-full justify-center items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                        Back to Login <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream/10 flex items-center justify-center p-6">
            <div className="max-w-md w-full relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-primary/5 relative">

                    <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-3xl flex items-center justify-center mb-8 transform -rotate-6">
                        <KeyRound size={28} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black font-serif text-primary leading-tight mb-4 tracking-tight">
                        Reset<br />Password.
                    </h1>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="rotate-180 shrink-0" size={16} /> {error}
                        </div>
                    )}

                    {message && step === 2 && (
                        <div className="bg-secondary/10 text-secondary p-4 rounded-xl text-xs font-bold mb-6">
                            {message}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <p className="text-sm font-medium text-primary/60">
                                Enter your email to begin the reset process. If you are a new applicant, you will receive an OTP from an Admin.
                            </p>

                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-cream/20 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary placeholder:text-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {requiresOtp && (
                                <div className="relative">
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-Digit Admin OTP"
                                        maxLength={6}
                                        className="w-full bg-cream/20 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary tracking-[0.5em] placeholder:tracking-normal placeholder:text-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="New Password"
                                    className="w-full bg-cream/20 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary placeholder:text-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm New Password"
                                    className="w-full bg-cream/20 border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary placeholder:text-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
                                {!isLoading && <CheckCircle2 size={18} />}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm font-bold text-primary/40 hover:text-secondary transition-colors">
                            Remembered your password? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
