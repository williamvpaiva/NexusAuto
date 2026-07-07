import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { registerCsrfToken } from '../src/middleware/csrf';

const JWT_SECRET = 'change-me-in-production';

function getAuthToken(userId = 'test-1', email = 'test@test.com') {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
}

function getCsrfToken(userId = 'test-1') {
  const token = 'c'.repeat(64);
  registerCsrfToken(token, userId, Date.now() + 1800000);
  return token;
}

describe('Error Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error).toHaveProperty('requestId');
  });

  it('should return 422 for invalid user creation data', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'A' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for login without credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 401 for missing auth token on protected route', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 for invalid auth token', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer invalid-token-here');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
