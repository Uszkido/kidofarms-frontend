const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { shipments, orders, activityLogs, users } = require('../db/schema');
const { eq, desc, sql } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET /api/shipments - List all active shipments
router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = db.select().from(shipments).orderBy(desc(shipments.updatedAt));
        if (req.user.role === 'carrier') {
            query = query.where(eq(shipments.distributorId, req.user.id));
        } else if (req.user.role !== 'admin' && req.user.role !== 'sub-admin') {
            // For customers, we need to join with orders
            const results = await db.select({
                id: shipments.id,
                orderId: shipments.orderId,
                status: shipments.status,
                origin: shipments.origin,
                destination: shipments.destination,
                currentLat: shipments.currentLat,
                currentLng: shipments.currentLng,
                updatedAt: shipments.updatedAt
            })
                .from(shipments)
                .innerJoin(orders, eq(shipments.orderId, orders.id))
                .where(eq(orders.userId, req.user.id));
            return res.json(results);
        }
        const allShipments = await query;
        res.json(allShipments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access logistics matrix' });
    }
});

// 2. POST /api/shipments/dispatch - Admin dispatches an order
router.post('/dispatch', authenticateToken, authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    const { orderId, distributorId, driverId, origin, destination, vehicleInfo } = req.body;
    try {
        const [inserted] = await db.insert(shipments).values({
            orderId,
            distributorId,
            driverId,
            origin,
            destination,
            vehicleInfo,
            status: 'pending'
        }).returning();

        // Update order status
        await db.update(orders).set({ orderStatus: 'shipped' }).where(eq(orders.id, orderId));

        await db.insert(activityLogs).values({
            action: 'SHIPMENT_DISPATCH',
            entity: 'shipments',
            details: { id: inserted.id, orderId, distributorId, driverId, vehicleInfo },
            userId: req.user.id
        });

        res.status(201).json(inserted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Logistics dispatch node failed' });
    }
});

// 3. PATCH /api/shipments/:id/track - Carrier updates coordinates/status
router.patch('/:id/track', authenticateToken, authorizeRoles('carrier', 'admin'), async (req, res) => {
    const { id } = req.params;
    const { lat, lng, status, temperatureAlert } = req.body;
    try {
        const [updated] = await db.update(shipments)
            .set({
                currentLat: sql`${lat}`,
                currentLng: sql`${lng}`,
                status: status || 'in_transit',
                temperatureAlert: !!temperatureAlert,
                updatedAt: new Date()
            })
            .where(eq(shipments.id, id))
            .returning();

        if (status === 'delivered') {
            await db.update(orders).set({ orderStatus: 'delivered' }).where(eq(orders.id, updated.orderId));
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tracking node' });
    }
});

// 4. GET /api/shipments/:trackingId/aftership - External Tracking Sync
router.get('/:trackingId/aftership', authenticateToken, async (req, res) => {
    const { trackingId } = req.params;
    try {
        const apiKey = process.env.AFTERSHIP_API_KEY;
        if (!apiKey) {
            return res.json({
                meta: { code: 200, message: 'Mock Mode Active - No API Key' },
                data: {
                    tracking: {
                        tracking_number: trackingId,
                        tag: 'InTransit',
                        subtag_message: 'Package arrived at Kido local sorting facility.',
                        checkpoints: [
                            { message: 'In Transit', city: 'Abuja', created_at: new Date().toISOString() }
                        ]
                    }
                }
            });
        }

        const response = await fetch(`https://api.aftership.com/tracking/2026-01/trackings/${trackingId}`, {
            method: 'GET',
            headers: {
                'as-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('AfterShip API error');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AfterShip Error:', error);
        res.status(500).json({ error: 'External tracking node offline.' });
    }
});

module.exports = router;
