import express from 'express';
import TencentMemoryBridge from '../../../.ai-factory/scripts/tencent-memory-bridge.js';
import { validate } from '../middleware/validate.middleware';
import { DrillDownSchema, GetCanvasSchema, OffloadMemorySchema, SearchTencentMemorySchema, StoreConversationSchema } from '../dtos/memory-tencent.dto';

const router = express.Router();
const bridge = new TencentMemoryBridge();

router.get('/status', (req, res) => {
  res.json({ available: bridge.isAvailable() });
});

router.post('/offload', validate(OffloadMemorySchema), async (req, res) => {
  const { taskId, logs, metadata } = req.body;
  const nodeId = await bridge.storeShortTerm(taskId, logs, metadata);
  res.json({ nodeId });
});

router.get('/canvas/:taskId', validate(GetCanvasSchema), async (req, res) => {
  const canvas = await bridge.getCanvas(req.params.taskId);
  res.json({ canvas });
});

router.get('/drill/:nodeId', validate(DrillDownSchema), async (req, res) => {
  const raw = await bridge.drillDown(req.params.nodeId);
  res.json({ raw });
});

router.get('/persona', async (req, res) => {
  const persona = await bridge.getPersona();
  res.json({ persona });
});

router.post('/conversation', validate(StoreConversationSchema), async (req, res) => {
  const { conversation, metadata } = req.body;
  const result = await bridge.storeConversation(conversation, metadata);
  res.json(result);
});

router.get('/search', validate(SearchTencentMemorySchema), async (req, res) => {
  const query = req.query.query as string;
  const topK = parseInt(req.query.topK as string, 10);
  const results = await bridge.hybridSearch(query, topK || 5);
  res.json(results);
});

export default router;
