import { Router } from 'express';
import { memoryService } from '../services/memory.service';
import { asyncHandler } from '../utils/async-handler';
import { AppError, NotFoundError } from '../utils/app-error';
import {
  createConversationSchema,
  createMessageSchema,
  createErrorLogSchema,
  updateErrorLogSchema,
  resolveErrorSchema,
  optimizeTokensSchema,
} from '../validators/memory.validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post('/conversations', validate(createConversationSchema), asyncHandler(async (req, res) => {
  const conversation = await memoryService.createConversation(req.body);
  res.status(201).json({ success: true, data: conversation });
}));

router.get('/conversations', asyncHandler(async (req, res) => {
  const { page, perPage, sortBy, order, search, agent_id, session_id } = req.query;
  const conversations = await memoryService.getConversations({
    page: page ? parseInt(page as string) : 1,
    perPage: perPage ? parseInt(perPage as string) : 20,
    sortBy: (sortBy as string) || 'updated_at',
    order: (order as 'asc' | 'desc') || 'desc',
    search: search as string,
    agent_id: agent_id as string,
    session_id: session_id as string,
  });
  res.json({ success: true, ...conversations });
}));

router.get('/conversations/:id', asyncHandler(async (req, res) => {
  const conversation = await memoryService.getConversation(req.params.id);
  if (!conversation) throw new NotFoundError('Conversation');
  res.json({ success: true, data: conversation });
}));

router.get('/conversations/:id/context', asyncHandler(async (req, res) => {
  const { maxTokens } = req.query;
  const context = await memoryService.getConversationContext(
    req.params.id,
    maxTokens ? parseInt(maxTokens as string) : undefined
  );
  res.json({ success: true, data: context });
}));

router.delete('/conversations/:id', asyncHandler(async (req, res) => {
  await memoryService.deleteConversation(req.params.id);
  res.status(204).send();
}));

router.post('/messages', validate(createMessageSchema), asyncHandler(async (req, res) => {
  const message = await memoryService.createMessage(req.body);
  res.status(201).json({ success: true, data: message });
}));

router.get('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const { page, perPage } = req.query;
  const messages = await memoryService.getMessages(req.params.id, {
    page: page ? parseInt(page as string) : 1,
    perPage: perPage ? parseInt(perPage as string) : 100,
  });
  res.json({ success: true, ...messages });
}));

router.delete('/messages/:id', asyncHandler(async (req, res) => {
  await memoryService.deleteMessage(req.params.id);
  res.status(204).send();
}));

router.post('/errors', validate(createErrorLogSchema), asyncHandler(async (req, res) => {
  const errorLog = await memoryService.createErrorLog(req.body);
  res.status(201).json({ success: true, data: errorLog });
}));

router.get('/errors', asyncHandler(async (req, res) => {
  const { page, perPage, status, conversation_id } = req.query;
  const errorLogs = await memoryService.getErrorLogs({
    page: page ? parseInt(page as string) : 1,
    perPage: perPage ? parseInt(perPage as string) : 20,
    status: status as string,
    conversation_id: conversation_id as string,
  });
  res.json({ success: true, ...errorLogs });
}));

router.get('/errors/:id', asyncHandler(async (req, res) => {
  const errorLog = await memoryService.getErrorLog(req.params.id);
  if (!errorLog) throw new NotFoundError('Error log');
  res.json({ success: true, data: errorLog });
}));

router.patch('/errors/:id', validate(updateErrorLogSchema), asyncHandler(async (req, res) => {
  const errorLog = await memoryService.updateErrorLog(req.params.id, req.body);
  res.json({ success: true, data: errorLog });
}));

router.post('/errors/:id/resolve', validate(resolveErrorSchema), asyncHandler(async (req, res) => {
  const { resolution_summary, resolution_steps } = req.body;
  const errorLog = await memoryService.resolveError(req.params.id, resolution_summary, resolution_steps);
  res.json({ success: true, data: errorLog });
}));

router.delete('/errors/:id', asyncHandler(async (req, res) => {
  await memoryService.deleteErrorLog(req.params.id);
  res.status(204).send();
}));

router.post('/conversations/:id/optimize', validate(optimizeTokensSchema), asyncHandler(async (req, res) => {
  const { strategy } = req.body;
  const result = await memoryService.optimizeConversationTokens(req.params.id, strategy);
  res.json({ success: true, data: result });
}));

router.get('/conversations/:id/optimizations', asyncHandler(async (req, res) => {
  const optimizations = await memoryService.getTokenOptimizations(req.params.id);
  res.json({ success: true, data: optimizations });
}));

router.get('/stats', asyncHandler(async (_req, res) => {
  const stats = await memoryService.getStats();
  res.json({ success: true, data: stats });
}));

router.get('/search', asyncHandler(async (req, res) => {
  const { q, agent_id, limit } = req.query;
  if (!q) {
    throw new AppError('Query parameter "q" is required', 400, 'INVALID_INPUT');
  }
  const results = await memoryService.searchMessages(q as string, {
    agent_id: agent_id as string,
    limit: limit ? parseInt(limit as string) : 50,
  });
  res.json({ success: true, data: results });
}));

export default router;
