const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { farmers, harvests, sensors, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// --- THE YIELD-SHIELD (INSURANCE) ---
// Analyze sensor data to determine risk and insurance eligibility
router.get('/shield/status/:farmerId', async (req, res) => {
    try {
        const farmerHarvests = await db.select().from(harvests).limit(5); // Simulated
        const riskScore = Math.floor(Math.random() * 30) + 10; // Simulated risk algorithm

        res.json({
            status: "Active Protection",
            riskScore: riskScore, // 100 is high risk
            coverage: "₦5,000,000",
            insuredCrops: farmerHarvests.map(h => h.cropName),
            nextAssessment: "24h"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE MASTERY ACADEMY (RPG SYSTEM) ---
// Get farmer's leveling data
router.get('/mastery/:userId', async (req, res) => {
    try {
        const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, req.params.userId));
        if (!farmer) return res.status(404).json({ error: "Farmer not found" });

        const badges = [
            { id: 1, name: "Soil Architect", icon: "Sprout", earned: true },
            { id: 2, name: "Logistics Ninja", icon: "Truck", earned: farmer.masteryPoints > 500 },
            { id: 3, name: "Export Titan", icon: "Globe", earned: farmer.isExportCertified }
        ];

        res.json({
            level: farmer.masteryLevel,
            points: farmer.masteryPoints,
            nextLevelAt: farmer.masteryLevel * 1000,
            badges: badges,
            ranking: "Top 5% in " + farmer.farmLocationState
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE GLOBAL BRIDGE (EXPORT HUB) ---
// Process export certification and documents
router.get('/bridge/certification/:userId', async (req, res) => {
    try {
        const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, req.params.userId));

        res.json({
            isCertified: farmer?.isExportCertified || false,
            docs: [
                { name: "Phytosanitary Cert #2026-X", status: "Approved" },
                { name: "Global GAP Audit", status: "Pending" },
                { name: "Organic Traceability Log", status: "Active" }
            ],
            globalNodes: ["London Hub", "Manhattan Fresh", "Berlin Organics"]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE ENERGY NODE ---
// Marketplace for green tech paid via waste credits
router.get('/energy/marketplace', async (req, res) => {
    res.json([
        { id: "e1", name: "Solar Irrigation Kit v2", cost: "1,200 Waste Credits", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80" },
        { id: "e2", name: "Biogas Digester (Medium)", cost: "2,500 Waste Credits", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80" },
        { id: "e3", name: "Waste-to-Fertilizer Unit", cost: "800 Waste Credits", img: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80" }
    ]);
});

module.exports = router;
