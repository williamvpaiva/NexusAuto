import React, { useState, useEffect } from 'react';
import { Tarefa } from '../../pages/TarefasPage';

interface TarefaFormProps {
  initialData?: Tarefa | null;
  onSave: (tarefa: Tarefa) => void;
  onCancel: () => void;
}

export function TarefaForm({ initialData, onSave, onCancel }: TarefaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCompleted(initialData.completed);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }
    setError('');
    onSave({
      id: initialData?.id || '',
      title,
      description,
      completed
    });
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginTop: 0 }}>{initialData ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h2>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title" style={{ fontWeight: '600' }}>Título</label>
          <input 
            id="title"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Digite o título da tarefa"
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontWeight: '600' }}>Descrição</label>
          <textarea 
            id="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Digite os detalhes da tarefa"
            rows={4}
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            id="completed"
            type="checkbox" 
            checked={completed} 
            onChange={(e) => setCompleted(e.target.checked)} 
            style={{ width: '1.25rem', height: '1.25rem' }}
          />
          <label htmlFor="completed" style={{ fontWeight: '600' }}>Marcar como concluída</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
