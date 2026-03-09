const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { db } = require('./src/db');
const { stories, users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');

async function seed() {
    console.log("🌱 Seeding Stories...");
    try {
        const [vendor] = await db.select().from(users).where(eq(users.role, 'vendor')).limit(1);
        const [farmer] = await db.select().from(users).where(eq(users.role, 'farmer')).limit(1);

        const targetId = vendor?.id || farmer?.id;
        if (!targetId) {
            console.error("No vendor or farmer found to attach stories. Please create a user first.");
            process.exit(1);
        }

        const seedData = [
            {
                vendorId: targetId,
                mediaUrl: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80",
                caption: "Early morning check on the corn fields. Looking healthy! 🌽",
                mediaType: "image"
            },
            {
                vendorId: targetId,
                mediaUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80",
                caption: "New extraction batch of wild honey is ready for bottling. 🍯",
                mediaType: "image"
            },
            {
                vendorId: targetId,
                mediaUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80",
                caption: "Freshly picked bell peppers. The colors are amazing! 🫑",
                mediaType: "image"
            }
        ];

        await db.insert(stories).values(seedData);
        console.log("✅ Successfully seeded 3 stories.");
    } catch (err) {
        console.error("❌ Seed failed:", err);
    }
    process.exit(0);
}

seed();
