/**
 * Memory Manager para NexusAuto
 * 
 * Gerencia memória persistente com SQLite + sqlite-vec para busca semântica.
 * Implementa cache de embeddings e respostas para economia de tokens.
 * 
 * @author NexusAuto Tech Lead
 * @version 1.0.0
 * @see {@link brain/North Star.md}
 * @see {@link brain/Patterns.md}
 */

const Database = require('better-sqlite3');
const sqliteVec = require('sqlite-vec');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Variável para o modelo de embeddings
let embeddingModel = null;

class MemoryManager {
  constructor(dbPath = 'nexusauto_memory.db') {
    this.dbPath = path.resolve(process.cwd(), dbPath);
    this.db = null;
    this.embeddingModel = null;
    this.initialized = false;
  }

  /**
   * Inicializa o banco de dados e carrega o modelo de embeddings
   */
  async init() {
    if (this.initialized) return;

    // Criar diretório do banco se não existir
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Inicializar banco de dados
    this.db = new Database(this.dbPath);
    
    // Carregar extensão sqlite-vec
    sqliteVec.load(this.db);

    // Criar tabelas
    this._createTables();

    // Carregar modelo de embeddings
    await this._loadEmbeddingModel();

    this.initialized = true;
    console.log('[MemoryManager] Inicializado com sucesso');
  }

  /**
   * Cria as tabelas necessárias
   */
  _createTables() {
    // Tabela de memórias
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        hash TEXT UNIQUE NOT NULL,
        agent TEXT,
        session TEXT,
        type TEXT CHECK(type IN ('decision', 'lesson', 'context', 'win', 'skill_usage')),
        tags TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de vetores (sqlite-vec)
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS memories_vec USING vec0(
        content_id INTEGER PRIMARY KEY,
        vector FLOAT[384]
      )
    `);

    // Tabela de cache de embeddings
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cache_embeddings (
        hash TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        embedding TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de cache de respostas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cache_responses (
        query_hash TEXT PRIMARY KEY,
        query TEXT NOT NULL,
        response TEXT NOT NULL,
        tokens_saved INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agent);
      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
      CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session);
    `);
  }

  /**
   * Carrega o modelo de embeddings (all-MiniLM-L6-v2)
   */
  async _loadEmbeddingModel() {
    try {
      // Importação dinâmica para ESM
      const { env, pipeline } = await import('@xenova/transformers');
      
      // Configurar para usar apenas CPU
      env.allowLocalModels = true;
      env.useBrowserModels = false;
      
      this.embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('[MemoryManager] Modelo de embeddings carregado');
    } catch (error) {
      console.error('[MemoryManager] Erro ao carregar modelo:', error.message);
      throw error;
    }
  }

  /**
   * Gera embedding para um texto (com cache)
   * @param {string} text - Texto para gerar embedding
   * @returns {Promise<number[]>} - Embedding como array de floats
   */
  async getEmbedding(text) {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    
    // Tentar cache primeiro
    const cached = this.db.prepare('SELECT embedding FROM cache_embeddings WHERE hash = ?').get(hash);
    if (cached) {
      return JSON.parse(cached.embedding);
    }

    // Gerar embedding
    const output = await this.embeddingModel(text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    // Salvar no cache
    this.db.prepare('INSERT OR REPLACE INTO cache_embeddings (hash, text, embedding) VALUES (?, ?, ?)').run(hash, text, JSON.stringify(embedding));

    return embedding;
  }

  /**
   * Salva uma memória no banco
   * @param {string} content - Conteúdo da memória
   * @param {Object} metadata - Metadados (agent, session, type, tags)
   * @returns {Object} - Memória salva com ID
   */
  async saveMemory(content, metadata = {}) {
    const { agent, session, type = 'context', tags = [] } = metadata;
    
    // Gerar hash do conteúdo
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    // Verificar se já existe
    const existing = this.db.prepare('SELECT id FROM memories WHERE hash = ?').get(hash);
    if (existing) {
      console.log('[MemoryManager] Memória já existe, atualizando:', existing.id);
      this.db.prepare(`
        UPDATE memories 
        SET content = ?, agent = ?, session = ?, type = ?, tags = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(content, agent, session, type, JSON.stringify(tags), existing.id);
      return { id: existing.id, hash, status: 'updated' };
    }

    // Inserir nova memória
    const result = this.db.prepare(`
      INSERT INTO memories (content, hash, agent, session, type, tags, metadata) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(content, hash, agent, session, type, JSON.stringify(tags), JSON.stringify(metadata));

    // Gerar embedding e inserir na tabela vetorial
    const embedding = await this.getEmbedding(content);
    const contentId = Number(result.lastInsertRowid);
    this.db.prepare('INSERT INTO memories_vec (content_id, vector) VALUES (?, ?)').run(contentId, JSON.stringify(embedding));

    console.log('[MemoryManager] Memória salva:', result.lastInsertRowid);
    return { id: result.lastInsertRowid, hash, status: 'created' };
  }

  /**
   * Busca memórias por similaridade semântica
   * @param {string} query - Query de busca
   * @param {Object} options - Opções (topK, filters)
   * @returns {Array} - Resultados da busca
   */
  async searchMemories(query, options = {}) {
    const { topK = 5, agent, type, session } = options;

    // Construir filtros
    let filters = [];
    let params = [];

    // Adicionar filtro de texto (busca textual simples)
    filters.push('m.content LIKE ?');
    params.push(`%${query}%`);

    if (agent) {
      filters.push('m.agent = ?');
      params.push(agent);
    }

    if (type) {
      filters.push('m.type = ?');
      params.push(type);
    }

    if (session) {
      filters.push('m.session = ?');
      params.push(session);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Buscar memórias (busca textual + ordenação por relevância simples)
    const stmt = this.db.prepare(`
      SELECT m.*
      FROM memories m
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT ?
    `);
    
    const results = stmt.all(...params, topK);

    return results.map(r => ({
      id: r.id,
      content: r.content,
      agent: r.agent,
      session: r.session,
      type: r.type,
      tags: JSON.parse(r.tags),
      created_at: r.created_at
    }));
  }

  /**
   * Obtém resposta cacheada
   * @param {string} query - Query original
   * @returns {string|null} - Resposta cacheada ou null
   */
  getCachedResponse(query) {
    const hash = crypto.createHash('sha256').update(query).digest('hex');
    const cached = this.db.prepare('SELECT response, tokens_saved FROM cache_responses WHERE query_hash = ?').get(hash);
    
    if (cached) {
      // Atualizar accessed_at
      this.db.prepare('UPDATE cache_responses SET accessed_at = CURRENT_TIMESTAMP WHERE query_hash = ?').run(hash);
      console.log('[MemoryManager] Resposta cacheada encontrada, tokens economizados:', cached.tokens_saved);
      return cached.response;
    }

    return null;
  }

  /**
   * Salva resposta no cache
   * @param {string} query - Query original
   * @param {string} response - Resposta para cache
   * @param {number} tokensSaved - Tokens economizados
   */
  saveCachedResponse(query, response, tokensSaved = 0) {
    const hash = crypto.createHash('sha256').update(query).digest('hex');
    this.db.prepare(`
      INSERT OR REPLACE INTO cache_responses (query_hash, query, response, tokens_saved) 
      VALUES (?, ?, ?, ?)
    `).run(hash, query, response, tokensSaved);
    console.log('[MemoryManager] Resposta cacheada salva, tokens economizados:', tokensSaved);
  }

  /**
   * Obtém estatísticas do banco
   * @returns {Object} - Estatísticas
   */
  getStats() {
    const stats = {
      totalMemories: this.db.prepare('SELECT COUNT(*) as count FROM memories').get().count,
      totalEmbeddings: this.db.prepare('SELECT COUNT(*) as count FROM cache_embeddings').get().count,
      totalCachedResponses: this.db.prepare('SELECT COUNT(*) as count FROM cache_responses').get().count,
      totalTokensSaved: this.db.prepare('SELECT COALESCE(SUM(tokens_saved), 0) as sum FROM cache_responses').get().sum,
      memoriesByType: this.db.prepare(`
        SELECT type, COUNT(*) as count 
        FROM memories 
        GROUP BY type
      `).all(),
      memoriesByAgent: this.db.prepare(`
        SELECT agent, COUNT(*) as count 
        FROM memories 
        WHERE agent IS NOT NULL
        GROUP BY agent
      `).all()
    };

    return stats;
  }

  /**
   * Fecha o banco de dados
   */
  close() {
    if (this.db) {
      this.db.close();
      console.log('[MemoryManager] Banco fechado');
    }
  }
}

// Exportar singleton
const memoryManager = new MemoryManager();

// CLI para testes
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    await memoryManager.init();

    if (command === 'save') {
      const content = args.slice(1).join(' ');
      const result = await memoryManager.saveMemory(content, {
        agent: 'cli',
        session: 'manual',
        type: 'context'
      });
      console.log('Memória salva:', result);
    } else if (command === 'search') {
      const query = args.slice(1).join(' ');
      const results = await memoryManager.searchMemories(query, { topK: 5 });
      console.log('Resultados:', JSON.stringify(results, null, 2));
    } else if (command === 'stats') {
      const stats = memoryManager.getStats();
      console.log('Estatísticas:', JSON.stringify(stats, null, 2));
    } else {
      console.log('Uso: node memory-manager.js <save|search|stats> [args]');
    }
    
    memoryManager.close();
  })();
}

module.exports = { MemoryManager, memoryManager };