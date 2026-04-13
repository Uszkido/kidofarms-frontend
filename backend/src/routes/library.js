const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/library - List all knowledge nodes
router.get('/', (req, res) => {
    try {
        const knowledgeDir = path.join(__dirname, '../../../frontend/src/knowledge');
        if (!fs.existsSync(knowledgeDir)) return res.json([]);

        const files = fs.readdirSync(knowledgeDir);
        const docs = files
            .filter(f => f.endsWith('.md'))
            .map(f => ({
                id: f.replace('.md', ''),
                title: f.replace('.md', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                fileName: f
            }));
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/library/:id - Get specific document content
router.get('/:id', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../../frontend/src/knowledge', `${req.params.id}.md`);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Document not found." });

        const content = fs.readFileSync(filePath, 'utf8');
        res.json({
            id: req.params.id,
            content
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/library - Inject new protocol
router.post('/', (req, res) => {
    try {
        const { id, content } = req.body;
        if (!id || !content) return res.status(400).json({ error: "Missing ID or content." });

        const fileName = `${id.toLowerCase().replace(/\s+/g, '_')}.md`;
        const filePath = path.join(__dirname, '../../../frontend/src/knowledge', fileName);

        fs.writeFileSync(filePath, content, 'utf8');
        res.json({ success: true, fileName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
