import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Leaf, ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-stretch">
                        {/* Branding Sidebar */}
                        <div className="bg-primary p-16 rounded-[4rem] text-white space-y-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-[10px]">
                                    <Leaf size={14} /> Join the Network
                                </div>
                                <h2 className="text-6xl font-bold font-serif leading-tight">Empowering <br /><span className="text-secondary italic">Farm Innovation</span></h2>
                                <p className="text-cream/60 leading-relaxed text-lg">
                                    Log in to access your farmer dashboard, manage your subscriptions, or track your fresh harvest deliveries.
                                </p>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <p className="text-sm font-bold uppercase tracking-widest opacity-30">Our Ecosystem</p>
                                <div className="flex gap-4">
                                    {["Farmers", "Wholesalers", "Customers", "Community"].map(tag => (
                                        <span key={tag} className="text-xs font-bold border border-white/10 px-4 py-2 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Login Form */}
                        <div className="glass p-16 rounded-[4rem] border border-primary/5 shadow-xl space-y-10 bg-white/40">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold font-serif">Welcome Back</h1>
                                <p className="text-primary/40 font-medium">Please enter your credentials to continue</p>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 block ml-4 text-left">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-white px-8 py-5 rounded-full border border-primary/5 outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 block text-left">Password</label>
                                        <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">Forgot Password?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white px-8 py-5 rounded-full border border-primary/5 outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm font-medium"
                                    />
                                </div>

                                <button className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                    Log In
                                    <ArrowRight size={22} />
                                </button>
                            </form>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/5"></div></div>
                                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-primary/20"><span className="bg-cream/0 px-4">Or continue with</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-4 rounded-full border border-primary/5 bg-white hover:bg-secondary/10 transition-all">
                                    <div className="w-5 h-5 bg-red-500 rounded-full" />
                                    <span className="font-bold text-sm">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 rounded-full border border-primary/5 bg-white hover:bg-secondary/10 transition-all">
                                    <Github size={20} />
                                    <span className="font-bold text-sm">Github</span>
                                </button>
                            </div>

                            <p className="text-center text-sm font-medium text-primary/40">
                                Don't have an account? <Link href="#" className="text-secondary font-bold hover:text-primary transition-colors">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
