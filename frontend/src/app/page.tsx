import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, Leaf, ShieldCheck, Truck, Users, Search, ShoppingCart, TrendingUp, Clock, Star, MapPin } from "lucide-react";
import { fetcher } from "@/lib/api";
import HomeSearch from "@/components/HomeSearch";
import MarketTicker from "@/components/MarketTicker";
import PremiumHero from "@/components/PremiumHero";
import KidoConcierge from "@/components/KidoConcierge";
import FadeInEntry from "@/components/FadeInEntry";
import CategoryList from "@/components/CategoryList";
import AdvantageSection from "@/components/AdvantageSection";

export const dynamic = 'force-dynamic';

async function getLandingData() {
  try {
    return await fetcher('/api/landing');
  } catch (error) {
    console.error('Failed to fetch landing data:', error);
    return null;
  }
}

export default async function Home() {
  const landingData = await getLandingData();

  // CMS Content with Fallbacks
  const hero = landingData?.hero || {
    badge: "Kido Farms Network • The Digital Marketplace",
    title: "Direct From",
    titleItalic: "The Source.",
    subtitle: "West Africa's most trusted network connecting premium community farmers directly to your kitchen. 100% Organic. Zero Middlemen.",
    btn1Text: "Start Shopping",
    btn1Link: "/shop",
    btn2Text: "Weekly Basket Plan",
    btn2Link: "/subscriptions"
  };

  const harvesting = landingData?.harvesting || {
    region: "Jos, Plateau",
    statusLabel: "Harvesting Now",
    cycle: "Sweet Maize & Red Peppers.",
    deliveryInfo: "Delivery available within 24 hours.",
    btnText: "Track Harvest"
  };

  const trends = landingData?.trends || {
    label: "Market Trends",
    title: "The Harvest",
    titleItalic: "Volume Report",
    subtitle: "Join 15,000+ conscious customers buying directly from our verified network of 450+ farmers. Experience real-time price transparency.",
    stat1Value: "₦45M+",
    stat1Label: "Market Volume This Week",
    stat2Value: "12.5h",
    stat2Label: "Avg. Harvest-to-Table Time",
    btnText: "View Live Marketplace"
  };

  const trendingList = landingData?.trending_list || {
    title: "Trending Near Lagos",
    items: [
      { name: "Red Habanero Peppers", qty: "450 Baskets", change: "+12%" },
      { name: "Sweet Kano Onions", qty: "1.2 Tons", change: "+8%" },
      { name: "Live Mature Fishes", qty: "2,400 Units", change: "+24%" },
      { name: "Organic Honeybush", qty: "850 Liters", change: "-2%" }
    ]
  };

  const advantage = landingData?.advantage || {
    title: "The Kido Farms",
    titleItalic: "Advantage",
    subtitle: "Why the biggest distributors and premium supermarkets trust our network.",
    items: [
      { title: "Smart Logistics", desc: "Proprietary oxygenated tank delivery for live catfish and cold-chain systems for strawberries." },
      { title: "Direct Verification", desc: "Every farmer is manually vetted. View soil reports and harvest certifications for every item." },
      { title: "Tech-Driven Yield", desc: "Utilizing cutting-edge greenhouses and hydroponics to ensure consistency year-round." }
    ]
  };

  const farmerCta = landingData?.farmer_cta || {
    title: "Scale Your",
    titleItalic: "Farm Business",
    subtitle: "Are you a farmer in Kano, Abuja, or Lagos? Join the network and reach 10x more customers. Our dashboard manages listing, pricing, and automated dispatch.",
    btn1Text: "List New Harvest",
    btn2Text: "Download Farmer App"
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-grow">
        {/* Market Ticker Component */}
        <MarketTicker />

        {/* Amazon-Style Persistent Search Bar */}
        <HomeSearch />

        {/* Premium Hero Section */}
        <PremiumHero data={hero} />

        {/* Categories Bar */}
        <section className="bg-white py-16 border-b border-primary/5 relative z-10">
          <div className="container mx-auto px-6">
            <CategoryList />
          </div>
        </section>

        {/* Recommended For You */}
        <FadeInEntry>
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="flex items-center gap-4 mb-16">
                <div className="w-12 h-1 bg-secondary rounded-full" />
                <h2 className="text-4xl md:text-6xl font-black font-serif flex items-center gap-4 uppercase tracking-tighter">
                  Recommended <span className="text-primary/20 italic">For You</span>
                  <span className="bg-secondary text-primary text-[10px] px-4 py-1.5 rounded-full font-black ml-4 shadow-lg shadow-secondary/20">LIVE MARKET</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {[
                  { name: "Bulbous Onions", farmer: "Musa Ibrahim", price: "₦4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=2000" },
                  { name: "Organic Strawberries", farmer: "Grace Oke", price: "₦12,000", rating: 5.0, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2000" },
                  { name: "Fresh Fishes (2kg)", farmer: "Kido Fishery", price: "₦8,500", rating: 4.8, image: "https://images.unsplash.com/photo-1555074213-911855e4be62?q=80&w=2000" },
                  { name: "Benue Yams", farmer: "Samuel Odoh", price: "₦15,000", rating: 4.7, image: "https://images.unsplash.com/photo-1596450514735-2d937089146a?q=80&w=2000" },
                ].map((prod, i) => (
                  <div key={i} className="group relative">
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl mb-8">
                      <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">
                          {prod.rating} ★
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 px-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Verified Farmer: {prod.farmer}</p>
                      <h3 className="text-2xl font-black font-serif group-hover:text-secondary transition-colors leading-tight">{prod.name}</h3>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-2xl font-black text-primary">{prod.price}</span>
                        <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-lg active:scale-95">
                          <ShoppingCart size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInEntry>

        {/* Market Trends Section */}
        <FadeInEntry>
          <section className="py-32 bg-primary text-white overflow-hidden relative rounded-[4rem] mx-6 lg:mx-12">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent" />
            </div>
            <div className="container mx-auto px-12 relative z-10">
              <div className="grid lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <span className="inline-block text-secondary font-black uppercase tracking-[0.3em] text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10">{trends.label}</span>
                    <h2 className="text-6xl md:text-8xl font-black font-serif leading-[0.85] tracking-tighter">
                      {trends.title} <br />
                      <span className="italic text-secondary">{trends.titleItalic}</span>
                    </h2>
                  </div>
                  <p className="text-cream/50 text-xl leading-relaxed max-w-xl font-medium">
                    {trends.subtitle}
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 group hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h4 className="text-4xl font-black font-serif">{trends.stat1Value}</h4>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-cream/40">{trends.stat1Label}</p>
                      </div>
                    </div>
                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 group hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="text-4xl font-black font-serif">{trends.stat2Value}</h4>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-cream/40">{trends.stat2Label}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-[850px] w-full bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-16 space-y-16">
                    <div className="flex justify-between items-center border-b border-white/10 pb-10">
                      <h3 className="text-3xl font-black font-serif uppercase tracking-tight">{trendingList.title}</h3>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-secondary">Updating Live</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {(trendingList.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center group hover:bg-white/5 p-6 rounded-3xl transition-all cursor-pointer border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                              {i === 0 ? "🌶️" : i === 1 ? "🧅" : i === 2 ? "🐟" : "🍯"}
                            </div>
                            <div>
                              <p className="text-xl font-black font-serif">{item.name}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-cream/30">{item.qty} In Network</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 text-sm font-black px-5 py-2 rounded-full ${item.change?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.change?.startsWith('+') ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                            {item.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-secondary p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                      <span className="text-primary font-black uppercase tracking-widest text-sm">View Full Market Analysis</span>
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInEntry>

        {/* Advantage Section */}
        <FadeInEntry>
          <AdvantageSection data={advantage} />
        </FadeInEntry>

        {/* Farmer CTA Section */}
        <FadeInEntry>
          <section className="py-24 mb-24 px-6 lg:px-12">
            <div className="container mx-auto">
              <div className="bg-primary rounded-[5rem] p-16 md:p-32 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-24">
                  <div className="max-w-2xl space-y-10">
                    <div className="space-y-6">
                      <h2 className="text-6xl md:text-8xl font-black font-serif leading-[0.85] tracking-tighter">
                        {farmerCta.title} <br />
                        <span className="text-secondary italic">{farmerCta.titleItalic}</span>
                      </h2>
                      <p className="text-xl text-cream/40 leading-relaxed font-medium">
                        {farmerCta.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <Link href="/register/farmer" className="bg-white text-primary px-12 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-white/5 active:scale-95">Register as Farmer</Link>
                      <Link href="/register/vendor" className="border-2 border-white/20 text-white px-12 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">Register as Vendor</Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative">
                    <div className="absolute -inset-4 bg-secondary/10 blur-[60px] rounded-full pointer-events-none" />
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-44 h-44 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center group hover:bg-secondary hover:border-secondary transition-all cursor-pointer shadow-lg">
                        <Users className="text-secondary group-hover:text-primary mb-3" size={40} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary text-white/40">Network ID #{i * 128}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInEntry>
      </main>

      {/* Floating Kido Concierge Widget */}
      <KidoConcierge />

      <Footer />
    </div>
  );
}
