import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Auth API (V&V)', () => {
  it('deve rejeitar acesso a rota /me sem token (401 Unauthorized)', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('deve retornar 401 para payload de login incorreto', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'invalid-email',
      password: '123'
    });
    // zod validation fails -> controller returns 401
    expect(res.status).toBe(401);
  });
});
