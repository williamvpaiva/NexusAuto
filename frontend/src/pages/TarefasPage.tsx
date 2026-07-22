import React, { useState } from 'react';
import { TarefasList } from '../../components/Tarefas/TarefasList';
import { TarefaForm } from '../../components/Tarefas/TarefaForm';
import { useTarefas, useCreateTarefa, useUpdateTarefa, useDeleteTarefa } from '../../hooks/useTarefas';
import { Tarefa } from '../../lib/api';

export function TarefasPage() {
  const { data: tarefas = [], isLoading } = useTarefas();
  const createMutation = useCreateTarefa();
  const updateMutation = useUpdateTarefa();
  const deleteMutation = useDeleteTarefa();

  const [isEditing, setIsEditing] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);

  // Handlers para o Form
  const handleSave = (tarefa: Tarefa) => {
    if (editingTarefa) {
      updateMutation.mutate(tarefa, {
        onSuccess: () => {
          setIsEditing(false);
          setEditingTarefa(null);
        }
      });
    } else {
      createMutation.mutate({
        title: tarefa.title,
        description: tarefa.description,
        completed: tarefa.completed
      }, {
        onSuccess: () => {
          setIsEditing(false);
          setEditingTarefa(null);
        }
      });
    }
  };

  const handleEdit = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Gerenciamento de Tarefas</h1>
        <button
          onClick={() => {
            setEditingTarefa(null);
            setIsEditing(true);
          }}
          disabled={createMutation.isPending || updateMutation.isPending}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            opacity: (createMutation.isPending || updateMutation.isPending) ? 0.7 : 1
          }}
        >
          Nova Tarefa
        </button>
      </header>

      {isEditing ? (
        <TarefaForm 
          initialData={editingTarefa} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <TarefasList 
          tarefas={tarefas} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}
