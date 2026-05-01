"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Map,
    MapPin,
    Leaf,
    Sprout,
    Droplets,
    Bird,
    Activity,
    HeartPulse,
    Scale
} from "lucide-react";

import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function PoultryGISDashboard() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"gis" | "poultry">("gis");
    const [gisData, setGisData] = useState<any[]>([]);
    const [poultryData, setPoultryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = (session?.user as any)?.id || "demo-farmer-id";
                const [gisRes, poultryRes] = await Promise.all([
                    fetch(getApiUrl(`/api/gis?userId=${userId}`)),
                    fetch(getApiUrl(`/api/poultry?userId=${userId}`))
                ]);

                if (gisRes.ok) setGisData(await gisRes.json());
                if (poultryRes.ok) setPoultryData(await poultryRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

    return (
        <div className="min-h-screen p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-[#C5A059] bg-clip-text text-transparent">
                            Precision Farming
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">
                            Manage your GIS Land Plots and Poultry Batches with real-time analytics.
                        </p>
                    </div>

                    <div className="flex bg-[#1a2d24]/50 border border-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab("gis")}
                            className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${activeTab === 'gis' ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Map className="w-5 h-5" /> GIS Plots
                        </button>
                        <button
                            onClick={() => setActiveTab("poultry")}
                            className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${activeTab === 'poultry' ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Bird className="w-5 h-5" /> Poultry Tracker
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {activeTab === "gis" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-[#0e1d16] border border-[#1a3c34] rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595804576182-1dd56f7ef57a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d16] via-[#0e1d16]/80 to-transparent" />

                                <div className="relative z-10 h-[400px] flex flex-col justify-end">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-[#C5A059]/20 rounded-xl backdrop-blur-md">
                                            <MapPin className="w-8 h-8 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Live Satellite View</h3>
                                            <p className="text-green-400 font-medium">Synced 2 mins ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading && <div className="text-center py-10 text-primary italic">Loading telemetry...</div>}
                                {!loading && gisData.map((plot, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={plot.id}
                                        className="bg-[#0e1d16] border border-[#1a3c34] rounded-2xl p-5 hover:border-[#C5A059] transition-colors cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-semibold text-lg text-white">{plot.name}</h4>
                                                <span className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> {plot.acreage} Acres
                                                </span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                                                {plot.health}% Health
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-300">
                                            <div className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-[#C5A059]" /> {plot.crop}</div>
                                            <div className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-blue-400" /> Optimal</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {loading && <div className="text-center py-10 text-primary italic col-span-2">Loading batch data...</div>}
                            {!loading && poultryData.map((batch, i) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={batch.id}
                                    className="bg-[#0e1d16] border border-[#1a3c34] rounded-3xl p-8 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Bird className="w-64 h-64 text-white" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="px-4 py-1.5 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-sm font-bold border border-[#C5A059]/30 inline-block mb-3">
                                                    Active Batch
                                                </div>
                                                <h3 className="text-3xl font-bold text-white">{batch.batch}</h3>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1a2d24]/50 border border-white/5 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                    <Activity className="w-5 h-5 text-green-400" /> Total Count
                                                </div>
                                                <div className="text-3xl font-bold text-white">{batch.count.toLocaleString()}</div>
                                            </div>

                                            <div className="bg-[#1a2d24]/50 border border-white/5 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                    <Sprout className="w-5 h-5 text-blue-400" /> Current Age
                                                </div>
                                                <div className="text-3xl font-bold text-white">{batch.age}</div>
                                            </div>

                                            <div className="bg-[#1a2d24]/50 border border-white/5 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                    <HeartPulse className="w-5 h-5 text-red-400" /> Mortality
                                                </div>
                                                <div className="text-3xl font-bold font-mono text-white">{batch.mortality}</div>
                                            </div>

                                            <div className="bg-[#1a2d24]/50 border border-white/5 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                    <Scale className="w-5 h-5 text-yellow-400" /> Avg Weight
                                                </div>
                                                <div className="text-3xl font-bold font-mono text-white">{batch.avgWeight}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}
