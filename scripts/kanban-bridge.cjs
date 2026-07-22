const MemoryManager = require('./memory-manager');
const fs = require('fs');
const path = require('path');

/**
 * Kanban Bridge
 * Sincroniza o status das tarefas (SQLite) com o Obsidian (Markdown)
 */
class KanbanBridge {
  constructor(dbPath, kanbanDir) {
    this.mm = new MemoryManager(dbPath);
    this.kanbanDir = kanbanDir || path.join(__dirname, '..', '.ai-factory', 'kanban');
    if (!fs.existsSync(this.kanbanDir)) {
      fs.mkdirSync(this.kanbanDir, { recursive: true });
    }
  }

  async init() {
    await this.mm.init();
  }

  /**
   * Gera um quadro Kanban em Markdown lendo do banco de dados (task_queue).
   */
  async exportToObsidian() {
    return new Promise((resolve, reject) => {
      this.mm.db.all(`SELECT * FROM task_queue ORDER BY priority DESC`, (err, rows) => {
        if (err) return reject(err);

        const columns = {
          'pending': [],
          'running': [],
          'completed': [],
          'failed': [],
          'cancelled': []
        };

        for (const row of rows) {
          if (columns[row.status]) {
            columns[row.status].push(row);
          }
        }

        let md = `# NexusAuto Kanban Board\n\n`;
        md += `_Gerado automaticamente pelo kanban-bridge.js_\n\n`;

        // Formatação simples do Kanban para Obsidian
        md += `## Pending\n`;
        columns.pending.forEach(t => md += `- [ ] **${t.id}**: ${t.description} (Agent: ${t.agent})\n`);

        md += `\n## Running\n`;
        columns.running.forEach(t => md += `- [/] **${t.id}**: ${t.description} (Agent: ${t.agent})\n`);

        md += `\n## Completed\n`;
        columns.completed.forEach(t => md += `- [x] **${t.id}**: ${t.description} (Agent: ${t.agent})\n`);

        md += `\n## Failed\n`;
        columns.failed.forEach(t => md += `- [!] **${t.id}**: ${t.description} (Agent: ${t.agent})\n`);

        md += `\n## Cancelled\n`;
        columns.cancelled.forEach(t => md += `- [-] **${t.id}**: ${t.description} (Agent: ${t.agent})\n`);

        const filePath = path.join(this.kanbanDir, 'board.md');
        fs.writeFileSync(filePath, md, 'utf-8');
        console.log(`[KanbanBridge] Exportado para ${filePath}`);
        resolve();
      });
    });
  }

  async close() {
    return this.mm.close();
  }
}

async function cli() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  const bridge = new KanbanBridge();
  await bridge.init();

  try {
    if (cmd === 'export') {
      await bridge.exportToObsidian();
    } else {
      console.log('Uso: node scripts/kanban-bridge.js export');
    }
  } finally {
    await bridge.close();
  }
}

if (require.main === module) {
  cli().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = KanbanBridge;
