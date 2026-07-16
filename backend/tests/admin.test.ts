import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('../src/config/database', () => ({
  db: {
    run: vi.fn().mockResolvedValue(undefined),
    get: vi.fn(),
    all: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../src/services/token.service', () => ({
  tokenService: {
    verifyAccessToken: vi.fn(),
  },
}));

vi.mock('../src/middleware/security', async () => {
  const actual = await vi.importActual<object>('../src/middleware/security');
  return { ...actual, authLimiter: (_req: unknown, _res: unknown, next: () => void) => next() };
});

import { app } from '../src/app';
import { tokenService } from '../src/services/token.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockUserPayload = {
  userId: 'user-1',
  email: 'user@test.com',
  role: 'user' as const,
  jti: 'mock-jti-user',
  type: 'access' as const,
};

const mockAdminPayload = {
  userId: 'admin-1',
  email: 'admin@test.com',
  role: 'admin' as const,
  jti: 'mock-jti-admin',
  type: 'access' as const,
};

// Configura mock do verifyAccessToken para retornar payload baseado no token
vi.mocked(tokenService.verifyAccessToken).mockImplementation(async (token: string) => {
  if (token.includes('admin')) return mockAdminPayload;
  if (token.includes('user')) return mockUserPayload;
  return null; // token inválido
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/v1/admin/cleanup-test-users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Sem token ────────────────────────────────────────────────────────

  it('deve retornar 401 sem token de autenticação', async () => {
    const res = await request(app).get('/api/v1/admin/cleanup-test-users');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // ── User comum (role 'user') ────────────────────────────────────────

  it('deve retornar 403 para usuário com role "user"', async () => {
    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-user-token');

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(res.body.error.message).toBe('Acesso restrito a administradores');
  });

  // ── Admin — sem usuários de teste ────────────────────────────────────

  it('deve retornar 200 com deleted=0 quando não há usuários de teste (admin)', async () => {
    const { db } = await import('../src/config/database');

    // Tabela users existe, mas não há usuários de teste
    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);            // sqlite_master
    vi.mocked(db.get).mockResolvedValueOnce({ total: 0 });                     // COUNT matching (NEW)
    vi.mocked(db.all).mockResolvedValueOnce([]);                               // test users (vazio)
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 });                     // totalBefore

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Nenhum usuário de teste encontrado');
    expect(res.body.data.deleted).toBe(0);
    expect(res.body.data.skipped).toBe(0);
    expect(res.body.data.totalBefore).toBe(5);
    expect(res.body.data.totalAfter).toBe(5);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.limit).toBe(100);
    expect(res.body.data.users).toEqual([]);
  });

  // ── Admin — com usuários de teste para limpar ──────────────────────

  it('deve retornar 200 e limpar usuários de teste (admin)', async () => {
    const { db } = await import('../src/config/database');
    const testUsers = [
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-123@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
      { id: 'u2', name: 'Mutation Test', email: 'mutation-abc-456@test.com', created_at: '2026-07-12T09:00:00.000Z' },
    ];

    // Tabela existe
    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    // COUNT matching = 2
    vi.mocked(db.get).mockResolvedValueOnce({ total: 2 });
    // Busca de test users retorna 2
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    // totalBefore = 7
    vi.mocked(db.get).mockResolvedValueOnce({ total: 7 });
    // DELETE calls (2) + INSERT log (1) = 3 — db.run já mockado
    // totalAfter = 5
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('2 usuário(s) de teste removido(s)');
    expect(res.body.data.deleted).toBe(2);
    expect(res.body.data.skipped).toBe(0);
    expect(res.body.data.totalBefore).toBe(7);
    expect(res.body.data.totalAfter).toBe(5);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.limit).toBe(100);
    expect(res.body.data.users).toHaveLength(2);
    expect(res.body.data.users[0].email).toBe('e2e-test-123@polymarketing.com');
    expect(res.body.data.users[1].email).toBe('mutation-abc-456@test.com');

    // 2 DELETEs + 1 INSERT no cleanup_log = 3
    expect(db.run).toHaveBeenCalledTimes(3);
    expect(db.run).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', ['u1']);
    expect(db.run).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', ['u2']);
  });

  // ── Admin — protege admin@polymarketing.com ─────────────────────────

  it('deve pular admin@polymarketing.com mesmo se corresponder a padrão', async () => {
    const { db } = await import('../src/config/database');

    const testUsers = [
      { id: 'admin-id', name: 'Admin', email: 'admin@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
      { id: 'u2', name: 'Test User', email: 'e2e-test-999@polymarketing.com', created_at: '2026-07-12T09:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 2 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });  // totalBefore
    vi.mocked(db.get).mockResolvedValueOnce({ total: 9 });   // totalAfter

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.deleted).toBe(1);   // apenas o e2e-test
    expect(res.body.data.skipped).toBe(1);   // admin protegido
    expect(res.body.data.totalBefore).toBe(10);
    expect(res.body.data.totalAfter).toBe(9);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.users).toHaveLength(2);

    // Deletou apenas o e2e-test, não o admin + 1 INSERT no log = 2
    expect(db.run).toHaveBeenCalledTimes(2);
    expect(db.run).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', ['u2']);
  });

  // ── Admin — tabela users não existe ────────────────────────────────

  it('deve retornar dados zerados se a tabela users não existir', async () => {
    const { db } = await import('../src/config/database');

    // Nenhuma tabela users
    vi.mocked(db.all).mockResolvedValue([]);

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.deleted).toBe(0);
    expect(res.body.data.totalBefore).toBe(0);
    expect(res.body.data.totalAfter).toBe(0);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.limit).toBe(100);
    expect(res.body.data.users).toEqual([]);
  });

  // ── Admin — dry-run lista sem deletar ──────────────────────────────

  it('deve listar usuários sem deletar quando ?dry_run=true', async () => {
    const { db } = await import('../src/config/database');

    const testUsers = [
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-123@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 }); // totalBefore

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?dry_run=true')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('1 usuário(s) de teste encontrado(s) (dry-run)');

    // Em dry-run, deleted=0 e totalAfter = totalBefore
    expect(res.body.data.deleted).toBe(0);
    expect(res.body.data.totalBefore).toBe(10);
    expect(res.body.data.totalAfter).toBe(10);
    expect(res.body.data.users).toHaveLength(1);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.limit).toBe(100);
    expect(res.body.data.users[0].email).toBe('e2e-test-123@polymarketing.com');

    // Nenhum DELETE foi executado
    expect(db.run).not.toHaveBeenCalled();
  });

  // ── Admin — dry-run com dry_run=1 ────────────────────────────────────

  it('deve aceitar dry_run=1 como true', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 0 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce([]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 3 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?dry_run=1')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('(dry-run)');
    expect(db.run).not.toHaveBeenCalled();
  });

  // ── Admin — dry_run=false executa normal ─────────────────────────────

  it('deve deletar normalmente quando dry_run=false', async () => {
    const { db } = await import('../src/config/database');

    const testUsers = [
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-999@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 }); // totalBefore
    vi.mocked(db.get).mockResolvedValueOnce({ total: 4 }); // totalAfter

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?dry_run=false')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.message).not.toContain('(dry-run)');
    expect(res.body.data.deleted).toBe(1);
    expect(res.body.data.totalAfter).toBe(4);

    // 1 DELETE + 1 INSERT no log = 2
    expect(db.run).toHaveBeenCalledTimes(2);
  });

  // ── Admin — sem dry_run (padrão) executa normal ─────────────────────

  it('deve deletar por padrão quando dry_run não é informado', async () => {
    const { db } = await import('../src/config/database');

    const testUsers = [
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-555@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 });
    vi.mocked(db.get).mockResolvedValueOnce({ total: 4 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.message).not.toContain('(dry-run)');
    expect(res.body.data.deleted).toBe(1);
    expect(res.body.data.limit).toBe(100);
    // 1 DELETE + 1 INSERT no log = 2
    expect(db.run).toHaveBeenCalledTimes(2);
  });

  // ── Admin — limit reduz o payload ────────────────────────────────────

  it('deve limitar o número de usuários retornados com ?limit=1', async () => {
    const { db } = await import('../src/config/database');

    const allUsers = [
      { id: 'u1', name: 'User 1', email: 'e2e-test-1@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
      { id: 'u2', name: 'User 2', email: 'e2e-test-2@polymarketing.com', created_at: '2026-07-12T09:00:00.000Z' },
      { id: 'u3', name: 'User 3', email: 'e2e-test-3@polymarketing.com', created_at: '2026-07-12T08:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 3 });   // COUNT matching = 3
    vi.mocked(db.all).mockResolvedValueOnce(allUsers);         // SELECT retorna todos (3)
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });   // totalBefore
    vi.mocked(db.get).mockResolvedValueOnce({ total: 7 });    // totalAfter (todos foram deletados)

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?limit=1')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(3);          // total real de matching
    expect(res.body.data.limit).toBe(1);          // limite aplicado
    expect(res.body.data.users).toHaveLength(1);  // apenas 1 retornado
    expect(res.body.data.users[0].email).toBe('e2e-test-1@polymarketing.com');
    expect(res.body.data.deleted).toBe(3);        // todos os 3 foram deletados mesmo com limit=1
    // 3 DELETEs + 1 INSERT no log = 4
    expect(db.run).toHaveBeenCalledTimes(4);
  });

  // ── Admin — limit 0 usa padrão 100 ───────────────────────────────────

  it('deve usar limit padrão (100) quando limit=0 é informado', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 });
    vi.mocked(db.all).mockResolvedValueOnce([
      { id: 'u1', name: 'Test', email: 'e2e-test-1@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 15 });
    vi.mocked(db.get).mockResolvedValueOnce({ total: 14 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?limit=0')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.limit).toBe(100);  // 0 reverte para o padrão 100
    expect(res.body.data.users).toHaveLength(1);
    // 1 DELETE + 1 INSERT no log = 2
    expect(db.run).toHaveBeenCalledTimes(2);
  });

  // ── Admin — limit máximo é 500 ───────────────────────────────────────

  it('deve capar limit em 500 mesmo se informado valor maior', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 3 });
    vi.mocked(db.all).mockResolvedValueOnce([
      { id: 'u1', name: 'Test', email: 'e2e-test-1@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });
    vi.mocked(db.get).mockResolvedValueOnce({ total: 9 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?limit=9999')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.limit).toBe(500);  // capado em 500
    // 1 DELETE + 1 INSERT no log = 2
    expect(db.run).toHaveBeenCalledTimes(2);
  });

  // ── Admin — limit não afeta a quantidade deletada ────────────────────

  it('deve deletar todos os usuários mesmo com limit baixo', async () => {
    const { db } = await import('../src/config/database');

    // 10 test users, mas limit=3
    const allUsers = Array.from({ length: 10 }, (_, i) => ({
      id: `u${i + 1}`,
      name: `User ${i + 1}`,
      email: `e2e-test-${i + 1}@polymarketing.com`,
      created_at: `2026-07-${12 - i}T10:00:00.000Z`,
    }));

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });  // COUNT matching = 10
    vi.mocked(db.all).mockResolvedValueOnce(allUsers);        // SELECT retorna todos (10)
    vi.mocked(db.get).mockResolvedValueOnce({ total: 20 });  // totalBefore
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });  // totalAfter

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?limit=3')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(10);        // total real
    expect(res.body.data.limit).toBe(3);          // limit aplicado
    expect(res.body.data.users).toHaveLength(3);  // só 3 retornados
    expect(res.body.data.deleted).toBe(10);       // 10 deletados
    // 10 DELETEs + 1 INSERT no log = 11
    expect(db.run).toHaveBeenCalledTimes(11);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/admin/stats
// ---------------------------------------------------------------------------

describe('GET /api/v1/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/v1/admin/stats');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('deve retornar 403 para user comum', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', 'Bearer mock-user-token');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('deve retornar métricas completas para admin', async () => {
    const { db } = await import('../src/config/database');

    // Tables
    vi.mocked(db.all).mockResolvedValueOnce([
      { name: 'users' }, { name: 'email_templates' }, { name: 'vehicles' },
      { name: 'conversations' }, { name: 'messages' }, { name: 'error_logs' },
      { name: 'token_optimizations' }, { name: 'query_cache' },
    ]);

    // Users: total, admins, test users
    vi.mocked(db.get).mockResolvedValueOnce({ total: 25 });   // total users
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });    // admins
    vi.mocked(db.get).mockResolvedValueOnce({ total: 12 });   // test users

    // Email templates
    vi.mocked(db.get).mockResolvedValueOnce({ total: 2 });

    // Vehicles
    vi.mocked(db.get).mockResolvedValueOnce({ total: 5 });

    // Conversations
    vi.mocked(db.get).mockResolvedValueOnce({ total: 270 });

    // Messages
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1420 });

    // Error logs: total
    vi.mocked(db.get).mockResolvedValueOnce({ total: 3 });
    // Error logs: by status
    vi.mocked(db.all).mockResolvedValueOnce([
      { status: 'open', total: 1 },
      { status: 'resolved', total: 2 },
    ]);

    // Token optimizations: total
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });
    // Token optimizations: sum
    vi.mocked(db.get).mockResolvedValueOnce({ totalOriginal: 50000, totalOptimized: 30000 });

    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Database
    expect(res.body.data.database.totalTables).toBe(8);
    expect(typeof res.body.data.database.sizeKB).toBe('number');

    // Users
    expect(res.body.data.users).toEqual({ total: 25, admins: 1, testUsers: 12 });

    // Email templates
    expect(res.body.data.emailTemplates.total).toBe(2);

    // Vehicles
    expect(res.body.data.vehicles.total).toBe(5);

    // Conversations & Messages
    expect(res.body.data.conversations.total).toBe(270);
    expect(res.body.data.messages.total).toBe(1420);

    // Error logs
    expect(res.body.data.errorLogs).toEqual({
      total: 3,
      open: 1,
      investigating: 0,
      resolved: 2,
      closed: 0,
    });

    // Token optimizations
    expect(res.body.data.tokenOptimizations).toEqual({
      total: 10,
      totalTokensSaved: 20000,
      totalOriginalTokens: 50000,
    });
  });

  it('deve retornar métricas zeradas quando banco está vazio', async () => {
    const { db } = await import('../src/config/database');

    // Nenhuma tabela
    vi.mocked(db.all).mockResolvedValue([]);

    // Todas as queries de COUNT retornam undefined (tabela não existe)
    vi.mocked(db.get).mockResolvedValue(undefined);

    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.database.totalTables).toBe(0);
    expect(res.body.data.users.total).toBe(0);
    expect(res.body.data.users.admins).toBe(0);
    expect(res.body.data.users.testUsers).toBe(0);
    expect(res.body.data.emailTemplates.total).toBe(0);
    expect(res.body.data.vehicles.total).toBe(0);
    expect(res.body.data.conversations.total).toBe(0);
    expect(res.body.data.messages.total).toBe(0);
    expect(res.body.data.errorLogs.total).toBe(0);
    expect(res.body.data.tokenOptimizations.total).toBe(0);
  });

  it('deve tratar errorsByStatus vazio (sem erros)', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValue(undefined); // todos os COUNT retornam 0 via ??
    vi.mocked(db.all).mockResolvedValueOnce([]);     // errors vazio

    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data.errorLogs.open).toBe(0);
    expect(res.body.data.errorLogs.investigating).toBe(0);
    expect(res.body.data.errorLogs.resolved).toBe(0);
    expect(res.body.data.errorLogs.closed).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/admin/cleanup-history
// ---------------------------------------------------------------------------

describe('GET /api/v1/admin/cleanup-history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/v1/admin/cleanup-history');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('deve retornar 403 para user comum', async () => {
    const res = await request(app)
      .get('/api/v1/admin/cleanup-history')
      .set('Authorization', 'Bearer mock-user-token');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('deve retornar histórico vazio quando tabela não existe', async () => {
    const { db } = await import('../src/config/database');

    // Tabela cleanup_log não existe
    vi.mocked(db.all).mockResolvedValue([]);

    const res = await request(app)
      .get('/api/v1/admin/cleanup-history')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('deve retornar histórico com registros', async () => {
    const { db } = await import('../src/config/database');

    const mockLog = [
      {
        id: 'cleanup_1741658400_abc123',
        executed_by: 'admin',
        dry_run: 0,
        deleted_count: 3,
        skipped_count: 0,
        total_before: 28,
        total_after: 25,
        users_found: 3,
        created_at: '2026-07-12T12:00:00.000Z',
      },
      {
        id: 'cleanup_1741658000_def456',
        executed_by: 'admin',
        dry_run: 0,
        deleted_count: 1,
        skipped_count: 1,
        total_before: 25,
        total_after: 24,
        users_found: 2,
        created_at: '2026-07-11T10:00:00.000Z',
      },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'cleanup_log' }]); // tabela existe
    vi.mocked(db.all).mockResolvedValueOnce(mockLog);                    // SELECT

    const res = await request(app)
      .get('/api/v1/admin/cleanup-history')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].id).toBe('cleanup_1741658400_abc123');
    expect(res.body.data[0].deleted_count).toBe(3);
    expect(res.body.data[0].users_found).toBe(3);
    expect(res.body.data[1].id).toBe('cleanup_1741658000_def456');
    expect(res.body.data[1].deleted_count).toBe(1);
    expect(res.body.data[1].skipped_count).toBe(1);
  });

  it('deve aceitar ?limit=1 e retornar apenas 1 registro', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'cleanup_log' }]);
    vi.mocked(db.all).mockResolvedValueOnce([
      { id: 'cleanup_1', executed_by: 'admin', dry_run: 0, deleted_count: 5, skipped_count: 0, total_before: 30, total_after: 25, users_found: 5, created_at: '2026-07-12T12:00:00.000Z' },
    ]);

    const res = await request(app)
      .get('/api/v1/admin/cleanup-history?limit=1')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('deve registrar log após execução de cleanup', async () => {
    const { db } = await import('../src/config/database');

    const testUsers = [
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-123@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ];

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });   // COUNT matching
    vi.mocked(db.all).mockResolvedValueOnce(testUsers);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });  // totalBefore
    vi.mocked(db.get).mockResolvedValueOnce({ total: 9 });   // totalAfter

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);

    // Verifica que INSERT INTO cleanup_log foi chamado
    const insertCalls = (db.run as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call: unknown[]) => String(call[0]).includes('INSERT INTO cleanup_log'),
    );
    expect(insertCalls).toHaveLength(1);

    const params = insertCalls[0][1] as unknown[];
    expect(params[2]).toBe(0);    // dry_run = false
    expect(params[3]).toBe(1);    // deleted_count = 1
    expect(params[4]).toBe(0);    // skipped_count = 0
    expect(params[5]).toBe(10);   // total_before = 10
    expect(params[6]).toBe(9);    // total_after = 9
    expect(params[7]).toBe(1);    // users_found = 1
  });

  it('não deve registrar log em dry-run', async () => {
    const { db } = await import('../src/config/database');

    vi.mocked(db.all).mockResolvedValueOnce([{ name: 'users' }]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 1 });
    vi.mocked(db.all).mockResolvedValueOnce([
      { id: 'u1', name: 'E2E Test', email: 'e2e-test-123@polymarketing.com', created_at: '2026-07-12T10:00:00.000Z' },
    ]);
    vi.mocked(db.get).mockResolvedValueOnce({ total: 10 });

    const res = await request(app)
      .get('/api/v1/admin/cleanup-test-users?dry_run=true')
      .set('Authorization', 'Bearer mock-admin-token');

    expect(res.status).toBe(200);

    // Nenhum INSERT INTO cleanup_log deve ter sido chamado
    const insertCalls = (db.run as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call: unknown[]) => String(call[0]).includes('INSERT INTO cleanup_log'),
    );
    expect(insertCalls).toHaveLength(0);
  });
});
