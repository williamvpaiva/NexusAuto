import express from 'express';
import path from 'path';
import memoryApi from '../../../.ai-factory/scripts/memory-api.js';

const router = express.Router();

// GET /api/memories?query=&limit=&offset=
router.get('/api/memories', async (req, res) => {
    try {
        const query = req.query.query || '';
        const memories = await memoryApi.getMemories(query);
        res.json(memories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar memórias' });
    }
});

// POST /api/memories/:id/private
router.post('/api/memories/:id/private', async (req, res) => {
    try {
        const id = req.params.id;
        await memoryApi.markPrivate(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar memória' });
    }
});

// PUT /api/memories/:id
router.put('/api/memories/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const content = req.body.content;
        await memoryApi.updateMemory(id, content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar memória' });
    }
});

// GET /api/memories/stream
router.get('/api/memories/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const onNewMemory = (memory) => {
        res.write(`data: ${JSON.stringify(memory)}\n\n`);
    };

    memoryApi.streamMemories().on('new_memory', onNewMemory);

    req.on('close', () => {
        memoryApi.streamMemories().removeListener('new_memory', onNewMemory);
    });
});

// Servir a interface web estática em /dashboard
const dashboardPath = path.resolve(__dirname, '../../../.ai-factory/web/memory-dashboard');
router.use('/dashboard', express.static(dashboardPath));

export default router;
