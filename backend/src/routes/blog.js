const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { blogPosts } = require('../db/schema');
const { desc } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

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

// GET /api/blog/:id
router.get('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const post = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, req.params.id)
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/blog
router.post('/', authenticateToken, async (req, res) => {
    try {
        const [post] = await db.insert(blogPosts).values({
            ...req.body,
            authorId: req.user.id
        }).returning();
        res.status(201).json(post);
    } catch (error) {
        console.error('Blog creation error:', error);
        res.status(400).json({ error: 'Failed to create blog post', details: error.message });
    }
});

// PATCH /api/blog/:id
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const [updated] = await db.update(blogPosts)
            .set(req.body)
            .where(eq(blogPosts.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/blog/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
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
