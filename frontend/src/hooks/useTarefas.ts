import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTarefas, createTarefa, updateTarefa, deleteTarefa, Tarefa } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function useTarefas() {
  const { showToast } = useToast();
  
  return useQuery({
    queryKey: ['tarefas'],
    queryFn: async () => {
      try {
        return await listTarefas();
      } catch (error: any) {
        showToast('Erro ao carregar tarefas: ' + (error.message || 'Erro desconhecido'), 'error');
        throw error;
      }
    }
  });
}

export function useCreateTarefa() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Tarefa, 'id'>) => createTarefa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      showToast('Tarefa criada com sucesso!', 'success');
    },
    onError: (error: any) => {
      showToast('Erro ao criar tarefa: ' + (error.message || 'Erro desconhecido'), 'error');
    }
  });
}

export function useUpdateTarefa() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }: Tarefa) => updateTarefa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      showToast('Tarefa atualizada com sucesso!', 'success');
    },
    onError: (error: any) => {
      showToast('Erro ao atualizar tarefa: ' + (error.message || 'Erro desconhecido'), 'error');
    }
  });
}

export function useDeleteTarefa() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteTarefa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      showToast('Tarefa excluída com sucesso!', 'success');
    },
    onError: (error: any) => {
      showToast('Erro ao excluir tarefa: ' + (error.message || 'Erro desconhecido'), 'error');
    }
  });
}
