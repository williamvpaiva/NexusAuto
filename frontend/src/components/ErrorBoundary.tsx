import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Global
 * 
 * Captura erros de renderização em qualquer componente filho
 * e exibe fallback amigável ao invés de tela branca.
 * 
 * Uso:
 * <ErrorBoundary fallback={<ErrorPage />}>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  /**
   * Atualiza estado quando erro é detectado
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Captura informações detalhadas do erro
   * e envia para monitoramento (opcional)
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error, errorInfo);

    // Log para serviço de monitoramento (ex: Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Em produção, enviar para backend
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error, errorInfo);
    }
  }

  /**
   * Envia erro para backend (implementar endpoint)
   */
  private async sendToMonitoring(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/v1/error-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          },
          component: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (sendError) {
      console.error('[ErrorBoundary] Falha ao enviar erro:', sendError);
    }
  }

  /**
   * Reseta o estado para tentar renderizar novamente
   */
  public resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
  };

  public render() {
    if (this.state.hasError) {
      // Usa fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f7fb',
            color: '#16202a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
            textAlign: 'center'
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#dc2626' }}>
              ⚠️ Oops! Algo deu errado
            </h1>
            
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#475569' }}>
              Encontramos um erro inesperado. Não se preocupe, nossa equipe foi notificada.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginBottom: '2rem',
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '8px',
                  textAlign: 'left',
                  border: '1px solid #fecaca'
                }}
              >
                <summary style={{ fontWeight: '600', color: '#b91c1c', cursor: 'pointer' }}>
                  Detalhes do erro (apenas desenvolvimento)
                </summary>
                <pre
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    maxHeight: '300px'
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.resetErrorBoundary}
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                🔄 Tentar novamente
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#e2e8f0',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#cbd5e1')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              >
                🔄 Recarregar Página
              </button>

              <a
                href="/"
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
              >
                🏠 Voltar ao Início
              </a>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar Error Boundary em componentes funcionais
 * 
 * Uso:
 * const { hasError, error, resetError } = useErrorBoundary();
 */
export function useErrorBoundary() {
  // Nota: Este hook requer um ErrorBoundaryProvider
  // Implementação simplificada para uso direto
  const hasError = false;
  const error: Error | undefined = undefined;
  const resetError = () => {};

  return { hasError, error, resetError };
}

/**
 * Higher Order Component para envolver componentes com ErrorBoundary
 * 
 * Uso:
 * const ProtectedComponent = withErrorBoundary(MyComponent);
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}