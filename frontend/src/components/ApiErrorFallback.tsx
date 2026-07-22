import type { ReactNode } from 'react';

interface ApiErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ApiErrorFallback({ message, onRetry, children }: ApiErrorFallbackProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ fontSize: '3rem', lineHeight: 1 }}>⚠</div>
      <p style={{ color: '#64748b', maxWidth: 400, margin: 0, fontSize: '0.95rem' }}>
        {message || 'Serviço temporariamente indisponível'}
      </p>
      {children}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
