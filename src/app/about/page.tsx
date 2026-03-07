import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32">
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop"
                                    alt="Farmer in the field"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <span className="text-secondary font-bold uppercase tracking-widest text-sm">Founded 2020</span>
                                    <h1 className="text-6xl font-bold font-serif leading-tight text-primary">Born From <br /><span className="italic">Passion & Purpose</span></h1>
                                </div>
                                <p className="text-lg text-primary/70 leading-relaxed">
                                    Kido Farms & Orchard was founded in 2020 with a bold vision — connecting Nigeria's most talented farmers directly with consumers through technology. What started as a single orchard has grown into the Kido Farms Network, one of Nigeria's most trusted farm-to-table platforms.
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-8">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold font-serif text-secondary">100%</h3>
                                        <p className="text-sm font-bold uppercase text-primary/40 tracking-wider">Organic Grown</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold font-serif text-secondary">Since '20</h3>
                                        <p className="text-sm font-bold uppercase text-primary/40 tracking-wider">Built in Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-cream">
                    <div className="container mx-auto px-6 text-center space-y-20">
                        <div className="max-w-2xl mx-auto space-y-4">
                            <h2 className="text-4xl font-bold font-serif text-primary">Our Mission & Vision</h2>
                            <p className="text-primary/60">Rooted in history, growing for the future. We believe in food that heals the body and respects the land.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Farmer Empowerment", desc: "Equipping Nigerian farmers with technology, market access, and fair pricing to grow their businesses." },
                                { title: "Tech Innovation", desc: "Leveraging modern greenhouse technology, hydroponics, and smart logistics to deliver freshness at scale." },
                                { title: "Community Access", desc: "Making premium, organic farm produce affordable and accessible to every household across Nigeria." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-12 rounded-[2rem] shadow-sm border border-primary/5 hover:shadow-xl transition-all">
                                    <h3 className="text-2xl font-bold font-serif text-primary mb-4">{item.title}</h3>
                                    <p className="text-primary/70">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
