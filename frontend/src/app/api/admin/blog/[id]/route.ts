import { NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "admin";
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const [updated] = await db.update(blogPosts)
            .set(body)
            .where(eq(blogPosts.id, params.id))
            .returning();
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
