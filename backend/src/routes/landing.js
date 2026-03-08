const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { landingSections } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Get all landing sections
router.get('/', async (req, res) => {
    try {
        const sections = await db.select().from(landingSections);
        const config = sections.reduce((acc, section) => {
            acc[section.id] = section.content;
            return acc;
        }, {});
        res.json(config);
    } catch (error) {
        console.error('Landing API Error:', error);
        res.status(500).json({ error: 'Failed to fetch landing content' });
    }
});

// Update a specific section
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        await db.insert(landingSections)
            .values({ id, content })
            .onConflictDoUpdate({
                target: landingSections.id,
                set: { content, updatedAt: new Date() }
            });
        res.json({ message: `Section ${id} updated`, content });
    } catch (error) {
        console.error('Landing API Update Error:', error);
        res.status(500).json({ error: 'Failed to update landing content' });
    }
});

// Initialization route
router.post('/init', async (req, res) => {
    try {
        const defaultContent = [
            { id: 'hero', content: { badge: "Harvest 2026", title: "Pure Organic", titleItalic: "Direct From Source", subtitle: "Connecting premium Nigerian farms with quality-focused homes.", btn1Text: "Shop Harvest", btn1Link: "/shop", btn2Text: "Join Network", btn2Link: "/register" } },
            { id: 'harvesting', content: { region: "Kano & Jos Districts", statusLabel: "Peak Harvest", cycle: "Strawberries, Onions, Maize", deliveryInfo: "Next delivery: Tuesday", btnText: "Track Live" } },
            { id: 'trends', content: { label: "Live Market", title: "Regional", titleItalic: "Demand Shifts", subtitle: "Real-time insights from the Kido network.", stat1Value: "94%", stat1Label: "Freshness Index", stat2Value: "12k", stat2Label: "Active Baskets", btnText: "View Insights" } },
            { id: 'advantage', content: { title: "The Kido", titleItalic: "Advantage", subtitle: "Why 15,000+ families trust our network.", items: [{ title: "Verified Origin", desc: "Every seed is tracked from planting to your plate." }, { title: "Fair Pricing", desc: "Direct farmer links ensure 30% better value." }] } },
            { id: 'farmer_cta', content: { title: "Empowering", titleItalic: "The Soil", subtitle: "Join 500+ verified farmers scale their reach.", btn1Text: "Register Farm", btn2Text: "Download App" } }
        ];

        for (const section of defaultContent) {
            await db.insert(landingSections)
                .values(section)
                .onConflictDoNothing();
        }

        res.json({ message: 'Landing CMS initialized with default nodes' });
    } catch (error) {
        console.error('Landing Init Error:', error);
        res.status(500).json({ error: 'Failed to initialize landing content' });
    }
});

module.exports = router;
