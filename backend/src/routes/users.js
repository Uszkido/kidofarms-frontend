const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users } = require('../db/schema');
const { desc } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(users).orderBy(desc(users.createdAt));
        const safe = data.map(({ password, ...rest }) => rest);
        res.json(safe);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const [user] = await db.insert(users).values(req.body).returning();
        const { password, ...safe } = user;
        res.status(201).json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const [user] = await db.update(users)
            .set(req.body)
            .where(eq(users.id, req.params.id))
            .returning();
        const { password, ...safe } = user;
        res.json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        await db.delete(users).where(eq(users.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Initialization route for demo accounts
router.post('/init', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const demoUsers = [
            { name: 'Kido Admin', email: 'admin@kido.com', password: 'kido-admin-2026', role: 'admin' },
            { name: 'Kano Valley Farmer', email: 'vendor@kido.com', password: 'kido-vendor-2026', role: 'farmer' },
            { name: 'Elite Subscriber', email: 'subscriber@kido.com', password: 'kido-sub-2026', role: 'subscriber' },
            { name: 'Happy Shopper', email: 'shopper@kido.com', password: 'kido-shop-2026', role: 'customer' }
        ];

        for (const user of demoUsers) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.insert(users).values({
                ...user,
                password: hashedPassword
            }).onConflictDoNothing({ target: users.email });
        }

        res.json({ message: 'Demo accounts initialized successfully' });
    } catch (error) {
        console.error('User Init Error:', error);
        res.status(500).json({ error: 'Failed to initialize demo accounts' });
    }
});

module.exports = router;
