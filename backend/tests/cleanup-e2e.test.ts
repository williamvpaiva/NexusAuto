import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

// ---------------------------------------------------------------------------
// Mocks (apenas middlewares externos — DB e token NÃO são mockados)
// ---------------------------------------------------------------------------

vi.mock('../src/middleware/security', async () => {
  const actual = await vi.importActual<object>('../src/middleware/security');
  return { ...actual, authLimiter: (_req: unknown, _res: unknown, next: () => void) => next() };
});

vi.mock('../src/middleware/brute-force', () => ({
  bruteForce: {
    recordFailedAttempt: vi.fn().mockResolvedValue(undefined),
    isBlocked: vi.fn().mockResolvedValue(false),
    resetAttempts: vi.fn().mockResolvedValue(undefined),
  },
  bruteForceProtection: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let adminToken: string;

async function getAdminToken(): Promise<string> {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@nexusauto.app', password: 'admin123' });

  if (res.status !== 200) {
    throw new Error(`Falha ao fazer login como admin: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.data.accessToken;
}

/** Timestamp único — cada teste usa um offset diferente para evitar colisão */
const runId = Date.now();

/**
 * Cria count usuários de teste com offset inicial.
 * Ex: offset=0 → e2e-test-{runId}-0, -1, -2...
 *     offset=10 → e2e-test-{runId}-10, -11, -12...
 */
async function createTestUsers(count: number, offset = 0): Promise<string[]> {
  const emails: string[] = [];
  for (let i = 0; i < count; i++) {
    const email = `e2e-test-${runId}-${offset + i}@nexusauto.app`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: `E2E Cleanup User ${offset + i}`, email, password: 'Test@123456' });

    if (res.status === 201) {
      emails.push(email);
    }
  }
  return emails;
}

/** Remove todos os usuários de teste deste runId do banco */
async function removeAllTestUsers(): Promise<void> {
  const { db } = await import('../src/config/database');
  const tables = await db.all<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`,
  );
  if (tables.length === 0) return;

  // Remove todos os padrões de teste
  await db.run(`DELETE FROM users WHERE email LIKE ?`, [`e2e-test-${runId}-%`]);
  await db.run(`DELETE FROM users WHERE email LIKE ?`, [`e2e-test-%`]);
  await db.run(`DELETE FROM users WHERE email LIKE ?`, [`test-%@test.com`]);
  await db.run(`DELETE FROM users WHERE email LIKE ?`, [`mutation-%@test.com`]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/v1/admin/cleanup-test-users — E2E Integration (no mocks)', () => {
  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  afterAll(async () => {
    await removeAllTestUsers();
  });

  // ── Teste 1: 401 sem token ──────────────────────────────────────────

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/v1/admin/cleanup-test-users');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // ── Teste 2: 403 para role user ─────────────────────────────────────

  it('deve retornar 403 para usuário comum', async () => {
    const userEmail = `e2e-cleanup-user-${runId}@test.com`;
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Cleanup E2E User', email: userEmail, password: 'Test@123456' });
    expect(registerRes.status).toBe(201);

    const userToken = registerRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');

    // Remove o user comum
    const { db } = await import('../src/config/database');
    await db.run('DELETE FROM users WHERE email = ?', [userEmail]);
  });

  // ── Teste 3: Dry-run lista sem deletar ──────────────────────────────

  it('deve listar usuários de teste sem deletar (dry_run=true)', async () => {
    const created = await createTestUsers(2, 0); // índices 0, 1
    expect(created).toHaveLength(2);

    const beforeRes = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    const totalBefore = beforeRes.body.data.users.total;

    const dryRunRes = await request(app)
      .get('/api/v1/admin/cleanup-test-users?dry_run=true')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(dryRunRes.status).toBe(200);
    expect(dryRunRes.body.success).toBe(true);
    expect(dryRunRes.body.message).toContain('(dry-run)');
    expect(dryRunRes.body.data.deleted).toBe(0);
    expect(dryRunRes.body.data.total).toBeGreaterThanOrEqual(2);
    expect(dryRunRes.body.data.totalBefore).toBe(totalBefore);
    expect(dryRunRes.body.data.totalAfter).toBe(totalBefore);

    // Os emails criados devem estar na lista
    for (const email of created) {
      const found = dryRunRes.body.data.users.some(
        (u: { email: string }) => u.email === email,
      );
      expect(found).toBe(true);
    }

    // Usuários ainda existem (dry-run não deleta)
    const statsAfter = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(statsAfter.body.data.users.total).toBe(totalBefore);

    // Limpa para não interferir nos próximos testes
    await removeAllTestUsers();
  });

  // ── Teste 4: Execução real deleta e registra log ────────────────────

  it('deve deletar usuários de teste e registrar no histórico', async () => {
    // Usa offset=10 para evitar conflito de emails com limpeza anterior
    const created = await createTestUsers(3, 10);
    expect(created).toHaveLength(3);

    const beforeRes = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    const totalBefore = beforeRes.body.data.users.total;

    const cleanupRes = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(cleanupRes.status).toBe(200);
    expect(cleanupRes.body.success).toBe(true);
    expect(cleanupRes.body.message).not.toContain('(dry-run)');
    expect(cleanupRes.body.data.deleted).toBeGreaterThanOrEqual(3);
    expect(cleanupRes.body.data.totalBefore).toBe(totalBefore);
    expect(cleanupRes.body.data.totalAfter).toBe(totalBefore - cleanupRes.body.data.deleted);
    expect(cleanupRes.body.data.total).toBeGreaterThanOrEqual(3);

    // Usuários foram removidos
    const statsAfter = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(statsAfter.body.data.users.total).toBe(totalBefore - cleanupRes.body.data.deleted);

    // ── Verifica cleanup_history ──────────────────────────────────────

    const historyRes = await request(app)
      .get('/api/v1/admin/cleanup-history?limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.success).toBe(true);
    expect(historyRes.body.data.length).toBeGreaterThanOrEqual(1);

    const latestEntry = historyRes.body.data[0];
    expect(latestEntry.executed_by).toBe('admin');
    expect(latestEntry.dry_run).toBe(0);
    expect(latestEntry.deleted_count).toBeGreaterThanOrEqual(3);
    expect(latestEntry.total_before).toBe(totalBefore);
    expect(latestEntry.total_after).toBe(totalBefore - cleanupRes.body.data.deleted);
    expect(latestEntry.users_found).toBeGreaterThanOrEqual(3);
    expect(latestEntry.created_at).toBeTruthy();
  });

  // ── Teste 5: Estrutura da resposta ──────────────────────────────────

  it('deve retornar estrutura correta da resposta de cleanup', async () => {
    // Limpa todos os padrões de teste para estado previsível
    await removeAllTestUsers();

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('message');
    expect(res.body.data).toHaveProperty('deleted');
    expect(res.body.data).toHaveProperty('skipped');
    expect(res.body.data).toHaveProperty('totalBefore');
    expect(res.body.data).toHaveProperty('totalAfter');
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('limit');
    expect(res.body.data).toHaveProperty('users');
    expect(Array.isArray(res.body.data.users)).toBe(true);
    expect(typeof res.body.data.deleted).toBe('number');
    expect(typeof res.body.data.totalBefore).toBe('number');
  });
});
