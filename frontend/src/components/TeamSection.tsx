"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Linkedin, Twitter } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function TeamSection() {
    const [team, setTeam] = useState<any[]>([]);

    useEffect(() => {
        fetch(getApiUrl("/api/team"))
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTeam(data);
                } else {
                    setTeam([]);
                }
            })
            .catch(err => {
                console.error(err);
                setTeam([]);
            });
    }, []);


    if (team.length === 0) return null;

    return (
        <section className="py-24 bg-neutral-900 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20 space-y-6">
                    <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">The Minds Behind Kido</span>
                    <h2 className="text-5xl md:text-8xl font-black font-serif text-white uppercase tracking-tighter">
                        Our <span className="text-secondary italic">Core Team</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {team.map((member: any) => (
                        <div key={member.id} className="group text-center">
                            <div className="relative w-48 h-48 mx-auto mb-8 rounded-[3rem] overflow-hidden border-2 border-white/5 group-hover:border-secondary transition-colors">
                                <Image
                                    src={member.image ? (member.image.startsWith('http') ? member.image : getApiUrl(member.image).replace('/api/', '/')) : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1a1a&color=facc15&size=512`}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />

                                <div className="absolute inset-x-0 bottom-0 py-4 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform flex justify-center gap-4">
                                    <Linkedin size={18} className="text-primary cursor-pointer hover:scale-110" />
                                    <Twitter size={18} className="text-primary cursor-pointer hover:scale-110" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                            <p className="text-secondary font-black uppercase text-[10px] tracking-widest mb-4">{member.role}</p>
                            <p className="text-white/40 text-sm leading-relaxed max-w-[200px] mx-auto">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
