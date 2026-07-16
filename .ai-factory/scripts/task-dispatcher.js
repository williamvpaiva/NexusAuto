#!/usr/bin/env node

const path = require('path');
const MemoryManager = require(path.join(__dirname, '..', '..', 'scripts', 'memory-manager.js'));

class TaskDispatcher {
  constructor() {
    this.mm = new MemoryManager();
    this.ready = false;
  }

  async init() {
    await this.mm.init();
    this.ready = true;
  }

  async enqueue(description, { priority = 0, agent = null, dependencies = [] } = {}) {
    if (!this.ready) await this.init();
    return new Promise((resolve, reject) => {
      const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      this.mm.db.run(
        `INSERT INTO task_queue (id, description, priority, agent, dependencies) VALUES (?, ?, ?, ?, ?)`,
        [id, description, priority, agent, JSON.stringify(dependencies)],
        (err) => { if (err) reject(err); else resolve(id); }
      );
    });
  }

  async dequeue() {
    if (!this.ready) await this.init();
    const ready = await this._getReadyTasks();
    if (!ready.length) return null;
    const task = ready[0];
    await this._updateStatus(task.id, 'running');
    return task;
  }

  async _getReadyTasks() {
    return new Promise((resolve, reject) => {
      this.mm.db.all(
        `SELECT * FROM task_queue WHERE status = 'pending' ORDER BY priority DESC, created_at ASC`,
        (err, rows) => {
          if (err) return reject(err);
          const ready = rows.filter((task) => {
            const deps = this._parseDeps(task.dependencies);
            if (!deps.length) return true;
            return deps.every((depId) =>
              rows.some((r) => r.id === depId && r.status === 'completed')
            );
          });
          resolve(ready);
        }
      );
    });
  }

  _parseDeps(deps) {
    try {
      const parsed = typeof deps === 'string' ? JSON.parse(deps) : deps;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async _updateStatus(id, status, extra = {}) {
    const setClauses = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [status];
    if (extra.result !== undefined) { setClauses.push('result = ?'); params.push(extra.result); }
    if (extra.error !== undefined) { setClauses.push('error = ?'); params.push(extra.error); }
    params.push(id);
    return new Promise((resolve, reject) => {
      this.mm.db.run(
        `UPDATE task_queue SET ${setClauses.join(', ')} WHERE id = ?`,
        params, (err) => { if (err) reject(err); else resolve(); }
      );
    });
  }

  async getNext() {
    return this.dequeue();
  }

  async complete(id, result) {
    await this._updateStatus(id, 'completed', { result: result || 'done' });
  }

  async fail(id, error) {
    await this._updateStatus(id, 'failed', { error: error || 'error' });
  }

  async status() {
    if (!this.ready) await this.init();
    return new Promise((resolve, reject) => {
      this.mm.db.all(
        `SELECT status, COUNT(*) as count FROM task_queue GROUP BY status`,
        (err, rows) => { if (err) reject(err); else resolve(rows); }
      );
    });
  }
}

async function main() {
  const d = new TaskDispatcher();
  await d.init();
  const cmd = process.argv[2];

  switch (cmd) {
    case 'add':
      const id = await d.enqueue(process.argv[3], {
        priority: parseInt(process.argv[4] || '0'),
        agent: process.argv[5] || null,
      });
      console.log(JSON.stringify({ status: 'ok', id }));
      break;
    case 'next':
      const task = await d.getNext();
      if (!task) { console.log(JSON.stringify({ status: 'empty' })); break; }
      console.log(JSON.stringify({ status: 'ok', task }));
      break;
    case 'complete':
      await d.complete(process.argv[3], process.argv[4] || 'done');
      console.log(JSON.stringify({ status: 'ok' }));
      break;
    case 'fail':
      await d.fail(process.argv[3], process.argv[4] || 'error');
      console.log(JSON.stringify({ status: 'ok' }));
      break;
    case 'status':
      const stats = await d.status();
      console.log(JSON.stringify({ status: 'ok', stats }));
      break;
    default:
      console.log('Usage: node .ai-factory/scripts/task-dispatcher.js <add|next|complete|fail|status> [args]');
  }
}

if (require.main === module) main();
module.exports = TaskDispatcher;
