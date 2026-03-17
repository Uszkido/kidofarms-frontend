require('dotenv').config();
const { db } = require('./src/db');
const { academyCourses, energyMarketplace, globalBridge, users } = require('./src/db/schema');
const { eq, sql } = require('drizzle-orm');

async function seed() {
    console.log('--- Seeding Orbit 5.0 Advanced Nodes ---');

    try {
        const admin = await db.query.users.findFirst({ where: eq(users.role, 'admin') });
        const farmer = await db.query.users.findFirst({ where: eq(users.role, 'farmer') });

        if (!admin || !farmer) {
            console.log('Error: Admin/Farmer nodes not found. Run seed-users.js first.');
            process.exit(1);
        }

        // 1. Academy Courses (Mastery Academy)
        const courses = [
            { title: "Organic Soil Biology", category: "Soil", description: "Master the art of living soil using bio-char and local microbes.", content: "https://kidofarms.com/academy/soil-101", points: 50 },
            { title: "Smart Irrigation Systems", category: "AgriTech", description: "Deploy solar-powered drip irrigation for year-round yields.", content: "https://kidofarms.com/academy/irrigation-201", points: 75 },
            { title: "Export Grade Compliance", category: "Business", description: "Learn ISO 22000 standards to ship your produce to the EU and USA.", content: "https://kidofarms.com/academy/export-301", points: 100 },
            { title: "Waste-to-Wealth Mastery", category: "Circular Economy", description: "Turn biomass into compost and trade carbon credits on Kido Market.", content: "https://kidofarms.com/academy/circular-401", points: 60 }
        ];

        for (const c of courses) {
            await db.insert(academyCourses).values(c);
            console.log(`- Injected Academy Node: ${c.title}`);
        }

        // 2. Energy Marketplace (Sovereign Energy)
        const energyNodes = [
            { sellerId: farmer.id, wasteType: "Rice Husks", quantity: sql`500.00`, unit: "kg", creditsOffered: 50, status: "available" },
            { sellerId: farmer.id, wasteType: "Corn Cob Biomass", quantity: sql`250.00`, unit: "kg", creditsOffered: 30, status: "available" },
            { sellerId: farmer.id, wasteType: "Organic Compost", quantity: sql`1000.00`, unit: "kg", creditsOffered: 100, status: "available" }
        ];

        for (const e of energyNodes) {
            await db.insert(energyMarketplace).values(e);
            console.log(`- Injected Energy Node: ${e.wasteType}`);
        }

        // 3. Global Bridge (International Trade)
        const exportNodes = [
            { farmerId: farmer.id, produceType: "Dried Hibiscus", quantity: sql`5000.00`, destination: "Germany", status: "certified", certifications: ["GlobalGAP", "Organic"] },
            { farmerId: farmer.id, produceType: "Shea Butter", quantity: sql`2000.00`, destination: "USA", status: "certification_pending", certifications: [] },
            { farmerId: farmer.id, produceType: "Ginger", quantity: sql`10000.00`, destination: "Netherlands", status: "shipped", certifications: ["ISO 22000"] }
        ];

        for (const ex of exportNodes) {
            await db.insert(globalBridge).values(ex);
            console.log(`- Injected Export Node: ${ex.produceType} to ${ex.destination}`);
        }

        console.log('--- Orbit 5.0 Seeding Sequence Complete ---');
    } catch (err) {
        console.error('Seeding Failure:', err);
    }
    process.exit(0);
}

seed();
