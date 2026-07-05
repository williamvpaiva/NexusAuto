#!/usr/bin/env node

/**
 * memory-manager.js — Memória Persistente com SQLite + Embeddings Semânticos
 *
 * Permite que agentes salvem e recuperem memórias (decisões, código, lições)
 * com busca semântica via embeddings (ou fallback TF-IDF).
 *
 * Uso via CLI:
 *   node scripts/memory-manager.js save "conteúdo" --agent nome --type decisao
 *   node scripts/memory-manager.js search "consulta" --topK 5 --agent nome
 *   node scripts/memory-manager.js cache-get "pergunta"
 *   node scripts/memory-manager.js cache-set "pergunta" "resposta"
 *   node scripts/memory-manager.js stats
 *
 * Uso via API:
 *   const MemoryManager = require('./memory-manager');
 *   const mm = new MemoryManager();
 *   await mm.saveMemory("conteúdo", { agent: 'architect', type: 'decision' });
 *   const results = await mm.searchMemories("consulta", 5, { agent: 'architect' });
 */

const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'nexusauto_memory.db');
const EMBEDDING_DIM = 384;

let embedderPromise = null;
let naturalPromise = null;

class MemoryManager {
  constructor(dbPath = DB_PATH) {
    this.dbPath = dbPath;
    this.db = null;
  }

  getDbPath() {
    return this.dbPath;
  }

  async init() {
    await this._openDb();
    await this._initTables();
  }

  _openDb() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  _initTables() {
    return new Promise((resolve, reject) => {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          metadata TEXT DEFAULT '{}',
          hash TEXT,
          embedding BLOB,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_memories_hash ON memories(hash);
        CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(json_extract(metadata, '$.agent'));
        CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(json_extract(metadata, '$.type'));
        CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(created_at);

        CREATE TABLE IF NOT EXISTS cache_embeddings (
          text_hash TEXT PRIMARY KEY,
          embedding BLOB,
          model TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cache_responses (
          query_hash TEXT PRIMARY KEY,
          response TEXT,
          model TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS memory_stats (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async _getEmbedder() {
    if (!embedderPromise) {
      embedderPromise = (async () => {
        try {
          const { pipeline } = await import('@xenova/transformers');
          const p = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
          return p;
        } catch (e) {
          console.error('[mem] @xenova/transformers unavailable, using TF-IDF fallback:', e.message);
          return null;
        }
      })();
    }
    return embedderPromise;
  }

  async _getTfidf() {
    if (!naturalPromise) {
      naturalPromise = (async () => {
        try {
          const natural = await import('natural');
          return natural;
        } catch (e) {
          console.error('[mem] natural unavailable, no fallback:', e.message);
          return null;
        }
      })();
    }
    return naturalPromise;
  }

  async getEmbedding(text) {
    const hash = crypto.createHash('sha256').update(text).digest('hex');

    const cached = await this._getCacheEmbedding(hash);
    if (cached) return cached;

    const embedder = await this._getEmbedder();
    if (embedder) {
      const result = await embedder(text, { pooling: 'mean', normalize: true });
      const embedding = new Float32Array(result.data);
      await this._setCacheEmbedding(hash, embedding, 'all-MiniLM-L6-v2');
      return embedding;
    }

    return null;
  }

  _getCacheEmbedding(hash) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT embedding FROM cache_embeddings WHERE text_hash = ?',
        [hash],
        (err, row) => {
          if (err) return reject(err);
          if (row) resolve(new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4));
          else resolve(null);
        }
      );
    });
  }

  _setCacheEmbedding(hash, embedding, model) {
    return new Promise((resolve, reject) => {
      const buf = Buffer.from(embedding.buffer);
      this.db.run(
        'INSERT OR REPLACE INTO cache_embeddings (text_hash, embedding, model) VALUES (?, ?, ?)',
        [hash, buf, model],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  async saveMemory(content, metadata = {}) {
    const id = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    const exists = await this._existsByHash(hash);
    if (exists) return { id: exists, deduplicated: true };

    const embedding = await this.getEmbedding(content);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO memories (id, content, metadata, hash, embedding) VALUES (?, ?, ?, ?, ?)`,
        [id, content, JSON.stringify(metadata), hash, embedding ? Buffer.from(embedding.buffer) : null],
        (err) => {
          if (err) return reject(err);
          resolve({ id, deduplicated: false });
        }
      );
    });
  }

  _existsByHash(hash) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id FROM memories WHERE hash = ?',
        [hash],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.id : null);
        }
      );
    });
  }

  async searchMemories(query, topK = 5, filters = {}) {
    const embedding = await this.getEmbedding(query);

    if (embedding) {
      return this._searchByEmbedding(embedding, topK, filters);
    }

    return this._searchByTfidf(query, topK, filters);
  }

  _searchByEmbedding(queryEmbedding, topK, filters) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT id, content, metadata, embedding, created_at FROM memories WHERE embedding IS NOT NULL`;
      const params = [];

      if (filters.agent) {
        sql += ` AND json_extract(metadata, '$.agent') = ?`;
        params.push(filters.agent);
      }
      if (filters.type) {
        sql += ` AND json_extract(metadata, '$.type') = ?`;
        params.push(filters.type);
      }
      if (filters.days) {
        sql += ` AND created_at >= datetime('now', '-' || ? || ' days')`;
        params.push(String(filters.days));
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);

        const scored = rows.map(row => {
          const emb = new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4);
          return {
            id: row.id,
            content: row.content,
            metadata: JSON.parse(row.metadata || '{}'),
            created_at: row.created_at,
            distance: 1 - this.cosineSimilarity(queryEmbedding, emb),
            score: this.cosineSimilarity(queryEmbedding, emb),
          };
        });

        scored.sort((a, b) => b.score - a.score);
        resolve(scored.slice(0, topK));
      });
    });
  }

  async _searchByTfidf(query, topK, filters) {
    const natural = await this._getTfidf();
    if (!natural) return [];

    return new Promise((resolve, reject) => {
      let sql = `SELECT id, content, metadata, created_at FROM memories`;
      const params = [];
      const conditions = [];

      if (filters.agent) {
        conditions.push(`json_extract(metadata, '$.agent') = ?`);
        params.push(filters.agent);
      }
      if (filters.type) {
        conditions.push(`json_extract(metadata, '$.type') = ?`);
        params.push(filters.type);
      }
      if (filters.days) {
        conditions.push(`created_at >= datetime('now', '-' || ? || ' days')`);
        params.push(String(filters.days));
      }
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);

        const tfidf = new natural.TfIdf();
        rows.forEach(row => tfidf.addDocument(row.content, row.id));

        const queryTerms = query.toLowerCase().split(/\s+/);
        const scored = rows
          .map((row, i) => ({
            id: row.id,
            content: row.content,
            metadata: JSON.parse(row.metadata || '{}'),
            created_at: row.created_at,
            score: tfidf.tfidf(queryTerms, i),
          }))
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, topK);

        resolve(scored);
      });
    });
  }

  getCachedResponse(query) {
    const hash = crypto.createHash('sha256').update(query.trim().toLowerCase()).digest('hex');
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT response FROM cache_responses WHERE query_hash = ?',
        [hash],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.response : null);
        }
      );
    });
  }

  saveCachedResponse(query, response) {
    const hash = crypto.createHash('sha256').update(query.trim().toLowerCase()).digest('hex');
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT OR REPLACE INTO cache_responses (query_hash, response) VALUES (?, ?)',
        [hash, response],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  getStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT
          (SELECT COUNT(*) FROM memories) as total_memories,
          (SELECT COUNT(*) FROM cache_embeddings) as cached_embeddings,
          (SELECT COUNT(*) FROM cache_responses) as cached_responses,
          (SELECT COUNT(DISTINCT json_extract(metadata, '$.agent')) FROM memories) as unique_agents,
          (SELECT COUNT(DISTINCT json_extract(metadata, '$.type')) FROM memories) as unique_types
      `, (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }

  async summarize() {
    await this._updateStats();
    return this.getStats();
  }

  _updateStats() {
    return this.getStats().then(stats => {
      return new Promise((resolve, reject) => {
        const stmt = this.db.prepare('INSERT OR REPLACE INTO memory_stats (key, value) VALUES (?, ?)');
        Object.entries(stats).forEach(([k, v]) => {
          stmt.run(k, String(v));
        });
        stmt.finalize(err => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async searchAll(query, topK = 5) {
    return this.searchMemories(query, topK, {});
  }
}

async function cli() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || ['--help', '-h'].includes(cmd)) {
    console.log(`
Uso: node scripts/memory-manager.js <comando> [args]

Comandos:
  save <texto>              Salva uma memória
    --agent <nome>            Nome do agente (obrigatório)
    --type <tipo>             Tipo: decision, code, lesson, adr, context
    --tags <tag1,tag2>        Tags para categorização

  search <query>            Busca memórias por similaridade semântica
    --topK <n>                Quantidade de resultados (padrão: 5)
    --agent <nome>            Filtrar por agente
    --type <tipo>             Filtrar por tipo
    --days <n>                Apenas últimos N dias

  cache-get <pergunta>      Recupera resposta em cache
  cache-set <pergunta> <resp>  Salva resposta em cache

  stats                     Estatísticas do banco de memórias

  summarize                 Gera sumário e atualiza estatísticas

Exemplos:
  node scripts/memory-manager.js save "Decidimos usar Prisma como ORM" --agent architect --type decision --tags orm,schema
  node scripts/memory-manager.js search "qual ORM estamos usando" --topK 3
  node scripts/memory-manager.js stats
`);
    return;
  }

  const mm = new MemoryManager();
  await mm.init();

  try {
    switch (cmd) {
      case 'save': {
        const content = args[1];
        if (!content) { console.error('Erro: forneça o texto da memória'); process.exit(1); }
        const agent = _getArg(args, '--agent') || 'unknown';
        const type = _getArg(args, '--type') || 'general';
        const tagsStr = _getArg(args, '--tags') || '';
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
        const result = await mm.saveMemory(content, { agent, type, tags });
        console.log(JSON.stringify({ status: 'ok', ...result, agent, type, tags }, null, 2));
        break;
      }

      case 'search': {
        const query = args[1];
        if (!query) { console.error('Erro: forneça a query de busca'); process.exit(1); }
        const topK = parseInt(_getArg(args, '--topK') || '5', 10);
        const filters = {};
        const agent = _getArg(args, '--agent');
        const type = _getArg(args, '--type');
        const days = _getArg(args, '--days');
        if (agent) filters.agent = agent;
        if (type) filters.type = type;
        if (days) filters.days = parseInt(days, 10);
        const results = await mm.searchMemories(query, topK, filters);
        console.log(JSON.stringify({ status: 'ok', query, count: results.length, results }, null, 2));
        break;
      }

      case 'cache-get': {
        const q = args[1];
        if (!q) { console.error('Erro: forneça a pergunta'); process.exit(1); }
        const response = await mm.getCachedResponse(q);
        console.log(JSON.stringify({ status: response ? 'hit' : 'miss', response }, null, 2));
        break;
      }

      case 'cache-set': {
        const q = args[1];
        const r = args[2];
        if (!q || !r) { console.error('Erro: use cache-set "pergunta" "resposta"'); process.exit(1); }
        await mm.saveCachedResponse(q, r);
        console.log(JSON.stringify({ status: 'ok', message: 'Resposta cacheada' }));
        break;
      }

      case 'stats': {
        const stats = await mm.getStats();
        console.log(JSON.stringify({ status: 'ok', stats }, null, 2));
        break;
      }

      case 'summarize': {
        const result = await mm.summarize();
        console.log(JSON.stringify({ status: 'ok', result }, null, 2));
        break;
      }

      default:
        console.error(`Comando desconhecido: ${cmd}`);
        process.exit(1);
    }
  } finally {
    mm.close();
  }
}

function _getArg(args, name) {
  const idx = args.indexOf(name);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return null;
}

if (require.main === module) {
  cli().catch(err => {
    console.error(JSON.stringify({ status: 'error', message: err.message }));
    process.exit(1);
  });
}

module.exports = MemoryManager;
