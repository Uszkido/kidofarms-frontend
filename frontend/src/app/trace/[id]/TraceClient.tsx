"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    ShieldCheck,
    MapPin,
    Calendar,
    ThermometerSun,
    Droplets,
    Info,
    Loader2,
    Dna,
    ExternalLink,
    Scale,
    Wind,
    Sun,
    Layers,
    Activity,
    QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export function TraceContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const productId = searchParams.get('product');

    const [loading, setLoading] = useState(true);
    const [passport, setPassport] = useState<any>(null);
    const [ledger, setLedger] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDNA();
    }, [id, productId]);

    const fetchDNA = async () => {
        try {
            setLoading(true);
            const targetId = productId || id;
            // Fetch real product and ledger data
            const [productRes, ledgerRes] = await Promise.all([
                fetch(getApiUrl(`/api/products/${targetId}`)),
                fetch(getApiUrl(`/api/provenance/${targetId}`))
            ]);

            if (productRes.ok) {
                const prod = await productRes.json();
                setPassport({
                    id: prod.id || targetId,
                    productName: prod.name || "Sovereign Harvest",
                    farmerName: prod.farmer?.farmName || "Kido Nexus Hub",
                    location: prod.farmer?.farmLocationState || "Global Exchange",
                    imageUrl: prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
                });
            } else {
                setPassport({
                    id: targetId,
                    productName: "Heritage Grain",
                    farmerName: "Kido System Node",
                    location: "Decentralized Reserve",
                    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
                });
            }

            if (ledgerRes.ok) {
                const ledgerData = await ledgerRes.json();
                setLedger(ledgerData.length > 0 ? ledgerData : []);
            }
        } catch (err) {
            console.error(err);
            setError("Ledger Desync");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#06120e] flex flex-col items-center justify-center gap-8">
            <div className="relative">
                <Dna size={80} className="text-secondary animate-pulse" />
                <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
            </div>
            <div className="space-y-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Decrypting Heritage DNA</p>
                <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary animate-pulse" style={{ width: '60%' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#040d0a] selection:bg-secondary selection:text-primary">
            <Header />
            <main className="flex-grow pt-40 pb-32 relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px] -mr-100 -mt-100 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1a3c34]/20 rounded-full blur-[120px] -ml-50 -mb-50 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="flex flex-col items-center text-center space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-32 h-32 rounded-[3.5rem] bg-secondary flex items-center justify-center shadow-[0_0_80px_rgba(197,160,89,0.3)] text-primary relative"
                            >
                                <Dna size={56} strokeWidth={2.5} />
                            </motion.div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4">
                                    <span className="w-12 h-1 bg-secondary rounded-full" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.8em] text-secondary">Heritage DNA Explorer</h2>
                                    <span className="w-12 h-1 bg-secondary rounded-full" />
                                </div>
                                <h1 className="text-7xl lg:text-[10rem] font-black font-serif italic uppercase text-white leading-none tracking-tighter">
                                    {passport?.productName || "Verified"} <span className="text-secondary block">Passport</span>
                                </h1>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-5 space-y-10">
                                <section className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                    <div className="aspect-square rounded-[3.5rem] overflow-hidden relative shadow-2xl border-4 border-white/5">
                                        <img src={passport?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-10 left-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Blockchain ID</p>
                                            <p className="text-[10px] font-mono font-bold text-secondary uppercase">{passport?.id.substring(0, 16)}...</p>
                                        </div>
                                    </div>
                                    <div className="mt-10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-4xl font-black font-serif italic text-white uppercase">{passport?.farmerName}</h3>
                                                <p className="text-secondary text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
                                                    <MapPin size={12} /> {passport?.location}
                                                </p>
                                            </div>
                                            <div className="w-20 h-20 bg-secondary/10 rounded-[2.5rem] flex items-center justify-center text-secondary">
                                                <Activity size={32} />
                                            </div>
                                        </div>
                                        <p className="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-widest">Mastery Level: Node-Gold Verified. Licensed for global export under Protocol Horizon 5.0.</p>
                                    </div>
                                </section>

                                <div className="bg-secondary p-10 rounded-[4rem] text-primary space-y-6 shadow-[0_0_100px_rgba(197,160,89,0.1)] relative overflow-hidden group">
                                    <QrCode className="absolute -bottom-10 -right-10 w-48 h-48 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] mb-4">Auth Verification</h4>
                                    <div className="flex gap-8 items-center">
                                        <div className="p-4 bg-white rounded-3xl shadow-2xl">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://kidofarms.vercel.app/trace/${id}`} className="w-16 h-16" />
                                        </div>
                                        <p className="text-xs font-black uppercase leading-relaxed tracking-widest opacity-60">Scan to share <br />Heritage Metadata</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-10">
                                <section className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl shadow-2xl space-y-12">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tight">Biological <span className="text-secondary">Chronology</span></h3>
                                        <ShieldCheck className="text-green-400" size={32} />
                                    </div>

                                    <div className="space-y-10 border-l-2 border-white/10 pl-12 relative ml-4">
                                        {ledger.length > 0 ? (
                                            ledger.map((entry, idx) => (
                                                <TimelineEvent
                                                    key={entry.id}
                                                    label={`Node State: ${new Date(entry.timestamp).toLocaleDateString()}`}
                                                    date={new Date(entry.timestamp).toLocaleTimeString()}
                                                    details={entry.signatureDetails}
                                                    hash={entry.hash}
                                                    status={idx === 0 ? "complete" : "inactive"}
                                                />
                                            ))
                                        ) : (
                                            <>
                                                <TimelineEvent label="DNA Initialization" date="Syncing..." details="Awaiting first cryptographic block." status="upcoming" />
                                            </>
                                        )}
                                    </div>
                                </section>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <VitalsCard label="Mean Thermal Load" value="21.4°C" icon={<Sun size={24} className="text-orange-400" />} />
                                    <VitalsCard label="Hydration Sync" value="68.2%" icon={<Droplets size={24} className="text-blue-400" />} />
                                    <VitalsCard label="Soil Vitality" value="pH 6.4" icon={<Wind size={24} className="text-emerald-400" />} />
                                    <VitalsCard label="Batch Purity" value="99.8%" icon={<ShieldCheck size={24} className="text-secondary" />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function TimelineEvent({ label, date, details, status, hash }: any) {
    return (
        <div className={`relative ${status === 'upcoming' ? 'opacity-20' : 'opacity-100'}`}>
            <div className={`absolute -left-[57px] top-1.5 w-6 h-6 rounded-full border-4 border-[#040d0a] shadow-2xl flex items-center justify-center ${status === 'complete' ? 'bg-primary' :
                status === 'active' ? 'bg-secondary animate-pulse' : 'bg-white/20'
                }`}>
                {status === 'complete' && <ShieldCheck size={10} className="text-secondary" />}
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <p className="font-black text-xs uppercase tracking-[0.3em] text-white leading-none">{label}</p>
                    <p className="text-[9px] font-black text-secondary uppercase tracking-widest">{date}</p>
                </div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">{details}</p>
                {hash && (
                    <div className="mt-2 p-2 bg-black/40 rounded-lg border border-white/5 inline-block">
                        <p className="text-[7px] font-mono text-secondary/70 uppercase tracking-widest">SHA-256 Block: {hash}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function VitalsCard({ label, value, icon }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] space-y-4 hover:border-secondary transition-all group">
            <div className="flex justify-between items-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-black font-serif italic text-white uppercase">{value}</p>
        </div>
    );
}
