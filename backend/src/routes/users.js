const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users } = require('../db/schema');
const { desc, eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// User management belongs to the protected admin CMS. Public registration is
// handled by /api/auth/signup and its role-specific application routes.
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'sub-admin'));

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
        const { name, email, password: requestedPassword, role: requestedRole, phone, permissions } = req.body;
        if (!name || !email || !requestedPassword) return res.status(400).json({ error: 'Name, email, and password are required' });
        if (requestedRole && req.user.role !== 'admin') return res.status(403).json({ error: 'Only admins can assign roles' });
        const [user] = await db.insert(users).values({
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            password: await bcrypt.hash(String(requestedPassword), 12),
            role: requestedRole || 'customer',
            phone: phone || null,
            permissions: Array.isArray(permissions) ? permissions : [],
        }).returning();
        const { password: _password, ...safe } = user;
        res.status(201).json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res) => {
    try {
        const { password, role, permissions, ...updates } = req.body;
        if (role && req.user.role !== 'admin') return res.status(403).json({ error: 'Only admins can change roles' });
        const safeUpdates = {
            ...updates,
            ...(role ? { role } : {}),
            ...(Array.isArray(permissions) && req.user.role === 'admin' ? { permissions } : {}),
            ...(password ? { password: await bcrypt.hash(String(password), 12) } : {}),
        };
        const [user] = await db.update(users)
            .set(safeUpdates)
            .where(eq(users.id, req.params.id))
            .returning();
        const { password: _password, ...safe } = user;
        res.json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(users).where(eq(users.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
