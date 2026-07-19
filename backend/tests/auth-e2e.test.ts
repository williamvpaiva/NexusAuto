import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

// ---------------------------------------------------------------------------
// Mocks
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

vi.mock('../src/services/email-templates.service', () => ({
  emailTemplatesService: {
    render: vi.fn().mockResolvedValue({
      subject: 'Redefina sua senha',
      html: '<html><body><a href="{{RESET_LINK}}">Resetar</a></body></html>',
    }),
  },
}));

// ---------------------------------------------------------------------------
// E2E Test — authService e emailService NÃO são mockados.
// ---------------------------------------------------------------------------

describe('Forgot/Reset Password — E2E Integration Flow', () => {
  const emailSuffix = Date.now();
  const testUser = {
    name: 'E2E Test User',
    email: `e2e-test-${emailSuffix}@nexusauto.app`,
    password: 'Initial@123',
    newPassword: 'NewStr0ng@456',
  };

  let capturedToken = '';

  beforeAll(async () => {
    // Registra o usuário de teste via endpoint real
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: testUser.name, email: testUser.email, password: testUser.password });

    if (res.status !== 201) {
      console.error('[E2E] Register unexpected:', res.status, JSON.stringify(res.body));
    }
  });

  // -----------------------------------------------------------------------
  // Fluxo completo: forgot → captura token → validate → reset → login
  // -----------------------------------------------------------------------

  it('deve completar o fluxo completo forgot → validate → reset → login', async () => {
    // ---- PASSO 1: Verificar login com senha inicial ----
    const loginCheckRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(loginCheckRes.status).toBe(200);
    expect(loginCheckRes.body.data.accessToken).toBeTruthy();

    // ---- PASSO 2: Spy no console.log e forgot-password ----
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation((msg: string) => {
      const match = msg.match(/\/reset-password\?token=([a-f0-9]+)/);
      if (match) capturedToken = match[1];
    });

    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testUser.email });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    expect(capturedToken).toBeTruthy();
    expect(capturedToken.length).toBe(64);
    expect(/^[a-f0-9]{64}$/.test(capturedToken)).toBe(true);

    // ---- PASSO 3: Validate token ----
    const validateRes = await request(app)
      .get(`/api/v1/auth/forgot-password/validate/${capturedToken}`);

    expect(validateRes.status).toBe(200);
    expect(validateRes.body.data.valid).toBe(true);

    // ---- PASSO 4: Reset password ----
    const resetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: capturedToken, password: testUser.newPassword });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);
    expect(resetRes.body.message).toBe('Senha redefinida com sucesso.');

    // ---- PASSO 5: Token consumido ----
    const consumedRes = await request(app)
      .get(`/api/v1/auth/forgot-password/validate/${capturedToken}`);

    expect(consumedRes.status).toBe(200);
    expect(consumedRes.body.data.valid).toBe(false);

    // ---- PASSO 6: Login com NOVA senha ----
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.newPassword });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.accessToken).toBeTruthy();
    expect(loginRes.body.data.user.email).toBe(testUser.email);

    // ---- PASSO 7: Login com senha ANTIGA falha ----
    const oldLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(oldLoginRes.status).toBe(401);
    expect(oldLoginRes.body.error.code).toBe('INVALID_CREDENTIALS');

    consoleSpy.mockRestore();
  });

  // -----------------------------------------------------------------------
  // Email inexistente (sem enumeração)
  // -----------------------------------------------------------------------

  it('deve retornar 200 para email inexistente (sem vazar informação)', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'inexistente@teste.com' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
    );

    const logCalls = consoleSpy.mock.calls.filter(
      (call) => (call[0] as string).includes('Modo dev - link de reset')
    );
    expect(logCalls.length).toBe(0);
    consoleSpy.mockRestore();
  });

  it('deve retornar 400 ao tentar resetar com token inválido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: 'token-invalido-123', password: 'NewStr0ng@456' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_RESET_TOKEN');
  });
});
