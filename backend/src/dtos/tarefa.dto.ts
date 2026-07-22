import { z } from 'zod';

export const createTarefaDto = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório'),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
});

export const updateTarefaDto = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório').optional(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
});

export interface TarefaResponse {
  id: string;
  title: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function toTarefaResponse(tarefa: any): TarefaResponse {
  return {
    id: tarefa.id,
    title: tarefa.title,
    status: tarefa.status,
    createdAt: tarefa.createdAt,
    updatedAt: tarefa.updatedAt,
  };
}

export function toTarefaListResponse(tarefas: any[]): TarefaResponse[] {
  return tarefas.map(toTarefaResponse);
}
