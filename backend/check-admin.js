require("dotenv").config();
const { db } = require("./src/db");
const { users } = require("./src/db/schema");
const { eq } = require("drizzle-orm");

async function check() {
    const email = "admin@kidofarms.com";
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (user) {
        console.log(`User: ${user.email}`);
        console.log(`Role: ${user.role}`);
    } else {
        console.log("User not found.");
    }
    process.exit(0);
}

check().catch(console.error);
