import request from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';
import { app } from '../src/app';
import { db } from '../src/config/database';
import { registerCsrfToken } from '../src/middleware/csrf';

let token: string;
let csrfToken: string;

beforeAll(async () => {
  await db.initialize();
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@polymarketing.com', password: 'admin123' });
  token = loginRes.body.data.accessToken;
  csrfToken = require('crypto').randomBytes(32).toString('hex');
  registerCsrfToken(csrfToken, loginRes.body.data.user.id, Date.now() + 3600000);
});

describe('Memory Routes - Auth', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/memory/conversations');
    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/memory/conversations')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });
});

describe('Memory Routes - Conversations', () => {
  let conversationId: string;

  it('should create a conversation', async () => {
    const res = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ title: 'Route Test', agent_id: 'route-agent' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title).toBe('Route Test');
    conversationId = res.body.data.id;
  });

  it('should list conversations', async () => {
    const res = await request(app)
      .get('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get conversation by id', async () => {
    const res = await request(app)
      .get(`/api/v1/memory/conversations/${conversationId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(conversationId);
  });

  it('should return 404 for non-existent conversation', async () => {
    const res = await request(app)
      .get('/api/v1/memory/conversations/non-existent-id')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 422 for invalid conversation data', async () => {
    const res = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ title: '' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('Memory Routes - Messages', () => {
  let conversationId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ title: 'Message Route Test', agent_id: 'msg-route-agent' });
    conversationId = res.body.data.id;
  });

  it('should create a message', async () => {
    const res = await request(app)
      .post('/api/v1/memory/messages')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ conversation_id: conversationId, role: 'user', content: 'Hello via route' });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('user');
    expect(res.body.data.content).toBe('Hello via route');
  });

  it('should list messages by conversation', async () => {
    const res = await request(app)
      .get(`/api/v1/memory/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 422 for invalid message data', async () => {
    const res = await request(app)
      .post('/api/v1/memory/messages')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ role: 'invalid' });

    expect(res.status).toBe(422);
  });
});

describe('Memory Routes - Stats', () => {
  it('should get stats', async () => {
    const res = await request(app)
      .get('/api/v1/memory/stats')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.data.totalConversations).toBeGreaterThanOrEqual(0);
    expect(res.body.data.totalMessages).toBeGreaterThanOrEqual(0);
  });
});

describe('Memory Routes - Error Logs', () => {
  let errorId: string;

  it('should create an error log', async () => {
    const res = await request(app)
      .post('/api/v1/memory/errors')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ error_code: 'ROUTE_TEST_ERR', error_message: 'Error via route' });

    expect(res.status).toBe(201);
    errorId = res.body.data.id;
  });

  it('should list error logs', async () => {
    const res = await request(app)
      .get('/api/v1/memory/errors')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should resolve an error', async () => {
    const res = await request(app)
      .post(`/api/v1/memory/errors/${errorId}/resolve`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ resolution_summary: 'Fixed via route', resolution_steps: ['Step 1', 'Step 2'] });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });

  it('should return 422 for invalid resolve data', async () => {
    const res = await request(app)
      .post(`/api/v1/memory/errors/${errorId}/resolve`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({});

    expect(res.status).toBe(422);
  });
});

describe('Memory Routes - Token Optimization', () => {
  let conversationId: string;

  beforeAll(async () => {
    const conv = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ title: 'Optimize Route', agent_id: 'opt-route-agent' });
    conversationId = conv.body.data.id;

    await request(app)
      .post('/api/v1/memory/messages')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ conversation_id: conversationId, role: 'user', content: 'Optimize me' });
  });

  it('should optimize conversation tokens', async () => {
    const res = await request(app)
      .post(`/api/v1/memory/conversations/${conversationId}/optimize`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken)
      .send({ strategy: 'summary' });

    if (res.status !== 200) {
      console.log('Optimize response:', res.status, JSON.stringify(res.body));
    }
    expect(res.status).toBe(200);
    expect(res.body.data.optimization.strategy).toBe('summary');
  });
});

describe('Memory Routes - Search', () => {
  it('should return 400 when query param is missing', async () => {
    const res = await request(app)
      .get('/api/v1/memory/search')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(400);
  });

  it('should search messages', async () => {
    const res = await request(app)
      .get('/api/v1/memory/search?q=hello')
      .set('Authorization', `Bearer ${token}`)
      .set('x-csrf-token', csrfToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
