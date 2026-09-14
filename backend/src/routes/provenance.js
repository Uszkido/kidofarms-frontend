const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');
const { cropLedger, products } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// GET provenance timeline for a product
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const ledger = await db.select()
            .from(cropLedger)
            .where(eq(cropLedger.productId, productId))
            .orderBy(desc(cropLedger.timestamp));

        return res.json(ledger);
    } catch (error) {
        console.error("Error fetching provenance", error);
        return res.status(500).json({ error: "Failed to fetch provenance ledger." });
    }
});

// POST a new state transition for a product (admin/system/farmer only in real app)
router.post('/:productId', authenticateToken, authorizeRoles('admin', 'sub-admin', 'vendor', 'farmer'), async (req, res) => {
    try {
        const { productId } = req.params;
        const { signatureDetails } = req.body;

        if (typeof signatureDetails !== 'string' || !signatureDetails.trim() || signatureDetails.length > 1000) {
            return res.status(400).json({ error: "signatureDetails is required." });
        }

        const [product] = await db.select({ ownerId: products.ownerId }).from(products).where(eq(products.id, productId)).limit(1);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        if (!['admin', 'sub-admin'].includes(req.user.role) && product.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only update provenance for products you own.' });
        }

        // Get the previous hash to form the chain
        const previousEntries = await db.select()
            .from(cropLedger)
            .where(eq(cropLedger.productId, productId))
            .orderBy(desc(cropLedger.timestamp))
            .limit(1);

        const previousHash = previousEntries.length > 0 ? previousEntries[0].hash : "0000000000000000000000000000000000000000000000000000000000000000";

        const timestamp = new Date().toISOString();
        const dataToHash = `${productId}|${signatureDetails.trim()}|${timestamp}|${previousHash}`;

        const newHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        const result = await db.insert(cropLedger).values({
            productId,
            signatureDetails: signatureDetails.trim(),
            hash: newHash
        }).returning();

        return res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error creating provenance hash", error);
        return res.status(500).json({ error: "Failed to append provenance ledger." });
    }
});

module.exports = router;
