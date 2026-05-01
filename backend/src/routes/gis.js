const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { gisPlots } = require('../db/schema');
const { eq } = require('drizzle-orm');

// GET /api/gis
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId || "demo-farmer-id"; // fallback
        const plots = await db.select().from(gisPlots);

        // Return mocks if DB is empty to maintain UI structure
        if (plots.length === 0) {
            return res.json([
                { id: "1", name: "North Wing Plot", acreage: 12.5, crop: "Cassava", health: 95 },
                { id: "2", name: "River Bank Zone", acreage: 8.2, crop: "Maize", health: 88 },
                { id: "3", name: "Sunrise Plateau", acreage: 15.0, crop: "Soybeans", health: 92 },
            ]);
        }

        const formatted = plots.map(p => ({
            id: p.id,
            name: p.name,
            acreage: p.acreage || 0,
            crop: p.currentCrop || "N/A",
            health: p.fertilityScore || 0
        }));

        res.json(formatted);
    } catch (error) {
        console.error("GIS Error:", error);
        res.status(500).json({ error: 'Failed to fetch GIS plots' });
    }
});

module.exports = router;
