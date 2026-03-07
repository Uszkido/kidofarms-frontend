import { NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts, users } from '@/db/schema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const adminUser = await db.query.users.findFirst({
            where: eq(users.email, session.user.email!)
        });

        if (!adminUser) {
            return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
        }

        const posts = [
            {
                title: "Sustainable Farming: Our Jos Journey",
                content: "Since moving to Jos in 2020, we've focused on regenerative agriculture. This post explores how we maintain soil health in the Plateau highgrounds...",
                image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800",
                authorId: adminUser.id,
            },
            {
                title: "The Kido Farms Network Expansion",
                content: "We are excited to announce new partner farmers joining our network. This means more variety for your weekly farm baskets, including premium organic beef...",
                image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
                authorId: adminUser.id,
            },
            {
                title: "Tips for Keeping Your Produce Fresh",
                content: "Most farm-fresh vegetables lose nutritional value within 48 hours. Here are three storage secrets we use at Kido Farms to keep your basket crisp...",
                image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?w=800",
                authorId: adminUser.id,
            }
        ];

        for (const post of posts) {
            await db.insert(blogPosts).values(post);
        }

        return NextResponse.json({ message: 'Blog seeded successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to seed blog' }, { status: 500 });
    }
}
