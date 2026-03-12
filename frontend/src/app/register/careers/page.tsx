"use client";

import { useState } from "react";
import {
    Briefcase,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Sparkles,
    UserCircle,
    FileText,
    ShieldCheck,
    ChevronRight,
    Clock,
    Target,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CareerRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        position: "Farm Hand",
        experience: "1-3 Years",
        location: "Lagos",
        resumeLink: "",
        bio: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/auth/signup/career"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || "Application failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary uppercase italic text-center">Application Transmitted!</h1>
                        <p className="text-primary/60 font-medium leading-relaxed text-center">
                            Your professional profile has been synchronized with the Kido HR Node. Our recruitment agents will review your credentials and contact you if your skills align with our current mission.
                        </p>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                        Return Home <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto pt-20">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left Side: Branding & Info */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest">
                                    <Sparkles size={14} /> Join the Kido Mission
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black font-serif text-white tracking-tighter leading-none italic uppercase">
                                    Cultivate Your <br />
                                    <span className="text-secondary italic">Career.</span>
                                </h1>
                                <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                                    Become part of the sovereign food revolution. We are looking for passionate individuals to join our farm nodes, orchards, and logistics centers across West Africa.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {[
                                    { icon: Target, title: "Mission Driven", desc: "Work on technologies that are redefining food security." },
                                    { icon: Clock, title: "Modern Workflow", desc: "Access to the best tools and tech-driven agricultural systems." },
                                    { icon: Zap, title: "Growth Node", desc: "Rapid advancement paths for high-performing team members." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 items-start p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                            <item.icon size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black font-serif text-white uppercase italic">{item.title}</h4>
                                            <p className="text-white/40 text-sm font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden border-8 border-secondary/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />

                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                <section className="space-y-8">
                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic border-b border-primary/5 pb-4">Identity Protocol</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="Professional Full Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="career@domain.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Primary Region</label>
                                            <select
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary appearance-none"
                                            >
                                                {NIGERIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="+234..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Account Password</label>
                                            <input
                                                required
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8">
                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic border-b border-primary/5 pb-4">Professional Intel</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Position Seeking</label>
                                            <select
                                                required
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary appearance-none"
                                            >
                                                <option value="Farm Hand">Farm Hand</option>
                                                <option value="Orchard Manager">Orchard Manager</option>
                                                <option value="Logistics Operator">Logistics Operator</option>
                                                <option value="Warehouse Supervisor">Warehouse Supervisor</option>
                                                <option value="Irrigation Specialist">Irrigation Specialist</option>
                                                <option value="Quality Control Officer">Quality Control Officer</option>
                                                <option value="Fleet Dispatcher">Fleet Dispatcher</option>
                                                <option value="Inventory Clerk">Inventory Clerk</option>
                                                <option value="Security Personnel">Security Personnel</option>
                                                <option value="Sales Representative">Sales Representative</option>
                                                <option value="Social Media Manager">Social Media Manager</option>
                                                <option value="Tech Support">Tech Support / Dev</option>
                                                <option value="Administrative">Administrative</option>
                                                <option value="AI Data Trainer">AI & Neural Data Trainer</option>
                                                <option value="Soil Scientist">Soil Health Scientist</option>
                                                <option value="Export Lead">Export Compliance Lead</option>
                                                <option value="Insurance Adjuster">Agro-Insurance Adjuster</option>
                                                <option value="Bio-Gas Technician">Bio-Gas & Energy Technician</option>
                                                <option value="Course Instructor">Mastery Academy Instructor</option>
                                                <option value="Blockchain Analyst">Escrow Compliance Analyst</option>
                                                <option value="Drone Pilot">Drone Mapping Pilot</option>
                                                <option value="Sustainability Lead">Sustainability Lead</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Exp. Level</label>
                                            <select
                                                required
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary appearance-none"
                                            >
                                                <option value="Entry Level">Entry Level</option>
                                                <option value="1-3 Years">1-3 Years</option>
                                                <option value="3-5 Years">3-5 Years</option>
                                                <option value="5+ Years">5+ Years</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Professional Bio / Mission Statement</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full bg-cream/10 border border-primary/5 rounded-3xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary h-32 resize-none"
                                            placeholder="Tell us why you want to join Kido Farms..."
                                        />
                                    </div>
                                </section>

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                                        <ShieldCheck size={18} /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Upload Professional Node <ChevronRight size={18} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
