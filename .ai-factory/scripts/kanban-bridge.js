#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const MemoryManager = require(path.join(__dirname, '..', '..', 'scripts', 'memory-manager.js'));

const KANBAN_PATH = path.join(__dirname, '..', '..', 'brain', 'kanban.md');
const KANBAN_TEMPLATE = `---

kanban-plugin: basic

## 🚀 Doing
- [ ] 

## 📋 Todo
- [ ] 

## ✅ Done
- [ ] 

`;

class KanbanBridge {
  constructor() {
    this.mm = new MemoryManager();
    this.ready = false;
  }

  async init() {
    await this.mm.init();
    this._ensureKanban();
    this.ready = true;
  }

  _ensureKanban() {
    if (!fs.existsSync(KANBAN_PATH)) {
      fs.writeFileSync(KANBAN_PATH, KANBAN_TEMPLATE);
    }
  }

  readBoard() {
    if (!fs.existsSync(KANBAN_PATH)) return { columns: {} };
    const content = fs.readFileSync(KANBAN_PATH, 'utf-8');
    const columns = {};
    let currentCol = null;
    for (const line of content.split('\n')) {
      const col = line.match(/^## (.+)$/);
      if (col) { currentCol = col[1].trim(); columns[currentCol] = []; continue; }
      const task = line.match(/^- \[([ x])\] (.+)$/);
      if (task && currentCol) {
        columns[currentCol].push({ done: task[1] === 'x', text: task[2] });
      }
    }
    return columns;
  }

  addCard(column, text) {
    const content = fs.readFileSync(KANBAN_PATH, 'utf-8');
    const header = `## ${column}`;
    if (content.includes(header)) {
      const updated = content.replace(
        new RegExp(`(${header}\\n)((?:- \\[.?\\] .*\\n?)*)`),
        `$1- [ ] ${text}\n$2`
      );
      fs.writeFileSync(KANBAN_PATH, updated);
    } else {
      fs.writeFileSync(KANBAN_PATH, content + `\n## ${column}\n- [ ] ${text}\n`);
    }
  }

  async sync() {
    if (!this.ready) await this.init();
    const board = this.readBoard();
    for (const [col, tasks] of Object.entries(board)) {
      for (const task of tasks) {
        const tag = col === '✅ Done' ? 'completed' : 'pending';
        await this.mm.saveMemory(`[kanban:${col}] ${task.text}`, {
          agent: 'kanban-bridge',
          type: 'task',
          source: `kanban#${col}`,
        });
      }
    }
    return board;
  }
}

async function main() {
  const bridge = new KanbanBridge();
  await bridge.init();
  const cmd = process.argv[2] || 'sync';

  switch (cmd) {
    case 'sync':
      const board = await bridge.sync();
      const total = Object.values(board).flat().length;
      console.log(JSON.stringify({ status: 'ok', columns: Object.keys(board), total }));
      break;
    case 'add':
      bridge.addCard(process.argv[3] || '📋 Todo', process.argv[4]);
      console.log(JSON.stringify({ status: 'ok' }));
      break;
    case 'read':
      const b = bridge.readBoard();
      console.log(JSON.stringify(b, null, 2));
      break;
    default:
      console.log('Usage: node .ai-factory/scripts/kanban-bridge.js <sync|add|read> [args]');
  }
}

if (require.main === module) main();
module.exports = KanbanBridge;
