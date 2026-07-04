/**
 * Token Budget Manager para NexusAuto
 * 
 * Controla e limita o consumo de tokens em tarefas.
 * Se uma tarefa exceder 50k tokens, divide em subtarefas.
 * 
 * @author NexusAuto Tech Lead
 * @version 1.0.0
 * @see {@link brain/Patterns.md#token-budget}
 */

const tiktoken = require('tiktoken');
const fs = require('fs');
const path = require('path');

// Limite de tokens por tarefa
const TOKEN_LIMIT = 50000;

class TokenBudgetManager {
  constructor() {
    this.encoder = null;
    this.initialized = false;
  }

  /**
   * Inicializa o encoder de tokens
   */
  async init() {
    if (this.initialized) return;

    try {
      // Usar modelo cl100k_base (GPT-4, GPT-3.5-Turbo)
      this.encoder = await tiktoken.get_encoding('cl100k_base');
      this.initialized = true;
      console.log('[TokenBudget] Inicializado com sucesso');
    } catch (error) {
      console.error('[TokenBudget] Erro ao inicializar encoder:', error.message);
      throw error;
    }
  }

  /**
   * Conta tokens em um texto
   * @param {string} text - Texto para contar tokens
   * @returns {number} - Número de tokens
   */
  countTokens(text) {
    if (!this.initialized) {
      throw new Error('TokenBudget não inicializado. Chame init() primeiro.');
    }

    const tokens = this.encoder.encode(text);
    return tokens.length;
  }

  /**
   * Conta tokens em um array de mensagens (formato OpenAI)
   * @param {Array} messages - Array de mensagens {role, content}
   * @returns {number} - Número total de tokens
   */
  countMessagesTokens(messages) {
    let totalTokens = 0;

    for (const msg of messages) {
      // Tokens fixos por mensagem
      totalTokens += 4; // role + content

      // Tokens do conteúdo
      if (typeof msg.content === 'string') {
        totalTokens += this.countTokens(msg.content);
      } else if (Array.isArray(msg.content)) {
        // Suporte para conteúdo multimodal
        for (const item of msg.content) {
          if (item.type === 'text') {
            totalTokens += this.countTokens(item.text);
          }
        }
      }

      // Tokens adicionais por role
      if (msg.role === 'system') {
        totalTokens += 2;
      } else if (msg.role === 'user') {
        totalTokens += 1;
      } else if (msg.role === 'assistant') {
        totalTokens += 1;
      }
    }

    // Tokens finais
    totalTokens += 2;

    return totalTokens;
  }

  /**
   * Verifica se o texto excede o limite de tokens
   * @param {string} text - Texto para verificar
   * @returns {Object} - { exceeds: boolean, count: number, limit: number }
   */
  checkBudget(text) {
    const count = this.countTokens(text);
    return {
      exceeds: count > TOKEN_LIMIT,
      count,
      limit: TOKEN_LIMIT,
      remaining: Math.max(0, TOKEN_LIMIT - count)
    };
  }

  /**
   * Divide texto grande em chunks menores
   * @param {string} text - Texto para dividir
   * @param {number} maxTokens - Máximo de tokens por chunk (padrão: TOKEN_LIMIT)
   * @returns {Array} - Array de chunks { content, tokens, index, total }
   */
  splitIntoChunks(text, maxTokens = TOKEN_LIMIT) {
    const tokens = this.encoder.encode(text);
    const chunks = [];
    const totalChunks = Math.ceil(tokens.length / maxTokens);

    for (let i = 0; i < tokens.length; i += maxTokens) {
      const chunkTokens = tokens.slice(i, i + maxTokens);
      const chunkContent = this.encoder.decode(chunkTokens);

      chunks.push({
        content: chunkContent,
        tokens: chunkTokens.length,
        index: chunks.length + 1,
        total: totalChunks
      });
    }

    return chunks;
  }

  /**
   * Divide tarefa em subtarefas se exceder limite
   * @param {string} taskDescription - Descrição da tarefa
   * @param {string} context - Contexto da tarefa
   * @returns {Object} - { status: 'OK' | 'SPLIT_REQUIRED', chunks?: Array, totalTokens: number }
   */
  async processTask(taskDescription, context = '') {
    const fullContent = `${taskDescription}\n\n---\n\n${context}`;
    const budget = this.checkBudget(fullContent);

    if (!budget.exceeds) {
      return {
        status: 'OK',
        totalTokens: budget.count,
        remainingTokens: budget.remaining
      };
    }

    // Dividir em chunks
    const chunks = this.splitIntoChunks(fullContent, TOKEN_LIMIT * 0.9); // 90% do limite para segurança

    // Criar diretório de tarefas divididas
    const splitDir = path.resolve(process.cwd(), '.ai-factory', 'tasks-split');
    if (!fs.existsSync(splitDir)) {
      fs.mkdirSync(splitDir, { recursive: true });
    }

    // Salvar subtarefas
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const taskFiles = [];

    for (const chunk of chunks) {
      const fileName = `task-${timestamp}-part-${chunk.index}.md`;
      const filePath = path.join(splitDir, fileName);

      const content = `---
part: ${chunk.index}/${chunk.total}
tokens: ${chunk.tokens}
created: ${new Date().toISOString()}
---

# Subtarefa ${chunk.index}/${chunk.total}

${chunk.content}

---
Instruções: Esta é uma parte de uma tarefa maior. 
Coordene com as outras partes para garantir continuidade.
`;

      fs.writeFileSync(filePath, content);
      taskFiles.push({
        file: fileName,
        path: filePath,
        tokens: chunk.tokens,
        part: chunk.index
      });
    }

    return {
      status: 'SPLIT_REQUIRED',
      totalTokens: budget.count,
      chunks: taskFiles,
      splitDir,
      message: `Tarefa dividida em ${chunks.length} subtarefas (${budget.count} tokens > ${TOKEN_LIMIT} limite)`
    };
  }

  /**
   * Estima custo em USD baseado nos tokens
   * @param {number} tokens - Número de tokens
   * @param {Object} pricing - Preços por 1k tokens (input, output)
   * @returns {Object} - { inputCost, outputCost, totalCost }
   */
  estimateCost(tokens, pricing = { input: 0.0005, output: 0.0015 }) {
    // Assumir ratio 1:3 entre input e output
    const inputTokens = tokens * 0.25;
    const outputTokens = tokens * 0.75;

    return {
      inputCost: (inputTokens / 1000) * pricing.input,
      outputCost: (outputTokens / 1000) * pricing.output,
      totalCost: ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output),
      tokensBreakdown: {
        input: Math.round(inputTokens),
        output: Math.round(outputTokens),
        total: tokens
      }
    };
  }

  /**
   * Otimiza contexto para caber no budget
   * @param {string} context - Contexto para otimizar
   * @param {number} targetTokens - Target de tokens (padrão: 80% do limite)
   * @returns {string} - Contexto otimizado
   */
  optimizeContext(context, targetTokens = TOKEN_LIMIT * 0.8) {
    const currentTokens = this.countTokens(context);

    if (currentTokens <= targetTokens) {
      return context;
    }

    // Estratégia de otimização:
    // 1. Remover linhas em branco extras
    // 2. Remover comentários longos
    // 3. Resumir seções repetitivas

    let optimized = context
      .replace(/\n{3,}/g, '\n\n') // Remover linhas em branco extras
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentários de bloco
      .replace(/\/\/.*$/gm, ''); // Remover comentários de linha

    const optimizedTokens = this.countTokens(optimized);

    if (optimizedTokens > targetTokens) {
      // Se ainda exceder, truncar de forma inteligente
      const sentences = optimized.split(/(?<=[.!?])\s+/);
      let result = '';
      let tokens = 0;

      for (const sentence of sentences) {
        const sentenceTokens = this.countTokens(sentence);
        if (tokens + sentenceTokens > targetTokens) {
          break;
        }
        result += sentence + ' ';
        tokens += sentenceTokens;
      }

      optimized = result.trim() + '\n\n[... contexto truncado para caber no budget ...]';
    }

    const savedTokens = currentTokens - this.countTokens(optimized);
    console.log(`[TokenBudget] Contexto otimizado: ${currentTokens} → ${this.countTokens(optimized)} tokens (${savedTokens} economizados)`);

    return optimized;
  }

  /**
   * Gera relatório de uso de tokens
   * @param {Array} sessions - Array de sessões com tokens usados
   * @returns {Object} - Relatório consolidado
   */
  generateReport(sessions) {
    const totalTokens = sessions.reduce((sum, s) => sum + s.tokens, 0);
    const totalCost = this.estimateCost(totalTokens);
    const avgTokensPerSession = totalTokens / sessions.length;
    const sessionsOverBudget = sessions.filter(s => s.tokens > TOKEN_LIMIT).length;

    return {
      period: {
        start: sessions[0]?.date,
        end: sessions[sessions.length - 1]?.date
      },
      totals: {
        sessions: sessions.length,
        tokens: totalTokens,
        cost: totalCost.totalCost
      },
      averages: {
        tokensPerSession: Math.round(avgTokensPerSession),
        costPerSession: totalCost.totalCost / sessions.length
      },
      budget: {
        limit: TOKEN_LIMIT,
        sessionsOverBudget,
        overBudgetPercentage: (sessionsOverBudget / sessions.length * 100).toFixed(2) + '%'
      },
      recommendations: this._generateRecommendations(sessions, avgTokensPerSession)
    };
  }

  /**
   * Gera recomendações baseadas no uso
   */
  _generateRecommendations(sessions, avgTokens) {
    const recommendations = [];

    if (avgTokens > TOKEN_LIMIT * 0.8) {
      recommendations.push({
        priority: 'HIGH',
        text: 'Média de tokens por sessão está acima de 80% do limite. Considere usar mais cache e busca semântica.'
      });
    }

    const sessionsWithCache = sessions.filter(s => s.cached).length;
    const cacheRate = sessionsWithCache / sessions.length;

    if (cacheRate < 0.3) {
      recommendations.push({
        priority: 'MEDIUM',
        text: `Taxa de cache baixa (${(cacheRate * 100).toFixed(1)}%). Implemente cache de respostas para economizar tokens.`
      });
    }

    if (sessions.some(s => s.tokens > TOKEN_LIMIT)) {
      recommendations.push({
        priority: 'HIGH',
        text: 'Sessões excederam o limite de tokens. Use splitIntoChunks para dividir tarefas grandes.'
      });
    }

    return recommendations;
  }

  /**
   * Fecha o encoder
   */
  close() {
    if (this.encoder) {
      this.encoder.free();
      console.log('[TokenBudget] Encoder fechado');
    }
  }
}

// Exportar singleton
const tokenBudget = new TokenBudgetManager();

// CLI para testes
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    await tokenBudget.init();

    try {
      if (command === 'count') {
        const text = args.slice(1).join(' ');
        const count = tokenBudget.countTokens(text);
        console.log(`Tokens: ${count}`);
      } else if (command === 'check') {
        const text = args.slice(1).join(' ');
        const budget = tokenBudget.checkBudget(text);
        console.log('Budget:', JSON.stringify(budget, null, 2));
      } else if (command === 'split') {
        const text = args.slice(1).join(' ');
        const chunks = tokenBudget.splitIntoChunks(text);
        console.log(`Dividido em ${chunks.length} chunks:`);
        chunks.forEach((c, i) => {
          console.log(`  Chunk ${i + 1}: ${c.tokens} tokens`);
        });
      } else if (command === 'cost') {
        const tokens = parseInt(args[1]);
        const cost = tokenBudget.estimateCost(tokens);
        console.log('Custo estimado:', JSON.stringify(cost, null, 2));
      } else {
        console.log('Uso: node token-budget.js <count|check|split|cost> [args]');
      }
    } finally {
      tokenBudget.close();
    }
  })();
}

module.exports = { TokenBudgetManager, tokenBudget, TOKEN_LIMIT };