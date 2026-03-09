"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Leaf, ShieldCheck, Truck } from "lucide-react";

interface HeroData {
    badge: string;
    title: string;
    titleItalic: string;
    subtitle: string;
    btn1Text: string;
    btn1Link: string;
    btn2Text: string;
    btn2Link: string;
}

export default function PremiumHero({ data }: { data: HeroData }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: "easeOut"
            }
        })
    };

    return (
        <section ref={containerRef} className="relative h-[100vh] flex items-center overflow-hidden bg-neutral-50 px-6 lg:px-12">
            {/* Background Decorative Elements */}
            <motion.div style={{ y: y1, opacity }} className="absolute top-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
            <motion.div style={{ y: y2, opacity }} className="absolute bottom-20 left-20 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[140px]" />

            {/* Floating Organic Assets (Parallax) */}
            <motion.div
                style={{ y: y2, rotate }}
                className="absolute top-1/4 right-[10%] hidden lg:block"
            >
                <div className="w-24 h-24 bg-white p-4 rounded-3xl shadow-2xl border border-primary/5 -rotate-12">
                    <Image src="https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=400&auto=format&fit=crop" alt="Organic" width={80} height={80} className="rounded-2xl object-cover h-full" />
                </div>
            </motion.div>

            <motion.div
                style={{ y: y1, rotate: -rotate as any }}
                className="absolute bottom-1/4 left-[5%] hidden lg:block"
            >
                <div className="w-32 h-32 bg-white p-5 rounded-[2.5rem] shadow-2xl border border-primary/5 rotate-12">
                    <Image src="https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=400&auto=format&fit=crop" alt="Fresh" width={100} height={100} className="rounded-3xl object-cover h-full" />
                </div>
            </motion.div>

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl space-y-12">
                    {/* Badge */}
                    <motion.div
                        initial="hidden" animate="visible" custom={0} variants={fadeInUp}
                        className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-primary/5"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center overflow-hidden">
                                    <Star size={10} className="text-secondary fill-secondary" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{data.badge}</span>
                    </motion.div>

                    {/* Title */}
                    <div className="space-y-4">
                        <motion.h1
                            initial="hidden" animate="visible" custom={1} variants={fadeInUp}
                            className="text-7xl md:text-9xl font-black font-serif leading-[0.85] tracking-tighter text-primary"
                        >
                            {data.title}<br />
                            <span className="text-secondary italic">{data.titleItalic}</span>
                        </motion.h1>
                        <motion.p
                            initial="hidden" animate="visible" custom={2} variants={fadeInUp}
                            className="text-xl md:text-2xl text-primary/60 max-w-2xl font-medium leading-relaxed"
                        >
                            {data.subtitle}
                        </motion.p>
                    </div>

                    {/* CTAs */}
                    <motion.div
                        initial="hidden" animate="visible" custom={3} variants={fadeInUp}
                        className="flex flex-wrap gap-6"
                    >
                        <Link href={data.btn1Link} className="bg-primary text-white px-10 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl shadow-primary/20 flex items-center gap-3">
                            {data.btn1Text} <ArrowRight size={22} />
                        </Link>
                        <Link href={data.btn2Link} className="bg-white border-2 border-primary/5 text-primary px-10 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:border-secondary transition-all flex items-center gap-3">
                            {data.btn2Text}
                        </Link>
                    </motion.div>

                    {/* Value Props */}
                    <motion.div
                        initial="hidden" animate="visible" custom={4} variants={fadeInUp}
                        className="flex flex-wrap gap-12 pt-8 border-t border-primary/5"
                    >
                        {[
                            { icon: ShieldCheck, label: "100% Verified Source" },
                            { icon: Truck, label: "24h Farm-to-Table" },
                            { icon: Leaf, label: "Direct Trade Only" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors">
                                    <item.icon size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
            >
                <div className="w-px h-12 bg-primary/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/20 rotate-90 origin-left translate-x-1.5 translate-y-6">Scroll</span>
            </motion.div>
        </section>
    );
}
