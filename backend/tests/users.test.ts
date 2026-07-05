import request from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';
import { app } from '../src/app';
import { registerCsrfToken } from '../src/middleware/csrf';

let token: string;
let csrfToken: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@polymarketing.com', password: 'admin123' });
  token = loginRes.body.data.token;
  csrfToken = require('crypto').randomBytes(32).toString('hex');
  registerCsrfToken(csrfToken, loginRes.body.data.user.id, Date.now() + 3600000);
});

describe('GET /api/v1/health', () => {
  it('should return health payload', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.service).toBe('polymarketing');
  });
});

describe('GET /api/v1/users', () => {
  it('should return list of users', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
  });
});

describe('POST /api/v1/users', () => {
  it('should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: `test.${Date.now()}@example.com`,
      password: 'test123456'
    };

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe(newUser.name);
    expect(response.body.data.email).toBe(newUser.email.toLowerCase());
  });

  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ name: 'Test', email: 'invalid', password: 'test123' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('should reject short name', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ name: 'A', email: 'test@example.com', password: 'test123' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('should reject short password', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ name: 'Test', email: 'test@example.com', password: '123' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});