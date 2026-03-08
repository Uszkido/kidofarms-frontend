import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2, Scaling, Gavel, Scale, Info } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <Header />
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="mb-16">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                            <Scale className="text-blue-500" size={40} />
                        </div>
                        <h1 className="text-6xl font-black font-serif uppercase tracking-tighter">Terms of <span className="text-blue-500 italic">Service</span></h1>
                        <p className="text-primary/40 font-medium text-lg mt-4">Last Updated: March 7, 2026</p>
                    </div>

                    <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-primary/5 shadow-sm space-y-12 text-primary/70 leading-relaxed font-medium">
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <Gavel className="text-blue-500" size={24} /> 1. Acceptance
                            </h2>
                            <p>By accessing Kido Farms Network, you agree to be bound by these terms. Our marketplace connects you with fresh local harvests, and use of our platform constitutes agreement to our commerce policies.</p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <Scaling className="text-blue-500" size={24} /> 2. Marketplace Use
                            </h2>
                            <p>Users must provide accurate information for delivery. Subscription to the "Farm Basket" program is subject to admin approval to ensure delivery capacity is maintained for all network members.</p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <Info className="text-blue-500" size={24} /> 3. Quality Guarantee
                            </h2>
                            <p>We strive for premium quality in every harvest. If a product does not meet our freshness standards upon delivery, users may request a credit or replacement within 24 hours of receipt.</p>
                        </section>

                        <div className="pt-12 border-t border-primary/5 italic text-sm">
                            Kido Farms Network remains a community-first platform for sustainable agriculture.
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
