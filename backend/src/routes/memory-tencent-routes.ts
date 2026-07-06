import express from 'express';
import TencentMemoryBridge from '../../../.ai-factory/scripts/tencent-memory-bridge.js';

const router = express.Router();
const bridge = new TencentMemoryBridge();

router.get('/status', (req, res) => {
  res.json({ available: bridge.isAvailable() });
});

router.post('/offload', async (req, res) => {
  const { taskId, logs, metadata } = req.body;
  const nodeId = await bridge.storeShortTerm(taskId, logs, metadata);
  res.json({ nodeId });
});

router.get('/canvas/:taskId', async (req, res) => {
  const canvas = await bridge.getCanvas(req.params.taskId);
  res.json({ canvas });
});

router.get('/drill/:nodeId', async (req, res) => {
  const raw = await bridge.drillDown(req.params.nodeId);
  res.json({ raw });
});

router.get('/persona', async (req, res) => {
  const persona = await bridge.getPersona();
  res.json({ persona });
});

router.post('/conversation', async (req, res) => {
  const { conversation, metadata } = req.body;
  const result = await bridge.storeConversation(conversation, metadata);
  res.json(result);
});

router.get('/search', async (req, res) => {
  const query = req.query.query as string;
  const topK = parseInt(req.query.topK as string, 10);
  const results = await bridge.hybridSearch(query, topK || 5);
  res.json(results);
});

export default router;
