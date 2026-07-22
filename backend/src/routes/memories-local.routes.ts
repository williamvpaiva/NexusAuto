import { Router, Request, Response } from 'express';
import path from 'path';
import { validate } from '../middleware/validate.middleware';
import { SaveLocalMemorySchema, SearchLocalMemoriesSchema, TogglePrivateLocalMemorySchema } from '../dtos/memories-local.dto';

const router = Router();

const sseClients: Response[] = [];

let mm: any;
async function getMM() {
  if (!mm) {
    const mod = await import(path.join(__dirname, '../../../scripts/memory-manager.cjs'));
    mm = new (mod.default as any)();
    await mm.init();
  }
  return mm;
}

export function broadcast(event: Record<string, unknown>) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    client.write(data);
  }
}

getMM().then(m => m.onSave = (ev: any) => broadcast({ type: 'memory:saved', ...ev }));

router.get('/', validate(SearchLocalMemoriesSchema), async (req: Request, res: Response) => {
  try {
    const manager = await getMM();
    const query = (req.query.query as string) || '';
    const results = await manager.searchMemories(query, 50);
    res.json(results.map((m: any) => ({
      id: m.id,
      content: m.content?.slice(0, 200),
      type: m.metadata?.type || 'unknown',
      isPrivate: m.metadata?.isPrivate === true,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', validate(SaveLocalMemorySchema), async (req: Request, res: Response) => {
  try {
    const { content, agent, type, tags } = req.body;
    const manager = await getMM();
    const result = await manager.saveMemory(content, { agent, type, tags });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stream', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx >= 0) sseClients.splice(idx, 1);
  });
});

router.post('/:id/private', validate(TogglePrivateLocalMemorySchema), async (req: Request, res: Response) => {
  try {
    const manager = await getMM();
    const { id } = req.params;
    const row = await new Promise<any>((resolve, reject) => {
      manager.db.get('SELECT metadata FROM memories WHERE id = ?', [id], (err: any, row: any) => {
        if (err) reject(err); else resolve(row);
      });
    });
    if (!row) { res.status(404).json({ error: 'memory not found' }); return; }
    const metadata = JSON.parse(row.metadata || '{}');
    metadata.isPrivate = !metadata.isPrivate;
    await new Promise<void>((resolve, reject) => {
      manager.db.run('UPDATE memories SET metadata = ? WHERE id = ?', [JSON.stringify(metadata), id], (err: any) => {
        if (err) reject(err); else resolve();
      });
    });
    broadcast({ type: 'memory:updated', id, isPrivate: metadata.isPrivate });
    res.json({ ok: true, id, isPrivate: metadata.isPrivate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
