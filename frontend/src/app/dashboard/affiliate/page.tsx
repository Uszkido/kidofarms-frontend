import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliateDashboardClient } from "./AffiliateDashboardClient";

export default function AffiliateDashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />
            <AffiliateDashboardClient />
            <Footer />
        </div>
    );
}
