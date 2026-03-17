"use client";

import { motion } from "framer-motion";
import { Fuel, Map as MapIcon, TrendingUp, Zap, Droplets, Leaf, Activity, BarChart3 } from "lucide-react";

interface AnalyticsProps {
    drivers: any[];
    orders: any[];
}

export default function LogisticsAnalytics({ drivers, orders }: AnalyticsProps) {
    // Simulated Predictor Data
    const activeShipments = orders.filter(o => o.orderStatus === 'shipped').length;
    const totalDistanceEst = activeShipments * 145; // Simulated KM
    const fuelConsumptionEst = totalDistanceEst * 0.085; // Simulated Liters per KM
    const carbonEst = fuelConsumptionEst * 2.31; // KG of CO2

    const regions = [
        { name: "Lagos Central", density: 85, trend: "up" },
        { name: "Abuja North", density: 42, trend: "stable" },
        { name: "Kano Node", density: 67, trend: "up" },
        { name: "Port Harcourt", density: 15, trend: "down" },
    ];

    return (
        <div className="space-y-10">
            {/* 🛰️ ANALYTICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ⛽ FUEL CONSUMPTION PREDICTOR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fuel size={120} />
                    </div>

                    <div className="relative space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                                <Fuel size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Fuel Dynamics Predictor</h3>
                                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-none text-nowrap">Real-time consumption matrix based on {activeShipments} active vectors</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Estimated Consumption</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black font-serif italic text-white">{fuelConsumptionEst.toFixed(1)}</span>
                                    <span className="text-secondary font-black text-sm uppercase">Liters</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Operational Reach</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black font-serif italic text-white">{totalDistanceEst.toLocaleString()}</span>
                                    <span className="text-secondary font-black text-sm uppercase">KM</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Carbon Payload</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black font-serif italic text-white">{carbonEst.toFixed(1)}</span>
                                    <span className="text-secondary font-black text-sm uppercase">KG CO2</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Efficiency Rate</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">94.2%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "94.2%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-secondary/50 to-secondary shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 🛡️ ECO IMPACT */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-secondary p-12 rounded-[3.5rem] flex flex-col justify-between shadow-2xl shadow-secondary/20"
                >
                    <div className="space-y-6 text-primary">
                        <Leaf size={48} strokeWidth={2.5} />
                        <h3 className="text-4xl font-black font-serif italic uppercase leading-none tracking-tighter">Green <br /> Carrier <br /> Points</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none">Net Zero Offset Progress</p>
                        <p className="text-5xl font-black font-serif italic text-primary leading-none">812.5</p>
                    </div>
                </motion.div>
            </div>

            {/* 🗺️ DELIVERIES HEATMAP SIMULATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 space-y-10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <MapIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary leading-none mb-1">Regional Heatmap</h3>
                                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-none">Order density distribution by geo-zone</p>
                            </div>
                        </div>
                        <BarChart3 className="text-white/10" size={32} />
                    </div>

                    <div className="space-y-6">
                        {regions.map((region, i) => (
                            <div key={region.name} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-white">{region.name}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{region.density}% Load</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${region.density}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                        className="h-full bg-secondary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 📊 LIVE BANDWIDTH */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-950 border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
                    <div className="relative space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black font-serif italic uppercase text-white tracking-widest">Network Pulse</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Live Stream Synchronized</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: "Fleet Bandwidth", value: "Locked", icon: Zap },
                                { label: "Sensor Latency", value: "0.12ms", icon: Activity },
                                { label: "Relay Uptime", value: "99.98%", icon: Droplets }
                            ].map((stat, i) => (
                                <div key={stat.label} className="flex items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <stat.icon size={18} className="text-secondary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-white uppercase tracking-widest">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
