const MemoryManager = require('./memory-manager');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Task Dispatcher - Motor de Orquestração Paralela
 * 
 * Responsabilidades:
 * - Ler tasks do spec.md/tasks.md
 * - Inserir na task_queue no SQLite via MemoryManager
 * - Controlar DAG de dependências
 * - Fornecer métodos para obter tarefas prontas para execução (getReadyTasks)
 */
class TaskDispatcher {
  constructor(dbPath) {
    this.mm = new MemoryManager(dbPath);
  }

  async init() {
    await this.mm.init();
  }

  /**
   * Extrai e carrega tasks de um arquivo Markdown para o banco de dados.
   * Supõe um formato simples onde cada task tem um ID, Descrição e possivelmente dependências.
   * Como este é o motor, vamos implementar uma lógica que insere as tasks no DB.
   * @param {Array} tasks - Array de objetos { id, description, agent, dependencies, priority }
   */
  async loadTasksFromSpec(tasks) {
    return new Promise((resolve, reject) => {
      this.mm.db.serialize(() => {
        this.mm.db.run('BEGIN TRANSACTION');
        const stmt = this.mm.db.prepare(`
          INSERT OR REPLACE INTO task_queue (id, description, status, priority, agent, dependencies, created_at, updated_at) 
          VALUES (?, ?, 'pending', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);

        for (const task of tasks) {
          const id = task.id || crypto.randomUUID();
          const desc = task.description || '';
          const priority = task.priority || 0;
          const agent = task.agent || 'unknown';
          const deps = JSON.stringify(task.dependencies || []);

          stmt.run([id, desc, priority, agent, deps], (err) => {
            if (err) {
              console.error('Erro ao carregar task:', id, err.message);
            }
          });
        }

        stmt.finalize();
        this.mm.db.run('COMMIT', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }

  /**
   * Retorna as tarefas prontas para execução.
   * Uma tarefa está pronta se:
   * - status = 'pending'
   * - Todas as suas dependências estão com status = 'completed'
   */
  async getReadyTasks() {
    return new Promise((resolve, reject) => {
      this.mm.db.all(`SELECT * FROM task_queue WHERE status = 'pending' ORDER BY priority DESC`, (err, rows) => {
        if (err) return reject(err);
        
        // Fazer a verificação de dependências
        const readyTasks = [];
        const checkPromises = rows.map(async (task) => {
          const deps = JSON.parse(task.dependencies || '[]');
          if (deps.length === 0) {
            readyTasks.push(task);
            return;
          }

          // Verificar se todas as dependências estão concluídas
          const allCompleted = await this._areDependenciesCompleted(deps);
          if (allCompleted) {
            readyTasks.push(task);
          }
        });

        Promise.all(checkPromises)
          .then(() => resolve(readyTasks))
          .catch(reject);
      });
    });
  }

  async _areDependenciesCompleted(deps) {
    return new Promise((resolve, reject) => {
      const placeholders = deps.map(() => '?').join(',');
      this.mm.db.all(`SELECT status FROM task_queue WHERE id IN (${placeholders})`, deps, (err, rows) => {
        if (err) return reject(err);
        if (rows.length !== deps.length) {
          // Alguma dependência não foi encontrada, não podemos executar ainda.
          return resolve(false);
        }
        const allCompleted = rows.every(r => r.status === 'completed');
        resolve(allCompleted);
      });
    });
  }

  async updateTaskStatus(taskId, status, result = null, error = null) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE task_queue SET status = ?, updated_at = CURRENT_TIMESTAMP`;
      const params = [status];
      
      if (result !== null) {
        query += `, result = ?`;
        params.push(result);
      }
      if (error !== null) {
        query += `, error = ?`;
        params.push(error);
      }
      
      query += ` WHERE id = ?`;
      params.push(taskId);

      this.mm.db.run(query, params, function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }

  /**
   * Inicia o Dispatcher.
   * Lógica simples para pegar as próximas tarefas prontas.
   */
  async startDispatcher() {
    console.log('[Dispatcher] Iniciando orquestração...');
    const readyTasks = await this.getReadyTasks();
    if (readyTasks.length === 0) {
      console.log('[Dispatcher] Nenhuma tarefa pronta no momento.');
      return;
    }
    
    console.log(`[Dispatcher] ${readyTasks.length} tarefa(s) pronta(s) para execução.`);
    // Em um sistema real, aqui despacharíamos para as skills/agentes via filas ou workers paralelos.
    // Para simplificar, marcaremos elas como 'running'.
    for (const task of readyTasks) {
      console.log(`[Dispatcher] Dispatching task ${task.id} -> agent: ${task.agent}`);
      await this.updateTaskStatus(task.id, 'running');
    }
    
    return readyTasks;
  }

  async close() {
    return this.mm.close();
  }
}

async function cli() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || ['--help', '-h'].includes(cmd)) {
    console.log(`
Uso: node scripts/task-dispatcher.js <comando> [args]

Comandos:
  start            Inicia o dispatcher e retorna tarefas prontas
  ready            Lista tarefas prontas
  load <arquivo>   Carrega tarefas de um JSON
  status <id> <s>  Atualiza status da tarefa
`);
    return;
  }

  const dispatcher = new TaskDispatcher();
  await dispatcher.init();

  try {
    switch (cmd) {
      case 'start': {
        await dispatcher.startDispatcher();
        break;
      }
      case 'ready': {
        const tasks = await dispatcher.getReadyTasks();
        console.log(JSON.stringify(tasks, null, 2));
        break;
      }
      case 'load': {
        const file = args[1];
        if (!file) {
          console.error('Informe o arquivo JSON.');
          process.exit(1);
        }
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        await dispatcher.loadTasksFromSpec(data);
        console.log('Tasks carregadas com sucesso.');
        break;
      }
      case 'status': {
        const id = args[1];
        const status = args[2];
        if (!id || !status) {
          console.error('Informe id e status.');
          process.exit(1);
        }
        await dispatcher.updateTaskStatus(id, status);
        console.log('Status atualizado.');
        break;
      }
      default:
        console.log('Comando desconhecido.');
    }
  } finally {
    await dispatcher.close();
  }
}

if (require.main === module) {
  cli().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = TaskDispatcher;
