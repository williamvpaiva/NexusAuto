#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const ROOT = process.cwd();
const HANDOFFS_DIR = path.join(ROOT, '.ai-factory', 'handoffs');
const ECONOMY_DIR = path.join(ROOT, '.ai-factory', 'wiki', 'economy');
const MEMORY_DB = path.join(ROOT, 'nexusauto_memory.db');
const BUDGET_SCRIPT = path.join(ROOT, '.ai-factory', 'scripts', 'token-budget.js');

const TOKENIZER_MODEL = 'cl100k_base';
const PRICING_INPUT = 0.0005;
const PRICING_OUTPUT = 0.0015;

function estimateTokenCount(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round(words * 1.3);
}

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

async function loadJSON(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch { return null; }
}

async function saveJSON(file, data) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function getMemoryStats() {
  const stats = { memories: 0, embeddings: 0, cacheHits: 0, tokensSavedByCache: 0, memoriesByType: [], memoriesByAgent: [] };
  try {
    const { memoryManager } = require('./memory-manager.js');
    await memoryManager.init();
    const s = memoryManager.getStats();
    stats.memories = s.totalMemories;
    stats.embeddings = s.totalEmbeddings;
    stats.cacheHits = s.totalCachedResponses;
    stats.tokensSavedByCache = s.totalTokensSaved;
    stats.memoriesByType = s.memoriesByType;
    stats.memoriesByAgent = s.memoriesByAgent;
    memoryManager.close();
  } catch (e) {
    stats.error = e.message;
  }
  return stats;
}

async function getGNHFStats() {
  const stats = { totalRuns: 0, successfulRuns: 0, failedRuns: 0, partialRuns: 0, totalIterations: 0, totalTokens: 0 };
  try {
    const files = await fs.readdir(HANDOFFS_DIR).catch(() => []);
    for (const file of files) {
      if (!file.startsWith('iteration-')) continue;
      const content = await fs.readFile(path.join(HANDOFFS_DIR, file), 'utf8');
      stats.totalRuns++;

      const iterMatch = content.match(/Iteration\s+(\d+)/i);
      if (iterMatch) stats.totalIterations += parseInt(iterMatch[1]);

      const tokenMatch = content.match(/Tokens?[:\s]+~?(\d+)/i);
      if (tokenMatch) stats.totalTokens += parseInt(tokenMatch[1]);

      if (content.includes('[V&V] PASS') || content.includes('V&V aprovado')) stats.successfulRuns++;
      else if (content.includes('[V&V] FAIL') || content.includes('V&V falhou')) stats.failedRuns++;
      else stats.partialRuns++;
    }
  } catch (e) {
    stats.error = e.message;
  }
  return stats;
}

async function getBudgetStats() {
  const stats = { totalOptimizations: 0, tokensSavedByOptimization: 0, totalSplits: 0 };
  const budgetLog = path.join(ROOT, '.ai-factory', 'budget-log.json');
  const log = await loadJSON(budgetLog);
  if (log) {
    stats.totalOptimizations = log.optimizations || 0;
    stats.tokensSavedByOptimization = log.tokensSaved || 0;
    stats.totalSplits = log.splits || 0;
  }
  return stats;
}

async function getCommitStats() {
  const stats = { totalCommits: 0, periodTokens: 0 };
  try {
    const log = execSync('git log --oneline --since="7 days ago" --format="%s"', { encoding: 'utf8', cwd: ROOT }).trim();
    if (log) {
      const lines = log.split('\n').filter(Boolean);
      stats.totalCommits = lines.length;
      stats.periodTokens = estimateTokenCount(log);
    }
  } catch {}
  return stats;
}

async function getHistoricalData() {
  const historyFile = path.join(ECONOMY_DIR, 'history.json');
  const data = await loadJSON(historyFile);
  return data || { days: [] };
}

async function saveHistoricalSnapshot(memory, gnhf, budget, commit) {
  const history = await getHistoricalData();
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = history.days[history.days.length - 1];
  if (lastEntry && lastEntry.date === today) return history;

  history.days.push({
    date: today,
    memory: { cacheHits: memory.cacheHits, tokensSavedByCache: memory.tokensSavedByCache },
    gnhf: { totalRuns: gnhf.totalRuns, totalTokens: gnhf.totalTokens },
    budget: { tokensSavedByOptimization: budget.tokensSavedByOptimization, totalSplits: budget.totalSplits },
    commit: { totalCommits: commit.totalCommits }
  });

  await saveJSON(path.join(ECONOMY_DIR, 'history.json'), history);
  return history;
}

function calculateSavings(memory, gnhf, budget, history) {
  const cacheTokens = memory.tokensSavedByCache;
  const budgetTokens = budget.tokensSavedByOptimization;
  const gnhfTokens = gnhf.totalTokens;
  const totalSaved = cacheTokens + budgetTokens;
  const totalProjected = totalSaved + gnhfTokens;

  const savingsUSD = (totalSaved / 1000) * PRICING_OUTPUT;
  const projectedUSD = (totalProjected / 1000) * PRICING_OUTPUT;
  const spentUSD = (gnhfTokens / 1000) * (PRICING_INPUT + PRICING_OUTPUT) / 2;

  const cacheRate = memory.cacheHits > 0
    ? Math.min(100, Math.round((memory.cacheHits / Math.max(1, memory.memories)) * 100))
    : 0;

  const economyRate = totalSaved > 0
    ? Math.round((totalSaved / Math.max(1, totalProjected)) * 100)
    : 0;

  const trend = history.days.length >= 2
    ? (() => {
        const prev = history.days[history.days.length - 2];
        const curr = history.days[history.days.length - 1];
        const prevTotal = (prev.budget?.tokensSavedByOptimization || 0) + (prev.memory?.tokensSavedByCache || 0);
        const currTotal = (curr.budget?.tokensSavedByOptimization || 0) + (curr.memory?.tokensSavedByCache || 0);
        if (currTotal > prevTotal) return 'up';
        if (currTotal < prevTotal) return 'down';
        return 'stable';
      })()
    : 'stable';

  return { totalSaved, totalProjected, savingsUSD, projectedUSD, spentUSD, cacheRate, economyRate, trend };
}

function generateReport(memory, gnhf, budget, commit, savings, history) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const ecoFile = path.join(ECONOMY_DIR, 'LATEST-REPORT.md');
  const linesSaved = Math.round(savings.totalSaved / 80);
  const treesEquivalent = Math.round(linesSaved / 5000);

  const content = `# Token Economy Report

**Gerado em:** ${now}
**Período:** Últimos 7 dias

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| 💰 Tokens economizados | ${savings.totalSaved.toLocaleString()} |
| 💵 Custo evitado | $${savings.savingsUSD.toFixed(4)} |
| 📈 Taxa de economia | ${savings.economyRate}% |
| 🎯 Cache hits | ${memory.cacheHits} |
| 🔄 Otimizações de contexto | ${budget.totalOptimizations} |

## Cache de Memória

| Métrica | Valor |
|---------|-------|
| Memórias armazenadas | ${memory.memories} |
| Embeddings cacheados | ${memory.embeddings} |
| Respostas cacheadas | ${memory.cacheHits} |
| Tokens economizados via cache | ${memory.tokensSavedByCache.toLocaleString()} |
| Taxa de reuso | ${savings.cacheRate}% |

## Otimização de Contexto (Token Budget)

| Métrica | Valor |
|---------|-------|
| Otimizações aplicadas | ${budget.totalOptimizations} |
| Tokens economizados | ${budget.tokensSavedByOptimization.toLocaleString()} |
| Divisões de tarefa | ${budget.totalSplits} |

## GNHF (Agentes Autônomos)

| Métrica | Valor |
|---------|-------|
| Runs totais | ${gnhf.totalRuns} |
| Runs sucedidos | ${gnhf.successfulRuns} |
| Runs com falha | ${gnhf.failedRuns} |
| Iterações totais | ${gnhf.totalIterations} |
| Tokens consumidos | ${gnhf.totalTokens.toLocaleString()} |
| Custo estimado | $${savings.spentUSD.toFixed(4)} |

## Projeções e Impacto

| Métrica | Valor |
|---------|-------|
| Tokens projetados (sem economia) | ${savings.totalProjected.toLocaleString()} |
| Tokens reais gastos | ${(savings.totalProjected - savings.totalSaved).toLocaleString()} |
| **Economia total** | **${savings.totalSaved.toLocaleString()} tokens (${savings.economyRate}%)** |
| Custo evitado (projetado) | $${savings.projectedUSD.toFixed(4)} |
| Custo real | $${(savings.projectedUSD - savings.savingsUSD).toFixed(4)} |
| **Economia financeira** | **$${savings.savingsUSD.toFixed(4)}** |

## Tendência

| Dia | Cache | Budget | GNHF | Total Economizado |
|-----|-------|--------|------|-------------------|
${history.days.slice(-7).map(d => {
  const dTotal = (d.memory?.tokensSavedByCache || 0) + (d.budget?.tokensSavedByOptimization || 0);
  return `| ${d.date} | ${(d.memory?.tokensSavedByCache || 0).toLocaleString()} | ${(d.budget?.tokensSavedByOptimization || 0).toLocaleString()} | ${(d.gnhf?.totalTokens || 0).toLocaleString()} | ${dTotal.toLocaleString()} |`;
}).join('\n')}

## Impacto Ambiental (Estimativa)

- Linhas de código que deixaram de ser geradas: ~${linesSaved.toLocaleString()}
- Equivalente a ~${treesEquivalent} árvores por ano (1 árvore ≈ 5K linhas economizadas)
- CO₂ evitado: ~${(savings.totalSaved * 0.0002).toFixed(2)} kg (estimativa)

## Recomendações

${savings.cacheRate < 30 ? '- **[MÉDIO]** Taxa de reuso de cache baixa. Considere aumentar TTL ou revisar política de cache.' : '- ✅ Cache operando com boa taxa de reuso.'}
${budget.totalOptimizations === 0 ? '- **[ALTO]** Nenhuma otimização de contexto registrada. Ative token-budget.js para economizar 60-80% por sessão.' : '- ✅ Otimizações de contexto ativas.'}
${gnhf.totalRuns === 0 ? '- **[MÉDIO]** Nenhum run GNHF registrado. Considere executar `/gnhf run` para automatizar tarefas.' : '- ✅ GNHF operacional.'}
${budget.totalSplits > 0 ? `- ℹ️ ${budget.totalSplits} tarefas foram divididas. Ideal para tarefas >50k tokens.` : ''}

---

*Relatório gerado automaticamente por NexusAuto Token Economy Report*
*Dashboard: \`.ai-factory/wiki/economy/\`*
`;

  return { content, ecoFile };
}

async function updateTECHLEAD(memory, gnhf, budget, savings) {
  const techLeadPath = path.join(ROOT, '.ai-factory', 'TECH-LEAD.md');
  let tl;
  try { tl = await fs.readFile(techLeadPath, 'utf8'); } catch { return; }

  const newCmd = `
---

### \\\`/token-report\\\`

**Propósito:** Exibir relatório de economia de tokens do NexusAuto

**Execução:**
1. Coletar stats do memory-manager (cache hits, tokens saved)
2. Coletar stats do GNHF (runs, tokens consumidos)
3. Coletar stats do token-budget (otimizações)
4. Gerar relatório consolidado com projeções

**Exemplo:**
\\\`\\\`\\\`bash
/token-report
\\\`\\\`\\\`

**Output:**
\\\`\\\`\\\`markdown
## Token Economy Report

| Métrica | Valor |
|---------|-------|
| 💰 Tokens economizados | ${savings.totalSaved.toLocaleString()} |
| 💵 Custo evitado | $${savings.savingsUSD.toFixed(4)} |
| 📈 Taxa de economia | ${savings.economyRate}% |
| 🎯 Cache hits | ${memory.cacheHits} |
🔄 Otimizações | ${budget.totalOptimizations} |
\\\`\\\`\\\`
`;

  if (!tl.includes('/token-report')) {
    await fs.writeFile(techLeadPath, tl.trim() + '\n' + newCmd);
  }
}

async function updateIntegrationScript() {
  const integratePath = path.join(ROOT, '.ai-factory', 'scripts', 'integrate.js');
  let content;
  try { content = await fs.readFile(integratePath, 'utf8'); } catch { return; }

  const economyBlock = `
    // Modo 5: Relatório de economia
    if (mode === 'economy' || mode === 'full') {
      console.log('📊 Gerando relatório de economia de tokens...\\n');
      try {
        execSync(\`node \${path.join(__dirname, 'token-economy-report.js')}\`, {
          stdio: 'inherit'
        });
        console.log('✅ Relatório de economia gerado\\n');
      } catch (error) {
        console.log('⚠️  Relatório de economia falhou - verifique issues\\n');
      }
    }
`;

  if (!content.includes("mode === 'economy'")) {
    const insertPoint = content.indexOf("// Modo 4: Validar V&V");
    if (insertPoint !== -1) {
      const before = content.slice(0, insertPoint);
      const after = content.slice(insertPoint);
      const updated = before + economyBlock + '\n' + after;
      await fs.writeFile(integratePath, updated);
    }
  }

  // Update modes listing
  if (content.includes("vv     - Apenas validação V&V")) {
    content = content.replace(
      "vv     - Apenas validação V&V",
      `vv     - Apenas validação V&V
  economy - Apenas relatório de economia`
    );
    await fs.writeFile(integratePath, content);
  }
}

async function run() {
  const args = process.argv.slice(2);
  const isJSON = args.includes('--json');

  await ensureDir(ECONOMY_DIR);

  const [memory, gnhf, budget, commit] = await Promise.all([
    getMemoryStats(),
    getGNHFStats(),
    getBudgetStats(),
    getCommitStats()
  ]);

  const history = await saveHistoricalSnapshot(memory, gnhf, budget, commit);
  const savings = calculateSavings(memory, gnhf, budget, history);
  const { content, ecoFile } = generateReport(memory, gnhf, budget, commit, savings, history);

  if (isJSON) {
    console.log(JSON.stringify({ memory, gnhf, budget, commit, savings, history: history.days }, null, 2));
    return;
  }

  console.log(content);
  await fs.writeFile(ecoFile, content);

  await Promise.all([
    updateTECHLEAD(memory, gnhf, budget, savings),
    updateIntegrationScript()
  ]);

  console.log(`\n✅ Relatório salvo em: ${ecoFile}`);
}

run().catch(e => {
  console.error('Erro:', e.message);
  process.exit(1);
});
