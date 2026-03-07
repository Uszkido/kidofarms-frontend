import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32">
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h1 className="text-6xl font-bold font-serif text-primary">Get in <span className="text-secondary italic">Touch</span></h1>
                                    <p className="text-lg text-primary/70 max-w-md">
                                        Have questions about our harvest or want to visit the orchard? We'd love to hear from you.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-sm">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Farm Location</p>
                                            <p className="text-primary/60">Kido Farms Hub, Jos, Plateau State, Nigeria</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-sm">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Phone Number</p>
                                            <p className="text-primary/60">+234 801 234 5678</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-sm">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Email Address</p>
                                            <p className="text-primary/60">hello@kidofarms.com</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 space-y-4">
                                    <p className="font-bold uppercase text-[12px] tracking-widest text-primary/40">Follow our journey</p>
                                    <div className="flex gap-4">
                                        {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                            <button key={i} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                                <Icon size={18} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-12 rounded-[3rem] shadow-2xl border border-primary/5">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/40">First Name</label>
                                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/40">Last Name</label>
                                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none" placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-primary/40">Email Address</label>
                                        <input type="email" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-primary/40">Your Message</label>
                                        <textarea className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none h-40" placeholder="How can we help you?"></textarea>
                                    </div>
                                    <button className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-lg">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Placeholder for Map */}
                <section className="h-[400px] bg-cream/50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <MapPin size={48} className="mx-auto text-secondary" />
                            <p className="font-serif text-xl font-bold">Find us in Jos, Plateau State</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
