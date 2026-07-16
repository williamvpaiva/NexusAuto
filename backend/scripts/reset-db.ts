#!/usr/bin/env tsx

/**
 * reset-db.ts
 *
 * Remove o banco SQLite e recria tudo do zero (tabelas + seed data).
 * Útil para desenvolvimento quando o banco está em estado inconsistente.
 *
 * Uso:
 *   npx tsx scripts/reset-db.ts           → pede confirmação antes de resetar
 *   npx tsx scripts/reset-db.ts --force   → executa sem confirmação
 *   npx tsx scripts/reset-db.ts --dry-run → mostra o que seria feito sem executar
 *   npx tsx scripts/reset-db.ts --help    → ajuda
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DB_DIR = path.resolve(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'memory.db');
const WAL_PATH = DB_PATH + '-wal';
const SHM_PATH = DB_PATH + '-shm';

const args = process.argv.slice(2);
const isForce = args.includes('--force');
const isDryRun = args.includes('--dry-run');
const showHelp = args.includes('--help');

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

if (showHelp) {
  console.log(`
  reset-db.ts — Recria o banco de dados do zero

  Uso:
    npx tsx scripts/reset-db.ts               → pede confirmação
    npx tsx scripts/reset-db.ts --force        → executa sem confirmação
    npx tsx scripts/reset-db.ts --dry-run      → mostra o que seria feito
    npx tsx scripts/reset-db.ts --help         → esta ajuda

  O que faz:
    1. Fecha conexão ativa com o banco (se houver)
    2. Remove data/memory.db (e WAL/SHM se existirem)
    3. Recria todas as tabelas com schema atual
    4. Insere seed data:
       - Admin: admin@polymarketing.com / admin123
       - Template de email de reset de senha
  `);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Prompt de confirmação
// ---------------------------------------------------------------------------

async function confirm(): Promise<boolean> {
  if (isForce) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `\n⚠️  ATENÇÃO: Isso vai APAGAR todo o banco de dados e recriar do zero!\n\n   Localização: ${DB_PATH}\n\n   Tem certeza? (s/N): `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim');
      },
    );
  });
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function printStatus(label: string, emoji: string, detail?: string) {
  const msg = detail ? `  ${emoji} ${label}: ${detail}` : `  ${emoji} ${label}`;
  console.log(msg);
}

function printSection(title: string) {
  console.log(`\n━━━ ${title} ━━━`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🔄 Reset do banco de dados');
  console.log(`   Banco: ${DB_PATH}`);
  console.log(`   Modo:  ${isDryRun ? 'DRY-RUN (simulação)' : isForce ? 'FORCE (sem confirmação)' : 'INTERATIVO'}`);

  // ── 1. Confirmação ──────────────────────────────────────────────────

  if (!(await confirm())) {
    console.log('\n  ❌ Operação cancelada.\n');
    process.exit(0);
  }

  // ── 2. Descobrir o que será afetado ────────────────────────────────

  const filesToDelete: { path: string; exists: boolean }[] = [
    { path: DB_PATH, exists: fs.existsSync(DB_PATH) },
    { path: WAL_PATH, exists: fs.existsSync(WAL_PATH) },
    { path: SHM_PATH, exists: fs.existsSync(SHM_PATH) },
  ];

  const existingFiles = filesToDelete.filter(f => f.exists);

  printSection('Removendo arquivos');

  for (const file of filesToDelete) {
    if (isDryRun) {
      printStatus(file.path, file.exists ? '🔍' : '⏭️', file.exists ? 'seria removido' : 'não existe');
    } else if (file.exists) {
      try {
        fs.unlinkSync(file.path);
        printStatus(path.basename(file.path), '🗑️', 'removido');
      } catch (err: any) {
        printStatus(path.basename(file.path), '⚠️', `erro ao remover: ${err.message}`);
        if (file.path === DB_PATH && err.code === 'EBUSY') {
          console.log('   ⚠️  O banco está em uso por outro processo (ex: servidor ou test watcher).');
          console.log('      O script vai recriar as tabelas em cima do arquivo existente.');
          console.log('      Dados antigos podem persistir. Feche outros processos e tente novamente.');
        }
      }
    } else {
      printStatus(path.basename(file.path), '⏭️', 'não existe');
    }
  }

  // Se for dry-run, para por aqui
  if (isDryRun) {
    console.log('\n📋 Resumo (dry-run):');
    console.log(`   Arquivos a remover: ${existingFiles.length}`);
    console.log(`   Após remoção, o banco será recriado com todas as tabelas e seed data.`);
    console.log('\n🔍 Modo DRY-RUN — Nenhuma alteração foi feita.\n');
    return;
  }

  // ── 3. Garantir diretório ─────────────────────────────────────────

  printSection('Preparando diretório');

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    printStatus('data/', '📁', 'diretório criado');
  } else {
    printStatus('data/', '📁', 'diretório já existe');
  }

  // ── 4. Recriar banco ─────────────────────────────────────────────

  printSection('Recriando banco de dados');

  try {
    // Importa e inicializa o banco (em processo fresco, módulo não está em cache)
    const { db } = await import('../src/config/database');
    await db.initialize();

    // ── 5. Verificar resultado ──────────────────────────────────────

    printSection('Verificando resultado');

    // Lista todas as tabelas
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
    );

    console.log(`   Tabelas criadas: ${tables.length}`);
    for (const t of tables) {
      const count = await db.get<{ c: number }>(`SELECT COUNT(*) as c FROM "${t.name}"`);
      console.log(`     ✓ ${t.name.padEnd(25)} ${count?.c ?? 0} registro(s)`);
    }

    // Verifica se o admin foi criado
    const admin = await db.get<{ email: string; role: string }>(
      `SELECT email, role FROM users WHERE email = ?`,
      ['admin@polymarketing.com'],
    );

    if (admin) {
      printStatus('Admin', '✅', `${admin.email} (${admin.role})`);
    } else {
      printStatus('Admin', '⚠️', 'não encontrado — seed pode ter falhado');
    }

    // Verifica template de email
    const template = await db.get<{ name: string }>(
      `SELECT name FROM email_templates WHERE name = ?`,
      ['reset-password'],
    );

    if (template) {
      printStatus('Template email', '✅', template.name);
    } else {
      printStatus('Template email', '⚠️', 'não encontrado');
    }

    // ── 5. Resumo final ─────────────────────────────────────────────

    const dbStat = fs.statSync(DB_PATH);
    const sizeKb = (dbStat.size / 1024).toFixed(1);

    console.log(`\n   📦 Tamanho do banco: ${sizeKb} KB`);
    console.log(`\n✅ Banco recriado com sucesso!\n`);

  } catch (err: any) {
    console.error(`\n❌ Erro ao recriar banco: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
