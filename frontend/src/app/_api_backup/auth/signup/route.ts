import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
        }

        const existing = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const [user] = await db.insert(users).values({
            name,
            email,
            phone,
            password: hashed,
            role: "customer",
        }).returning();

        return NextResponse.json(
            { message: "Account created successfully!", userId: user.id },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
