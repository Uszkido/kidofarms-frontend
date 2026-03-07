const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { blogPosts } = require('../db/schema');
const { desc } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.query.blogPosts.findMany({
            orderBy: [desc(blogPosts.createdAt)]
        });
        res.json(data);
    } catch (error) {
        console.error('Blog GET error:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

router.post('/init', async (req, res) => {
    try {
        const { users } = require('../db/schema');
        const { eq } = require('drizzle-orm');

        const adminUser = await db.query.users.findFirst({
            where: eq(users.role, 'admin')
        });

        if (!adminUser) return res.status(404).json({ error: 'Admin user not found' });

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

        res.json({ message: 'Blog seeded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
