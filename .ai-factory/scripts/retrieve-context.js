#!/usr/bin/env node

/**
 * NexusAuto - Retrieve Context
 * 
 * Carrega contexto específico sob demanda para agentes
 * Camada 3 do sistema de contexto em camadas
 */

const fs = require('fs').promises;
const path = require('path');

const CONTEXT_LAYERS = {
  layer1: 'CONTEXT_SUMMARY.md',
  layer2: 'PROJECT_CONTEXT.md',
  layer3: '.ai-factory/scripts/retrieve-context.js'
};

async function retrieveContext(query, options = {}) {
  const {
    maxTokens = 500,
    includeAgents = false,
    includeSkills = false,
    includeWorkflows = false,
    includeMemory = false
  } = options;

  console.log(`🔍 Buscando contexto para: "${query}"\n`);

  const context = {
    query,
    timestamp: new Date().toISOString(),
    layers: [],
    tokens: 0
  };

  // Layer 1: Contexto base (sempre carregado)
  console.log('📥 Carregando Layer 1 (Base)...');
  const layer1 = await loadLayer(CONTEXT_LAYERS.layer1);
  context.layers.push({ name: 'Layer 1 - Base', content: layer1 });
  context.tokens += estimateTokens(layer1);

  // Layer 2: Visão macro (sob demanda)
  if (options.includeMacro) {
    console.log('📥 Carregando Layer 2 (Macro)...');
    const layer2 = await loadLayer(CONTEXT_LAYERS.layer2);
    context.layers.push({ name: 'Layer 2 - Macro', content: layer2 });
    context.tokens += estimateTokens(layer2);
  }

  // Layer 3: Código específico (sob demanda)
  if (includeAgents) {
    console.log('📥 Carregando Agentes...');
    const agents = await loadAgents();
    context.layers.push({ name: 'Agents', content: agents });
    context.tokens += estimateTokens(agents);
  }

  if (includeSkills) {
    console.log('📥 Carregando Skills...');
    const skills = await loadSkills();
    context.layers.push({ name: 'Skills', content: skills });
    context.tokens += estimateTokens(skills);
  }

  if (includeWorkflows) {
    console.log('📥 Carregando Workflows...');
    const workflows = await loadWorkflows();
    context.layers.push({ name: 'Workflows', content: workflows });
    context.tokens += estimateTokens(workflows);
  }

  if (includeMemory) {
    console.log('📥 Carregando Memória Recente...');
    const memory = await loadMemory(query);
    context.layers.push({ name: 'Memory', content: memory });
    context.tokens += estimateTokens(memory);
  }

  // Otimizar contexto se exceder maxTokens
  if (context.tokens > maxTokens) {
    console.log(`⚠️  Contexto (${context.tokens} tokens) excede limite (${maxTokens}), otimizando...`);
    await optimizeContext(context, maxTokens);
  }

  console.log(`\n✅ Contexto recuperado: ${context.tokens} tokens`);
  console.log(`📊 Layers: ${context.layers.length}`);

  return context;
}

async function loadLayer(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (error) {
    console.warn(`⚠️  Layer não encontrado: ${filePath}`);
    return '';
  }
}

async function loadAgents() {
  const agentsDir = path.join(process.cwd(), '.ai-factory', 'agents');
  const files = await fs.readdir(agentsDir).catch(() => []);

  let content = '# Agentes Disponíveis\n\n';
  for (const file of files) {
    if (file.endsWith('.md')) {
      const agentContent = await fs.readFile(path.join(agentsDir, file), 'utf-8');
      const name = file.replace('.md', '');
      content += `## ${name}\n\n${agentContent.substring(0, 500)}...\n\n`;
    }
  }

  return content;
}

async function loadSkills() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const files = await fs.readdir(skillsDir).catch(() => []);

  let content = '# Skills Disponíveis\n\n';
  for (const file of files) {
    if (file.endsWith('/SKILL.md') || file.endsWith('.md')) {
      const skillContent = await fs.readFile(path.join(skillsDir, file), 'utf-8');
      content += `## ${file}\n\n${skillContent.substring(0, 300)}...\n\n`;
    }
  }

  return content;
}

async function loadWorkflows() {
  const workflowsDir = path.join(process.cwd(), '.ai-factory', 'workflows');
  const files = await fs.readdir(workflowsDir).catch(() => []);

  let content = '# Workflows Disponíveis\n\n';
  for (const file of files) {
    if (file.endsWith('.yml') || file.endsWith('.md')) {
      const workflowContent = await fs.readFile(path.join(workflowsDir, file), 'utf-8');
      content += `## ${file}\n\n${workflowContent.substring(0, 300)}...\n\n`;
    }
  }

  return content;
}

async function loadMemory(query) {
  // Carregar resumo recente da memória
  const memoryPath = path.join(process.cwd(), '.ai-factory', 'wiki', 'memory', 'RECENT_SUMMARY.md');
  try {
    const content = await fs.readFile(memoryPath, 'utf-8');
    return content;
  } catch (error) {
    return 'Memória não disponível.';
  }
}

async function optimizeContext(context, maxTokens) {
  // Estratégia simples: truncar conteúdo de cada layer
  const targetPerLayer = Math.floor(maxTokens / context.layers.length);

  for (const layer of context.layers) {
    const tokens = estimateTokens(layer.content);
    if (tokens > targetPerLayer) {
      // Truncar para caber no limite
      const ratio = targetPerLayer / tokens;
      const maxLength = Math.floor(layer.content.length * ratio);
      layer.content = layer.content.substring(0, maxLength) + '\n\n[...truncado para otimização...]';
    }
  }

  // Recalcular tokens
  context.tokens = context.layers.reduce((sum, layer) => sum + estimateTokens(layer.content), 0);
}

function estimateTokens(text) {
  // Estimativa simples: 1 token ≈ 4 caracteres em português
  return Math.ceil(text.length / 4);
}

function exportContext(context, format = 'markdown') {
  if (format === 'json') {
    return JSON.stringify(context, null, 2);
  }

  // Markdown
  let output = `# Contexto Recuperado\n\n`;
  output += `**Query:** ${context.query}\n`;
  output += `**Timestamp:** ${context.timestamp}\n`;
  output += `**Total Tokens:** ${context.tokens}\n\n`;

  for (const layer of context.layers) {
    output += `---\n\n## ${layer.name}\n\n`;
    output += `${layer.content}\n\n`;
  }

  return output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const query = args.join(' ') || 'contexto geral';

  const options = {
    maxTokens: 500,
    includeAgents: args.includes('--agents'),
    includeSkills: args.includes('--skills'),
    includeWorkflows: args.includes('--workflows'),
    includeMemory: args.includes('--memory'),
    includeMacro: args.includes('--macro')
  };

  const context = await retrieveContext(query, options);

  // Output
  const format = args.includes('--json') ? 'json' : 'markdown';
  console.log(exportContext(context, format));
}

// Exports
module.exports = { retrieveContext, loadLayer, estimateTokens, exportContext };

// Main
if (require.main === module) {
  main().catch(console.error);
}