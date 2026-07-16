import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';

vi.mock('../src/services/users.service', () => ({
  usersService: {
    list: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { usersService } from '../src/services/users.service';

const JWT_SECRET = 'change-me-in-production';

const mockUser = {
  id: 'test-1',
  name: 'Test User',
  email: 'test@example.com',
  password: '$2b$12$PSCchyABMbJ4Q/CslQaXDOVDJk/bOu0mBS4V3DaCdS/ulEgivlKmy',
  role: 'user' as const,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login with valid credentials', async () => {
    vi.mocked(usersService.list).mockResolvedValue([mockUser]);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'correct-password' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.id).toBe('test-1');
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should return 401 with wrong password', async () => {
    vi.mocked(usersService.list).mockResolvedValue([mockUser]);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should return 401 with unknown email', async () => {
    vi.mocked(usersService.list).mockResolvedValue([mockUser]);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'unknown@example.com', password: 'password' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });
});

describe('GET /api/v1/auth/csrf-token', () => {
  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/api/v1/auth/csrf-token');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 200 with CSRF token for authenticated user', async () => {
    const token = jwt.sign({ userId: 'test-1', email: 'test@example.com', type: 'access' }, JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/v1/auth/csrf-token')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.token.length).toBe(64);
    expect(res.body.data.expiresIn).toBe(1800);
  });
});
