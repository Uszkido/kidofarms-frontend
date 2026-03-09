const express = require('express');
const router = express.Router();
const { db } = require('../db');
const {
    // We'll define these in schema later, using raw SQL or generic select for now if needed.
    // For the demo, we'll use simulated data logic.
} = require('../db/schema');

// GET /api/horizon/pods (City-Nodes Monitoring)
router.get('/pods', async (req, res) => {
    try {
        // Simulated: In a real app we'd query the 'city_nodes' table
        const pods = [
            { id: '1', name: 'Lagos Pod A', location: 'Victoria Island', crop: 'Gourmet Lettuce', health: 98, moisture: 72, nutrients: 850, lights: true },
            { id: '2', name: 'Abuja Pod C', location: 'Maitama', crop: 'Microgreens', health: 94, moisture: 68, nutrients: 920, lights: true }
        ];
        res.json(pods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/horizon/exports (Global-Bridge Terminal)
router.get('/exports', async (req, res) => {
    try {
        const exports = [
            { id: 'e1', product: 'Cashew Nuts', destination: 'Dubai, UAE', volume: '2 Tons', price: '$4,500', status: 'boarding' },
            { id: 'e2', product: 'Ginger', destination: 'London, UK', volume: '500 KG', price: '£2,100', status: 'cleared' }
        ];
        res.json(exports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/horizon/circular (Waste-to-Wealth Tracker)
router.get('/circular', async (req, res) => {
    try {
        const stats = {
            totalWasteRecycled: '1.2 Tons',
            energyGenerated: '450 kWh',
            organicFertilizer: '800 KG',
            creditsEarned: 1250
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/horizon/academy (Skill Mastery)
router.get('/academy', async (req, res) => {
    try {
        const courses = [
            { id: 'c1', title: 'Precision Irrigation', category: 'Tech', points: 50, duration: '15 min' },
            { id: 'c2', title: 'Export Compliance 101', category: 'Business', points: 100, duration: '45 min' },
            { id: 'c3', title: 'Bio-Gas Setup', category: 'Circular', points: 75, duration: '30 min' }
        ];
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
