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

  const recommended = landingData?.recommended || {
    title: "Recommended",
    titleItalic: "For You",
    badge: "LIVE MARKET",
    items: [
      { name: "Bulbous Onions", farmer: "Musa Ibrahim", price: "₦4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=2000" },
      { name: "Organic Strawberries", farmer: "Grace Oke", price: "₦12,000", rating: 5.0, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2000" },
      { name: "Fresh Fishes (2kg)", farmer: "Kido Fishery", price: "₦8,500", rating: 4.8, image: "https://images.unsplash.com/photo-1555074213-911855e4be62?q=80&w=2000" },
      { name: "Benue Yams", farmer: "Samuel Odoh", price: "₦15,000", rating: 4.7, image: "https://images.unsplash.com/photo-1596450514735-2d937089146a?q=80&w=2000" },
    ]
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
    btn1Text: "Register as Farmer",
    btn2Text: "Register as Vendor"
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <main className="flex-grow">
        {/* Market Ticker Component */}
        <MarketTicker />

        {/* Amazon-Style Persistent Search Bar */}
        <HomeSearch />

        {/* Premium Hero Section */}
        <PremiumHero data={hero} />

        {/* Categories Bar */}
        <section className="bg-primary pt-16 pb-24 border-b border-white/5 relative z-10">
          <div className="container mx-auto px-6">
            <CategoryList />
          </div>
        </section>

        {/* Recommended For You */}
        <FadeInEntry>
          <section className="py-32 bg-primary">
            <div className="container mx-auto px-6">
              <div className="flex items-center gap-4 mb-20">
                <div className="w-16 h-1 bg-secondary rounded-full shadow-lg shadow-secondary/20" />
                <h2 className="text-5xl md:text-7xl font-black font-serif flex items-center gap-6 uppercase tracking-tighter text-white">
                  {recommended.title} <span className="text-white/20 italic">{recommended.titleItalic}</span>
                  <span className="bg-secondary text-primary text-[10px] px-5 py-2 rounded-full font-black ml-4 shadow-xl shadow-secondary/30">{recommended.badge}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                {(recommended.items || []).map((prod: any, i: number) => (
                  <div key={i} className="group relative">
                    <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl mb-10 border border-white/5">
                      <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute top-8 left-8">
                        <span className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 shadow-2xl">
                          {prod.rating} ★
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 px-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60 group-hover:text-secondary transition-colors">Verified Farmer: {prod.farmer}</p>
                      <h3 className="text-3xl font-black font-serif text-white leading-tight">{prod.name}</h3>
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-3xl font-black text-white">{prod.price}</span>
                        <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-2xl active:scale-95 group-hover:border-secondary">
                          <ShoppingCart size={22} strokeWidth={2.5} />
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
          <section className="py-40 bg-neutral-950 text-white overflow-hidden relative rounded-[5rem] mx-6 lg:mx-12 border border-white/5">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-secondary/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-12 relative z-10">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                <div className="space-y-16">
                  <div className="space-y-8">
                    <span className="inline-block text-secondary font-black uppercase tracking-[0.4em] text-[10px] bg-white/5 px-6 py-3 rounded-full border border-white/10 shadow-2xl">{trends.label}</span>
                    <h2 className="text-7xl md:text-9xl font-black font-serif leading-[0.85] tracking-tighter">
                      {trends.title} <br />
                      <span className="italic text-secondary">{trends.titleItalic}</span>
                    </h2>
                  </div>
                  <p className="text-white/40 text-2xl leading-relaxed max-w-xl font-medium">
                    {trends.subtitle}
                  </p>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="p-12 rounded-[4rem] bg-white/5 border border-white/10 space-y-8 group hover:bg-white/10 transition-all hover:scale-105 duration-500">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                        <TrendingUp size={32} />
                      </div>
                      <div>
                        <h4 className="text-5xl font-black font-serif text-white">{trends.stat1Value}</h4>
                        <p className="text-[11px] uppercase font-black tracking-[0.3em] text-white/20">{trends.stat1Label}</p>
                      </div>
                    </div>
                    <div className="p-12 rounded-[4rem] bg-white/5 border border-white/10 space-y-8 group hover:bg-white/10 transition-all hover:scale-105 duration-500">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                        <Clock size={32} />
                      </div>
                      <div>
                        <h4 className="text-5xl font-black font-serif text-white">{trends.stat2Value}</h4>
                        <p className="text-[11px] uppercase font-black tracking-[0.3em] text-white/20">{trends.stat2Label}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-[900px] w-full bg-white/5 backdrop-blur-3xl rounded-[5rem] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent pointer-events-none" />
                  <div className="p-16 space-y-20">
                    <div className="flex justify-between items-center border-b border-white/5 pb-12">
                      <h3 className="text-4xl font-black font-serif uppercase tracking-tight text-white">{trendingList.title}</h3>
                      <div className="flex gap-3 items-center">
                        <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/40" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-secondary">Broadcasting Live</span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {(trendingList.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center group hover:bg-white/5 p-8 rounded-[2.5rem] transition-all cursor-pointer border border-transparent hover:border-white/10">
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow- inner shadow-white/5">
                              {i === 0 ? "🌶️" : i === 1 ? "🧅" : i === 2 ? "🐟" : "🍯"}
                            </div>
                            <div>
                              <p className="text-2xl font-black font-serif text-white group-hover:text-secondary transition-colors">{item.name}</p>
                              <p className="text-[11px] uppercase font-black tracking-[0.2em] text-white/30">{item.qty} Handled Locally</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-3 text-sm font-black px-6 py-2.5 rounded-full ${item.change?.startsWith('+') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {item.change?.startsWith('+') ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                            {item.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-secondary p-10 rounded-[3rem] flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-2xl shadow-secondary/20">
                      <span className="text-primary font-black uppercase tracking-[0.2em] text-sm">Open Full Market Analysis</span>
                      <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <ArrowRight size={24} strokeWidth={3} />
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
          <section className="py-40 mb-24 px-6 lg:px-12">
            <div className="container mx-auto">
              <div className="bg-neutral-950 rounded-[6rem] p-20 md:p-40 text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-32">
                  <div className="max-w-3xl space-y-16 text-center lg:text-left">
                    <div className="space-y-10">
                      <h2 className="text-7xl md:text-9xl font-black font-serif leading-[0.85] tracking-tighter">
                        {farmerCta.title} <br />
                        <span className="text-secondary italic underline decoration-secondary/10 decoration-8 underline-offset-8">{farmerCta.titleItalic}</span>
                      </h2>
                      <p className="text-2xl text-white/40 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                        {farmerCta.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                      <Link href="/register/farmer" className="bg-secondary text-primary px-16 py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-secondary/20 active:scale-95">{farmerCta.btn1Text}</Link>
                      <Link href="/register/vendor" className="bg-white/5 border-2 border-white/10 text-white px-16 py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">{farmerCta.btn2Text}</Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 relative">
                    <div className="absolute -inset-10 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-52 h-52 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center group hover:bg-secondary hover:border-secondary transition-all cursor-pointer shadow-2xl hover:scale-110 duration-500">
                        <Users className="text-secondary group-hover:text-primary mb-4" size={56} strokeWidth={1} />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-primary text-white/20 transition-colors">Unit #{i * 256}</span>
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
