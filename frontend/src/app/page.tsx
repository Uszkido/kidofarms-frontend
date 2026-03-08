import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Truck, Users, Search, ShoppingCart, TrendingUp, Clock, Star, MapPin } from "lucide-react";
import { fetcher } from "@/lib/api";

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
      { title: "Smart Logistics", icon: Truck, desc: "Proprietary oxygenated tank delivery for live catfish and cold-chain systems for strawberries." },
      { title: "Direct Verification", icon: ShieldCheck, desc: "Every farmer is manually vetted. View soil reports and harvest certifications for every item." },
      { title: "Tech-Driven Yield", icon: Leaf, desc: "Utilizing cutting-edge greenhouses and hydroponics to ensure consistency year-round." }
    ]
  };

  // Map icon strings to components for advantage section if they come from API as strings
  const advantageItems = (advantage.items || []).map((item: any) => {
    let Icon = Leaf;
    if (item.title === "Smart Logistics") Icon = Truck;
    if (item.title === "Direct Verification") Icon = ShieldCheck;
    return { ...item, icon: Icon };
  });

  const farmerCta = landingData?.farmer_cta || {
    title: "Scale Your",
    titleItalic: "Farm Business",
    subtitle: "Are you a farmer in Kano, Abuja, or Lagos? Join the network and reach 10x more customers. Our dashboard manages listing, pricing, and automated dispatch.",
    btn1Text: "List New Harvest",
    btn2Text: "Download Farmer App"
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Amazon-Style Persistent Search Bar */}
        <div className="bg-primary/95 backdrop-blur-xl border-b border-white/10 py-3 sticky top-20 z-50 shadow-2xl">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search size={20} className="text-secondary" />
              </div>
              <input
                type="text"
                placeholder="Search for organic vegetables, fresh fishes, or seasonal fruits..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-16 pr-32 text-white placeholder:text-white/40 focus:bg-white focus:text-primary focus:ring-4 focus:ring-secondary/20 transition-all outline-none text-lg font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-secondary text-primary px-8 rounded-full font-bold text-sm hover:bg-white transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
            alt="Farm Landscape"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-3 bg-secondary/90 backdrop-blur-md px-5 py-2.5 rounded-full text-primary font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                {hero.badge}
              </div>
              <h1 className="text-7xl md:text-9xl font-black font-serif text-white leading-[0.9] tracking-tighter">
                {hero.title} <br />
                <span className="text-secondary italic">{hero.titleItalic}</span>
              </h1>
              <p className="text-2xl text-cream/90 max-w-2xl leading-relaxed font-medium">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-5 pt-6">
                <Link href={hero.btn1Link} className="bg-secondary text-primary px-12 py-6 rounded-2xl font-black text-xl transition-all hover:bg-white flex items-center gap-3 shadow-[0_20px_50px_rgba(190,160,78,0.3)] hover:-translate-y-1">
                  {hero.btn1Text}
                  <ArrowRight size={24} strokeWidth={3} />
                </Link>
                <Link href={hero.btn2Link} className="bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all hover:bg-white/10 flex items-center gap-3">
                  {hero.btn2Text}
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Trust Card */}
          <div className="hidden lg:block absolute bottom-20 right-20 w-80 glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 animate-float">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-inner">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-secondary">{harvesting.statusLabel}</p>
                <p className="text-white font-bold text-lg">{harvesting.region}</p>
              </div>
            </div>
            <p className="text-cream/60 text-sm font-medium leading-relaxed">
              Current harvest cycle: <span className="text-white font-bold italic">{harvesting.cycle}</span> {harvesting.deliveryInfo}
            </p>
            <button className="w-full py-4 border-2 border-secondary/30 rounded-xl text-secondary text-xs font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all">
              {harvesting.btnText}
            </button>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="bg-cream/20 py-12 border-b border-primary/5">
          <div className="container mx-auto px-6">
            <div className="flex justify-center gap-8 md:gap-20 flex-wrap">
              {[
                { name: "Fruits", icon: "🍎" },
                { name: "Vegetables", icon: "🥬" },
                { name: "Wholesale", icon: "📦" },
                { name: "Fishes", icon: "🐟" },
                { name: "Grain Hub", icon: "🌾" },
                { name: "Artisan", icon: "🍯" },
              ].map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-primary/5 shadow-sm flex items-center justify-center text-4xl group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended For You */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-1 bg-secondary rounded-full" />
              <h2 className="text-4xl font-black font-serif flex items-center gap-3 uppercase tracking-tighter">
                Recommended <span className="text-primary/20 italic">For You</span>
                <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-black ml-2 animate-pulse">LIVE</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {[
                { name: "Bulbous Onions", farmer: "Musa Ibrahim", price: "₦4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=2000" },
                { name: "Organic Strawberries", farmer: "Grace Oke", price: "₦12,000", rating: 5.0, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2000" },
                { name: "Fresh Fishes (2kg)", farmer: "Kido Fishery", price: "₦8,500", rating: 4.8, image: "https://images.unsplash.com/photo-1555074213-911855e4be62?q=80&w=2000" },
                { name: "Benue Yams", farmer: "Samuel Odoh", price: "₦15,000", rating: 4.7, image: "https://images.unsplash.com/photo-1596450514735-2d937089146a?q=80&w=2000" },
              ].map((prod, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl mb-6">
                    <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                        {prod.rating} ★
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Verified Farmer: {prod.farmer}</p>
                    <h3 className="text-2xl font-bold font-serif group-hover:text-secondary transition-colors leading-tight">{prod.name}</h3>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-black text-primary">{prod.price}</span>
                      <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Trends Section */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="text-secondary font-black uppercase tracking-[0.3em] text-xs">{trends.label}</span>
                  <h2 className="text-6xl md:text-8xl font-black font-serif leading-[0.85]">{trends.title} <br /><span className="italic text-secondary">{trends.titleItalic}</span></h2>
                </div>
                <p className="text-cream/50 text-xl leading-relaxed max-w-xl">
                  {trends.subtitle}
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                    <TrendingUp className="text-secondary" size={32} />
                    <h4 className="text-4xl font-black font-serif">{trends.stat1Value}</h4>
                    <p className="text-xs uppercase font-bold tracking-widest text-cream/40">{trends.stat1Label}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                    <Clock className="text-secondary" size={32} />
                    <h4 className="text-4xl font-black font-serif">{trends.stat2Value}</h4>
                    <p className="text-xs uppercase font-bold tracking-widest text-cream/40">{trends.stat2Label}</p>
                  </div>
                </div>
                <button className="bg-secondary text-primary px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3">
                  {trends.btnText} <ArrowRight size={24} />
                </button>
              </div>
              <div className="relative h-[800px] w-full bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
                <div className="p-16 space-y-12">
                  <h3 className="text-3xl font-black font-serif border-b-2 border-secondary/20 pb-6">{trendingList.title}</h3>
                  {(trendingList.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center hover:bg-white/5 p-4 rounded-2xl transition-all cursor-crosshair">
                      <div>
                        <p className="text-lg font-bold">{item.name}</p>
                        <p className="text-xs uppercase font-black text-cream/30">{item.qty} Available</p>
                      </div>
                      <span className={`text-sm font-black px-4 py-1.5 rounded-full ${item.change?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.change}
                      </span>
                    </div>
                  ))}
                  <div className="pt-12 flex justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advantage Section */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto space-y-8 mb-24">
              <h2 className="text-6xl font-black font-serif uppercase tracking-tighter">{advantage.title} <span className="text-secondary italic underline decoration-secondary/30">{advantage.titleItalic}</span></h2>
              <p className="text-2xl text-primary/40 font-medium">{advantage.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {advantageItems.map((item: any, i: number) => (
                <div key={i} className="space-y-8 text-center group">
                  <div className="w-32 h-32 mx-auto rounded-[3rem] bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 group-hover:rotate-[15deg]">
                    <item.icon size={56} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black font-serif">{item.title}</h4>
                    <p className="text-lg text-primary/60 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Farmer CTA Section */}
        <section className="py-24 bg-cream/10 border-y border-primary/5">
          <div className="container mx-auto px-6">
            <div className="bg-primary rounded-[4rem] p-16 md:p-24 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary rounded-full blur-[150px]" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-20">
                <div className="max-w-2xl space-y-8">
                  <h2 className="text-5xl font-black font-serif leading-tight">{farmerCta.title} <br /><span className="text-secondary">{farmerCta.titleItalic}</span></h2>
                  <p className="text-xl text-cream/40 leading-relaxed font-medium">
                    {farmerCta.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <Link href="/register/vendor" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-secondary transition-all">{farmerCta.btn1Text}</Link>
                    <button className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">{farmerCta.btn2Text}</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-40 h-40 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center group hover:bg-secondary cursor-pointer transition-all">
                      <Users className="text-secondary group-hover:text-primary mb-2" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary">Kido Partner #{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
