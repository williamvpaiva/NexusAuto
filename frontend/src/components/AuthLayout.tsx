import type { ReactNode } from 'react';

/**
 * Props do AuthLayout
 */
interface AuthLayoutProps {
  /** Título principal do card */
  title: string;
  /** Subtítulo abaixo do título */
  subtitle?: string;
  /** Largura máxima do card (default: 420px) */
  maxWidth?: number | string;
  /** Se true, centraliza o texto do conteúdo (usado em estados de sucesso/erro) */
  centerText?: boolean;
  /** Conteúdo do card */
  children: ReactNode;
}

/**
 * Layout compartilhado para páginas de autenticação.
 *
 * Fornece o container centralizado, card branco com sombra,
 * header (título + subtítulo), e animação de spin.
 */
export function AuthLayout({
  title,
  subtitle,
  maxWidth = 420,
  centerText = false,
  children,
}: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f7fb',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
          textAlign: centerText ? 'center' : 'left',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.5rem',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{subtitle}</p>
          )}
        </div>

        {/* Conteúdo */}
        {children}
      </div>

      {/* Spin animation global para spinners nos botões */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
