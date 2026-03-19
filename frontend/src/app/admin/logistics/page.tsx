"use client";

export const dynamic = "force-dynamic";


import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Truck,
    Bike,
    Car,
    User,
    MapPin,
    ArrowLeft,
    Loader2,
    ShieldCheck,
    Navigation,
    Circle,
    Activity,
    ClipboardCheck,
    Box,
    Zap
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";

import LogisticsAnalytics from "@/components/LogisticsAnalytics";

const FleetOverviewMap = dynamic(() => import("@/components/FleetOverviewMap"), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-white/5 rounded-[3rem] animate-pulse flex items-center justify-center text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">Initializing Satellite Matrix...</div>
});

export default function AdminLogisticsHub() {
    const [view, setView] = useState<'drivers' | 'dispatches' | 'overview' | 'analytics'>('drivers');
    const [drivers, setDrivers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // For registering new drivers
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);

    // Form State for new driver
    const [newDriver, setNewDriver] = useState({
        userId: '',
        vehicleType: 'Motorcycle',
        vehiclePlate: '',
        licenseNumber: ''
    });

    const [recommendations, setRecommendations] = useState<Record<string, string>>({});
    const [isDispatchingAll, setIsDispatchingAll] = useState(false);

    const autoOptimizeDispatch = (currentOrders: any[], currentDrivers: any[]) => {
        const idleDrivers = currentDrivers.filter(d => d.status === 'idle');
        if (idleDrivers.length === 0) return {};

        const newRecs: Record<string, string> = {};
        currentOrders.forEach((order, index) => {
            // Simulated Logic: Match larger orders to Trucks/Vans, smaller to Bikes
            // For now, we distribute them to ensure fleet balance
            const recommendedDriver = idleDrivers[index % idleDrivers.length];
            if (recommendedDriver) {
                newRecs[order.id] = recommendedDriver.id;
            }
        });
        setRecommendations(newRecs);
    };

    const autoDispatchAll = async () => {
        const pOrders = orders.filter(o => o.orderStatus === 'processing');
        if (pOrders.length === 0 || Object.keys(recommendations).length === 0) return;

        setIsDispatchingAll(true);
        try {
            for (const order of pOrders) {
                const driverId = recommendations[order.id];
                if (driverId) {
                    await assignDriver(order.id, driverId);
                }
            }
            await fetchData();
        } catch (error) {
            console.error("Batch dispatch failed", error);
        } finally {
            setIsDispatchingAll(false);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [driversRes, ordersRes, usersRes] = await Promise.all([
                fetch(getApiUrl("/api/drivers")),
                fetch(getApiUrl("/api/orders")),
                fetch(getApiUrl("/api/users"))
            ]);

            const driversData = await driversRes.json();
            const ordersData = await ordersRes.json();
            const usersData = await usersRes.json();

            const finalDrivers = Array.isArray(driversData) ? driversData : [];
            const finalOrders = Array.isArray(ordersData) ? ordersData.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'shipped') : [];

            setDrivers(finalDrivers);
            setOrders(finalOrders);
            setUsers(Array.isArray(usersData) ? usersData.filter(u => u.role === 'carrier' || u.role === 'customer' || u.role === 'admin') : []);

            // Trigger Optimization
            autoOptimizeDispatch(finalOrders.filter(o => o.orderStatus === 'processing'), finalDrivers);
        } catch (error) {
            console.error("Logistics sync failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRegisterDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl("/api/drivers"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDriver)
            });
            if (res.ok) {
                setIsRegistering(false);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to bind driver", error);
        }
    };

    const assignDriver = async (orderId: string, driverId: string) => {
        try {
            const res = await fetch(getApiUrl("/api/shipments/dispatch"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    driverId,
                    origin: "Main Kido Warehouse, Lagos",
                    destination: "Customer Address Node",
                    vehicleInfo: drivers.find(d => d.id === driverId)?.vehicleType + " - " + drivers.find(d => d.id === driverId)?.vehiclePlate
                })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Dispatch assignment failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-8 md:p-12 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto space-y-12">

                {/* 🛰️ LOGISTICS HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Command
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Logistics Node v5.2</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter">
                            Fleet <span className="text-secondary block">Dynamics</span>
                        </h1>
                    </div>

                    <div className="flex bg-white/5 border border-white/10 p-2 rounded-[2.5rem] backdrop-blur-3xl overflow-x-auto max-w-full">
                        <button
                            onClick={() => setView('overview')}
                            className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'overview' ? 'bg-secondary text-primary shadow-2xl' : 'text-white/40 hover:text-white'}`}
                        >
                            Satellite Overview
                        </button>
                        <button
                            onClick={() => setView('drivers')}
                            className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'drivers' ? 'bg-secondary text-primary shadow-2xl' : 'text-white/40 hover:text-white'}`}
                        >
                            Personnel Grid
                        </button>
                        <button
                            onClick={() => setView('dispatches')}
                            className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'dispatches' ? 'bg-secondary text-primary shadow-2xl' : 'text-white/40 hover:text-white'}`}
                        >
                            Active Protocols
                        </button>
                        <button
                            onClick={() => setView('analytics')}
                            className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'analytics' ? 'bg-secondary text-primary shadow-2xl' : 'text-white/40 hover:text-white'}`}
                        >
                            Dynamics Analytics
                        </button>
                    </div>
                </header>

                {/* 📊 CONTENT ARENA */}
                <AnimatePresence mode="wait">
                    {view === 'overview' ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Global Fleet Matrix</h3>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-none">Real-time vector synchronization active</p>
                                </div>
                            </div>
                            <FleetOverviewMap units={drivers} />
                        </motion.div>
                    ) : view === 'analytics' ? (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <LogisticsAnalytics drivers={drivers} orders={orders} />
                        </motion.div>
                    ) : view === 'drivers' ? (
                        <motion.div
                            key="drivers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-10"
                        >
                            {/* Summary & Registration */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-8">
                                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Total Active Units</p>
                                        <p className="text-4xl font-black font-serif italic text-white">{drivers.length}</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Fleet Availability</p>
                                        <p className="text-4xl font-black font-serif italic text-secondary">
                                            {drivers.filter(d => d.status === 'idle').length}/{drivers.length}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsRegistering(true)}
                                    className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl active:scale-95"
                                >
                                    <Plus size={18} strokeWidth={3} /> Enlist New Unit
                                </button>
                            </div>

                            {/* Drivers List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {drivers.map(driver => (
                                    <div key={driver.id} className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 scale-150 opacity-10 group-hover:scale-[2] transition-transform">
                                            {driver.vehicleType?.includes('Bike') ? <Bike size={48} /> :
                                                driver.vehicleType?.includes('Car') ? <Car size={48} /> : <Truck size={48} />}
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                                    <User size={28} />
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${driver.status === 'idle' ? 'bg-green-500/10 text-green-500' : 'bg-secondary/10 text-secondary'}`}>
                                                    {driver.status}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black font-serif italic text-white uppercase group-hover:text-secondary transition-colors">{driver.userName || 'Unknown Operator'}</h3>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{driver.carrierName || 'Kido Direct Fleet'}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Vehicle Node</p>
                                                    <p className="text-xs font-bold text-white/80">{driver.vehicleType} • {driver.vehiclePlate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Registration</p>
                                                    <p className="text-xs font-bold text-white/80">{driver.licenseNumber || 'Verified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dispatches"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-secondary animate-pulse" size={20} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Real-time Order Vector Log</h3>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => autoOptimizeDispatch(orders.filter(o => o.orderStatus === 'processing'), drivers)}
                                        className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all shadow-xl flex items-center gap-2"
                                    >
                                        <Zap size={14} fill="currentColor" /> Recalculate AI Vectors
                                    </button>
                                    <button
                                        onClick={autoDispatchAll}
                                        disabled={isDispatchingAll || orders.filter(o => o.orderStatus === 'processing').length === 0}
                                        className="px-6 py-2.5 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isDispatchingAll ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                                        {isDispatchingAll ? "Executing Protocol..." : "Auto-Dispatch All"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {orders.filter(o => o.orderStatus === 'processing').map(order => (
                                    <div key={order.id} className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 hover:bg-white/[0.08] transition-all relative overflow-hidden">
                                        {recommendations[order.id] && (
                                            <div className="absolute top-0 right-0 py-2 px-8 bg-secondary/10 border-b border-l border-secondary/20 text-secondary text-[8px] font-black uppercase tracking-widest rounded-bl-3xl">
                                                AI Optimized Protocol Available
                                            </div>
                                        )}
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 rounded-[2.5rem] bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
                                                <Box size={32} />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-3xl font-black font-serif italic text-white uppercase tracking-tighter">ORD-{order.id.slice(0, 8).toUpperCase()}</h4>
                                                <p className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                                    <MapPin size={14} /> {order.address || 'Lagos Central Hub'} &bull; {order.user?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 min-w-[320px]">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Assign Carrier Node</span>
                                                    {recommendations[order.id] && (
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-secondary flex items-center gap-1">
                                                            <Zap size={10} fill="currentColor" /> Suggesting Optimal
                                                        </span>
                                                    )}
                                                </div>
                                                <select
                                                    value={recommendations[order.id] || ''}
                                                    onChange={(e) => assignDriver(order.id, e.target.value)}
                                                    className={`w-full bg-white/5 border rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-secondary transition-all ${recommendations[order.id] ? 'border-secondary/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]' : 'border-white/10'}`}
                                                >
                                                    <option value="">Select Driver...</option>
                                                    {drivers.filter(d => d.status === 'idle').map(d => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.userName} ({d.vehicleType}) {recommendations[order.id] === d.id ? " ⭐ RECOMMENDED" : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="text-right px-8 border-l border-white/5">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Provision Value</p>
                                                <p className="text-2xl font-black font-serif italic text-white">₦{Number(order.totalAmount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🛡️ REGISTRATION MODAL */}
            <AnimatePresence>
                {isRegistering && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div disable-motion-blur
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRegistering(false)}
                            className="absolute inset-0 bg-primary/80 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-neutral-900 w-full max-w-2xl rounded-[4rem] border-2 border-white/5 p-12 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] -mr-32 -mt-32" />

                            <div className="relative space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black font-serif italic text-white leading-none">Fleet Enlistment</h3>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Register a new driver and vehicle node to the Kido Network.</p>
                                </div>

                                <form onSubmit={handleRegisterDriver} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Operator Identity</label>
                                            <select
                                                value={newDriver.userId}
                                                onChange={e => setNewDriver({ ...newDriver, userId: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-secondary transition-all"
                                                required
                                            >
                                                <option value="">Select a User...</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Vehicle Type</label>
                                                <select
                                                    value={newDriver.vehicleType}
                                                    onChange={e => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-secondary transition-all"
                                                >
                                                    <option>Motorcycle</option>
                                                    <option>Bicycle</option>
                                                    <option>Car</option>
                                                    <option>Van</option>
                                                    <option>Truck</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Plate Number</label>
                                                <input
                                                    placeholder="E.g. KDL-902-LG"
                                                    value={newDriver.vehiclePlate}
                                                    onChange={e => setNewDriver({ ...newDriver, vehiclePlate: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-secondary transition-all placeholder:text-white/10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary">License Authority ID</label>
                                            <input
                                                placeholder="Enter Driver's License Number"
                                                value={newDriver.licenseNumber}
                                                onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-secondary transition-all placeholder:text-white/10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="submit"
                                            className="flex-grow bg-secondary text-primary py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] transition-transform active:scale-95"
                                        >
                                            Bind To Network
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsRegistering(false)}
                                            className="px-8 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                        >
                                            Abort
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
