const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { drivers, users, carriers } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET /api/drivers - List all drivers
router.get('/', authenticateToken, authorizeRoles('admin', 'sub-admin', 'distributor'), async (req, res) => {
    try {
        const results = await db.select({
            id: drivers.id,
            status: drivers.status,
            vehicleType: drivers.vehicleType,
            vehiclePlate: drivers.vehiclePlate,
            licenseNumber: drivers.licenseNumber,
            userName: users.name,
            carrierName: carriers.companyName,
        })
            .from(drivers)
            .leftJoin(users, eq(drivers.userId, users.id))
            .leftJoin(carriers, eq(drivers.carrierId, carriers.id));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Logistics driver registry node offline' });
    }
});

// 2. POST /api/drivers - Register a new driver
router.post('/', authenticateToken, authorizeRoles('admin', 'distributor'), async (req, res) => {
    const { userId, carrierId, vehicleType, vehiclePlate, licenseNumber } = req.body;
    try {
        const [inserted] = await db.insert(drivers).values({
            userId,
            carrierId,
            vehicleType,
            vehiclePlate,
            licenseNumber,
            status: 'idle'
        }).returning();

        res.status(201).json(inserted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to bind driver to logistics network' });
    }
});

module.exports = router;
