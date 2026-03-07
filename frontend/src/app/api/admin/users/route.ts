import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc, and, not } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper to check if user is admin
async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "admin";
}

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
        const safeUsers = allUsers.map(({ password, ...rest }) => rest);
        return NextResponse.json(safeUsers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, email, password, role, phone } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashed,
            role,
            phone
        }).returning();

        const { password: _, ...safeUser } = newUser;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, role } = await req.json();
        if (!id || !role) return NextResponse.json({ error: "ID and role required" }, { status: 400 });

        const [updated] = await db.update(users)
            .set({ role })
            .where(eq(users.id, id))
            .returning();

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const session = await getServerSession(authOptions);
        if ((session?.user as any).id === id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        await db.delete(users).where(eq(users.id, id));
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
