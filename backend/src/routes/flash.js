const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { notifications, users } = require('../db/schema');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/flash/trigger (Vendor triggers a flash harvest alert)
router.post('/trigger', authenticateToken, authorizeRoles('admin', 'sub-admin', 'vendor', 'farmer'), async (req, res) => {
    const { cropName, discount } = req.body;
    const safeCropName = typeof cropName === 'string' ? cropName.trim().slice(0, 100) : '';
    const safeDiscount = Number(discount);
    if (!safeCropName || !Number.isFinite(safeDiscount) || safeDiscount <= 0 || safeDiscount > 100) {
        return res.status(400).json({ error: 'Provide a crop name and a discount between 1 and 100.' });
    }
    try {
        const allUsers = await db.select({ id: users.id }).from(users);

        const notificationPromises = allUsers.map(user => {
            return db.insert(notifications).values({
                userId: user.id,
                title: `⚡ Flash Harvest: ${safeCropName}!`,
                message: `${req.user.name} just listed a fresh batch of ${safeCropName} at ${safeDiscount}% OFF! Only for the next 4 hours. 🌾`,
                type: 'alert'
            });
        });

        await Promise.all(notificationPromises);
        res.status(201).json({ message: `Flash alert sent to ${allUsers.length} users!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Flash trigger failed' });
    }
});

module.exports = router;
