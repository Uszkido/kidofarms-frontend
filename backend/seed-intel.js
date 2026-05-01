require('dotenv').config();
const { db } = require("./src/db");
const { intelContents, users } = require("./src/db/schema");
const { eq } = require("drizzle-orm");

async function seedIntel() {
    console.log("🚀 Initializing Intelligence Registry...");

    try {
        // Find an admin to be the author
        const adminUser = await db.query.users.findFirst({
            where: eq(users.role, "admin")
        });

        if (!adminUser) {
            console.error("❌ No admin user found to author intelligence.");
            return;
        }

        const initialIntel = [
            {
                title: "Army Worm Resistance Protocol (Delta-9)",
                body: "Implementing a multi-spectral deterrent pattern. Farmers should rotate to Node-B coordinates and apply a 12% neem-oil solution during the twilight phase of the lunar cycle for maximum efficacy.",
                type: "Technical",
                category: "Alert",
                section: "exchange",
                status: "published",
                isLive: true,
                authorId: adminUser.id
            },
            {
                title: "NDVI Variance in Plateau Regions",
                body: "Satellite observations indicate a 4% biomass dip in the Jos agricultural belt. This is likely due to early harmattan precursors. Recommend standardizing irrigation pulse metrics by 15%.",
                type: "Research",
                category: "Advisory",
                section: "vault",
                status: "published",
                isLive: true,
                authorId: adminUser.id
            },
            {
                title: "Sovereign Supply Chain Hardening",
                body: "Transitioning all regional logistics to the Kido Sovereign Mesh. This ensures that even during high-latency network anomalies, the produce maintains its cryptographic timestamp.",
                type: "Technical",
                category: "General",
                section: "vault",
                status: "published",
                isLive: true,
                authorId: adminUser.id
            },
            {
                title: "Peer-to-Peer Seed Exchange Logic",
                body: "Community nodes can now swap heirloom genetics under the accreditation of the Master Node. Ensure all swaps are signed with a bio-digital fingerprint.",
                type: "Community",
                category: "General",
                section: "exchange",
                status: "draft",
                isLive: false,
                authorId: adminUser.id
            }
        ];

        console.log("💾 Purging legacy nodes...");
        await db.delete(intelContents);

        console.log("📡 Injecting new intelligence modules...");
        for (const item of initialIntel) {
            await db.insert(intelContents).values(item);
        }

        console.log("✅ Intelligence Registry successfully synchronized.");
    } catch (error) {
        console.error("❌ Registry Sync Failed:", error);
    } finally {
        setTimeout(() => {
            process.exit();
        }, 2000);
    }
}

seedIntel();
