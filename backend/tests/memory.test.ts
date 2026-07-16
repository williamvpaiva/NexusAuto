import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../src/services/memory.service', () => ({
  memoryService: {
    createConversation: vi.fn(),
    getConversation: vi.fn(),
    getConversations: vi.fn(),
    getConversationContext: vi.fn(),
    deleteConversation: vi.fn(),
    createMessage: vi.fn(),
    getMessages: vi.fn(),
    deleteMessage: vi.fn(),
    createErrorLog: vi.fn(),
    getErrorLog: vi.fn(),
    getErrorLogs: vi.fn(),
    updateErrorLog: vi.fn(),
    resolveError: vi.fn(),
    deleteErrorLog: vi.fn(),
    optimizeConversationTokens: vi.fn(),
    getTokenOptimizations: vi.fn(),
    getStats: vi.fn(),
    searchMessages: vi.fn(),
  },
}));

import { app } from '../src/app';
import { memoryService } from '../src/services/memory.service';
import { registerCsrfToken } from '../src/middleware/csrf';

const JWT_SECRET = 'change-me-in-production';

function getAuthToken(userId = 'test-1', email = 'test@test.com') {
  return jwt.sign({ userId, email, type: 'access' }, JWT_SECRET, { expiresIn: '1h' });
}

function getCsrfToken(userId = 'test-1') {
  const token = 'b'.repeat(64);
  registerCsrfToken(token, userId, Date.now() + 1800000);
  return token;
}

const mockConversation = {
  id: 'conv-1',
  title: 'Test Conversation',
  agent_id: 'agent-1',
  session_id: 'session-1',
  message_count: 0,
  token_count: 0,
  metadata: {},
  created_at: new Date('2025-01-01T00:00:00.000Z'),
  updated_at: new Date('2025-01-01T00:00:00.000Z'),
};

const mockMessage = {
  id: 'msg-1',
  conversation_id: 'conv-1',
  role: 'user',
  content: 'Hello world',
  token_count: 3,
  metadata: {},
  created_at: new Date('2025-01-01T00:00:00.000Z'),
};

const mockErrorLog = {
  id: 'err-1',
  conversation_id: 'conv-1',
  error_code: 'ERR_001',
  error_message: 'Something went wrong',
  error_stack: null,
  context: {},
  resolution_steps: [],
  status: 'open',
  created_at: new Date('2025-01-01T00:00:00.000Z'),
  updated_at: new Date('2025-01-01T00:00:00.000Z'),
  resolved_at: undefined,
};

const mockOptimization = {
  id: 'opt-1',
  conversation_id: 'conv-1',
  original_token_count: 100,
  optimized_token_count: 30,
  compression_ratio: 0.3,
  strategy: 'summary',
  metadata: {},
  created_at: new Date('2025-01-01T00:00:00.000Z'),
};

const mockStats = {
  totalConversations: 5,
  totalMessages: 42,
  totalTokens: 1000,
  totalErrors: 3,
  openErrors: 1,
  avgTokensPerConversation: 200,
  cacheHitRate: 0.75,
  lastOptimization: new Date('2025-01-01T00:00:00.000Z'),
};

describe('POST /api/v1/memory/conversations', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should create a conversation', async () => {
    vi.mocked(memoryService.createConversation).mockResolvedValue(mockConversation);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ title: 'Test Conversation', agent_id: 'agent-1' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('conv-1');
    expect(res.body.data.title).toBe('Test Conversation');
  });

  it('should return 422 for missing title', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ agent_id: 'agent-1' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/memory/conversations', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should list conversations', async () => {
    vi.mocked(memoryService.getConversations).mockResolvedValue({
      data: [mockConversation],
      meta: { page: 1, perPage: 20, total: 1, totalPages: 1 },
    });

    const res = await request(app)
      .get('/api/v1/memory/conversations')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
  });
});

describe('GET /api/v1/memory/conversations/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return a conversation by id', async () => {
    vi.mocked(memoryService.getConversation).mockResolvedValue(mockConversation);

    const res = await request(app)
      .get('/api/v1/memory/conversations/conv-1')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('conv-1');
  });

  it('should return 404 for unknown conversation', async () => {
    vi.mocked(memoryService.getConversation).mockResolvedValue(undefined);

    const res = await request(app)
      .get('/api/v1/memory/conversations/nonexistent')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/memory/conversations/:id/context', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return conversation context', async () => {
    vi.mocked(memoryService.getConversationContext).mockResolvedValue({
      conversation: mockConversation,
      messages: [mockMessage],
      totalTokens: 3,
      truncated: false,
    });

    const res = await request(app)
      .get('/api/v1/memory/conversations/conv-1/context')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.conversation.id).toBe('conv-1');
    expect(res.body.data.messages).toHaveLength(1);
    expect(res.body.data.truncated).toBe(false);
  });
});

describe('DELETE /api/v1/memory/conversations/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should delete a conversation', async () => {
    vi.mocked(memoryService.deleteConversation).mockResolvedValue(undefined);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .delete('/api/v1/memory/conversations/conv-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf);

    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/memory/messages', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should create a message', async () => {
    vi.mocked(memoryService.createMessage).mockResolvedValue(mockMessage);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/messages')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ conversation_id: 'conv-1', role: 'user', content: 'Hello world' });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('msg-1');
    expect(res.body.data.content).toBe('Hello world');
  });

  it('should return 422 for invalid role', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/messages')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ conversation_id: 'conv-1', role: 'invalid', content: 'Hello' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/memory/conversations/:id/messages', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should list messages by conversation', async () => {
    vi.mocked(memoryService.getMessages).mockResolvedValue({
      data: [mockMessage],
      meta: { page: 1, perPage: 100, total: 1, totalPages: 1 },
    });

    const res = await request(app)
      .get('/api/v1/memory/conversations/conv-1/messages')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].content).toBe('Hello world');
  });
});

describe('DELETE /api/v1/memory/messages/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should delete a message', async () => {
    vi.mocked(memoryService.deleteMessage).mockResolvedValue(undefined);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .delete('/api/v1/memory/messages/msg-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf);

    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/memory/errors', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should create an error log', async () => {
    vi.mocked(memoryService.createErrorLog).mockResolvedValue(mockErrorLog);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/errors')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ error_code: 'ERR_001', error_message: 'Something went wrong' });

    expect(res.status).toBe(201);
    expect(res.body.data.error_code).toBe('ERR_001');
  });

  it('should return 422 for missing error_code', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/errors')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ error_message: 'Oops' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/memory/errors', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should list error logs', async () => {
    vi.mocked(memoryService.getErrorLogs).mockResolvedValue({
      data: [mockErrorLog],
      meta: { page: 1, perPage: 20, total: 1, totalPages: 1 },
    });

    const res = await request(app)
      .get('/api/v1/memory/errors')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('open');
  });
});

describe('GET /api/v1/memory/errors/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return an error log by id', async () => {
    vi.mocked(memoryService.getErrorLog).mockResolvedValue(mockErrorLog);

    const res = await request(app)
      .get('/api/v1/memory/errors/err-1')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('err-1');
  });

  it('should return 404 for unknown error log', async () => {
    vi.mocked(memoryService.getErrorLog).mockResolvedValue(undefined);

    const res = await request(app)
      .get('/api/v1/memory/errors/nonexistent')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/v1/memory/errors/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should update an error log', async () => {
    vi.mocked(memoryService.updateErrorLog).mockResolvedValue({
      ...mockErrorLog,
      status: 'resolved',
      resolution_summary: 'Fixed the issue',
    });

    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .patch('/api/v1/memory/errors/err-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ status: 'resolved' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });
});

describe('POST /api/v1/memory/errors/:id/resolve', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should resolve an error log', async () => {
    vi.mocked(memoryService.resolveError).mockResolvedValue({
      ...mockErrorLog,
      status: 'resolved',
      resolution_summary: 'Fixed',
      resolution_steps: ['Step 1'],
    });

    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/errors/err-1/resolve')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ resolution_summary: 'Fixed', resolution_steps: ['Step 1'] });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });

  it('should return 422 without resolution_summary', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/errors/err-1/resolve')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ resolution_steps: ['Step 1'] });

    expect(res.status).toBe(422);
  });
});

describe('DELETE /api/v1/memory/errors/:id', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should delete an error log', async () => {
    vi.mocked(memoryService.deleteErrorLog).mockResolvedValue(undefined);
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .delete('/api/v1/memory/errors/err-1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf);

    expect(res.status).toBe(204);
  });
});

describe('POST /api/v1/memory/conversations/:id/optimize', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should optimize conversation tokens', async () => {
    vi.mocked(memoryService.optimizeConversationTokens).mockResolvedValue({
      optimization: mockOptimization,
      originalTokens: 100,
      optimizedTokens: 30,
      savedTokens: 70,
    });

    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/conversations/conv-1/optimize')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ strategy: 'summary' });

    expect(res.status).toBe(200);
    expect(res.body.data.originalTokens).toBe(100);
    expect(res.body.data.savedTokens).toBe(70);
  });

  it('should return 422 for invalid strategy', async () => {
    const token = getAuthToken();
    const csrf = getCsrfToken();

    const res = await request(app)
      .post('/api/v1/memory/conversations/conv-1/optimize')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrf)
      .send({ strategy: 'invalid' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/memory/conversations/:id/optimizations', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should list token optimizations', async () => {
    vi.mocked(memoryService.getTokenOptimizations).mockResolvedValue([mockOptimization]);

    const res = await request(app)
      .get('/api/v1/memory/conversations/conv-1/optimizations')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].strategy).toBe('summary');
  });
});

describe('GET /api/v1/memory/stats', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return memory stats', async () => {
    vi.mocked(memoryService.getStats).mockResolvedValue(mockStats);

    const res = await request(app)
      .get('/api/v1/memory/stats')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalConversations).toBe(5);
    expect(res.body.data.totalMessages).toBe(42);
    expect(res.body.data.cacheHitRate).toBe(0.75);
  });
});

describe('GET /api/v1/memory/search', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should search messages by query', async () => {
    vi.mocked(memoryService.searchMessages).mockResolvedValue([
      { message: mockMessage, conversation: mockConversation, relevance: 0.5 },
    ]);

    const res = await request(app)
      .get('/api/v1/memory/search?q=hello')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].message.content).toBe('Hello world');
  });

  it('should return 400 when q is missing', async () => {
    const res = await request(app)
      .get('/api/v1/memory/search')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });
});

describe('Unauthenticated access', () => {
  it('should return 401 for all memory endpoints without a token', async () => {
    const endpoints = [
      '/api/v1/memory/conversations',
      '/api/v1/memory/conversations/conv-1',
      '/api/v1/memory/stats',
      '/api/v1/memory/search?q=test',
    ] as const;

    for (const url of endpoints) {
      const res = await request(app).get(url);
      expect(res.status, `GET ${url}`).toBe(401);
    }
  });
});
