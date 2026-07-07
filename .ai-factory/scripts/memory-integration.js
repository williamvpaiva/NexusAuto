#!/usr/bin/env node

/**
 * NexusAuto - Memory Integration para OpenWiki + GNHF
 * 
 * Conecta o sistema de memória hierárquica existente
 * com as ferramentas OpenWiki e GNHF
 */

const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('better-sqlite3');

class MemoryIntegration {
  constructor() {
    this.dbPath = path.join(process.cwd(), 'nexusauto_memory.db');
    this.db = sqlite3(this.dbPath);
    this.wikiDir = path.join(process.cwd(), '.ai-factory', 'wiki');
    this.handoffsDir = path.join(process.cwd(), '.ai-factory', 'handoffs');
  }

  /**
   * Injeta resumo da memória na Wiki
   */
  async injectMemorySummary() {
    console.log('📥 Injetando resumo da memória na Wiki...');

    // Buscar último resumo
    const summary = this.db.prepare(`
      SELECT content, created_at 
      FROM memories 
      WHERE type = 'summary' 
      ORDER BY created_at DESC 
      LIMIT 1
    `).get();

    if (!summary) {
      console.log('⚠️  Nenhum resumo de memória encontrado');
      return;
    }

    // Criar arquivo de memória na Wiki
    const memoryDoc = `# Memória Recente do Projeto

## Resumo Automático

${summary.content}

## Metadados

- **Gerado em:** ${new Date(summary.created_at).toISOString()}
- **Fonte:** NexusAuto Memory Database
- **Atualização:** Automática via memory-watcher

## Como Usar

Este resumo é injetado automaticamente pelo sistema de memória do NexusAuto.
Os agentes devem consultar este documento para contexto recente do projeto.

---

*Gerado automaticamente por NexusAuto Memory Integration*
`;

    const outputPath = path.join(this.wikiDir, 'memory', 'RECENT_SUMMARY.md');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, memoryDoc, 'utf-8');

    console.log('✅ Resumo injetado com sucesso');
  }

  /**
   * Atualiza Wiki com mudanças da memória
   */
  async updateWikiFromMemory() {
    console.log('🔄 Atualizando Wiki a partir da memória...');

    // Buscar memórias recentes (últimas 24h)
    const recentMemories = this.db.prepare(`
      SELECT type, content, created_at 
      FROM memories 
      WHERE created_at > datetime('now', '-1 day')
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    if (recentMemories.length === 0) {
      console.log('ℹ️  Nenhuma memória recente para atualizar');
      return;
    }

    // Agrupar por tipo
    const grouped = recentMemories.reduce((acc, mem) => {
      acc[mem.type] = acc[mem.type] || [];
      acc[mem.type].push(mem);
      return acc;
    }, {});

    // Criar documento de atualização
    const updateDoc = `# Atualizações Recentes - Memória

## Últimas 24 Horas

${Object.entries(grouped).map(([type, memories]) => `
### ${type.toUpperCase()}

${memories.map(m => `- ${new Date(m.created_at).toLocaleString()}: ${m.content.substring(0, 100)}...`).join('\n')}
`).join('\n')}

## Estatísticas

- **Total de memórias:** ${recentMemories.length}
- **Período:** Últimas 24 horas
- **Tipos:** ${Object.keys(grouped).join(', ')}

---

*Gerado automaticamente em ${new Date().toISOString()}*
`;

    const outputPath = path.join(this.wikiDir, 'memory', 'RECENT_UPDATES.md');
    await fs.writeFile(outputPath, updateDoc, 'utf-8');

    console.log(`✅ ${recentMemories.length} memórias processadas`);
  }

  /**
   * Cria handoff a partir de memória de conversação
   */
  async createHandoffFromMemory(conversationId) {
    console.log(`📝 Criando handoff para conversação ${conversationId}...`);

    // Buscar conversação
    const conversation = this.db.prepare(`
      SELECT content, metadata 
      FROM memories 
      WHERE type = 'conversation' AND node_id = ?
      ORDER BY created_at DESC 
      LIMIT 1
    `).get(conversationId);

    if (!conversation) {
      throw new Error(`Conversação ${conversationId} não encontrada`);
    }

    const metadata = JSON.parse(conversation.metadata || '{}');

    // Criar handoff
    const handoff = `# Handoff - Conversação ${conversationId}

## Contexto

${conversation.content}

## Metadados

- **Agente:** ${metadata.agent || 'Unknown'}
- **Tarefa:** ${metadata.task || 'N/A'}
- **Status:** ${metadata.status || 'Pending'}
- **Criado em:** ${new Date(metadata.createdAt || Date.now()).toISOString()}

## Validação V&V

- [ ] Sintaxe OK
- [ ] Testes OK
- [ ] Security OK
- [ ] Performance OK
- [ ] Lint OK
- [ ] Docs OK

## Próxima Ação

${metadata.nextAction || 'Aguardando revisão'}

---

*Gerado automaticamente por NexusAuto Memory Integration*
`;

    const outputPath = path.join(this.handoffsDir, `conv-${conversationId}.md`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, handoff, 'utf-8');

    console.log('✅ Handoff criado com sucesso');
  }

  /**
   * Carrega contexto da memória para GNHF
   */
  async loadContextForGNHF(runId) {
    console.log(`📖 Carregando contexto para GNHF run ${runId}...`);

    // Buscar últimas memórias relevantes
    const memories = this.db.prepare(`
      SELECT type, content, metadata
      FROM memories 
      WHERE type IN ('summary', 'decision', 'architecture')
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();

    const context = memories.map(m => {
      const meta = JSON.parse(m.metadata || '{}');
      return `## ${m.type.toUpperCase()}\n\n${m.content}\n\n`;
    }).join('\n');

    return context || 'Sem contexto prévio.';
  }

  /**
   * Salva resultado de iteração GNHF na memória
   */
  async saveGNHFIteration(runId, iteration, result) {
    console.log(`💾 Salvando iteração ${iteration} na memória...`);

    const stmt = this.db.prepare(`
      INSERT INTO memories (type, content, metadata, created_at)
      VALUES ('gnhf_iteration', ?, ?, ?)
    `);

    stmt.run(
      result.summary,
      JSON.stringify({
        runId,
        iteration,
        tokens: result.tokens,
        vvPassed: result.vvPassed,
        changes: result.changes
      }),
      new Date().toISOString()
    );

    console.log('✅ Iteração salva com sucesso');
  }

  /**
   * Sincroniza Wiki com memória hierárquica
   */
  async syncWikiWithMemory() {
    console.log('🔄 Sincronizando Wiki com memória...');

    // Atualizar resumo recente
    await this.injectMemorySummary();
    
    // Atualizar atualizações recentes
    await this.updateWikiFromMemory();

    console.log('✅ Sincronização completa');
  }

  /**
   * Busca memória por palavras-chave
   */
  async searchMemory(query) {
    console.log(`🔍 Buscando memória: ${query}...`);

    const results = this.db.prepare(`
      SELECT type, content, metadata, created_at,
             RANK() OVER (ORDER BY created_at DESC) as relevance
      FROM memories 
      WHERE content LIKE ? OR metadata LIKE ?
      ORDER BY relevance
      LIMIT 20
    `).all(`%${query}%`, `%${query}%`);

    return results;
  }

  close() {
    this.db.close();
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const integration = new MemoryIntegration();

  try {
    switch (command) {
      case 'sync':
        await integration.syncWikiWithMemory();
        break;

      case 'inject':
        await integration.injectMemorySummary();
        break;

      case 'update':
        await integration.updateWikiFromMemory();
        break;

      case 'handoff':
        const convId = args[1];
        if (!convId) {
          throw new Error('Conversation ID required');
        }
        await integration.createHandoffFromMemory(convId);
        break;

      case 'search':
        const query = args.slice(1).join(' ');
        if (!query) {
          throw new Error('Query required');
        }
        const results = await integration.searchMemory(query);
        console.log(JSON.stringify(results, null, 2));
        break;

      default:
        console.log(`
NexusAuto Memory Integration

Uso:
  node memory-integration.js <command> [args]

Comandos:
  sync              Sincroniza Wiki com memória
  inject            Injeta resumo na Wiki
  update            Atualiza Wiki com mudanças recentes
  handoff <id>      Cria handoff de conversação
  search <query>    Busca na memória

Exemplos:
  node memory-integration.js sync
  node memory-integration.js inject
  node memory-integration.js handoff conv-123
  node memory-integration.js search arquitetura
        `);
    }
  } finally {
    integration.close();
  }
}

main().catch(console.error);