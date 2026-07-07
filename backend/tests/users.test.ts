import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../src/config/database', () => ({
  db: {
    run: vi.fn().mockResolvedValue(undefined),
    get: vi.fn(),
    all: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
  },
}));

import { app } from '../src/app';
import { registerCsrfToken } from '../src/middleware/csrf';

const JWT_SECRET = 'change-me-in-production';

function getAuthToken(userId = 'test-1', email = 'user@test.com') {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
}

function getCsrfToken(userId = 'test-1') {
  const token = 'a'.repeat(64);
  registerCsrfToken(token, userId, Date.now() + 1800000);
  return token;
}

const mockUserRow = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed-pw-123',
  role: 'user',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed-pw-123',
  role: 'user',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('GET /api/v1/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });

  it('should list users', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.all).mockResolvedValue([mockUserRow]);

    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('John Doe');
    expect(res.body.meta.total).toBe(1);
  });
});

describe('POST /api/v1/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(undefined);
    vi.mocked(db.all).mockResolvedValue([]);

    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'New User', email: 'new@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('New User');
    expect(res.body.data.email).toBe('new@test.com');
  });

  it('should return 422 for invalid data', async () => {
    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'A', email: 'not-an-email', password: '12' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 403 without CSRF token', async () => {
    const token = getAuthToken('admin-1', 'admin@test.com');

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', email: 't@test.com', password: 'password123' });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('CSRF_MISSING');
  });

  it('should return 409 for duplicate email', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(mockUserRow);
    vi.mocked(db.all).mockResolvedValue([mockUserRow]);

    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });
});

describe('GET /api/v1/users/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user by id', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(mockUserRow);

    const res = await request(app)
      .get('/api/v1/users/user-1')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('John Doe');
  });

  it('should return 404 for unknown user', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(undefined);

    const res = await request(app)
      .get('/api/v1/users/nonexistent')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('USER_NOT_FOUND');
  });
});

describe('PUT /api/v1/users/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a user', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(mockUserRow);

    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .put('/api/v1/users/user-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });
});

describe('DELETE /api/v1/users/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a user', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(mockUserRow);

    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .delete('/api/v1/users/user-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf);

    expect(res.status).toBe(204);
  });

  it('should return 404 for deleting nonexistent user', async () => {
    const { db } = await import('../src/config/database');
    vi.mocked(db.get).mockResolvedValue(undefined);

    const token = getAuthToken('admin-1', 'admin@test.com');
    const csrf = getCsrfToken('admin-1');

    const res = await request(app)
      .delete('/api/v1/users/nonexistent')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf);

    expect(res.status).toBe(404);
  });
});
