#!/usr/bin/env node

/**
 * cleanup-test-users.js
 *
 * Remove do banco SQLite os usuários criados durante os testes E2E e de mutação.
 *
 * Uso:
 *   node scripts/cleanup-test-users.js              → dry-run (mostra o que seria removido)
 *   node scripts/cleanup-test-users.js --execute     → deleta os usuários de teste
 *   node scripts/cleanup-test-users.js --older-than 24h  → apenas usuários com mais de N horas
 *   node scripts/cleanup-test-users.js --help        → ajuda
 *
 * Padrões de email reconhecidos como usuários de teste:
 *   - e2e-test-*@nexusauto.app  (auth-e2e.test.ts)
 *   - mutation-*@test.com           (mutation-password.test.ts)
 *   - test-*@test.com               (outros testes)
 */

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DB_PATH = path.resolve(__dirname, '..', 'data', 'memory.db');

const TEST_PATTERNS = [
  { pattern: 'e2e-test-%',      label: 'E2E tests' },
  { pattern: 'mutation-%@test.com', label: 'Mutation tests' },
  { pattern: 'test-%@test.com', label: 'Generic test users' },
];

// Usuários que NUNCA devem ser removidos
const PROTECTED_EMAILS = [
  'admin@nexusauto.app',
];

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const isDryRun = !args.includes('--execute');
const showHelp = args.includes('--help');
const olderThanArg = args.find(a => a.startsWith('--older-than'));
let olderThanMs = 0;

if (showHelp) {
  console.log(`
  cleanup-test-users.js — Remove usuários de teste do banco SQLite

  Uso:
    node scripts/cleanup-test-users.js              → dry-run (padrão)
    node scripts/cleanup-test-users.js --execute     → executa a remoção
    node scripts/cleanup-test-users.js --older-than 24h  → apenas > N horas
    node scripts/cleanup-test-users.js --help        → esta ajuda

  Padrões reconhecidos:
    ${TEST_PATTERNS.map(p => `${p.pattern} (${p.label})`).join('\n    ')}

  Protegidos:
    ${PROTECTED_EMAILS.join(', ')}
  `);
  process.exit(0);
}

if (olderThanArg) {
  const value = olderThanArg.split('=')[1] || '24h';
  const match = value.match(/^(\d+)([hmd])$/);
  if (!match) {
    console.error('Formato inválido para --older-than. Use: 24h, 30m, 7d');
    process.exit(1);
  }
  const num = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { h: 3600000, m: 60000, d: 86400000 };
  olderThanMs = num * (multipliers[unit] || 3600000);
}

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------

function openDb() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Banco não encontrado: ${DB_PATH}`);
    console.error('Execute os testes primeiro para criar o banco.');
    process.exit(1);
  }
  return new sqlite3.Database(DB_PATH);
}

function query(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const db = openDb();

  try {
    // Verifica se a tabela existe
    const tables = await query(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (tables.length === 0) {
      console.log('ℹ️  Tabela "users" não existe no banco. Nada a limpar.');
      return;
    }

    // Constrói a query com todos os padrões
    const whereClauses = TEST_PATTERNS.map(p => `email LIKE ?`).join(' OR ');
    const whereParams = TEST_PATTERNS.map(p => p.pattern);

    // Filtro opcional por idade
    const ageClause = olderThanMs > 0 ? ` AND created_at < datetime('now', ?)` : '';
    const ageParams = olderThanMs > 0 ? [`-${olderThanMs / 1000} seconds`] : [];

    // Busca usuários de teste
    const testUsers = await query(
      db,
      `SELECT id, name, email, role, created_at FROM users WHERE (${whereClauses})${ageClause} ORDER BY created_at DESC`,
      [...whereParams, ...ageParams],
    );

    if (testUsers.length === 0) {
      console.log('✅ Nenhum usuário de teste encontrado.');
      return;
    }

    // Total de usuários no banco
    const totalResult = await query(db, 'SELECT COUNT(*) as count FROM users');
    const totalUsers = totalResult[0].count;

    // Exibe os usuários encontrados
    console.log(`\n📋 Usuários de teste encontrados: ${testUsers.length} (de ${totalUsers} total)\n`);
    console.log('─'.repeat(80));
    console.log('  Email'.padEnd(45) + 'Nome'.padEnd(22) + 'Criado em');
    console.log('─'.repeat(80));

    for (const user of testUsers) {
      // SQLite pode retornar "YYYY-MM-DD HH:MM:SS" (CURRENT_TIMESTAMP) ou
      // "YYYY-MM-DDTHH:MM:SS.mmmZ" (new Date().toISOString()). Normaliza ambos.
      const raw = user.created_at.replace(' ', 'T');
      const iso = raw.endsWith('Z') ? raw : raw + 'Z';
      const createdDate = new Date(iso).toLocaleString('pt-BR');
      const email = user.email.padEnd(45);
      const name = (user.name || '').substring(0, 20).padEnd(22);
      console.log(`  ${email}${name}${createdDate}`);
    }

    console.log('─'.repeat(80));

    if (isDryRun) {
      console.log(`\n🔍 Modo DRY-RUN — Nada foi removido.`);
      console.log(`   Para deletar, execute com --execute:`);
      console.log(`   node scripts/cleanup-test-users.js --execute\n`);
      return;
    }

    // Remove um por um (com proteção)
    let deleted = 0;
    let skipped = 0;

    for (const user of testUsers) {
      if (PROTECTED_EMAILS.includes(user.email.toLowerCase())) {
        console.log(`⏭️  Pulando (protegido): ${user.email}`);
        skipped++;
        continue;
      }
      await run(db, 'DELETE FROM users WHERE id = ?', [user.id]);
      console.log(`🗑️  Removido: ${user.email}`);
      deleted++;
    }

    const remaining = totalUsers - deleted;
    console.log(`\n✅ Limpeza concluída:`);
    console.log(`   Removidos: ${deleted}`);
    console.log(`   Pulados (protegidos): ${skipped}`);
    console.log(`   Restantes no banco: ${remaining}\n`);

  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
