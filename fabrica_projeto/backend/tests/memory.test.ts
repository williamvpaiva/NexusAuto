import { MemoryService } from '../src/services/memory.service';
import { db } from '../src/config/database';
import { CreateConversationDTO, CreateMessageDTO } from '../src/types/memory';

describe('MemoryService', () => {
  let memoryService: MemoryService;

  beforeAll(async () => {
    await db.initialize();
  });

  beforeEach(() => {
    memoryService = new MemoryService();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('Conversations', () => {
    it('should create a conversation', async () => {
      const data: CreateConversationDTO = {
        title: 'Test Conversation',
        agent_id: 'test-agent-1',
        session_id: 'test-session-1',
        metadata: { test: true },
      };

      const conversation = await memoryService.createConversation(data);

      expect(conversation.id).toBeDefined();
      expect(conversation.title).toBe(data.title);
      expect(conversation.agent_id).toBe(data.agent_id);
      expect(conversation.metadata).toEqual(data.metadata);
    });

    it('should get conversation by id', async () => {
      const data: CreateConversationDTO = {
        title: 'Get Test',
        agent_id: 'test-agent-2',
      };

      const created = await memoryService.createConversation(data);
      const retrieved = await memoryService.getConversation(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe(created.title);
    });

    it('should return undefined for non-existent conversation', async () => {
      const result = await memoryService.getConversation('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should list conversations with pagination', async () => {
      // Create multiple conversations
      for (let i = 0; i < 5; i++) {
        await memoryService.createConversation({
          title: `Conversation ${i}`,
          agent_id: 'test-agent-list',
        });
      }

      const result = await memoryService.getConversations({
        agent_id: 'test-agent-list',
        page: 1,
        perPage: 3,
      });

      expect(result.data.length).toBeLessThanOrEqual(3);
      expect(result.meta.total).toBeGreaterThanOrEqual(5);
      expect(result.meta.page).toBe(1);
      expect(result.meta.perPage).toBe(3);
    });

    it('should delete conversation', async () => {
      const data: CreateConversationDTO = {
        title: 'Delete Test',
        agent_id: 'test-agent-delete',
      };

      const created = await memoryService.createConversation(data);
      await memoryService.deleteConversation(created.id);

      const retrieved = await memoryService.getConversation(created.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Messages', () => {
    it('should create a message', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Message Test',
        agent_id: 'test-agent-msg',
      });

      const data: CreateMessageDTO = {
        conversation_id: conversation.id,
        role: 'user',
        content: 'Hello, this is a test message!',
      };

      const message = await memoryService.createMessage(data);

      expect(message.id).toBeDefined();
      expect(message.conversation_id).toBe(conversation.id);
      expect(message.role).toBe('user');
      expect(message.content).toBe(data.content);
      expect(message.token_count).toBeGreaterThan(0);
    });

    it('should get messages by conversation', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Messages List Test',
        agent_id: 'test-agent-msglist',
      });

      // Create multiple messages
      for (let i = 0; i < 5; i++) {
        await memoryService.createMessage({
          conversation_id: conversation.id,
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`,
        });
      }

      const result = await memoryService.getMessages(conversation.id);

      expect(result.data.length).toBe(5);
      expect(result.meta.total).toBe(5);
    });

    it('should update conversation token count', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Token Count Test',
        agent_id: 'test-agent-tokens',
      });

      await memoryService.createMessage({
        conversation_id: conversation.id,
        role: 'user',
        content: 'Test message for token counting',
      });

      const updated = await memoryService.getConversation(conversation.id);
      expect(updated?.message_count).toBe(1);
      expect(updated?.token_count).toBeGreaterThan(0);
    });
  });

  describe('Error Logs', () => {
    it('should create error log', async () => {
      const errorData = {
        error_code: 'TEST_ERROR',
        error_message: 'This is a test error',
        error_stack: 'Error: Test error\n    at test.js:1:1',
        context: { userId: '123', action: 'test' },
      };

      const errorLog = await memoryService.createErrorLog(errorData);

      expect(errorLog.id).toBeDefined();
      expect(errorLog.error_code).toBe(errorData.error_code);
      expect(errorLog.error_message).toBe(errorData.error_message);
      expect(errorLog.status).toBe('open');
    });

    it('should resolve error with steps', async () => {
      const errorLog = await memoryService.createErrorLog({
        error_code: 'RESOLVE_TEST',
        error_message: 'Error to resolve',
      });

      const resolutionSteps = [
        'Step 1: Identified the issue',
        'Step 2: Applied fix',
        'Step 3: Verified solution',
      ];

      const resolved = await memoryService.resolveError(
        errorLog.id,
        'Issue resolved successfully',
        resolutionSteps
      );

      expect(resolved.status).toBe('resolved');
      expect(resolved.resolution_summary).toBe('Issue resolved successfully');
      expect(resolved.resolution_steps).toEqual(resolutionSteps);
      expect(resolved.resolved_at).toBeDefined();
    });

    it('should list errors by status', async () => {
      await memoryService.createErrorLog({
        error_code: 'OPEN_ERROR',
        error_message: 'Open error',
      });

      const result = await memoryService.getErrorLogs({ status: 'open' });
      expect(result.data.some((e) => e.error_code === 'OPEN_ERROR')).toBe(true);
    });
  });

  describe('Token Optimization', () => {
    it('should optimize conversation tokens with summary strategy', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Optimization Test',
        agent_id: 'test-agent-opt',
      });

      // Create messages
      for (let i = 0; i < 10; i++) {
        await memoryService.createMessage({
          conversation_id: conversation.id,
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i} with some content to increase token count`,
        });
      }

      const result = await memoryService.optimizeConversationTokens(
        conversation.id,
        'summary'
      );

      expect(result.optimization.strategy).toBe('summary');
      expect(result.optimizedTokens).toBeLessThan(result.originalTokens);
      expect(result.savedTokens).toBeGreaterThan(0);
    });

    it('should optimize conversation tokens with truncate strategy', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Truncate Test',
        agent_id: 'test-agent-trunc',
      });

      // Create 20 messages
      for (let i = 0; i < 20; i++) {
        await memoryService.createMessage({
          conversation_id: conversation.id,
          role: 'user',
          content: `Message ${i}`,
        });
      }

      const result = await memoryService.optimizeConversationTokens(
        conversation.id,
        'truncate'
      );

      expect(result.optimization.strategy).toBe('truncate');
      expect(result.optimizedTokens).toBeLessThan(result.originalTokens);
    });
  });

  describe('Stats', () => {
    it('should get memory stats', async () => {
      const stats = await memoryService.getStats();

      expect(stats.totalConversations).toBeGreaterThanOrEqual(0);
      expect(stats.totalMessages).toBeGreaterThanOrEqual(0);
      expect(stats.totalTokens).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Context Management', () => {
    it('should get conversation context', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Context Test',
        agent_id: 'test-agent-context',
      });

      await memoryService.createMessage({
        conversation_id: conversation.id,
        role: 'user',
        content: 'First message',
      });

      await memoryService.createMessage({
        conversation_id: conversation.id,
        role: 'assistant',
        content: 'Second message',
      });

      const context = await memoryService.getConversationContext(conversation.id);

      expect(context.conversation.id).toBe(conversation.id);
      expect(context.messages.length).toBe(2);
      expect(context.totalTokens).toBeGreaterThan(0);
      expect(context.truncated).toBe(false);
    });

    it('should truncate context when maxTokens exceeded', async () => {
      const conversation = await memoryService.createConversation({
        title: 'Truncate Context Test',
        agent_id: 'test-agent-trunc-ctx',
      });

      // Create messages with known token counts
      for (let i = 0; i < 10; i++) {
        await memoryService.createMessage({
          conversation_id: conversation.id,
          role: 'user',
          content: `Message ${i} with enough content to have significant token count`,
        });
      }

      const context = await memoryService.getConversationContext(conversation.id, 100);

      expect(context.truncated).toBe(true);
      expect(context.totalTokens).toBeLessThanOrEqual(100);
    });
  });
});