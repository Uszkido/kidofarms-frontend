const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { poultryBatches } = require('../db/schema');
const { eq } = require('drizzle-orm');

// GET /api/poultry
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId || "demo-farmer-id";
        const batches = await db.select().from(poultryBatches);

        if (batches.length === 0) {
            return res.json([
                { id: "1", batch: "Batch A - Broilers", count: 2500, age: "4 Weeks", mortality: "1.2%", avgWeight: "1.5 kg" },
                { id: "2", batch: "Batch B - Layers", count: 5000, age: "18 Weeks", mortality: "0.5%", avgWeight: "2.1 kg" },
            ]);
        }

        const formatted = batches.map(b => ({
            id: b.id,
            batch: b.batchType,
            count: b.quantity,
            age: "Active", // Could compute from hatchDate
            mortality: `${b.mortalityRate || 0}%`,
            avgWeight: `${b.averageWeight || 0} kg`
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Poultry Error:", error);
        res.status(500).json({ error: 'Failed to fetch poultry data' });
    }
});

module.exports = router;
