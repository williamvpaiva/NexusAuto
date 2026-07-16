/**
 * global-teardown.ts
 *
 * Vitest Global Teardown — executado automaticamente após TODOS os testes.
 * Remove usuários de teste criados pelos testes E2E e de mutação.
 *
 * Referência: https://vitest.dev/config/#globalteardown
 *
 * NOTA: Não use __dirname aqui. Vitest carrega globalTeardown via vite-node,
 * que pode tratar o módulo como ESM, onde __dirname não está disponível.
 * Use process.cwd() — que aponta para o diretório do vitest.config.ts.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export function teardown() {
  const projectRoot = process.cwd();
  const scriptPath = path.resolve(projectRoot, 'scripts', 'cleanup-test-users.js');
  const dbPath = path.resolve(projectRoot, 'data', 'memory.db');

  // Se o banco não existe, não há o que limpar
  if (!fs.existsSync(dbPath)) {
    return;
  }

  console.log('\n━━━ 🧹 Global Teardown: limpando usuários de teste ━━━');

  try {
    const output = execSync(`node "${scriptPath}" --execute`, {
      encoding: 'utf-8',
      timeout: 15000,
      cwd: projectRoot,
    });

    // Só exibe o output se houver mudanças relevantes
    const lines = output.split('\n').filter(l => l.includes('Removido') || l.includes('Nenhum'));
    for (const line of lines) {
      console.log(`  ${line.trim()}`);
    }
  } catch (err: any) {
    // Falha no teardown não deve mascarar resultados de teste
    if (err.stderr) {
      console.error(`  ⚠️  Erro no cleanup: ${err.stderr.trim()}`);
    } else {
      console.error(`  ⚠️  Erro no cleanup: ${err.message}`);
    }
  } finally {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}
