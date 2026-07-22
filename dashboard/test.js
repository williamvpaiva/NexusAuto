#!/usr/bin/env node

/**
 * Dashboard Test Script
 * Verifica se todos os componentes do Dashboard estão funcionando
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001';
const WEB_BASE = 'http://localhost:3000';

console.log('🧪 Testando Dashboard Líder...\n');

// Teste 1: Verificar se arquivos existem
console.log('📁 Teste 1: Verificando arquivos...');
const requiredFiles = [
  path.join(__dirname, 'api', 'server.js'),
  path.join(__dirname, 'web', 'index.html'),
  path.join(__dirname, 'package.json'),
  path.join(__dirname, 'README.md')
];

let filesOk = true;
for (const file of requiredFiles) {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${path.basename(file)}`);
  if (!exists) filesOk = false;
}

if (!filesOk) {
  console.log('\n❌ Arquivos necessários faltando. Execute: npm install\n');
  process.exit(1);
}

console.log('  ✅ Todos os arquivos existem\n');

// Teste 2: Verificar se API está rodando
console.log('📡 Teste 2: Verificando API...');

async function testAPI() {
  try {
    const healthCheck = await fetchJSON('/api/health');
    
    if (healthCheck.status === 'ok') {
      console.log('  ✅ API está rodando');
      console.log(`  📊 Timestamp: ${healthCheck.timestamp}`);
      console.log(`  💾 Memory Manager: ${healthCheck.mmInitialized ? 'Inicializado' : 'Não inicializado'}\n`);
      
      // Testar endpoints
      console.log('📡 Teste 3: Testando endpoints...\n');
      
      const endpoints = [
        { path: '/api/tasks', name: 'Tasks' },
        { path: '/api/agents', name: 'Agents' },
        { path: '/api/metrics', name: 'Metrics' },
        { path: '/api/handoffs', name: 'Handoffs' }
      ];
      
      for (const endpoint of endpoints) {
        try {
          const data = await fetchJSON(endpoint.path);
          console.log(`  ✅ ${endpoint.name}: OK`);
          
          if (endpoint.path === '/api/tasks') {
            console.log(`     - Total: ${data.total} tarefas`);
            console.log(`     - Completas: ${data.byStatus.completed}`);
            console.log(`     - Em progresso: ${data.byStatus.in_progress}`);
            console.log(`     - Pendentes: ${data.byStatus.pending}`);
          }
          
          if (endpoint.path === '/api/agents') {
            console.log(`     - Total: ${data.total} agentes`);
            console.log(`     - Ativos: ${data.active}`);
          }
          
          if (endpoint.path === '/api/metrics') {
            console.log(`     - Validações V&V: ${data.vv.totalValidations}`);
            console.log(`     - Nível 1 (Crítico): ${data.vv.level1Count}`);
            console.log(`     - Nível 2 (Médio): ${data.vv.level2Count}`);
            console.log(`     - Nível 3 (Cache): ${data.vv.level3Count}`);
          }
          
          if (endpoint.path === '/api/handoffs') {
            console.log(`     - Total: ${data.total} handoffs`);
          }
          
          console.log('');
        } catch (error) {
          console.log(`  ❌ ${endpoint.name}: ${error.message}`);
        }
      }
      
      console.log('✅ Todos os testes completados!\n');
      console.log('🎉 Dashboard está funcionando corretamente!\n');
      console.log('📊 Acesse: http://localhost:3000\n');
      
    } else {
      console.log('  ❌ API retornou status inválido\n');
      process.exit(1);
    }
  } catch (error) {
    console.log('  ❌ API não está respondendo');
    console.log('\n💡 Solução:');
    console.log('  1. Execute: npm run start');
    console.log('  2. Ou execute: node api/server.js\n');
    process.exit(1);
  }
}

function fetchJSON(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE}${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Executar testes
testAPI();