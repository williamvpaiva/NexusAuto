import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { toTarefaResponse, toTarefaListResponse } from '../dtos/tarefa.dto';

export const tarefasController = {
  // Criar uma nova tarefa
  async create(req: Request, res: Response) {
    try {
      const { title, status } = req.body;

      const tarefa = await prisma.tarefa.create({
        data: {
          title,
          status: status || 'PENDENTE',
        },
      });

      return res.status(201).json({ success: true, data: toTarefaResponse(tarefa) });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Listar todas as tarefas
  async list(req: Request, res: Response) {
    try {
      const tarefas = await prisma.tarefa.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, data: toTarefaListResponse(tarefas) });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Obter tarefa por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tarefa = await prisma.tarefa.findUnique({ where: { id } });

      if (!tarefa) {
        return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
      }

      return res.status(200).json({ success: true, data: toTarefaResponse(tarefa) });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Atualizar tarefa
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, status } = req.body;

      const tarefa = await prisma.tarefa.update({
        where: { id },
        data: { title, status },
      });

      return res.status(200).json({ success: true, data: toTarefaResponse(tarefa) });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
      }
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Excluir tarefa
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.tarefa.delete({ where: { id } });

      return res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: 'Tarefa não encontrada.' });
      }
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};
