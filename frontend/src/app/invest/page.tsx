import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrendingUp, ShieldCheck, PieChart, Coins, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import FadeInEntry from "@/components/FadeInEntry";

export default function InvestmentPage() {
    return (
        <div className="flex flex-col min-h-screen bg-primary">
            <Header />
            <main className="flex-grow pt-32">
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
                            <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-full border border-secondary/20 shadow-2xl">
                                Kido Invest • Agritech Portal
                            </span>
                            <h1 className="text-6xl md:text-9xl font-black font-serif text-white leading-[0.85] tracking-tighter uppercase">
                                Growth Through <br />
                                <span className="text-secondary italic">Collaboration.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-medium">
                                Join the Kido Farms ecosystem. Fund sustainable farm expansions, automate supply chains, and share in the harvest.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                            <FadeInEntry>
                                <div className="bg-neutral-900 border border-white/5 p-16 rounded-[4rem] h-full flex flex-col justify-between group hover:border-secondary transition-all">
                                    <div className="space-y-8">
                                        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-secondary/20">
                                            <TrendingUp size={40} strokeWidth={2.5} />
                                        </div>
                                        <h2 className="text-5xl font-black font-serif text-white uppercase tracking-tighter">Fund Farm Expansion</h2>
                                        <p className="text-white/40 text-lg leading-relaxed">
                                            Invest directly into verified farm clusters in Kano and Jos. Your capital funds modern irrigation, high-yield seeds, and organic certifications.
                                        </p>
                                        <ul className="space-y-4 pt-4">
                                            {[
                                                "Estimated Annual Yield: 15-22%",
                                                "Quarterly Performance Reports",
                                                "Soil-to-Market Transparency",
                                                "Principal Protection via Harvest Insurance"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-4 text-white/60 font-medium">
                                                    <CheckCircle2 size={20} className="text-secondary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button className="mt-12 bg-white text-primary w-full py-8 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-4 group/btn">
                                        Open Investment Portal <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </FadeInEntry>

                            <FadeInEntry>
                                <div className="bg-neutral-900 border border-white/5 p-16 rounded-[4rem] h-full flex flex-col justify-between group hover:border-secondary transition-all">
                                    <div className="space-y-8">
                                        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-secondary/20">
                                            <ShieldCheck size={40} strokeWidth={2.5} />
                                        </div>
                                        <h2 className="text-5xl font-black font-serif text-white uppercase tracking-tighter">Strategic Partnership</h2>
                                        <p className="text-white/40 text-lg leading-relaxed">
                                            Become a Kido Farms Institutional Partner. We provide the infrastructure for bulk off-taking, cold-chain logistics, and export-grade produce.
                                        </p>
                                        <ul className="space-y-4 pt-4">
                                            {[
                                                "Prioritized Bulk Pricing",
                                                "Direct API Access to Inventory",
                                                "Custom Logistics & Storage Solutions",
                                                "ESG & Impact Reporting Compliance"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-4 text-white/60 font-medium">
                                                    <CheckCircle2 size={20} className="text-secondary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button className="mt-12 border-2 border-white/10 text-white w-full py-8 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4 group/btn">
                                        Contact Partnership Team <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </FadeInEntry>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-secondary">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black font-serif text-primary uppercase tracking-tighter leading-none">
                                Ready to <span className="italic">Transform</span> African Agriculture?
                            </h2>
                            <p className="text-primary/70 text-xl font-medium">
                                Join our network of over 450+ investors and partners driving the bio-digital revolution.
                            </p>
                            <Link href="/register" className="inline-block bg-primary text-white px-20 py-8 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                                Get Started Today
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
