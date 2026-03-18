import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { desc } from 'drizzle-orm';
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
        const data = await db.query.orders.findMany({
            with: {
                user: true
            },
            orderBy: desc(orders.createdAt)
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
