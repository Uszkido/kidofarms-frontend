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

module.exports = router;
