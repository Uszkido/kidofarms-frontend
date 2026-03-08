require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { landingSections } = require('./src/db/schema');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const initialData = [
    {
        id: 'hero',
        content: {
            badge: "Kido Farms Network • The Digital Marketplace",
            title: "Direct From",
            titleItalic: "The Source.",
            subtitle: "West Africa's most trusted network connecting premium community farmers directly to your kitchen. 100% Organic. Zero Middlemen.",
            btn1Text: "Start Shopping",
            btn1Link: "/shop",
            btn2Text: "Weekly Basket Plan",
            btn2Link: "/subscriptions"
        }
    },
    {
        id: 'harvesting',
        content: {
            region: "Jos, Plateau",
            statusLabel: "Harvesting Now",
            cycle: "Sweet Maize & Red Peppers.",
            deliveryInfo: "Delivery available within 24 hours.",
            btnText: "Track Harvest"
        }
    },
    {
        id: 'trends',
        content: {
            label: "Market Trends",
            title: "The Harvest",
            titleItalic: "Volume Report",
            subtitle: "Join 15,000+ conscious customers buying directly from our verified network of 450+ farmers. Experience real-time price transparency.",
            stat1Value: "₦45M+",
            stat1Label: "Market Volume This Week",
            stat2Value: "12.5h",
            stat2Label: "Avg. Harvest-to-Table Time",
            btnText: "View Live Marketplace"
        }
    },
    {
        id: 'trending_list',
        content: {
            title: "Trending Near Lagos",
            items: [
                { name: "Red Habanero Peppers", qty: "450 Baskets", change: "+12%" },
                { name: "Sweet Kano Onions", qty: "1.2 Tons", change: "+8%" },
                { name: "Live Mature Fishes", qty: "2,400 Units", change: "+24%" },
                { name: "Organic Honeybush", qty: "850 Liters", change: "-2%" }
            ]
        }
    },
    {
        id: 'advantage',
        content: {
            title: "The Kido Farms",
            titleItalic: "Advantage",
            subtitle: "Why the biggest distributors and premium supermarkets trust our network.",
            items: [
                { title: "Smart Logistics", desc: "Proprietary oxygenated tank delivery for live catfish and cold-chain systems for strawberries." },
                { title: "Direct Verification", desc: "Every farmer is manually vetted. View soil reports and harvest certifications for every item." },
                { title: "Tech-Driven Yield", desc: "Utilizing cutting-edge greenhouses and hydroponics to ensure consistency year-round." }
            ]
        }
    },
    {
        id: 'farmer_cta',
        content: {
            title: "Scale Your",
            titleItalic: "Farm Business",
            subtitle: "Are you a farmer in Kano, Abuja, or Lagos? Join the network and reach 10x more customers. Our dashboard manages listing, pricing, and automated dispatch.",
            btn1Text: "List New Harvest",
            btn2Text: "Download Farmer App"
        }
    }
];

async function seed() {
    console.log('🌱 Seeding Landing Page Content...');
    try {
        for (const section of initialData) {
            await db.insert(landingSections)
                .values(section)
                .onConflictDoUpdate({
                    target: landingSections.id,
                    set: { content: section.content, updatedAt: new Date() }
                });
            console.log(`✅ Seeded section: ${section.id}`);
        }
        console.log('✨ Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
