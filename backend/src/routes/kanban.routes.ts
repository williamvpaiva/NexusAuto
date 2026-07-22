import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

let bridge: any;
async function getBridge() {
  if (!bridge) {
    const mod = await import(path.join(__dirname, '../../../.ai-factory/scripts/kanban-bridge.cjs'));
    bridge = new (mod.default as any)();
    await bridge.init();
  }
  return bridge;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const b = await getBridge();
    const board = b.readBoard();
    res.json(board);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sync', async (req: Request, res: Response) => {
  try {
    const b = await getBridge();
    const board = await b.sync();
    const total = Object.values(board as Record<string, any[]>).flat().length;
    res.json({ status: 'ok', columns: Object.keys(board), total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req: Request, res: Response) => {
  try {
    const { column, text } = req.body;
    if (!column || !text) {
      res.status(400).json({ error: 'column and text are required' });
      return;
    }
    const b = await getBridge();
    b.addCard(column, text);
    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
