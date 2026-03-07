import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
    console.log("Creating Admin account...");
    const email = "admin@kidofarms.com";
    const password = "KidoAdmin2026!";
    const name = "Kido Farms Admin";

    try {
        const hashed = await bcrypt.hash(password, 12);

        await db.insert(users).values({
            name,
            email,
            password: hashed,
            role: "admin",
            phone: "+2340000000000"
        }).onConflictDoNothing();

        console.log("-----------------------------------------");
        console.log("Admin account created/verified!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Error creating admin:", error);
    }
    process.exit(0);
}

seedAdmin();
