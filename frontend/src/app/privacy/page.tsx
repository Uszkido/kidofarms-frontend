import Link from "next/link";
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="mb-16">
                        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6">
                            <Shield className="text-secondary" size={40} />
                        </div>
                        <h1 className="text-6xl font-black font-serif uppercase tracking-tighter">Privacy <span className="text-secondary italic">Policy</span></h1>
                        <p className="text-primary/40 font-medium text-lg mt-4">Last Updated: March 7, 2026</p>
                    </div>

                    <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-primary/5 shadow-sm space-y-12 text-primary/70 leading-relaxed font-medium">
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <Lock className="text-secondary" size={24} /> 1. Data Collection
                            </h2>
                            <p>At Kido Farms, we respect your privacy. We collect information you provide directly to us when you create an account, place an order, or subscribe to our "Farm Basket" program. This includes your name, email address, phone number, and delivery address.</p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <Eye className="text-secondary" size={24} /> 2. Use of Information
                            </h2>
                            <p>We use the information we collect to process your harvests, organize local deliveries, and communicate updates about our farm operations. We never sell your personal data to third parties.</p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black font-serif text-primary uppercase flex items-center gap-4">
                                <FileText className="text-secondary" size={24} /> 3. Data Security
                            </h2>
                            <p>We implement industry-standard security measures to protect your information. Our payment processing is handled by secure third-party providers (Stripe/Transfer), ensuring your financial details are never stored on our local farm servers.</p>
                        </section>

                        <div className="pt-12 border-t border-primary/5 italic text-sm">
                            If you have questions about our privacy practices, please contact us at <span className="text-secondary font-bold">privacy@kidofarms.com</span>.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
