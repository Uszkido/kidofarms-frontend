const express = require('express');
const router = express.Router();

// POST /api/agronomist/diagnose (Simulated AI Crop Disease Diagnosis)
router.post('/diagnose', async (req, res) => {
    const { cropType, description, imageBase64 } = req.body;

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 2000));

    const results = {
        Maize: {
            diagnosis: "Maize Lethal Necrosis (MLN)",
            confidence: 0.94,
            treatment: "Immediately uproot and burn infected plants. Rotate with non-cereals like beans for the next cycle.",
            urgency: "High"
        },
        Onion: {
            diagnosis: "Purple Blotch",
            confidence: 0.88,
            treatment: "Improve field drainage and apply copper-based fungicides. Ensure seeds are treated before planting.",
            urgency: "Medium"
        },
        Pepper: {
            diagnosis: "Bacterial Wilt",
            confidence: 0.91,
            treatment: "Avoid excessive irrigation. Introduce solarization to the soil for future plantings.",
            urgency: "High"
        }
    };

    const diagnosis = results[cropType] || {
        diagnosis: "Nutrition Deficiency (Nitrogen)",
        confidence: 0.75,
        treatment: "Increase manure or NPK 15-15-15 application. Ensure soil pH is between 6.0 and 7.0.",
        urgency: "Medium"
    };

    res.json({
        id: Math.random().toString(36).substr(2, 9),
        ...diagnosis,
        timestamp: new Date()
    });
});

module.exports = router;
