require('dotenv').config();
const { db } = require('./src/db');
const { teamMembers, impactMetrics, blogPosts, users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');

async function run() {
    console.log('--- Seeding Team, Impact, and Knowledge Hub ---');

    try {
        const kidoAdmin = await db.query.users.findFirst({
            where: eq(users.email, 'admin@kido.com')
        });
        const authorId = kidoAdmin ? kidoAdmin.id : null;

        // Team Members
        const teamData = [
            { name: "John Kido", role: "Founder", bio: "Visionary behind Kido Farms, dedicated to food security in Nigeria.", socialLinks: { twitter: "@johnkido" } },
            { name: "Sarah Musa", role: "Agronomist", bio: "Expert in crop science and sustainable farming practices.", socialLinks: { linkedin: "sarahmusa" } },
            { name: "Ibrahim Bello", role: "Farm manager", bio: "Oversees daily operations at Plateau Fresh Farms.", socialLinks: {} },
            { name: "Grace Egwu", role: "Marketing officer", bio: "Connecting farmers to global markets.", socialLinks: { instagram: "@gracekido" } }
        ];

        for (const member of teamData) {
            await db.insert(teamMembers).values(member);
            console.log(`- Added Team Member: ${member.name}`);
        }

        // Impact Metrics
        await db.insert(impactMetrics).values({
            id: 'current_metrics',
            acresCultivated: 500,
            farmersSupported: 1200,
            productionCapacity: '5000 Tons/Year'
        }).onConflictDoUpdate({
            target: impactMetrics.id,
            set: { acresCultivated: 500, farmersSupported: 1200, productionCapacity: '5000 Tons/Year' }
        });
        console.log('- Impact metrics seeded');

        // Blog Posts (Knowledge Hub)
        const articles = [
            { title: "How to grow tomatoes", content: "Tomatoes require well-drained soil and plenty of sunlight. Start by selecting high-quality seeds...", authorId },
            { title: "Catfish farming guide", content: "Catfish farming is a lucrative business in Nigeria. Ensure you have a consistent water source and quality feed...", authorId },
            { title: "Climate-smart agriculture", content: "Adapting to climate change is crucial for modern farmers. Use drought-resistant seeds and efficient irrigation...", authorId }
        ];

        for (const article of articles) {
            if (authorId) {
                await db.insert(blogPosts).values(article);
                console.log(`- Added Article: ${article.title}`);
            }
        }

        console.log('--- Seeding Complete ---');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
    process.exit(0);
}

run();
