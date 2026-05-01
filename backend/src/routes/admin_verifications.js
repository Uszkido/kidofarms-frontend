const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { farmers, vendors, carriers, users } = require('../db/schema');
const { eq, and, or } = require('drizzle-orm');

// GET /api/admin/verifications/pending
router.get('/pending', async (req, res) => {
    try {
        const [pendingFarmers, pendingVendors, pendingCarriers] = await Promise.all([
            db.select({
                id: farmers.id,
                entityName: farmers.farmName,
                status: farmers.status,
                type: db.select({ val: 'farmer' }), // help identify
                documents: farmers.verificationDocuments,
                score: farmers.aiConfidenceScore,
                userName: users.name,
                userEmail: users.email,
                createdAt: farmers.createdAt
            }).from(farmers).leftJoin(users, eq(farmers.userId, users.id)).where(eq(farmers.status, 'pending')),

            db.select({
                id: vendors.id,
                entityName: vendors.businessName,
                status: vendors.status,
                type: db.select({ val: 'vendor' }),
                documents: vendors.verificationDocuments,
                score: vendors.aiConfidenceScore,
                userName: users.name,
                userEmail: users.email,
                createdAt: vendors.createdAt
            }).from(vendors).leftJoin(users, eq(vendors.userId, users.id)).where(eq(vendors.status, 'pending')),

            db.select({
                id: carriers.id,
                entityName: carriers.companyName,
                status: carriers.status,
                type: db.select({ val: 'carrier' }),
                documents: carriers.createdAt, // Carriers might not have docs in schema yet, using creation date as placeholder
                score: db.select({ val: 75 }), // Mock score
                userName: users.name,
                userEmail: users.email,
                createdAt: carriers.createdAt
            }).from(carriers).leftJoin(users, eq(carriers.userId, users.id)).where(eq(carriers.status, 'pending'))
        ]);

        // Fix type labels since sub-queries in select are tricky in some versions
        const formattedFarmers = pendingFarmers.map(f => ({ ...f, type: 'farmer' }));
        const formattedVendors = pendingVendors.map(v => ({ ...v, type: 'vendor' }));
        const formattedCarriers = pendingCarriers.map(c => ({ ...c, type: 'carrier' }));

        res.json([...formattedFarmers, ...formattedVendors, ...formattedCarriers]);
    } catch (error) {
        console.error('Verifications Error:', error);
        res.status(500).json({ error: 'Failed to fetch pending verifications' });
    }
});

module.exports = router;
