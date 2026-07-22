import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Lead Webhook API (V&V)', () => {
  it('deve rejeitar requisicao sem x-api-key (401 Unauthorized)', async () => {
    const res = await request(app).post('/api/v1/leads/webhook').send({
      name: 'Lead Teste',
      source: 'Google'
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized webhook');
  });
});
