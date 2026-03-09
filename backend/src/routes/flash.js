const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { notifications, users } = require('../db/schema');

// POST /api/flash/trigger (Vendor triggers a flash harvest alert)
router.post('/trigger', async (req, res) => {
    const { cropName, discount, vendorName } = req.body;
    try {
        const allUsers = await db.select({ id: users.id }).from(users);

        const notificationPromises = allUsers.map(user => {
            return db.insert(notifications).values({
                userId: user.id,
                title: `⚡ Flash Harvest: ${cropName}!`,
                message: `${vendorName} just listed a fresh batch of ${cropName} at ${discount}% OFF! Only for the next 4 hours. 🌾`,
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
