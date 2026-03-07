import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if ((session.user as any)?.role !== "admin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream/30">
                <div className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-primary/5 shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M12 8V12" /><path d="M12 16H12.01" /></svg>
                    </div>
                    <h1 className="text-3xl font-black font-serif text-primary">Access Denied</h1>
                    <p className="text-primary/40 font-medium leading-relaxed">
                        Your account does not have the <span className="text-primary font-black">Chief Farmer</span> credentials required to enter this command center.
                    </p>
                    <div className="pt-4 flex flex-col gap-3">
                        <a href="/" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                            Return to Store
                        </a>
                        <a href="/login" className="text-xs font-black text-primary/30 hover:text-primary uppercase tracking-widest transition-colors py-2">
                            Switch Account
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
