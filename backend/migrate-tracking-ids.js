const { db } = require("./src/db/index");
const { products } = require("./src/db/schema");
const { eq, isNull } = require("drizzle-orm");
const crypto = require("crypto");

async function migrateTrackingIds() {
    console.log("Starting tracking ID migration...");

    const existingProducts = await db.select().from(products).where(isNull(products.trackingId));

    console.log(`Found ${existingProducts.length} products without tracking IDs.`);

    for (const product of existingProducts) {
        const trackingId = `KD-PROD-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
        await db.update(products)
            .set({ trackingId })
            .where(eq(products.id, product.id));
        console.log(`Assigned ${trackingId} to product: ${product.name}`);
    }

    console.log("Migration complete.");
    process.exit(0);
}

migrateTrackingIds().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
