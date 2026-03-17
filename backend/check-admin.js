require("dotenv").config();
const { db } = require("./src/db");
const { users } = require("./src/db/schema");
const { eq } = require("drizzle-orm");

async function check() {
    const allUsers = await db.select().from(users);
    console.log("Total Users in Network:", allUsers.length);
    allUsers.forEach(u => console.log(`- ${u.name} [${u.email}] -> Role: ${u.role}`));
    process.exit(0);
}

check().catch(console.error);
