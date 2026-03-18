import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "admin";
}

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const [subscriber] = await db.insert(subscribers).values({
            email: body.email,
            plan: body.plan || "Weekly Farm Basket",
            status: "pending"
        }).returning();
        return NextResponse.json(subscriber, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 400 });
    }
}
