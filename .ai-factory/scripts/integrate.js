#!/usr/bin/env node

/**
 * NexusAuto - OpenWiki + GNHF Integration Script
 * 
 * Orquestra a execução conjunta do OpenWiki e GNHF
 * com integração completa de memória e handoffs
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const OPENWIKI_SCRIPT = path.join(__dirname, 'tools', 'openwiki', 'openwiki.js');
const GNHF_SCRIPT = path.join(__dirname, 'tools', 'gnhf', 'gnhf.js');
const MEMORY_INTEGRATION = path.join(__dirname, 'memory-integration.js');
const VV_SCRIPT = path.join(__dirname, 'run-vv.js');

async function runIntegration(mode = 'full') {
  console.log('🚀 NexusAuto Integration - OpenWiki + GNHF\n');

  const startTime = Date.now();

  try {
    // Modo 1: Apenas OpenWiki
    if (mode === 'wiki' || mode === 'full') {
      console.log('📚 Executando OpenWiki...\n');
      execSync(`node ${OPENWIKI_SCRIPT} --update --verbose`, {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      console.log('✅ OpenWiki completado\n');
    }

    // Modo 2: Apenas GNHF
    if (mode === 'gnhf' || mode === 'full') {
      console.log('🌙 Executando GNHF...\n');
      execSync(`node ${GNHF_SCRIPT} "Improve documentation and code quality" --max-iterations 3 --verbose`, {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      console.log('✅ GNHF completado\n');
    }

    // Modo 3: Sincronizar memória
    if (mode === 'sync' || mode === 'full') {
      console.log('🔄 Sincronizando memória...\n');
      execSync(`node ${MEMORY_INTEGRATION} sync`, {
        stdio: 'inherit'
      });
      console.log('✅ Memória sincronizada\n');
    }

    // Modo 4: Validar V&V
    if (mode === 'vv' || mode === 'full') {
      console.log('🔍 Executando V&V...\n');
      try {
        execSync(`node ${VV_SCRIPT}`, {
          stdio: 'inherit'
        });
        console.log('✅ V&V aprovado\n');
      } catch (error) {
        console.log('⚠️  V&V falhou - verifique issues\n');
      }
    }

    // Modo 5: Relatório de economia
    if (mode === 'economy' || mode === 'full') {
      console.log('📊 Gerando relatório de economia de tokens...\n');
      try {
        execSync(`node ${path.join(__dirname, 'token-economy-report.js')}`, {
          stdio: 'inherit'
        });
        console.log('✅ Relatório de economia gerado\n');
      } catch (error) {
        console.log('⚠️  Relatório de economia falhou - verifique issues\n');
      }
    }

    const elapsed = Date.now() - startTime;
    const elapsedMinutes = Math.floor(elapsed / 60000);
    const elapsedSeconds = Math.floor((elapsed % 60000) / 1000);

    console.log('='.repeat(60));
    console.log('✅ INTEGRAÇÃO COMPLETA');
    console.log('='.repeat(60));
    console.log(`Tempo total: ${elapsedMinutes}m ${elapsedSeconds}s`);
    console.log('');
    console.log('Próximos passos:');
    console.log('1. Revisar docs em .ai-factory/wiki/');
    console.log('2. Revisar handoffs em .ai-factory/handoffs/');
    console.log('3. Verificar runs do GNHF em .gnhf/runs/');
    console.log('4. Commitar mudanças (se aplicável)');
    console.log('');

  } catch (error) {
    console.error('❌ Erro na integração:', error.message);
    process.exit(1);
  }
}

// CLI
const mode = process.argv[2] || 'full';

console.log(`
NexusAuto Integration - OpenWiki + GNHF

Modos:
  full   - Executa tudo (OpenWiki + GNHF + Sync + V&V)
  wiki   - Apenas OpenWiki
  gnhf   - Apenas GNHF
  sync   - Apenas sincronização de memória
  vv     - Apenas validação V&V
  economy - Apenas relatório de economia

Uso:
  node integrate.js [mode]

Exemplos:
  node integrate.js full
  node integrate.js wiki
  node integrate.js gnhf
  node integrate.js sync
`);

runIntegration(mode).catch(console.error);