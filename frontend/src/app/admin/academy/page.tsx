"use client";

import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Plus, Search, ArrowLeft, Loader2, Trash2, Edit, CheckCircle, XCircle, Play, FileText, Layout, Lightbulb } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AcademyAdminPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        totalCourses: 0,
        published: 0,
        drafts: 0,
        totalEnrollment: 1240 // Mock enrollment for now
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/academy"));
            const data = await res.json();
            const courseList = Array.isArray(data) ? data : [];
            setCourses(courseList);

            setStats({
                totalCourses: courseList.length,
                published: courseList.filter((c: any) => c.isPublished).length,
                drafts: courseList.filter((c: any) => !c.isPublished).length,
                totalEnrollment: 1240
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(getApiUrl(`/api/academy/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus })
            });
            if (res.ok) fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCourse = async (id: string) => {
        if (!confirm("Are you sure you want to delete this educational node?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/academy/${id}`), { method: "DELETE" });
            if (res.ok) fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = courses.filter(c =>
        (c.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (c.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Knowledge Dissemination Matrix</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Academy <span className="text-secondary block">Command</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/admin/academy/new" className="px-14 py-8 bg-secondary text-primary rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 border-b-4 border-black/20">
                            <Plus size={20} /> Authorize New Course
                        </Link>
                        <button
                            onClick={fetchCourses}
                            className="px-8 py-8 bg-white/5 text-secondary border border-secondary/20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4"
                        >
                            <Loader2 size={16} className={loading ? 'animate-spin' : ''} /> Synchronize
                        </button>
                    </div>
                </header>

                {/* 📊 ANALYTICS NODES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Educational Nodes", value: stats.totalCourses, icon: <BookOpen />, color: "text-white" },
                        { label: "Active Broadcasts", value: stats.published, icon: <Layout />, color: "text-green-400" },
                        { label: "Development Drafts", value: stats.drafts, icon: <Edit />, color: "text-amber-400" },
                        { label: "Citizen Enrollment", value: stats.totalEnrollment, icon: <Users />, color: "text-secondary" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl group hover:border-white/20 transition-all relative overflow-hidden">
                            <div className="absolute -bottom-4 -right-4 text-white/5 opacity-50 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-4">{stat.label}</p>
                            <p className={`text-5xl font-black font-serif italic ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* 🔍 SEARCH & FILTERS */}
                <div className="relative group max-w-2xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                    <input
                        placeholder="Scan academy courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                    />
                </div>

                {/* 📚 COURSE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[450px] bg-white/5 rounded-[4rem] border border-white/10 animate-pulse" />
                        ))
                    ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="group bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl p-10 flex flex-col justify-between hover:bg-white/[0.08] transition-all relative overflow-hidden">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <span className="px-5 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                                            {course.category}
                                        </span>
                                        <div className={`w-3 h-3 rounded-full ${course.isPublished ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-amber-500'}`} title={course.isPublished ? 'Live' : 'Draft'} />
                                    </div>
                                    <h3 className="text-3xl font-black font-serif italic text-white leading-[1.1] uppercase tracking-tighter group-hover:text-secondary transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-[11px] font-medium text-white/30 leading-relaxed uppercase tracking-widest line-clamp-3">
                                        {course.description || "NO DESCRIPTION PROVIDED"}
                                    </p>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => togglePublish(course.id, course.isPublished)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${course.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'}`}
                                            title={course.isPublished ? 'Unpublish' : 'Publish'}
                                        >
                                            {course.isPublished ? <CheckCircle size={20} /> : <Play size={20} />}
                                        </button>
                                        <Link
                                            href={`/admin/academy/edit/${course.id}`}
                                            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-secondary hover:border-secondary transition-all"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-40 text-center space-y-8 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-3xl">
                            <BookOpen size={80} className="mx-auto text-white/5" />
                            <h3 className="text-4xl font-black font-serif italic text-white/20 uppercase">Registry Emptied</h3>
                            <Link href="/admin/academy/new" className="inline-flex px-14 py-7 bg-secondary text-primary rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                                Authorize First Node
                            </Link>
                        </div>
                    )}
                </div>

                {/* 🎇 FOOTER GUIDE */}
                <div className="bg-primary/50 border border-white/10 rounded-[4rem] p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-secondary/5 rounded-full blur-[150px] -translate-y-48 translate-x-48 group-hover:bg-secondary/10 transition-colors" />
                    <div className="space-y-6 text-center lg:text-left relative z-10">
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                            <Lightbulb className="text-secondary" />
                            <h3 className="text-4xl font-black font-serif italic text-white uppercase tracking-tighter">Strategic <span className="text-secondary">Enlightenment</span></h3>
                        </div>
                        <p className="max-w-2xl text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed text-white/30 italic">
                            THE KIDO ACADEMY IS THE CENTRAL HUB FOR FARMER TRAINING AND CONSUMER AWARENESS. PUBLISHED NODES AUTOMATICALLY MINT MASTERY POINTS FOR PARTICIPATING CITIZENS.
                        </p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/10 border border-white/5">
                            <GraduationCap size={32} />
                        </div>
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/10 border border-white/5">
                            <FileText size={32} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
