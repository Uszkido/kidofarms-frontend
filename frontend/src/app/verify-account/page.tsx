"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, ArrowRight, Activity, Mail } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import Link from "next/link";

function VerifyAccountContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== "" && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const code = otp.join("");
        if (code.length < 6) {
            setError("PROTOCOL INCOMPLETE: Full sequence required.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch(getApiUrl("/api/auth/verify-otp"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.error || "DE-SYNCHRONIZATION FAIL: Invalid sequence.");
            }
        } catch (err) {
            setError("NETWORK COLLAPSE: Failed to reach verification node.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#040d0a] flex items-center justify-center p-6 text-white font-sans">
                <div className="max-w-md w-full text-center space-y-10 animate-in zoom-in duration-500">
                    <div className="w-32 h-32 bg-secondary rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(197,160,89,0.3)]">
                        <ShieldCheck size={64} className="text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif uppercase italic tracking-tighter">Identity <span className="text-secondary">Verified</span></h1>
                        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Neural link established. Redirecting to secure login...</p>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary animate-progress" style={{ width: '100%' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center p-6 text-white font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-xl w-full bg-white/5 border border-white/10 p-12 lg:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative z-10 space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Security Protocol V5.2</h2>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black font-serif italic uppercase leading-none tracking-tighter">
                        Verify <span className="text-secondary">Signature</span>
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        A verification sequence has been dispatched to <span className="text-white">{email || "your secure link"}</span>. Enter the 6-digit code to activate your node.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-500 flex items-center gap-4 animate-shake">
                        <ShieldCheck size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-6 gap-3 lg:gap-4 text-center">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="bg-white/5 border-2 border-white/10 rounded-2xl py-6 text-3xl font-black text-secondary outline-none focus:border-secondary transition-all text-center w-full"
                            maxLength={1}
                        />
                    ))}
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || otp.join("").length < 6}
                        className="w-full bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <> <ArrowRight size={20} strokeWidth={3} /> Activate Node </>}
                    </button>

                    <div className="flex flex-col items-center gap-4 pt-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Didn't receive the sequence?</p>
                        <button className="text-secondary hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border-b border-secondary/40">Request Re-Synchronization</button>
                    </div>
                </div>

                <div className="flex items-center justify-center pt-8 border-t border-white/5">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">
                        Return to Alpha Entry
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyAccountPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#040d0a] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={64} /></div>}>
            <VerifyAccountContent />
        </Suspense>
    );
}
