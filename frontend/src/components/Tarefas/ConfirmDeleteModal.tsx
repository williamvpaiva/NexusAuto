import React from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '2rem', 
        borderRadius: '8px', 
        maxWidth: '400px', 
        width: '100%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#0f172a' }}>Confirmar Exclusão</h3>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Tem certeza de que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            onClick={onCancel}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
