#!/usr/bin/env node

/**
 * token-dashboard.js
 * 
 * Dashboard de Token Economy
 * Mostra economia diária, semanal e por agente
 * 
 * Uso: node scripts/token-dashboard.js [--reset]
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_FILE = path.join(__dirname, '..', '.ai-factory', 'TOKEN-DASHBOARD.md');
const PROGRESS_FILE = path.join(__dirname, '..', 'PROGRESS.md');

/**
 * Calcula estimativa de economia
 */
function calculateSavings() {
  // Valores de referência (tokens)
  const BASELINE = {
    tokensPerTask: 25000,
    tokensPerHandoff: 5000,
    tokensPerVV: 3000,
    contextLoaded: 20000
  };
  
  const OPTIMIZED = {
    tokensPerTask: 5000,
    tokensPerHandoff: 200,
    tokensPerVV: 600, // média ponderada (cache hit = 50)
    contextLoaded: 2000
  };
  
  // Lê PROGRESS.md para extrair métricas reais
  let tasksCompleted = 0;
  let handoffsMade = 0;
  let vvChecks = 0;
  let cacheHits = 0;
  
  try {
    const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
    
    // Contagem simples (pode ser melhorada com regex)
    tasksCompleted = (progressContent.match(/🟢/g) || []).length;
    handoffsMade = (progressContent.match(/HANDOFF/g) || []).length;
    vvChecks = (progressContent.match(/V&V/g) || []).length;
    cacheHits = (progressContent.match(/Cache Hit/g) || []).length;
  } catch (err) {
    console.error('⚠️  Não foi possível ler PROGRESS.md');
  }
  
  // Calcula economia
  const baseline = {
    tasks: tasksCompleted * BASELINE.tokensPerTask,
    handoffs: handoffsMade * BASELINE.tokensPerHandoff,
    vv: vvChecks * BASELINE.tokensPerVV,
    context: BASELINE.contextLoaded // uma vez por sessão
  };
  
  const optimized = {
    tasks: tasksCompleted * OPTIMIZED.tokensPerTask,
    handoffs: handoffsMade * OPTIMIZED.tokensPerHandoff,
    vv: cacheHits * 50 + (vvChecks - cacheHits) * OPTIMIZED.tokensPerVV,
    context: OPTIMIZED.contextLoaded
  };
  
  const baselineTotal = Object.values(baseline).reduce((a, b) => a + b, 0);
  const optimizedTotal = Object.values(optimized).reduce((a, b) => a + b, 0);
  const savings = baselineTotal - optimizedTotal;
  
  // Custo estimado (US$ 0,02 / 1K tokens para GPT-4)
  const costPer1K = 0.02;
  const baselineCost = (baselineTotal / 1000) * costPer1K;
  const optimizedCost = (optimizedTotal / 1000) * costPer1K;
  const costSavings = baselineCost - optimizedCost;
  
  return {
    metrics: {
      tasksCompleted,
      handoffsMade,
      vvChecks,
      cacheHits,
      cacheHitRate: vvChecks > 0 ? Math.round((cacheHits / vvChecks) * 100) : 0
    },
    tokens: {
      baseline: baselineTotal,
      optimized: optimizedTotal,
      savings
    },
    cost: {
      baseline: baselineCost,
      optimized: optimizedCost,
      savings: costSavings
    },
    reduction: baselineTotal > 0 ? Math.round((savings / baselineTotal) * 100) : 0
  };
}

/**
 * Gera dashboard Markdown
 */
function generateDashboard(data) {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('pt-BR');
  
  return `# Token Economy Dashboard

## 📊 Visão Geral

**Data:** ${date} ${time}  
**Status:** ${data.tokens.savings > 0 ? '✅ Economizando' : '⚠️ Sem dados'}

---

## 💰 Economia Acumulada

| Métrica | Valor |
|---------|-------|
| **Tokens Economizados** | ${data.tokens.savings.toLocaleString('pt-BR')} |
| **Economia Financeira** | R$ ${(data.cost.savings * 5).toFixed(2)}* |
| **Redução Percentual** | ${data.reduction}% |

\\* Estimativa: R$ 0,10 / 1K tokens (GPT-4)

---

## 📈 Métricas Operacionais

| Métrica | Valor |
|---------|-------|
| Tarefas Concluídas | ${data.metrics.tasksCompleted} |
| Handoffs Realizados | ${data.metrics.handoffsMade} |
| Validações V&V | ${data.metrics.vvChecks} |
| Cache Hits | ${data.metrics.cacheHits} |
| **Cache Hit Rate** | ${data.metrics.cacheHitRate}% |

---

## 🎯 Metas vs Realizado

| Métrica | Meta | Realizado | Status |
|---------|------|-----------|--------|
| Redução de Tokens | 70% | ${data.reduction}% | ${data.reduction >= 70 ? '✅' : '⏳'} |
| Cache Hit Rate | 80% | ${data.metrics.cacheHitRate}% | ${data.metrics.cacheHitRate >= 80 ? '✅' : '⏳'} |
| Handoffs < 200 tokens | 100% | ${data.metrics.handoffsMade > 0 ? 'Verificar' : 'Sem dados'} | ⏳ |
| Tarefas < 50k tokens | 100% | ${data.metrics.tasksCompleted > 0 ? 'Verificar' : 'Sem dados'} | ⏳ |

---

## 📊 Comparativo (Antes vs Depois)

```
ANTES (Baseline):     ${data.tokens.baseline.toLocaleString('pt-BR')} tokens  (R$ ${(data.cost.baseline * 5).toFixed(2)})
DEPOIS (Otimizado):   ${data.tokens.optimized.toLocaleString('pt-BR')} tokens  (R$ ${(data.cost.optimized * 5).toFixed(2)})
                       ──────────────────────────────────────
ECONOMIA:              ${data.tokens.savings.toLocaleString('pt-BR')} tokens  (R$ ${(data.cost.savings * 5).toFixed(2)})
```

---

## 🏆 Ranking por Agente

*(Preencher manualmente ou integrar com logs)*

| Posição | Agente | Economia | % Meta |
|---------|--------|----------|--------|
| 🥇 1 | - | R$ 0,00 | 0% |
| 🥈 2 | - | R$ 0,00 | 0% |
| 🥉 3 | - | R$ 0,00 | 0% |

---

## 📝 Ações para Melhorar

${data.reduction < 70 ? `
### 🔴 Prioridade Máxima
- [ ] Revisar handoffs (estão > 200 tokens?)
- [ ] Implementar cache de validação
- [ ] Usar retrieve-context.js em vez de carregar diretórios
` : ''}

${data.metrics.cacheHitRate < 80 ? `
### 🟡 Prioridade Alta
- [ ] Validar mais arquivos via cache
- [ ] Atualizar VALIDATION_CACHE.md após cada V&V
- [ ] Verificar hash antes de validar
` : ''}

${data.metrics.cacheHitRate >= 80 && data.reduction >= 70 ? `
### 🟢 Manter Performance
- ✅ Continuar seguindo protocolos
- ✅ Compartilhar melhores práticas
- ✅ Documentar casos de sucesso
` : ''}

---

## 📚 Links Úteis

- [Guia da Token Economy](./MELHORIAS/23-Token-Economy/TOKEN-ECONOMY.md)
- [Guia dos Agentes](./MELHORIAS/23-Token-Economy/GUIA-AGENTES.md)
- [VALIDATION_CACHE](./VALIDATION_CACHE.md)
- [HANDOFF_TEMPLATE](./handoffs/HANDOFF_TEMPLATE.md)

---

*Atualizado automaticamente por token-dashboard.js*
`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');
  
  console.error('📊 Token Economy Dashboard\n');
  
  if (reset) {
    console.error('🔄 Resetando dashboard...');
    const emptyDashboard = generateDashboard({
      metrics: {
        tasksCompleted: 0,
        handoffsMade: 0,
        vvChecks: 0,
        cacheHits: 0,
        cacheHitRate: 0
      },
      tokens: {
        baseline: 0,
        optimized: 0,
        savings: 0
      },
      cost: {
        baseline: 0,
        optimized: 0,
        savings: 0
      },
      reduction: 0
    });
    
    fs.writeFileSync(DASHBOARD_FILE, emptyDashboard);
    console.error('✅ Dashboard resetado');
    return;
  }
  
  // Calcula dados
  const data = calculateSavings();
  
  // Gera dashboard
  const dashboard = generateDashboard(data);
  
  // Salva arquivo
  fs.writeFileSync(DASHBOARD_FILE, dashboard);
  
  // Output no console
  console.log(`
╔══════════════════════════════════════════════════════════╗
║           TOKEN ECONOMY DASHBOARD                        ║
╠══════════════════════════════════════════════════════════╣
║  Tokens Economizados:  ${data.tokens.savings.toLocaleString('pt-BR').padEnd(20)} ║
║  Economia Financeira:  R$ ${(data.cost.savings * 5).toFixed(2).padStart(15)} ║
║  Redução Percentual:   ${data.reduction.toString().padEnd(20)}% ║
╠══════════════════════════════════════════════════════════╣
║  Tarefas Concluídas:   ${data.metrics.tasksCompleted.toString().padEnd(20)} ║
║  Cache Hit Rate:       ${data.metrics.cacheHitRate.toString().padEnd(20)}% ║
╚══════════════════════════════════════════════════════════╝

📄 Dashboard completo: ${DASHBOARD_FILE}
  `);
  
  // Exit codes
  if (data.reduction >= 70 && data.metrics.cacheHitRate >= 80) {
    console.error('✅ Meta de economia atingida!');
    process.exit(0);
  } else if (data.reduction >= 50) {
    console.error('⚠️  Economia parcial - melhorar cache hit rate');
    process.exit(1);
  } else {
    console.error('🔴 Economia abaixo da meta - revisar processos');
    process.exit(2);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});