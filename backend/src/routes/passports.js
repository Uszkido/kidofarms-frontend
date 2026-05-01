const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, products, orderItems, farmers } = require('../db/schema');
const { eq } = require('drizzle-orm');

// GET /api/passports/:orderId
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // Return structured mock data for now to maintain layout until full relations are seeded
        // In reality, this would join orders -> orderItems -> products -> farmers
        const passportMocks = {
            "ORD-9921": {
                productName: "Jos Grade-A Saffron",
                farmerName: "Audu Ibrahim",
                location: "Jos Plateau, Nigeria",
                harvestDate: "March 02, 2026",
                purityScore: "99.8%",
                soilType: "Volcanic Ash Hub",
                certification: "Kido Organic V5",
                image: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80",
                farmerBio: "Master producer with 15 years in Jos highlands. Specializes in exotic spices and climate-controlled nodes."
            },
            "ORD-9918": {
                productName: "Extra Virgin Hibiscus",
                farmerName: "Binta Zakari",
                location: "Kano State, Nigeria",
                harvestDate: "Feb 28, 2026",
                purityScore: "98.5%",
                soilType: "Alluvial Mesh",
                certification: "Kido Bio-Mesh Gold",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
                farmerBio: "Community lead in Kano's organic ring. Pioneer of multi-stage solar drying techniques."
            }
        };

        const data = passportMocks[orderId] || passportMocks["ORD-9921"];

        res.json(data);
    } catch (error) {
        console.error("Passport Error:", error);
        res.status(500).json({ error: 'Failed to fetch harvest passport' });
    }
});

module.exports = router;
