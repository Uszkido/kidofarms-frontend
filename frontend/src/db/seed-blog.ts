import { db } from './index';
import { blogPosts, users, categories } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('--- Seeding Blog Content ---');

    const admin = await db.query.users.findFirst({
        where: eq(users.role, 'admin')
    });

    if (!admin) {
        console.error('No admin found. Seed an admin first.');
        return;
    }

    const posts = [
        {
            title: 'Sustainable Poultry: How We Raise Our Chickens',
            content: 'At Kido Farms, sustainability is at the heart of everything we do. Our chickens are raised with organic feed and plenty of sunshine. We believe that happy birds lead to healthier food for your family...',
            image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&auto=format&fit=crop',
            authorId: admin.id,
            status: 'published'
        },
        {
            title: 'Modernizing Fish Farming in Kano',
            content: 'Our new aquaculture facility in Kano is leveraging water recycling technology to raise the freshest Fishes in the region. By controlling every variable, we ensure consistent quality and taste...',
            image: 'https://images.unsplash.com/photo-1524704685771-adad009c6931?w=1200&auto=format&fit=crop',
            authorId: admin.id,
            status: 'published'
        }
    ];

    for (const post of posts) {
        await db.insert(blogPosts).values(post);
    }

    console.log('Blog content seeded.');
    process.exit(0);
}

main().catch(console.error);
