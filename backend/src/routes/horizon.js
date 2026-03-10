const express = require('express');
const router = express.Router();
const { db } = require('../db');
const {
    farmers,
    harvests,
    sensors,
    users,
    yieldShieldPolicies,
    storageNodes,
    heritagePassports,
    energyMarketplace,
    products
} = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// --- THE YIELD-SHIELD (INSURANCE) ---
router.get('/shield/status/:farmerId', async (req, res) => {
    try {
        const policies = await db.select()
            .from(yieldShieldPolicies)
            .where(eq(yieldShieldPolicies.farmerId, req.params.farmerId))
            .limit(1);

        const [policy] = policies;

        if (!policy) {
            return res.json({
                status: "Not Insured",
                riskScore: 25,
                coverage: "₦0",
                insuredCrops: [],
                nextAssessment: "Now"
            });
        }

        const harvest = await db.select().from(harvests).where(eq(harvests.id, policy.harvestId)).limit(1);

        res.json({
            status: policy.status === 'active' ? "Active Protection" : "Protocol Triggered",
            riskScore: policy.status === 'active' ? 15 : 85,
            coverage: `₦${policy.coverageAmount}`,
            insuredCrops: harvest.length > 0 ? [harvest[0].cropName] : ["Unknown crop"],
            nextAssessment: "Real-time"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE COLD-VAULT (STORAGE NODES) ---
router.get('/vaults/:ownerId', async (req, res) => {
    try {
        const nodes = await db.select()
            .from(storageNodes)
            .where(eq(storageNodes.ownerId, req.params.ownerId));
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/vaults', async (req, res) => {
    try {
        const [newNode] = await db.insert(storageNodes).values(req.body).returning();
        res.status(201).json(newNode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE HERITAGE DNA (TRACEABILITY) ---
router.get('/dna/:productId', async (req, res) => {
    try {
        const [passport] = await db.select()
            .from(heritagePassports)
            .where(eq(heritagePassports.productId, req.params.productId))
            .limit(1);

        if (!passport) return res.status(404).json({ error: "DNA Passport not found" });

        const [product] = await db.select().from(products).where(eq(products.id, req.params.productId)).limit(1);
        const [farmer] = await db.select().from(users).where(eq(users.id, passport.farmerId)).limit(1);

        res.json({
            ...passport,
            productName: product?.name,
            farmerName: farmer?.name,
            location: "Verified Kano Node"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- THE ENERGY NODE (WASTE-TO-CREDIT) ---
router.get('/energy/credits/:userId', async (req, res) => {
    try {
        const transactions = await db.select()
            .from(energyMarketplace)
            .where(eq(energyMarketplace.sellerId, req.params.userId));

        const totalCredits = transactions.reduce((acc, curr) => acc + (curr.status === 'sold' ? curr.creditsOffered : 0), 0);

        res.json({
            earnedCredits: totalCredits,
            activeListings: transactions.filter(t => t.status === 'available').length,
            history: transactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/energy/list', async (req, res) => {
    try {
        const [newListing] = await db.insert(energyMarketplace).values(req.body).returning();
        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GLOBAL BRIDGE ---
let exportRoutes = []; // Mock for now until we move to real bridge table
router.get('/exports', async (req, res) => {
    res.json(exportRoutes);
});

router.post('/exports', async (req, res) => {
    const newExport = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date() };
    exportRoutes.push(newExport);
    res.status(201).json(newExport);
});

module.exports = router;
