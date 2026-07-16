import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MemoryManager = require(path.join(__dirname, '../../../scripts/memory-manager.js'));

const router = Router();

let mm: any;
async function getMM() {
  if (!mm) { mm = new (MemoryManager as any)(); await mm.init(); }
  return mm;
}

const rootDir = path.resolve(__dirname, '../../..');
const aiFactoryDir = path.resolve(__dirname, '../../../.ai-factory');

router.get('/', async (req: Request, res: Response) => {
  try {
    const manager = await getMM();

    const taskStats = await new Promise<any[]>((resolve, reject) => {
      manager.db.all(
        `SELECT status, COUNT(*) as count FROM task_queue GROUP BY status`,
        (err: any, rows: any) => { if (err) reject(err); else resolve(rows); }
      );
    });

    const memoryStats = await new Promise<any[]>((resolve, reject) => {
      manager.db.all(
        `SELECT key, value FROM memory_stats`,
        (err: any, rows: any) => { if (err) reject(err); else resolve(rows); }
      );
    });

    const statusBoardEntries = await new Promise<any[]>((resolve, reject) => {
      manager.db.all(
        `SELECT * FROM status_board WHERE status = 'active' ORDER BY created_at DESC`,
        (err: any, rows: any) => { if (err) reject(err); else resolve(rows); }
      );
    });

    const brainDir = path.join(rootDir, 'brain');
    const brainFiles = fs.existsSync(brainDir)
      ? fs.readdirSync(brainDir).filter(f => f.endsWith('.md'))
      : [];

    const agentsDir = path.join(aiFactoryDir, 'agents');
    const agentFiles = fs.existsSync(agentsDir)
      ? fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
      : [];

    const skillsDir = path.join(aiFactoryDir, 'skills');
    const skillEntries = fs.existsSync(skillsDir)
      ? fs.readdirSync(skillsDir)
      : [];

    const fsStats = {
      brainFiles: brainFiles.length,
      agents: agentFiles.length,
      skills: skillEntries.length,
    };

    res.json({
      tasks: taskStats,
      memoryStats: memoryStats.reduce((acc: any, r: any) => { acc[r.key] = r.value; return acc; }, {}),
      statusBoard: statusBoardEntries,
      filesystem: fsStats,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
