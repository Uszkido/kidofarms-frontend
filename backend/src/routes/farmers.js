const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { farmers, users } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Get all farmers for admin
router.get('/', async (req, res) => {
    try {
        const allFarmers = await db.select({
            id: farmers.id,
            farmName: farmers.farmName,
            status: farmers.status,
            farmLocationState: farmers.farmLocationState,
            verificationDocuments: farmers.verificationDocuments,
            aiConfidenceScore: farmers.aiConfidenceScore,
            createdAt: farmers.createdAt,
            userName: users.name,
            userEmail: users.email,
            phone: users.phone
        })
            .from(farmers)
            .leftJoin(users, eq(farmers.userId, users.id));

        res.json(allFarmers);
    } catch (error) {
        console.error('Farmers Error:', error);
        res.status(500).json({ error: 'Failed to fetch farmers' });
    }
});

// Update farmer status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await db.update(farmers)
            .set({ status })
            .where(eq(farmers.id, id));

        res.json({ message: `Farmer status updated to ${status}` });
    } catch (error) {
        console.error('Farmer Status Update Error:', error);
        res.status(500).json({ error: 'Failed to update farmer status' });
    }
});

module.exports = router;
