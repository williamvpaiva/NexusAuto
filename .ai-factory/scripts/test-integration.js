#!/usr/bin/env node

/**
 * NexusAuto - Test Suite para OpenWiki + GNHF Integration
 * 
 * Executa testes end-to-end de todos os componentes
 */

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const TESTS = {
  openwiki: {
    name: 'OpenWiki',
    script: '.ai-factory/tools/openwiki/openwiki.js',
    tests: ['init', 'update', 'structure']
  },
  gnhf: {
    name: 'GNHF',
    script: '.ai-factory/tools/gnhf/gnhf.js',
    tests: ['run', 'vv-gate', 'handoff']
  },
  vv: {
    name: 'V&V Validation',
    script: '.ai-factory/scripts/run-vv.js',
    tests: ['all-steps']
  },
  memory: {
    name: 'Memory Integration',
    script: '.ai-factory/scripts/memory-integration.js',
    tests: ['sync', 'inject']
  },
  integration: {
    name: 'Full Integration',
    script: '.ai-factory/scripts/integrate.js',
    tests: ['full-flow']
  }
};

async function runTest(category, testName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${TESTS[category].name} - ${testName}`);
  console.log('='.repeat(60));

  const startTime = Date.now();
  let passed = false;
  let error = null;

  try {
    switch (category) {
      case 'openwiki':
        await testOpenWiki(testName);
        break;
      
      case 'gnhf':
        await testGNHF(testName);
        break;
      
      case 'vv':
        await testVV(testName);
        break;
      
      case 'memory':
        await testMemory(testName);
        break;
      
      case 'integration':
        await testIntegration(testName);
        break;
    }

    passed = true;
  } catch (e) {
    error = e.message;
  }

  const elapsed = Date.now() - startTime;
  
  console.log(`\n${passed ? '✅ PASS' : '❌ FAIL'} - ${elapsed}ms`);
  if (error) {
    console.log(`Erro: ${error}`);
  }

  return { passed, error, elapsed };
}

async function testOpenWiki(testName) {
  switch (testName) {
    case 'init':
      console.log('Testando inicialização...');
      execSync('node .ai-factory/tools/openwiki/openwiki.js --init', {
        stdio: 'pipe'
      });
      
      // Verificar estrutura criada
      const wikiDir = '.ai-factory/wiki';
      const requiredDirs = ['architecture', 'agents', 'workflows', 'api', 'memory', 'skills', 'handoffs'];
      
      for (const dir of requiredDirs) {
        const exists = await fs.stat(path.join(wikiDir, dir)).catch(() => null);
        if (!exists) {
          throw new Error(`Diretório ${dir} não criado`);
        }
      }
      
      console.log('✅ Estrutura criada corretamente');
      break;

    case 'update':
      console.log('Testando atualização...');
      execSync('node .ai-factory/tools/openwiki/openwiki.js --update', {
        stdio: 'pipe'
      });
      
      // Verificar INDEX.md
      const indexPath = '.ai-factory/wiki/INDEX.md';
      const indexExists = await fs.stat(indexPath).catch(() => null);
      if (!indexExists) {
        throw new Error('INDEX.md não gerado');
      }
      
      console.log('✅ Atualização completada');
      break;

    case 'structure':
      console.log('Verificando estrutura...');
      const readmePath = '.ai-factory/wiki/README.md';
      const readmeExists = await fs.stat(readmePath).catch(() => null);
      
      if (!readmeExists) {
        throw new Error('README.md não existe');
      }
      
      const content = await fs.readFile(readmePath, 'utf-8');
      if (!content.includes('NexusAuto Wiki')) {
        throw new Error('README.md não tem conteúdo esperado');
      }
      
      console.log('✅ Estrutura válida');
      break;
  }
}

async function testGNHF(testName) {
  switch (testName) {
    case 'run':
      console.log('Testando execução GNHF (1 iteração)...');
      
      // Testar com max-iterations 1
      execSync('node .ai-factory/tools/gnhf/gnhf.js "test" --max-iterations 1 --verbose', {
        stdio: 'pipe'
      });
      
      // Verificar run criado
      const runsDir = '.gnhf/runs';
      const runs = await fs.readdir(runsDir).catch(() => []);
      
      if (runs.length === 0) {
        throw new Error('Nenhuma run criada');
      }
      
      console.log(`✅ Run criado: ${runs[runs.length - 1]}`);
      break;

    case 'vv-gate':
      console.log('Testando gate V&V...');
      
      // Executar V&V
      const vvOutput = execSync('node .ai-factory/scripts/run-vv.js --json', {
        encoding: 'utf-8'
      });
      
      const result = JSON.parse(vvOutput);
      
      if (!result.passed) {
        throw new Error(`V&V falhou: ${result.issues?.join(', ')}`);
      }
      
      console.log(`✅ V&V aprovado (${result.step}/7 passos)`);
      break;

    case 'handoff':
      console.log('Testando handoffs...');
      
      const handoffsDir = '.ai-factory/handoffs';
      const handoffFiles = await fs.readdir(handoffsDir).catch(() => []);
      
      // Handoffs são criados durante execução do GNHF
      console.log(`📝 Handoffs existentes: ${handoffFiles.length}`);
      break;
  }
}

async function testVV(testName) {
  switch (testName) {
    case 'all-steps':
      console.log('Testando todos os passos V&V...');
      
      const output = execSync('node .ai-factory/scripts/run-vv.js', {
        encoding: 'utf-8'
      });
      
      // Verificar se todos os passos passaram
      const passed = output.includes('V&V APROVADO');
      
      if (!passed) {
        throw new Error('V&V não aprovou todos os passos');
      }
      
      console.log('✅ 7/7 passos V&V validados');
      break;
  }
}

async function testMemory(testName) {
  switch (testName) {
    case 'sync':
      console.log('Testando sincronização de memória...');
      
      execSync('node .ai-factory/scripts/memory-integration.js sync', {
        stdio: 'pipe'
      });
      
      // Verificar arquivos criados
      const summaryPath = '.ai-factory/wiki/memory/RECENT_SUMMARY.md';
      const summaryExists = await fs.stat(summaryPath).catch(() => null);
      
      if (!summaryExists) {
        throw new Error('RECENT_SUMMARY.md não criado');
      }
      
      console.log('✅ Memória sincronizada');
      break;

    case 'inject':
      console.log('Testando injeção de memória...');
      
      execSync('node .ai-factory/scripts/memory-integration.js inject', {
        stdio: 'pipe'
      });
      
      const updatesPath = '.ai-factory/wiki/memory/RECENT_UPDATES.md';
      const updatesExists = await fs.stat(updatesPath).catch(() => null);
      
      if (!updatesExists) {
        throw new Error('RECENT_UPDATES.md não criado');
      }
      
      console.log('✅ Memória injetada');
      break;
  }
}

async function testIntegration(testName) {
  switch (testName) {
    case 'full-flow':
      console.log('Testando fluxo completo de integração...');
      
      const startTime = Date.now();
      
      // 1. OpenWiki
      console.log('  [1/4] OpenWiki...');
      execSync('node .ai-factory/tools/openwiki/openwiki.js --update', {
        stdio: 'pipe'
      });
      
      // 2. Memory Sync
      console.log('  [2/4] Memory Sync...');
      execSync('node .ai-factory/scripts/memory-integration.js sync', {
        stdio: 'pipe'
      });
      
      // 3. V&V
      console.log('  [3/4] V&V...');
      execSync('node .ai-factory/scripts/run-vv.js', {
        stdio: 'pipe'
      });
      
      // 4. Verificar estrutura
      console.log('  [4/4] Verificando estrutura...');
      const checks = await Promise.all([
        fs.stat('.ai-factory/wiki/INDEX.md').catch(() => null),
        fs.stat('.ai-factory/wiki/memory/RECENT_SUMMARY.md').catch(() => null),
        fs.stat('.ai-factory/handoffs').catch(() => null)
      ]);
      
      const allExist = checks.every(c => c !== null);
      
      if (!allExist) {
        throw new Error('Estrutura incompleta após integração');
      }
      
      const elapsed = Date.now() - startTime;
      console.log(`✅ Integração completa em ${elapsed}ms`);
      break;
  }
}

async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   NexusAuto - Test Suite: OpenWiki + GNHF Integration   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    elapsed: 0
  };

  for (const [category, config] of Object.entries(TESTS)) {
    for (const testName of config.tests) {
      results.total++;
      const result = await runTest(category, testName);
      
      if (result.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
      
      results.elapsed += result.elapsed;
    }
  }

  // Resumo final
  console.log('\n' + '═'.repeat(60));
  console.log('RESUMO DOS TESTES');
  console.log('═'.repeat(60));
  console.log(`Total:    ${results.total}`);
  console.log(`✅ Pass:   ${results.passed}`);
  console.log(`❌ Fail:  ${results.failed}`);
  console.log(`⏱️  Tempo:  ${results.elapsed}ms`);
  console.log('═'.repeat(60));

  if (results.failed === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${results.failed} teste(s) falharam\n`);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  runAllTests();
} else {
  const [category, testName] = args;
  
  if (!TESTS[category]) {
    console.error(`Categoria desconhecida: ${category}`);
    console.log('Categorias válidas:', Object.keys(TESTS));
    process.exit(1);
  }
  
  runTest(category, testName).then(result => {
    process.exit(result.passed ? 0 : 1);
  });
}