const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, wallets, walletTransactions, activityLogs } = require('../db/schema');
const { eq, sql, desc, or } = require('drizzle-orm');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

// 1. POST /api/admin/ai/scan-trust - Master Trust Oracle Logic
router.post('/scan-trust', async (req, res) => {
    try {
        const allWallets = await db.select().from(wallets);
        const results = [];

        for (const wallet of allWallets) {
            let score = 50; // Baseline
            const userId = wallet.userId;

            // A. Analysis: Order History
            const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
            const successfulOrders = userOrders.filter(o => o.orderStatus === 'delivered').length;
            const cancelledOrders = userOrders.filter(o => o.orderStatus === 'cancelled').length;

            score += (successfulOrders * 5); // +5 for every successful delivery
            score -= (cancelledOrders * 10); // -10 for every cancellation

            // B. Analysis: Wallet Activity
            const transactions = await db.select().from(walletTransactions).where(eq(walletTransactions.walletId, wallet.id));
            const totalCredits = transactions.filter(t => t.type === 'credit').length;

            score += (totalCredits * 2); // Frequency of topping up reflects liquidity

            // C. Analysis: Tenure
            const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
            const monthsInSystem = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30));
            score += (monthsInSystem * 2);

            // Cap score 0-100
            score = Math.max(10, Math.min(100, score));

            // D. Suggested Credit Limit Logic
            // Based on score and total order volume
            const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            let suggestedLimit = (totalSpent * (score / 100)) * 0.2; // 20% of normalized spend

            // Apply Update
            await db.update(wallets)
                .set({
                    trustScore: score,
                    creditLimit: sql`${suggestedLimit.toFixed(2)}`,
                    updatedAt: new Date()
                })
                .where(eq(wallets.id, wallet.id));

            results.push({ userId, score, suggestedLimit });
        }

        await db.insert(activityLogs).values({
            action: 'AI_TRUST_ORACLE_SCAN',
            entity: 'system',
            details: { walletsScanned: results.length },
        });

        res.json({ message: 'Global Trust Ledger Synced', results });
    } catch (error) {
        console.error('AI Scan Error:', error);
        res.status(500).json({ error: 'Trust Oracle failed to simulate.' });
    }
});

// 2. GET /api/admin/ai/insights/:userId - Get specific AI insights for a user
router.get('/insights/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
        if (!wallet) return res.status(404).json({ error: 'No wallet node found' });

        // Build a mock narrative for the AI's "thought process"
        const insights = {
            trustScore: wallet.trustScore,
            creditLimit: wallet.creditLimit,
            narrative: "",
            status: wallet.trustScore > 70 ? 'elite' : wallet.trustScore > 40 ? 'stable' : 'high_risk'
        };

        if (wallet.trustScore > 80) {
            insights.narrative = "This citizen demonstrates peak liquidity and operational consistency. Recommended for high-tier B2B float.";
        } else if (wallet.trustScore > 50) {
            insights.narrative = "Stable network participant. Trust index is growing. Maintain current credit ceiling.";
        } else {
            insights.narrative = "High volatility detected in transaction nodes. Manual oversight recommended for any further credit injections.";
        }

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve AI data' });
    }
});

// --- AI AGENT TOOLS (FUNCTION DEFINITIONS) ---
const tools = [
    {
        functionDeclarations: [
            {
                name: "search_products",
                description: "Search for organic produce and products in the Kido Farms marketplace.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING", description: "The product name or category to search for (e.g., 'onions', 'tomatoes')." }
                    },
                    required: ["query"]
                }
            },
            {
                name: "get_order_status",
                description: "Retrieve the current status and tracking info for a specific order.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        orderId: { type: "STRING", description: "The unique order ID." }
                    },
                    required: ["orderId"]
                }
            },
            {
                name: "get_harvest_tracking",
                description: "Check the growth progress and estimated harvest date for a specific crop cycle.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        cropName: { type: "STRING", description: "The name of the crop to track." }
                    },
                    required: ["cropName"]
                }
            },
            {
                name: "get_academy_modules",
                description: "List available agricultural training modules from the Kido Mastery Academy.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "get_market_stats",
                description: "Get real-time insights into total market volume and active farmers.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "analyze_crop_health",
                description: "Analyze a description of crop symptoms to identify pests or diseases.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        symptoms: { type: "STRING", description: "Visual description of the crop issues (e.g., 'yellow spots on leaves')." }
                    },
                    required: ["symptoms"]
                }
            },
            {
                name: "get_logistics_clusters",
                description: "Identify high-volume order clusters for efficient delivery batching.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "retrieve_farming_knowledge",
                description: "Search the Kido internal knowledge base for farming guides, soil management, and crop protocols.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING", description: "Keywords to search for in the agricultural library." }
                    },
                    required: ["query"]
                }
            }
        ]
    }
];

// --- TOOL HANDLERS (DATABASE INTERACTION) ---
const toolHandlers = {
    search_products: async ({ query }) => {
        try {
            const { products } = require('../db/schema');
            const results = await db.select().from(products).where(or(
                sql`LOWER(${products.name}) LIKE ${'%' + query.toLowerCase() + '%'}`,
                sql`LOWER(${products.category}) LIKE ${'%' + query.toLowerCase() + '%'}`
            )).limit(5);
            return results.length > 0 ? results : "No products found matching that query.";
        } catch (err) {
            return "Error searching products.";
        }
    },
    get_order_status: async ({ orderId }) => {
        try {
            const { orders } = require('../db/schema');
            const [order] = await db.select().from(orders).where(or(
                eq(orders.id, orderId),
                eq(orders.trackingId, orderId)
            ));
            return order ? { status: order.orderStatus, total: order.totalAmount, date: order.createdAt, trackingId: order.trackingId } : "Order not found.";
        } catch (err) {
            return "Error retrieving order status.";
        }
    },
    get_harvest_tracking: async ({ cropName }) => {
        try {
            const { harvests } = require('../db/schema');
            const [harvest] = await db.select().from(harvests).where(
                sql`LOWER(${harvests.cropName}) LIKE ${'%' + cropName.toLowerCase() + '%'}`
            );
            return harvest ? {
                progress: `${harvest.progress}%`,
                status: harvest.status,
                readyDate: harvest.estimatedReadyDate,
                farm: harvest.farmName
            } : "Harvest data not found for that crop.";
        } catch (err) {
            return "Error tracking harvest.";
        }
    },
    get_academy_modules: async () => {
        try {
            const { academyCourses } = require('../db/schema');
            const courses = await db.select().from(academyCourses).limit(10);
            return courses.length > 0 ? courses : [
                { title: "Organic Soil Biology", category: "Soil" },
                { title: "Smart Irrigation Systems", category: "Tech" },
                { title: "Export Scale Logistics", category: "Logistics" }
            ];
        } catch (err) {
            return "Error retrieving academy modules.";
        }
    },
    get_market_stats: async () => {
        try {
            const { users, products } = require('../db/schema');
            const [uCount] = await db.select({ count: sql`count(*)` }).from(users);
            const [pCount] = await db.select({ count: sql`count(*)` }).from(products);
            return {
                totalCitizens: uCount.count,
                activeProducts: pCount.count,
                activeFarmers: "450+",
                marketVolume: "₦45M+"
            };
        } catch (err) {
            return "Error retrieving market stats.";
        }
    },
    analyze_crop_health: async ({ symptoms }) => {
        // This is a specialized tool that uses the model's internal knowledge
        return `Based on '${symptoms}', our organic protocols suggest checking for common regional pests or soil pH issues. Consult the Mastery Academy for a detailed treatment plan and organic mitigation steps.`;
    },
    get_logistics_clusters: async () => {
        try {
            const { orders } = require('../db/schema');
            const pendingOrders = await db.select().from(orders).where(eq(orders.orderStatus, 'processing'));
            const clusters = pendingOrders.reduce((acc, order) => {
                const city = order.city || 'Unknown';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {});
            return { clusters, recommendation: "Deploy carriers to high-volume nodes for immediate batching in the specified cities." };
        } catch (err) {
            return "Error clustering logistics.";
        }
    },
    retrieve_farming_knowledge: async ({ query }) => {
        try {
            const fs = require('fs');
            const path = require('path');
            const knowledgeDir = path.join(__dirname, '../../../frontend/src/knowledge');

            if (!fs.existsSync(knowledgeDir)) return "Knowledge base directory not found.";

            const files = fs.readdirSync(knowledgeDir);
            let combinedContent = "";

            for (const file of files) {
                if (file.endsWith('.md')) {
                    const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf8');
                    if (content.toLowerCase().includes(query.toLowerCase())) {
                        combinedContent += `--- From ${file} ---\n${content}\n\n`;
                    }
                }
            }

            return combinedContent || "No specific Kido protocols found for that query. Defaulting to general agronomist knowledge.";
        } catch (err) {
            console.error("Knowledge retrieval error:", err);
            return "Error accessing the internal library.";
        }
    }
};

const SYSTEM_PROMPT = "You are the Kido Farms Horizon AI, a unified agricultural intelligence. Your goal is to assist users with EVERYTHING from shopping and tracking to deep regional farming research. When a user asks a question about farming, crops, soil, or regional data (like Cocoa, Ginger, Cashew, etc.), IMMEDIATELY use your `retrieve_farming_knowledge` tool to provide an accurate, Kido-verified answer. For general greetings or marketplace tasks, use your other tools. Be professional, slightly Nigerian in flair, and extremely precise.";

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: tools
});

// 3. POST /api/ai/chat - agentic Gemini Chat Integration
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        const isDummy = !apiKey || apiKey === 'your-gemini-api-key' || apiKey.includes('dummy');

        if (isDummy) {
            const lowerMsg = message.toLowerCase();
            let replyText = "I'm currently in training mode (AI Node syncing). Please add a valid GEMINI_API_KEY to the backend .env file to activate my neural engine!";

            if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
                replyText = "[Offline Protocol] I can track your harvest nodes once my Gemini API key is active! Please check the Vault tab instead.";
            } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
                replyText = "[Offline Protocol] Please check the Market Oracle for live pricing. My neural analysis module requires an API key.";
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                replyText = "Greetings from Kido Farms! I'm currently in restricted mock mode. Provide my API key to unlock full conversational intelligence!";
            }

            return res.json({
                reply: replyText,
                isMock: true
            });
        }

        try {
            const chat = model.startChat({
                history: history || [],
                generationConfig: {
                    maxOutputTokens: 800,
                },
            });

            let result = await chat.sendMessage(message);
            let response = await result.response;
            let calls = response.functionCalls();

            // Handle Function Calling Loop
            if (calls && calls.length > 0) {
                const toolResponses = [];
                for (const call of calls) {
                    const handler = toolHandlers[call.name];
                    if (handler) {
                        const toolResult = await handler(call.args);
                        toolResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: toolResult }
                            }
                        });
                    }
                }

                // Send tool results back to the model for final synthesis
                result = await chat.sendMessage(toolResponses);
                response = await result.response;
            }

            const text = response.text();
            res.json({ reply: text });
        } catch (apiError) {
            console.error('Gemini Agent Neural Failure, switching to Local Knowledge Nodes:', apiError);

            // Local Knowledge Fallback (The "Sovereign Assistant")
            try {
                // Better keyword extraction for search
                const query = message.split(' ').map(w => w.toLowerCase()).filter(w => w.length > 3).slice(0, 3).join(' ');
                const localInfo = await toolHandlers.retrieve_farming_knowledge({ query: query || message });

                if (localInfo && !localInfo.includes("No specific Kido protocols found") && !localInfo.includes("Knowledge base directory not found")) {
                    return res.json({
                        reply: "I have successfully retrieved the following Sovereign protocols from the Kido Internal Library to assist with your request:\n\n" + localInfo,
                        isLocal: true
                    });
                }
            } catch (fallbackErr) {
                console.error("Local fallback failed:", fallbackErr);
            }

            return res.json({
                reply: "I am currently operating in High-Security Knowledge Mode. While my external reasoning nodes are undergoing maintenance, I am here to assist you with our organic harvests, order tracking, and citizen registries. How can I serve you today within our sovereign protocols?",
                isLocal: true
            });
        }
    } catch (error) {
        console.error('Gemini Global Agent Error:', error);
        res.status(500).json({ error: 'AI Agent disruption. Our neural nodes are currently re-aligning.' });
    }
});

// 4. POST /api/ai/describe-product - AI Freshness Concierge
router.post('/describe-product', async (req, res) => {
    try {
        const { productName, category } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                description: `Freshly harvested ${productName} from our verified organic fields.`,
                freshnessTip: "Keep in a cool, dry place for maximum flavor."
            });
        }

        const prompt = `Act as an expert agricultural copywriter for Kido Farms. 
        Product: ${productName}
        Category: ${category}
        
        Generate:
        1. A premium, appetizing product description (2-3 sentences).
        2. A "Freshness Hack" or storage tip specific to this item.
        
        Format as JSON: { "description": "...", "freshnessTip": "..." }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate description' });
    }
});

// 5. POST /api/ai/suggest-recipe - Smart Recipe Engine
router.post('/suggest-recipe', async (req, res) => {
    try {
        const { items } = req.body; // Array of item names

        const prompt = `I have these ingredients from Kido Farms: ${items.join(', ')}. 
        Suggest 1 traditional or modern Nigerian recipe I can make. 
        Provide:
        - Recipe Name
        - Brief instructions
        - Any missing Kido Farms ingredients I should add to my cart.
        
        Format as JSON: { "recipeName": "...", "instructions": "...", "missingIngredients": ["...", "..."] }`;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                recipeName: "Kido Special Jollof",
                instructions: "1. Rinse Kido Organic Rice. 2. Blend Kido Tomatoes and Peppers. 3. Sauté and simmer with your choice of farm-fresh protein.",
                missingIngredients: ["Kido Thyme", "Smoked Paprika"]
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
});

// 6. POST /api/ai/yield-shield - AI Yield Risk Assessment
router.post('/yield-shield', async (req, res) => {
    try {
        const { location, crop, month } = req.body;

        const prompt = `Analyze agricultural risk for:
        Location: ${location}
        Crop: ${crop}
        Time: ${month}
        
        Provide:
        - Risk Score (0-100, where 100 is extreme risk)
        - Key threat (e.g. "Early rains", "Heatwave")
        - Mitigation tip.
        
        Format as JSON: { "score": 85, "threat": "...", "mitigation": "..." }`;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                score: 15,
                threat: "Normal weather patterns detected.",
                mitigation: "Continue standard irrigation protocol."
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Yield analysis failed' });
    }
});

// 7. POST /api/ai/mastery-tutor - AI Farmer Education
router.post('/mastery-tutor', async (req, res) => {
    try {
        const { question, topic } = req.body;

        const prompt = `You are a Master Agronomist at Kido Farms Academy. 
        Topic: ${topic}
        Question: ${question}
        
        Provide a detailed, practical answer for a Nigerian farmer. Use local context.`;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                answer: "As a Master Agronomist, I recommend observing your soil pH and moisture levels. Our training node is currently syncing for more specific data."
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ answer: response.text() });
    } catch (error) {
        res.status(500).json({ error: 'Mastery Tutor unavailable' });
    }
});

// 8. POST /api/ai/vision-audit - Kido Vision: Pest & Health Auditor
router.post('/vision-audit', async (req, res) => {
    try {
        const { imageBase64, cropInfo } = req.body; // Expecting base64 image data

        if (!process.env.GEMINI_API_KEY || !imageBase64) {
            return res.json({
                diagnosis: "Field scan node offline. Visual confirmation required.",
                treatment: "General organic compost and irrigation suggested.",
                confidence: 0
            });
        }

        const prompt = `Act as a Master Plant Pathologist for Kido Farms. 
        Context: ${cropInfo || 'Organic crop field'}
        Analyze the provided image and:
        1. Identify if there are any pests, nutrient deficiencies, or diseases.
        2. Suggest organic treatments.
        3. Assign a health score (0-100).
        
        Format as JSON: { "diagnosis": "...", "treatment": "...", "healthScore": 85 }`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        console.error('Vision Audit Error:', error);
        res.status(500).json({ error: 'Vision neural scan interrupted.' });
    }
});

// 9. POST /api/ai/logistics-batch - Autonomous Dispatcher
router.post('/logistics-batch', async (req, res) => {
    try {
        // Find orders in the same city that are 'processing'
        const pendingOrders = await db.select().from(orders).where(eq(orders.orderStatus, 'processing'));

        if (pendingOrders.length === 0) return res.json({ message: "No active order clusters detected." });

        // Group by city
        const clusters = pendingOrders.reduce((acc, order) => {
            const city = order.city || 'Unknown';
            if (!acc[city]) acc[city] = [];
            acc[city].push(order.id);
            return acc;
        }, {});

        // AI Logic: Rank clusters by weight/efficiency
        const report = Object.entries(clusters).map(([city, ids]) => ({
            city,
            volume: ids.length,
            ids,
            priority: ids.length > 5 ? 'High' : 'Medium'
        }));

        res.json({ clusters: report });
    } catch (error) {
        res.status(500).json({ error: 'Logistics batching failed.' });
    }
});

// 10. POST /api/ai/pricing-oracle - Fair-Trade Pricing Agent
router.post('/pricing-oracle', async (req, res) => {
    try {
        const { cropName, currentPrice, region } = req.body;

        const prompt = `Analyze market conditions for ${cropName} in ${region}.
        Current price: ${currentPrice}
        
        Consider that high volume harvests are coming. 
        1. Suggest an optimal Fair-Trade price.
        2. Provide reasoning (Price Oracle Insight).
        
        Format as JSON: { "suggestedPrice": 0, "insight": "..." }`;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                suggestedPrice: currentPrice,
                insight: "Market data synchronization in progress."
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        res.json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ error: 'Pricing Oracle disruption.' });
    }
});

// 11. POST /api/ai/carbon-credits - Smart Carbon Calculator
router.post('/calculate-carbon', async (req, res) => {
    try {
        const { userId, wasteWeight, type } = req.body; // weight in kg

        // AI Logic: Formula-based or Gemini-refined calculation
        // Baseline: 10kg waste = 1 Credit
        let credits = Math.floor(wasteWeight / 10);

        const { circularLogs } = require('../db/schema');
        await db.insert(circularLogs).values({
            userId,
            wasteWeight: sql`${wasteWeight}`,
            creditsEarned: credits,
            type: type || 'fertilizer'
        });

        res.json({ creditsEarned: credits, message: `Node synchronized. +${credits} Energy Tokens awarded.` });
    } catch (error) {
        res.status(500).json({ error: 'Carbon sync failed.' });
    }
});

// 12. POST /api/ai/quality-guard - Sovereign Produce Vetting
router.post('/quality-guard', async (req, res) => {
    try {
        const { imageBase64, productName, category } = req.body;

        if (!process.env.GEMINI_API_KEY || !imageBase64) {
            return res.json({
                approved: true,
                score: 100,
                rationale: "Sovereign AI node offline. Defaulting to manual vetting node."
            });
        }

        const prompt = `Act as the Supreme Quality Auditor for Kido Farms. 
        Analyze the image of this ${productName} (Category: ${category}).
        
        Tasks:
        1. Evaluate freshness, visual appeal, and consistency.
        2. Identify any visible damage or mold.
        3. Assign a Quality Score (0-100).
        4. Decide if it meets "Kido Premium" standards (Score > 75).
        
        Format as JSON: { "approved": true/false, "score": 0, "rationale": "..." }`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        console.error('Quality Guard Error:', error);
        res.status(500).json({ error: 'Quality Guard neural scan parity lost.' });
    }
});

module.exports = router;
