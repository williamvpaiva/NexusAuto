#!/usr/bin/env node

/**
 * Dashboard API - Líder Orchestration Dashboard
 * 
 * fornece dados em tempo real para o dashboard de orquestração
 * Endpoints:
 * - GET /api/tasks → Lista de tarefas
 * - GET /api/agents → Agentes ativos e métricas
 * - GET /api/metrics → Métricas de orquestração
 * - GET /api/vv → Estatísticas de V&V
 * - GET /api/handoffs → Histórico de handoffs
 * - WS /ws → WebSocket para atualizações em tempo real
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const MemoryManager = require('../../scripts/memory-manager.cjs');

const PORT = process.env.DASHBOARD_PORT || 3001;
const ROOT_DIR = path.join(__dirname, '..', '..');
const MELHORIAS_DIR = path.join(ROOT_DIR, '.ai-factory', 'MELHORIAS');

// Inicializar Memory Manager
const mm = new MemoryManager();
let mmInitialized = false;

mm.init().then(() => {
  mmInitialized = true;
  console.log('📊 Dashboard API initialized');
}).catch(err => {
  console.error('⚠️ Memory Manager init failed:', err.message);
});

// Helper: Parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Handler: GET /api/tasks
async function getTasks() {
  const tasks = [];
  
  // Ler tarefas dos arquivos MELHORIAS
  if (fs.existsSync(MELHORIAS_DIR)) {
    const areas = fs.readdirSync(MELHORIAS_DIR)
      .filter(f => fs.statSync(path.join(MELHORIAS_DIR, f)).isDirectory());
    
    for (const area of areas) {
      const tarefasFile = path.join(MELHORIAS_DIR, area, 'TAREFAS.md');
      if (fs.existsSync(tarefasFile)) {
        const content = fs.readFileSync(tarefasFile, 'utf-8');
        const taskLines = content.split('\n')
          .filter(line => line.includes('- [ ]') || line.includes('- [x]') || line.includes('- [~]'));
        
        for (const line of taskLines) {
          const status = line.includes('- [x]') ? 'completed' : 
                        line.includes('- [~]') ? 'in_progress' : 'pending';
          const description = line.replace(/- \[.\]\s*/, '').trim();
          
          tasks.push({
            id: crypto.randomUUID(),
            area,
            description,
            status,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }
  
  // Buscar tarefas na memória recente
  if (mmInitialized) {
    try {
      const recentTasks = await mm.searchMemories('task', 50, { type: 'context' });
      recentTasks.forEach(m => {
        tasks.push({
          id: m.id,
          area: m.metadata?.agent || 'unknown',
          description: m.content.slice(0, 200),
          status: 'memory',
          timestamp: m.created_at
        });
      });
    } catch (e) {
      // Ignorar erros de memória
    }
  }
  
  return {
    total: tasks.length,
    byStatus: {
      completed: tasks.filter(t => t.status === 'completed').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length
    },
    tasks: tasks.slice(0, 100) // Limite de 100 tarefas
  };
}

// Handler: GET /api/agents
async function getAgents() {
  const agents = [
    { name: 'architect', tasks: 0, status: 'idle' },
    { name: 'backend-dev', tasks: 0, status: 'idle' },
    { name: 'frontend-dev', tasks: 0, status: 'idle' },
    { name: 'security', tasks: 0, status: 'idle' },
    { name: 'devops', tasks: 0, status: 'idle' },
    { name: 'qa-tester', tasks: 0, status: 'idle' },
    { name: 'performance', tasks: 0, status: 'idle' },
    { name: 'tech-lead', tasks: 0, status: 'busy' },
    { name: 'digital-product-creator', tasks: 0, status: 'idle' },
    { name: 'monetization-strategist', tasks: 0, status: 'idle' },
    { name: 'product-launch-manager', tasks: 0, status: 'idle' }
  ];
  
  // Contar tarefas por agente na memória
  if (mmInitialized) {
    try {
      const stats = await mm.getStats();
      // Parsear stats para contar por agente
      // (implementação simplificada)
    } catch (e) {
      // Ignorar
    }
  }
  
  return { agents, total: agents.length, active: agents.filter(a => a.status === 'busy').length };
}

// Handler: GET /api/metrics
async function getMetrics() {
  const metrics = {
    orchestration: {
      totalTasks: 0,
      completedTasks: 0,
      delegationRate: 0,
      avgTaskDuration: 0
    },
    performance: {
      cacheHitRate: 0,
      avgResponseTime: 0,
      totalRequests: 0
    },
    vv: {
      totalValidations: 0,
      passedValidations: 0,
      skippedByCache: 0,
      level1Count: 0,
      level2Count: 0,
      level3Count: 0
    }
  };
  
  // Buscar métricas da memória
  if (mmInitialized) {
    try {
      const stats = await mm.getStats();
      metrics.orchestration.totalTasks = stats.total_memories || 0;
      
      // Calcular cache hit rate
      metrics.performance.cacheHitRate = stats.cached_responses ? 
        (stats.cached_responses / (stats.total_memories + stats.cached_responses)) * 100 : 0;
    } catch (e) {
      // Ignorar
    }
  }
  
  // Calcular métricas de V&V do LOG-VALIDACOES
  const logFile = path.join(MELHORIAS_DIR, 'LOG-VALIDACOES.md');
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf-8');
    const vvLines = content.split('\n').filter(l => l.includes('V&V Nível'));
    
    metrics.vv.totalValidations = vvLines.length;
    metrics.vv.level1Count = vvLines.filter(l => l.includes('Nível 1')).length;
    metrics.vv.level2Count = vvLines.filter(l => l.includes('Nível 2')).length;
    metrics.vv.level3Count = vvLines.filter(l => l.includes('Nível 3') || l.includes('Cache')).length;
    metrics.vv.passedValidations = vvLines.filter(l => l.includes('✅')).length;
  }
  
  return metrics;
}

// Handler: GET /api/handoffs
async function getHandoffs() {
  const handoffs = [];
  
  // Buscar handoffs na memória
  if (mmInitialized) {
    try {
      const handoffMemories = await mm.searchMemories('handoff', 50, { type: 'handoff' });
      handoffs.push(...handoffMemories.map(h => ({
        id: h.id,
        from: h.metadata?.agent || 'unknown',
        to: h.metadata?.handoffTo || 'unknown',
        description: h.content.slice(0, 200),
        timestamp: h.created_at
      })));
    } catch (e) {
      // Ignorar
    }
  }
  
  // Buscar handoffs no session log
  const sessionLogFile = path.join(ROOT_DIR, '.ai-factory', 'wiki', 'session', 'log.md');
  if (fs.existsSync(sessionLogFile)) {
    const content = fs.readFileSync(sessionLogFile, 'utf-8');
    const logEntries = content.split('\n## ').slice(1);
    
    for (const entry of logEntries.slice(0, 50)) {
      if (entry.includes('handoff')) {
        handoffs.push({
          id: crypto.randomUUID(),
          from: 'system',
          to: 'agent',
          description: entry.slice(0, 200),
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  return { handoffs: handoffs.slice(0, 50), total: handoffs.length };
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }
  
  try {
    // API Routes
    if (pathname === '/api/tasks' && method === 'GET') {
      const data = await getTasks();
      sendJSON(res, 200, data);
    }
    else if (pathname === '/api/agents' && method === 'GET') {
      const data = await getAgents();
      sendJSON(res, 200, data);
    }
    else if (pathname === '/api/metrics' && method === 'GET') {
      const data = await getMetrics();
      sendJSON(res, 200, data);
    }
    else if (pathname === '/api/handoffs' && method === 'GET') {
      const data = await getHandoffs();
      sendJSON(res, 200, data);
    }
    else if (pathname === '/api/health' && method === 'GET') {
      sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString(), mmInitialized });
    }
    else {
      sendJSON(res, 404, { error: 'Not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    sendJSON(res, 500, { error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Dashboard API running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   GET /api/tasks`);
  console.log(`   GET /api/agents`);
  console.log(`   GET /api/metrics`);
  console.log(`   GET /api/handoffs`);
  console.log(`   GET /api/health`);
});

module.exports = { server, mm };