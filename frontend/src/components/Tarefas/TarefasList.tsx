import React, { useState } from 'react';
import { Tarefa } from '../../pages/TarefasPage';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface TarefasListProps {
  tarefas: Tarefa[];
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function TarefasList({ tarefas, onEdit, onDelete, isLoading }: TarefasListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando tarefas...</div>;
  }

  if (tarefas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <p style={{ color: '#64748b' }}>Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tarefas.map((tarefa) => (
        <div key={tarefa.id} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: tarefa.completed ? '#10b981' : '#f59e0b' 
              }}></span>
              {tarefa.title}
            </h3>
            <p style={{ margin: 0, color: '#64748b' }}>{tarefa.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => onEdit(tarefa)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Editar
            </button>
            <button 
              onClick={() => setDeleteId(tarefa.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                border: '1px solid #fca5a5',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}

      {deleteId && (
        <ConfirmDeleteModal 
          onConfirm={() => {
            onDelete(deleteId);
            setDeleteId(null);
          }} 
          onCancel={() => setDeleteId(null)} 
        />
      )}
    </div>
  );
}
