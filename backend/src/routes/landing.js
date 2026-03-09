const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { eq } = require('drizzle-orm');

// Get all landing sections
router.get('/', async (req, res) => {
    try {
        // Use db.query to avoid potential require circularity with schema.js
        const sections = await db.query.landingSections.findMany();

        const config = sections.reduce((acc, section) => {
            acc[section.id] = section.content;
            return acc;
        }, {});
        res.json(config);
    } catch (error) {
        console.error('Landing API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch landing content' });
    }
});

// Update a specific section
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        // We still need the table object for inserts/updates if we don't have it on db.query
        // But for update we can try to use the schema from db
        const { landingSections } = require('../db/schema');

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
            {
                id: 'recommended', content: {
                    title: "Recommended", titleItalic: "For You", badge: "LIVE MARKET", items: [
                        { name: "Bulbous Onions", farmer: "Musa Ibrahim", price: "₦4,500", rating: "4.9", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=2000" },
                        { name: "Organic Strawberries", farmer: "Grace Oke", price: "₦12,000", rating: "5.0", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2000" }
                    ]
                }
            },
            {
                id: 'ticker', content: {
                    items: [
                        { crop: "Sweet Maize", price: "₦450/kg", change: "+12.4%", trend: "up", region: "Jos" },
                        { crop: "Red Peppers", price: "₦1,200/bag", change: "-2.1%", trend: "down", region: "Kano" }
                    ]
                }
            },
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
