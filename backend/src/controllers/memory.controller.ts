import { Router, Request, Response } from 'express';
import { memoryService } from '../services/memory.service';
import { CreateConversationDTO, CreateMessageDTO, CreateErrorLogDTO, UpdateErrorLogDTO } from '../types/memory';

const router = Router();

// ==================== CONVERSATIONS ====================

/**
 * @route   POST /api/v1/memory/conversations
 * @desc    Criar nova conversa
 * @access  Public
 */
router.post('/conversations', async (req: Request, res: Response) => {
  try {
    const data: CreateConversationDTO = req.body;

    // Validação básica
    if (!data.title || !data.agent_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Title and agent_id are required',
        },
      });
    }

    const conversation = await memoryService.createConversation(data);

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create conversation',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/conversations
 * @desc    Listar conversas com paginação
 * @access  Public
 */
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      order,
      search,
      agent_id,
      session_id,
    } = req.query;

    const conversations = await memoryService.getConversations({
      page: page ? parseInt(page as string) : 1,
      perPage: perPage ? parseInt(perPage as string) : 20,
      sortBy: (sortBy as string) || 'updated_at',
      order: (order as 'asc' | 'desc') || 'desc',
      search: search as string,
      agent_id: agent_id as string,
      session_id: session_id as string,
    });

    res.json({
      success: true,
      ...conversations,
    });
  } catch (error) {
    console.error('Error listing conversations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list conversations',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/conversations/:id
 * @desc    Buscar conversa por ID
 * @access  Public
 */
router.get('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await memoryService.getConversation(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found',
        },
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get conversation',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/conversations/:id/context
 * @desc    Obter contexto completo da conversa (com otimização de tokens)
 * @access  Public
 */
router.get('/conversations/:id/context', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { maxTokens } = req.query;

    const context = await memoryService.getConversationContext(
      id,
      maxTokens ? parseInt(maxTokens as string) : undefined
    );

    res.json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error('Error getting conversation context:', error);
    
    if ((error as Error).message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: (error as Error).message,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get conversation context',
      },
    });
  }
});

/**
 * @route   DELETE /api/v1/memory/conversations/:id
 * @desc    Deletar conversa
 * @access  Public
 */
router.delete('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await memoryService.deleteConversation(id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete conversation',
      },
    });
  }
});

// ==================== MESSAGES ====================

/**
 * @route   POST /api/v1/memory/messages
 * @desc    Adicionar mensagem à conversa
 * @access  Public
 */
router.post('/messages', async (req: Request, res: Response) => {
  try {
    const data: CreateMessageDTO = req.body;

    // Validação básica
    if (!data.conversation_id || !data.role || !data.content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'conversation_id, role, and content are required',
        },
      });
    }

    const message = await memoryService.createMessage(data);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create message',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/conversations/:id/messages
 * @desc    Listar mensagens de uma conversa
 * @access  Public
 */
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page, perPage } = req.query;

    const messages = await memoryService.getMessages(id, {
      page: page ? parseInt(page as string) : 1,
      perPage: perPage ? parseInt(perPage as string) : 100,
    });

    res.json({
      success: true,
      ...messages,
    });
  } catch (error) {
    console.error('Error listing messages:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list messages',
      },
    });
  }
});

/**
 * @route   DELETE /api/v1/memory/messages/:id
 * @desc    Deletar mensagem
 * @access  Public
 */
router.delete('/messages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await memoryService.deleteMessage(id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete message',
      },
    });
  }
});

// ==================== ERROR LOGS ====================

/**
 * @route   POST /api/v1/memory/errors
 * @desc    Registrar erro
 * @access  Public
 */
router.post('/errors', async (req: Request, res: Response) => {
  try {
    const data: CreateErrorLogDTO = req.body;

    // Validação básica
    if (!data.error_code || !data.error_message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'error_code and error_message are required',
        },
      });
    }

    const errorLog = await memoryService.createErrorLog(data);

    res.status(201).json({
      success: true,
      data: errorLog,
    });
  } catch (error) {
    console.error('Error creating error log:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create error log',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/errors
 * @desc    Listar logs de erro com paginação
 * @access  Public
 */
router.get('/errors', async (req: Request, res: Response) => {
  try {
    const { page, perPage, status, conversation_id } = req.query;

    const errorLogs = await memoryService.getErrorLogs({
      page: page ? parseInt(page as string) : 1,
      perPage: perPage ? parseInt(perPage as string) : 20,
      status: status as string,
      conversation_id: conversation_id as string,
    });

    res.json({
      success: true,
      ...errorLogs,
    });
  } catch (error) {
    console.error('Error listing error logs:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list error logs',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/errors/:id
 * @desc    Buscar erro por ID
 * @access  Public
 */
router.get('/errors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const errorLog = await memoryService.getErrorLog(id);

    if (!errorLog) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Error log not found',
        },
      });
    }

    res.json({
      success: true,
      data: errorLog,
    });
  } catch (error) {
    console.error('Error getting error log:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get error log',
      },
    });
  }
});

/**
 * @route   PATCH /api/v1/memory/errors/:id
 * @desc    Atualizar erro (adicionar resolução)
 * @access  Public
 */
router.patch('/errors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateErrorLogDTO = req.body;

    const errorLog = await memoryService.updateErrorLog(id, data);

    res.json({
      success: true,
      data: errorLog,
    });
  } catch (error) {
    console.error('Error updating error log:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update error log',
      },
    });
  }
});

/**
 * @route   POST /api/v1/memory/errors/:id/resolve
 * @desc    Resolver erro com passos de resolução
 * @access  Public
 */
router.post('/errors/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution_summary, resolution_steps } = req.body;

    if (!resolution_summary || !resolution_steps || !Array.isArray(resolution_steps)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'resolution_summary and resolution_steps (array) are required',
        },
      });
    }

    const errorLog = await memoryService.resolveError(id, resolution_summary, resolution_steps);

    res.json({
      success: true,
      data: errorLog,
    });
  } catch (error) {
    console.error('Error resolving error log:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to resolve error log',
      },
    });
  }
});

/**
 * @route   DELETE /api/v1/memory/errors/:id
 * @desc    Deletar log de erro
 * @access  Public
 */
router.delete('/errors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await memoryService.deleteErrorLog(id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting error log:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete error log',
      },
    });
  }
});

// ==================== TOKEN OPTIMIZATION ====================

/**
 * @route   POST /api/v1/memory/conversations/:id/optimize
 * @desc    Otimizar tokens de uma conversa
 * @access  Public
 */
router.post('/conversations/:id/optimize', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { strategy } = req.body;

    if (!strategy || !['summary', 'truncate', 'compress', 'cache'].includes(strategy)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'strategy must be one of: summary, truncate, compress, cache',
        },
      });
    }

    const result = await memoryService.optimizeConversationTokens(id, strategy);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error optimizing tokens:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to optimize tokens',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/conversations/:id/optimizations
 * @desc    Listar otimizações de uma conversa
 * @access  Public
 */
router.get('/conversations/:id/optimizations', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const optimizations = await memoryService.getTokenOptimizations(id);

    res.json({
      success: true,
      data: optimizations,
    });
  } catch (error) {
    console.error('Error listing optimizations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list optimizations',
      },
    });
  }
});

// ==================== STATS ====================

/**
 * @route   GET /api/v1/memory/stats
 * @desc    Obter estatísticas gerais de memória
 * @access  Public
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await memoryService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get stats',
      },
    });
  }
});

/**
 * @route   GET /api/v1/memory/search
 * @desc    Buscar mensagens por conteúdo
 * @access  Public
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, agent_id, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Query parameter "q" is required',
        },
      });
    }

    const results = await memoryService.searchMessages(q as string, {
      agent_id: agent_id as string,
      limit: limit ? parseInt(limit as string) : 50,
    });

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to search messages',
      },
    });
  }
});

export default router;