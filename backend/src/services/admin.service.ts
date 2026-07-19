import { db } from '../config/database';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TEST_PATTERNS = [
  { pattern: 'e2e-test-%', label: 'E2E tests' },
  { pattern: 'e2e-stats-%', label: 'E2E stats tests' },
  { pattern: 'mutation-%@test.com', label: 'Mutation tests' },
  { pattern: 'test-%@test.com', label: 'Generic test users' },
];

const PROTECTED_EMAILS = ['admin@nexusauto.app'];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminStats {
  /** Métricas do banco de dados */
  database: {
    totalTables: number;
    sizeKB: number;
  };
  /** Métricas de usuários */
  users: {
    total: number;
    admins: number;
    testUsers: number;
  };
  /** Métricas de templates de email */
  emailTemplates: {
    total: number;
  };
  /** Métricas de veículos */
  vehicles: {
    total: number;
  };
  /** Métricas de conversas */
  conversations: {
    total: number;
  };
  /** Métricas de mensagens */
  messages: {
    total: number;
  };
  /** Métricas de logs de erro */
  errorLogs: {
    total: number;
    open: number;
    investigating: number;
    resolved: number;
    closed: number;
  };
  /** Métricas de otimizações de token */
  tokenOptimizations: {
    total: number;
    totalTokensSaved: number;
    totalOriginalTokens: number;
  };
}

export interface CleanupResult {
  /** Quantidade de usuários deletados */
  deleted: number;
  /** Quantidade de usuários pulados (protegidos) */
  skipped: number;
  /** Total de usuários no banco antes da limpeza */
  totalBefore: number;
  /** Total de usuários no banco após a limpeza */
  totalAfter: number;
  /** Total de usuários de teste encontrados (sem limite) */
  total: number;
  /** Limite aplicado à lista de usuários retornada */
  limit: number;
  /** Lista dos usuários de teste encontrados (limitada a `limit` itens) */
  users: Array<{
    email: string;
    name: string;
    created_at: string;
  }>;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Remove do banco (ou apenas lista) os usuários criados durante os testes
 * E2E e de mutação.
 *
 * Usa a mesma lógica do script `scripts/cleanup-test-users.js`,
 * mas executa via a conexão `db` já existente na aplicação.
 *
 * @param dryRun  Se `true`, apenas lista os usuários sem deletar.
 *                Padrão: `false` (deleta).
 * @param limit   Máximo de usuários retornados na lista. Útil para
 *                controlar o tamanho do payload. Padrão: `100`.
 *
 * Usuários protegidos (ex: admin@nexusauto.app) nunca são removidos.
 */
export async function cleanupTestUsers(dryRun = false, limit = 100): Promise<CleanupResult> {
  // ── 1. Verificar se a tabela existe ────────────────────────────────

  const tables = await db.all<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`,
  );

  if (tables.length === 0) {
    return { deleted: 0, skipped: 0, totalBefore: 0, totalAfter: 0, total: 0, limit, users: [] };
  }

  // ── 2. Buscar usuários de teste ────────────────────────────────────

  const whereClauses = TEST_PATTERNS.map(p => `email LIKE ?`).join(' OR ');
  const whereParams = TEST_PATTERNS.map(p => p.pattern);

  // Primeiro conta o total (para metadados de paginação, independente do limit)
  const totalTestUsers = (await db.get<{ total: number }>(
    `SELECT COUNT(*) as total FROM users WHERE (${whereClauses})`,
    whereParams,
  ))?.total ?? 0;

  const testUsers = await db.all<{ id: string; name: string; email: string; created_at: string }>(
    `SELECT id, name, email, created_at FROM users WHERE (${whereClauses}) ORDER BY created_at DESC`,
    whereParams,
  );

  const totalBefore = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM users'))?.total ?? 0;

  const usersInfo = testUsers.map(u => ({
    email: u.email,
    name: u.name,
    created_at: u.created_at,
  }));

  if (testUsers.length === 0) {
    return { deleted: 0, skipped: 0, totalBefore, totalAfter: totalBefore, total: 0, limit, users: [] };
  }

  // ── 3. Remover um por um (com proteção) ────────────────────────────

  let deleted = 0;
  let skipped = 0;

  for (const user of testUsers) {
    if (PROTECTED_EMAILS.includes(user.email.toLowerCase())) {
      skipped++;
      continue;
    }
    if (!dryRun) {
      await db.run('DELETE FROM users WHERE id = ?', [user.id]);
      deleted++;
    }
  }

  const totalAfter = dryRun
    ? totalBefore
    : (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM users'))?.total ?? 0;

  // ── 4. Registrar no log (apenas execuções com dryRun=false) ────

  if (!dryRun) {
    const logId = `cleanup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await db.run(
      `INSERT INTO cleanup_log (id, executed_by, dry_run, deleted_count, skipped_count, total_before, total_after, users_found)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [logId, 'admin', 0, deleted, skipped, totalBefore, totalAfter, totalTestUsers],
    );
  }

  return { deleted, skipped, totalBefore, totalAfter, total: totalTestUsers, limit, users: usersInfo.slice(0, limit) };
}

// ---------------------------------------------------------------------------
// Cleanup History
// ---------------------------------------------------------------------------

export interface CleanupLogEntry {
  id: string;
  executed_by: string;
  dry_run: number;
  deleted_count: number;
  skipped_count: number;
  total_before: number;
  total_after: number;
  users_found: number;
  created_at: string;
}

/**
 * Retorna o histórico de operações de cleanup, ordenado do mais recente
 * para o mais antigo.
 *
 * @param limit  Máximo de registros (padrão: 50).
 */
export async function getCleanupHistory(limit = 50): Promise<CleanupLogEntry[]> {
  const tables = await db.all<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='cleanup_log'`,
  );

  if (tables.length === 0) {
    return [];
  }

  return db.all<CleanupLogEntry>(
    'SELECT * FROM cleanup_log ORDER BY created_at DESC LIMIT ?',
    [limit],
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Coleta métricas do sistema para o painel admin.
 *
 * Consulta todas as tabelas do banco e retorna contagens
 * agregadas de usuários, templates, veículos, conversas,
 * mensagens, erros e otimizações de token.
 */
export async function adminStats(): Promise<AdminStats> {
  // ── Database ────────────────────────────────────────────────────────

  const tables = await db.all<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
  );

  const totalTables = tables.length;

  // Se não há tabelas, retorna métricas zeradas (banco corrompido/deletado)
  if (totalTables === 0) {
    return {
      database: { totalTables: 0, sizeKB: 0 },
      users: { total: 0, admins: 0, testUsers: 0 },
      emailTemplates: { total: 0 },
      vehicles: { total: 0 },
      conversations: { total: 0 },
      messages: { total: 0 },
      errorLogs: { total: 0, open: 0, investigating: 0, resolved: 0, closed: 0 },
      tokenOptimizations: { total: 0, totalTokensSaved: 0, totalOriginalTokens: 0 },
    };
  }

  // Tamanho do arquivo via VFS (SQLite não expõe diretamente; usamos stat)
  const fs = await import('fs');
  const path = await import('path');
  const dbPath = path.resolve('data', 'memory.db');
  let sizeKB = 0;
  try {
    const stat = fs.statSync(dbPath);
    sizeKB = Math.round(stat.size / 1024);
  } catch {
    // Arquivo pode não existir ainda (banco em memória?)
  }

  // ── Usuários ────────────────────────────────────────────────────────

  const totalUsers = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM users'))?.total ?? 0;

  const totalAdmins = (await db.get<{ total: number }>("SELECT COUNT(*) as total FROM users WHERE role = 'admin'"))?.total ?? 0;

  const whereClauses = TEST_PATTERNS.map(p => `email LIKE ?`).join(' OR ');
  const whereParams = TEST_PATTERNS.map(p => p.pattern);
  const totalTestUsers = (await db.get<{ total: number }>(`SELECT COUNT(*) as total FROM users WHERE (${whereClauses})`, whereParams))?.total ?? 0;

  // ── Email Templates ─────────────────────────────────────────────────

  const totalTemplates = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM email_templates'))?.total ?? 0;

  // ── Veículos ────────────────────────────────────────────────────────

  const totalVehicles = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM vehicles'))?.total ?? 0;

  // ── Conversas e Mensagens ───────────────────────────────────────────

  const totalConversations = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM conversations'))?.total ?? 0;
  const totalMessages = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM messages'))?.total ?? 0;

  // ── Error Logs ──────────────────────────────────────────────────────

  const totalErrors = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM error_logs'))?.total ?? 0;

  const errorsByStatus = await db.all<{ status: string; total: number }>(
    'SELECT status, COUNT(*) as total FROM error_logs GROUP BY status',
  );

  const errorStatusMap: Record<string, number> = {
    open: 0,
    investigating: 0,
    resolved: 0,
    closed: 0,
  };
  for (const row of errorsByStatus) {
    errorStatusMap[row.status] = row.total;
  }

  // ── Token Optimizations ─────────────────────────────────────────────

  const totalOptimizations = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM token_optimizations'))?.total ?? 0;

  const tokenSummary = await db.get<{ totalOriginal: number; totalOptimized: number }>(
    'SELECT COALESCE(SUM(original_token_count), 0) as totalOriginal, COALESCE(SUM(optimized_token_count), 0) as totalOptimized FROM token_optimizations',
  );

  const totalOriginalTokens = tokenSummary?.totalOriginal ?? 0;
  const totalOptimizedTokens = tokenSummary?.totalOptimized ?? 0;
  const totalTokensSaved = totalOriginalTokens - totalOptimizedTokens;

  return {
    database: { totalTables, sizeKB },
    users: { total: totalUsers, admins: totalAdmins, testUsers: totalTestUsers },
    emailTemplates: { total: totalTemplates },
    vehicles: { total: totalVehicles },
    conversations: { total: totalConversations },
    messages: { total: totalMessages },
    errorLogs: {
      total: totalErrors,
      open: errorStatusMap.open,
      investigating: errorStatusMap.investigating,
      resolved: errorStatusMap.resolved,
      closed: errorStatusMap.closed,
    },
    tokenOptimizations: {
      total: totalOptimizations,
      totalTokensSaved,
      totalOriginalTokens,
    },
  };
}
