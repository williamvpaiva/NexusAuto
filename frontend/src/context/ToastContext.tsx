import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Sistema de Notificações Toast
 * 
 * Notificações flutuantes para feedback de ações do usuário.
 * Suporta tipos: success, error, warning, info.
 * 
 * Uso:
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * 
 * const toast = useToast();
 * toast.success('Operação realizada!');
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms, 0 = não fecha automático
}

interface ToastContextType {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => string;
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  warning: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  /** Duração padrão em ms */
  defaultDuration?: number;
  /** Posição dos toasts */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Máximo de toasts visíveis */
  maxToasts?: number;
}

/**
 * Provedor de Toasts
 */
export function ToastProvider({
  children,
  defaultDuration = 5000,
  position = 'top-right',
  maxToasts = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Adiciona um novo toast
   */
  const show = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: defaultDuration,
      ...toast
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Remove mais antigos se exceder máximo
      if (updated.length > maxToasts) {
        return updated.slice(updated.length - maxToasts);
      }
      return updated;
    });

    // Auto-dismiss se duration > 0
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, [defaultDuration, maxToasts]);

  /**
   * Helpers para tipos específicos
   */
  const success = useCallback((message: string, description?: string) => {
    return show({ type: 'success', message, description });
  }, [show]);

  const error = useCallback((message: string, description?: string) => {
    return show({ type: 'error', message, description });
  }, [show]);

  const warning = useCallback((message: string, description?: string) => {
    return show({ type: 'warning', message, description });
  }, [show]);

  const info = useCallback((message: string, description?: string) => {
    return show({ type: 'info', message, description });
  }, [show]);

  /**
   * Remove toast específico
   */
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Remove todos os toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll
  };

  // Posicionamento
  const positionClasses = {
    'top-right': { top: '1rem', right: '1rem', left: 'auto', bottom: 'auto' },
    'top-left': { top: '1rem', left: '1rem', right: 'auto', bottom: 'auto' },
    'bottom-right': { bottom: '1rem', right: '1rem', top: 'auto', left: 'auto' },
    'bottom-left': { bottom: '1rem', left: '1rem', top: 'auto', right: 'auto' },
    'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)', right: 'auto', bottom: 'auto' },
    'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)', top: 'auto', right: 'auto' }
  };

  const currentPos = positionClasses[position];

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Container de Toasts */}
      <div
        style={{
          position: 'fixed',
          ...currentPos,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100% - 2rem)',
          pointerEvents: 'none' // Permite clicar através do container
        }}
        role="region"
        aria-label="Notificações"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Item individual de Toast
 */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const colors = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✅' },
    error: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', icon: '❌' },
    warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '⚠️' },
    info: { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', icon: 'ℹ️' }
  };

  const color = colors[toast.type];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        pointerEvents: 'auto', // Permite clicar no toast
        animation: 'slideIn 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={onDismiss}
      role="alert"
      aria-live="assertive"
    >
      {/* Ícone */}
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{color.icon}</span>

      {/* Conteúdo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: '600', fontSize: '0.95rem', color: color.text, margin: 0 }}>
          {toast.message}
        </p>
        {toast.description && (
          <p style={{ fontSize: '0.85rem', color: color.text, opacity: 0.9, margin: '0.25rem 0 0', lineHeight: 1.4 }}>
            {toast.description}
          </p>
        )}
      </div>

      {/* Botão de fechar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
          transition: 'opacity 0.2s',
          fontSize: '1.25rem',
          lineHeight: 1,
          color: color.text
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Hook para usar toasts
 * 
 * Uso:
 * const toast = useToast();
 * toast.success('Sucesso!');
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  
  return context;
}

// Animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);