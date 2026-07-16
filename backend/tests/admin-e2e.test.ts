import { describe, it, expect, vi, beforeAll } from 'vitest';
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

/**
 * Faz login como admin e retorna o access token real.
 */
async function getAdminToken(): Promise<string> {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@polymarketing.com', password: 'admin123' });

  if (res.status !== 200) {
    throw new Error(`Falha ao fazer login como admin: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.data.accessToken;
}

/**
 * Gera um email único baseado em timestamp.
 */
const suffix = Date.now();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/v1/admin/stats — E2E Integration (no mocks)', () => {
  let adminToken: string;

  // ── Baseline: métricas antes de criar dados ─────────────────────────

  let baselineUsers = 0;
  let baselineAdmins = 0;
  let baselineTemplates = 0;
  let baselineVehicles = 0;
  let baselineTables = 0;

  beforeAll(async () => {
    adminToken = await getAdminToken();

    // Estabelece baseline das métricas existentes (admin seed + template seed)
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    if (res.status !== 200) {
      throw new Error(`Falha ao obter baseline stats: ${res.status}`);
    }

    baselineUsers = res.body.data.users.total;
    baselineAdmins = res.body.data.users.admins;
    baselineTemplates = res.body.data.emailTemplates.total;
    baselineVehicles = res.body.data.vehicles.total;
    baselineTables = res.body.data.database.totalTables;
  });

  // ── Teste 1: Login admin e acesso à rota ─────────────────────────────

  it('deve logar como admin e acessar /admin/stats', () => {
    expect(adminToken).toBeTruthy();
    expect(typeof adminToken).toBe('string');
  });

  // ── Teste 2: Métricas baseline ──────────────────────────────────────

  it('deve retornar métricas baseline (admin seed + template seed)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database.totalTables).toBeGreaterThanOrEqual(8);
    expect(res.body.data.users.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data.users.admins).toBeGreaterThanOrEqual(1);
    expect(res.body.data.emailTemplates.total).toBeGreaterThanOrEqual(1);
  });

  // ── Teste 3: 401 sem token ──────────────────────────────────────────

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/v1/admin/stats');
    expect(res.status).toBe(401);
  });

  // ── Teste 4: Criar usuário de teste e verificar contagem ───────────

  it('deve refletir novo usuário de teste nas métricas', async () => {
    const email = `e2e-stats-${suffix}@polymarketing.com`;

    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Stats E2E User', email, password: 'Test@123456' });

    expect(registerRes.status).toBe(201);

    // Verifica que o total de usuários aumentou em 1
    const statsRes = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.users.total).toBe(baselineUsers + 1);
    expect(statsRes.body.data.users.testUsers).toBeGreaterThanOrEqual(1);
  });

  // ── Teste 5: Criar veículo e verificar contagem ────────────────────

  it('deve refletir novo veículo nas métricas', async () => {
    // Cria um veículo via POST (precisa de CSRF token)
    const csrfRes = await request(app)
      .get('/api/v1/auth/csrf-token')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(csrfRes.status).toBe(200);
    const csrfToken = csrfRes.body.data.token;

    // fuelType (camelCase) conforme schema Zod; placa no formato Mercosul: ABC1D23
    const last3 = suffix.toString().slice(-3).padStart(3, '0');
    const plate = `EEE${last3[0]}A${last3.slice(1)}`; // ex: EEE1A23 (3 letras + 1 dig + 1 alfa + 2 digs)

    const vehicleRes = await request(app)
      .post('/api/v1/veiculos')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-CSRF-Token', csrfToken)
      .send({
        brand: 'Test Brand',
        model: 'Stats E2E',
        year: 2026,
        color: 'Prata',
        price: 50000,
        mileage: 1000,
        fuelType: 'flex',
        transmission: 'automatico',
        plate,
      });

    expect(vehicleRes.status).toBe(201);

    // Verifica que o total de veículos aumentou em 1
    const statsRes = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.vehicles.total).toBe(baselineVehicles + 1);
  });

  // ── Teste 6: Criar conversa e mensagem e verificar contagens ───────

  it('deve refletir nova conversa e mensagem nas métricas', async () => {
    // Insere dados diretamente no banco via db (não há endpoint para criar conversas)
    const { db } = await import('../src/config/database');

    const convId = `e2e-conv-${suffix}`;
    const msgId = `e2e-msg-${suffix}`;

    await db.run(
      `INSERT INTO conversations (id, title, agent_id, session_id, token_count, message_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [convId, 'E2E Stats Conversation', 'e2e-agent', 'e2e-session', 100, 1],
    );

    await db.run(
      `INSERT INTO messages (id, conversation_id, role, content, token_count)
       VALUES (?, ?, ?, ?, ?)`,
      [msgId, convId, 'user', 'Mensagem de teste E2E para stats', 50],
    );

    // Verifica que as métricas refletem os novos dados
    const statsRes = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.conversations.total).toBeGreaterThanOrEqual(1);
    expect(statsRes.body.data.messages.total).toBeGreaterThanOrEqual(1);
  });

  // ── Teste 7: Verificar estrutura completa da resposta ──────────────

  it('deve retornar estrutura completa de métricas', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    const data = res.body.data;

    // Database
    expect(data.database).toHaveProperty('totalTables');
    expect(typeof data.database.totalTables).toBe('number');
    expect(data.database).toHaveProperty('sizeKB');
    expect(typeof data.database.sizeKB).toBe('number');

    // Users
    expect(data.users).toHaveProperty('total');
    expect(data.users).toHaveProperty('admins');
    expect(data.users).toHaveProperty('testUsers');

    // Email templates
    expect(data.emailTemplates).toHaveProperty('total');

    // Vehicles
    expect(data.vehicles).toHaveProperty('total');

    // Conversations & Messages
    expect(data.conversations).toHaveProperty('total');
    expect(data.messages).toHaveProperty('total');

    // Error logs
    expect(data.errorLogs).toHaveProperty('total');
    expect(data.errorLogs).toHaveProperty('open');
    expect(data.errorLogs).toHaveProperty('investigating');
    expect(data.errorLogs).toHaveProperty('resolved');
    expect(data.errorLogs).toHaveProperty('closed');

    // Token optimizations
    expect(data.tokenOptimizations).toHaveProperty('total');
    expect(data.tokenOptimizations).toHaveProperty('totalTokensSaved');
    expect(data.tokenOptimizations).toHaveProperty('totalOriginalTokens');
  });
});
