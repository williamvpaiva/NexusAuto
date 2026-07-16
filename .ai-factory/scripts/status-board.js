#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const MemoryManager = require(path.join(__dirname, '..', '..', 'scripts', 'memory-manager.js'));

class StatusBoard {
  constructor() {
    this.mm = new MemoryManager();
    this.ready = false;
  }

  async init() {
    await this.mm.init();
    this.ready = true;
  }

  gather() {
    const items = [];

    const brainDir = path.join(__dirname, '..', '..', 'brain');
    if (fs.existsSync(brainDir)) {
      const files = fs.readdirSync(brainDir);
      items.push({ id: 'brain-files', category: 'docs', title: 'Brain files', detail: `${files.length} files` });
    }

    const agentsDir = path.join(__dirname, '..', 'agents');
    if (fs.existsSync(agentsDir)) {
      const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
      items.push({ id: 'agents-count', category: 'agents', title: 'Available agents', detail: `${files.length} agents` });
    }

    const skillsDir = path.join(__dirname, '..', 'skills');
    if (fs.existsSync(skillsDir)) {
      const entries = fs.readdirSync(skillsDir);
      items.push({ id: 'skills-count', category: 'skills', title: 'Skills', detail: `${entries.length} skills` });
    }

    return items;
  }

  async add(category, title, detail, source = 'status-board') {
    if (!this.ready) await this.init();
    const id = `sb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return new Promise((resolve, reject) => {
      this.mm.db.run(
        `INSERT INTO status_board (id, category, title, detail, source) VALUES (?, ?, ?, ?, ?)`,
        [id, category, title, detail, source],
        (err) => { if (err) reject(err); else resolve(id); }
      );
    });
  }

  async dismiss(id) {
    if (!this.ready) await this.init();
    return new Promise((resolve, reject) => {
      this.mm.db.run(
        `UPDATE status_board SET status = 'dismissed' WHERE id = ?`,
        [id],
        (err) => { if (err) reject(err); else resolve(); }
      );
    });
  }

  async list(category) {
    if (!this.ready) await this.init();
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM status_board WHERE status = 'active'`;
      const params = [];
      if (category) { sql += ` AND category = ?`; params.push(category); }
      sql += ` ORDER BY created_at DESC`;
      this.mm.db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows); });
    });
  }
}

async function main() {
  const sb = new StatusBoard();
  await sb.init();
  const cmd = process.argv[2] || 'gather';

  switch (cmd) {
    case 'gather':
      const items = sb.gather();
      console.log(JSON.stringify({ status: 'ok', items }, null, 2));
      break;
    case 'add':
      const id = await sb.add(process.argv[3], process.argv[4], process.argv[5] || '');
      console.log(JSON.stringify({ status: 'ok', id }));
      break;
    case 'dismiss':
      await sb.dismiss(process.argv[3]);
      console.log(JSON.stringify({ status: 'ok' }));
      break;
    case 'list':
      const rows = await sb.list(process.argv[3]);
      console.log(JSON.stringify({ status: 'ok', items: rows }, null, 2));
      break;
    default:
      console.log('Usage: node .ai-factory/scripts/status-board.js <gather|add|dismiss|list> [args]');
  }
}

if (require.main === module) main();
module.exports = StatusBoard;
