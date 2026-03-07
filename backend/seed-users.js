require("dotenv").config();
const { db } = require("./src/db");
const { users } = require("./src/db/schema");
const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");

async function seed() {
    console.log("🌱 Seeding users...");

    const userData = [
        {
            name: "Chief Farmer Admin",
            email: "admin@kidofarms.com",
            password: "admin123password",
            role: "admin",
            phone: "+2348000000001"
        },
        {
            name: "Sani Musa",
            email: "sani@kidofarms.com",
            password: "user123password",
            role: "customer",
            phone: "+2348000000002"
        },
        {
            name: "Amina Yusuf",
            email: "amina@kidofarms.com",
            password: "user123password",
            role: "customer",
            phone: "+2348000000003"
        }
    ];

    for (const data of userData) {
        // Check if user exists
        const [existing] = await db.select().from(users).where(eq(users.email, data.email));

        if (existing) {
            console.log(`User ${data.email} already exists, updating password and role.`);
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await db.update(users).set({
                password: hashedPassword,
                role: data.role
            }).where(eq(users.email, data.email));
            continue;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        await db.insert(users).values({
            ...data,
            password: hashedPassword
        });
        console.log(`✅ Created user: ${data.name} (${data.role}) - Password: ${data.password}`);
    }

    console.log("✨ Seeding completed.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
