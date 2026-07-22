import { Router } from 'express';
import { tarefasController } from '../controllers/tarefas.controller';
import { validate } from '../middleware/validate.middleware';
import { createTarefaDto, updateTarefaDto } from '../dtos/tarefa.dto';

export const tarefasRouter = Router();

// Rota para listar tarefas e criar novas
tarefasRouter.get('/', tarefasController.list);
tarefasRouter.post('/', validate({ body: createTarefaDto }), tarefasController.create);

// Rota para manipular tarefa específica
tarefasRouter.get('/:id', tarefasController.getById);
tarefasRouter.put('/:id', validate({ body: updateTarefaDto }), tarefasController.update);
tarefasRouter.delete('/:id', tarefasController.delete);
