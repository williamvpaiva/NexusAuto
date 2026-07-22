#!/usr/bin/env node

/**
 * token-budget.js
 * 
 * Estima custo em tokens antes de executar tarefas
 * Divide tarefas grandes em subtarefas menores automaticamente
 * 
 * Uso: node scripts/token-budget.js prompt.txt
 * Saída: JSON com estimativa e decisão (SPLIT_REQUIRED ou OK)
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
  // Limites de tokens
  MAX_TOKENS_PER_TASK: 50000,     // Limite por tarefa
  MAX_TOKENS_PER_AGENT: 30000,    // Limite por agente
  SAFETY_MARGIN: 0.8,             // Margem de segurança (80%)
  
  // Estimativas (1 token ≈ 4 caracteres em português)
  CHARS_PER_TOKEN: 4,
  
  // Split thresholds
  SPLIT_THRESHOLD_LINES: 500,     // Divide se > 500 linhas de código
  SPLIT_THRESHOLD_FILES: 10,      // Divide se > 10 arquivos
};

/**
 * Estima tokens de um texto (método rápido sem tiktoken)
 */
function estimateTokens(text) {
  if (!text) return 0;
  
  // Contagem básica: caracteres / 4
  const charCount = text.length;
  const estimatedTokens = Math.ceil(charCount / CONFIG.CHARS_PER_TOKEN);
  
  // Ajuste para português (palavras mais longas)
  const wordCount = text.split(/\s+/).length;
  const avgWordLength = charCount / wordCount;
  
  // Fator de correção para português (~1.2x)
  const correctionFactor = avgWordLength > 5 ? 1.2 : 1.0;
  
  return Math.ceil(estimatedTokens * correctionFactor);
}

/**
 * Analisa complexidade do prompt
 */
function analyzeComplexity(prompt) {
  const indicators = {
    // Palavras-chave que indicam complexidade
    highComplexity: [
      'implementar sistema',
      'arquitetura completa',
      'integração múltipla',
      'banco de dados',
      'autenticação',
      'pagamento',
      'microserviços',
      'deploy em produção'
    ],
    
    // Palavras-chave que indicam tarefa simples
    lowComplexity: [
      'criar componente',
      'adicionar rota',
      'corrigir bug',
      'atualizar teste',
      'refatorar função',
      'adicionar validação'
    ]
  };
  
  const lowerPrompt = prompt.toLowerCase();
  
  const highScore = indicators.highComplexity.reduce((acc, phrase) => 
    acc + (lowerPrompt.includes(phrase) ? 1 : 0), 0
  );
  
  const lowScore = indicators.lowComplexity.reduce((acc, phrase) => 
    acc + (lowerPrompt.includes(phrase) ? 1 : 0), 0
  );
  
  return {
    level: highScore > 2 ? 'ALTA' : lowScore > 1 ? 'BAIXA' : 'MÉDIA',
    highScore,
    lowScore
  };
}

/**
 * Divide tarefa em subtarefas
 */
function splitTask(prompt, complexity) {
  const subtasks = [];
  
  // Padrões de split
  const patterns = [
    {
      name: 'Backend First',
      condition: (p) => p.includes('backend') || p.includes('API') || p.includes('rota'),
      split: (p) => [
        '1. Criar schema/model no banco de dados',
        '2. Implementar controller e rotas da API',
        '3. Adicionar validações e middleware',
        '4. Criar testes unitários do backend',
        '5. Documentar endpoints (OpenAPI/Swagger)'
      ]
    },
    {
      name: 'Frontend First',
      condition: (p) => p.includes('frontend') || p.includes('React') || p.includes('componente'),
      split: (p) => [
        '1. Criar tipos/interfaces TypeScript',
        '2. Implementar componente base',
        '3. Adicionar estado e lógica (hooks)',
        '4. Estilizar (Tailwind/CSS)',
        '5. Criar testes do componente'
      ]
    },
    {
      name: 'Full Stack',
      condition: (p) => p.includes('tela') || p.includes('feature') || p.includes('funcionalidade'),
      split: (p) => [
        '1. Definir contrato API (backend)',
        '2. Implementar backend (rotas + DB)',
        '3. Testar API (Postman/cURL)',
        '4. Implementar frontend (componentes)',
        '5. Integrar frontend-backend',
        '6. Testes E2E e validação'
      ]
    },
    {
      name: 'Bug Fix',
      condition: (p) => p.includes('bug') || p.includes('erro') || p.includes('corrigir'),
      split: (p) => [
        '1. Reproduzir o bug (passos claros)',
        '2. Identificar causa raiz (logs/debug)',
        '3. Implementar fix',
        '4. Criar teste que previne regressão',
        '5. Validar fix em staging'
      ]
    }
  ];
  
  // Encontra padrão aplicável
  const pattern = patterns.find(p => p.condition(prompt)) || patterns[2]; // Default: Full Stack
  
  return {
    strategy: pattern.name,
    subtasks: pattern.split(prompt),
    estimatedTokensPerSubtask: Math.ceil(estimateTokens(prompt) / pattern.split(prompt).length)
  };
}

/**
 * Main function
 */
async function main() {
  const promptFile = process.argv[2];
  
  if (!promptFile) {
    console.error('Uso: node scripts/token-budget.js <arquivo-prompt.txt>');
    console.error('Ex: node scripts/token-budget.js tasks/task-001-prompt.txt');
    process.exit(1);
  }
  
  // Lê prompt
  let prompt;
  try {
    prompt = fs.readFileSync(promptFile, 'utf8');
  } catch (err) {
    console.error(`❌ Erro ao ler arquivo: ${err.message}`);
    process.exit(1);
  }
  
  // Estima tokens
  const estimatedTokens = estimateTokens(prompt);
  const adjustedTokens = Math.ceil(estimatedTokens * CONFIG.SAFETY_MARGIN);
  
  // Analisa complexidade
  const complexity = analyzeComplexity(prompt);
  
  // Verifica se precisa dividir
  const requiresSplit = adjustedTokens > CONFIG.MAX_TOKENS_PER_TASK;
  
  // Gera output
  const output = {
    file: promptFile,
    timestamp: new Date().toISOString(),
    estimation: {
      rawTokens: estimatedTokens,
      adjustedTokens,
      safetyMargin: CONFIG.SAFETY_MARGIN,
      characters: prompt.length,
      lines: prompt.split('\n').length
    },
    complexity,
    decision: requiresSplit ? 'SPLIT_REQUIRED' : 'OK',
    limits: {
      maxTokensPerTask: CONFIG.MAX_TOKENS_PER_TASK,
      maxTokensPerAgent: CONFIG.MAX_TOKENS_PER_AGENT,
      utilizationPercent: Math.round((adjustedTokens / CONFIG.MAX_TOKENS_PER_TASK) * 100)
    }
  };
  
  // Se precisa dividir, gera subtarefas
  if (requiresSplit) {
    const splitResult = splitTask(prompt, complexity);
    output.split = {
      strategy: splitResult.strategy,
      subtasks: splitResult.subtasks,
      estimatedTokensPerSubtask: splitResult.estimatedTokensPerSubtask
    };
    
    // Salva subtarefas em arquivo
    const tasksDir = path.join(__dirname, '..', '.ai-factory', 'tasks-split');
    if (!fs.existsSync(tasksDir)) {
      fs.mkdirSync(tasksDir, { recursive: true });
    }
    
    const taskId = path.basename(promptFile, '.txt');
    splitResult.subtasks.forEach((subtask, index) => {
      const subtaskFile = path.join(tasksDir, `${taskId}-part-${index + 1}.md`);
      fs.writeFileSync(subtaskFile, `# ${taskId} - Parte ${index + 1}\n\n${subtask}\n\nContexto:\n${prompt}`);
      console.error(`📝 Subtarefa salva: ${subtaskFile}`);
    });
  }
  
  // Output JSON
  console.log(JSON.stringify(output, null, 2));
  
  // Exit code para automação
  if (requiresSplit) {
    process.exit(2); // SPLIT_REQUIRED
  } else {
    process.exit(0); // OK
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});