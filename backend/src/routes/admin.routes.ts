import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { cleanupTestUsers, adminStats, getCleanupHistory } from '../services/admin.service';
import { validate } from '../middleware/validate.middleware';
import { CleanupHistorySchema, CleanupTestUsersSchema } from '../dtos/admin.dto';

export const adminRouter = Router();

/**
 * GET /admin/cleanup-test-users
 *
 * Lista e/ou remove do banco os usuários criados durante os testes
 * E2E e de mutação.
 *
 * Query params:
 * - `dry_run=true` — apenas lista, não deleta (padrão: `false`)
 *
 * Requer autenticação + role 'admin'.
 *
 * Resposta (execução):
 * ```json
 * {
 *   "success": true,
 *   "message": "3 usuário(s) de teste removido(s)",
 *   "data": {
 *     "deleted": 3,
 *     "skipped": 0,
 *     "totalBefore": 26,
 *     "totalAfter": 23,
 *     "users": [ ... ]
 *   }
 * }
 * ```
 *
 * Resposta (dry-run):
 * ```json
 * {
 *   "success": true,
 *   "message": "2 usuário(s) de teste encontrado(s) (dry-run)",
 *   "data": {
 *     "deleted": 0,
 *     "skipped": 0,
 *     "totalBefore": 26,
 *     "totalAfter": 26,
 *     "users": [ ... ]
 *   }
 * }
 * ```
 */
adminRouter.get('/cleanup-test-users', validate(CleanupTestUsersSchema), asyncHandler(async (req, res) => {
  const dryRun = ['true', '1', 'yes'].includes(String(req.query.dry_run).toLowerCase());

  // Limita o número de usuários retornados (padrão 100, máximo 500)
  const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 100, 1), 500);

  const result = await cleanupTestUsers(dryRun, limit);

  const message = dryRun
    ? `${result.users.length} usuário(s) de teste encontrado(s) (dry-run)`
    : result.deleted > 0
      ? `${result.deleted} usuário(s) de teste removido(s)`
      : 'Nenhum usuário de teste encontrado';

  res.json({ success: true, message, data: result });
}));

/**
 * GET /admin/stats
 *
 * Retorna métricas do sistema: total de usuários, templates,
 * veículos, conversas, mensagens, erros e otimizações.
 *
 * Requer autenticação + role 'admin'.
 *
 * Resposta:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "database": { "totalTables": 8, "sizeKB": 128 },
 *     "users": { "total": 25, "admins": 1, "testUsers": 12 },
 *     "emailTemplates": { "total": 2 },
 *     "vehicles": { "total": 0 },
 *     "conversations": { "total": 270 },
 *     "messages": { "total": 1420 },
 *     "errorLogs": { "total": 0, "open": 0, ... },
 *     "tokenOptimizations": { "total": 0, "totalTokensSaved": 0, "totalOriginalTokens": 0 }
 *   }
 * }
 * ```
 */
adminRouter.get('/stats', asyncHandler(async (_req, res) => {
  const stats = await adminStats();
  res.json({ success: true, data: stats });
}));

/**
 * GET /admin/cleanup-history
 *
 * Retorna o histórico de operações de cleanup já executadas,
 * ordenado do mais recente para o mais antigo.
 *
 * Query params:
 * - `limit` — máximo de registros (padrão: 50, máximo: 200)
 *
 * Requer autenticação + role 'admin'.
 *
 * Resposta:
 * ```json
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "cleanup_1741658400_abc123",
 *       "executed_by": "admin",
 *       "dry_run": 0,
 *       "deleted_count": 3,
 *       "skipped_count": 0,
 *       "total_before": 28,
 *       "total_after": 25,
 *       "users_found": 3,
 *       "created_at": "2026-07-12T12:00:00.000Z"
 *     }
 *   ]
 * }
 * ```
 */
adminRouter.get('/cleanup-history', validate(CleanupHistorySchema), asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 50, 1), 200);
  const history = await getCleanupHistory(limit);
  res.json({ success: true, data: history });
}));
