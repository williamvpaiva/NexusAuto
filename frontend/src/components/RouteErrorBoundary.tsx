import { Component, ErrorInfo, ReactNode } from 'react';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeName?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  public state: RouteErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[RouteErrorBoundary:${this.props.routeName || 'unknown'}]`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            textAlign: 'center',
            minHeight: '300px'
          }}
          role="alert"
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#dc2626', margin: '0 0 0.5rem' }}>
            Erro nesta seção
          </h2>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem', maxWidth: '400px' }}>
            Algo deu errado ao carregar esta página. Tente novamente ou volte para o início.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '100%', overflow: 'auto' }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.6rem 1.25rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tentar novamente
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.6rem 1.25rem',
                backgroundColor: '#e2e8f0',
                color: '#0f172a',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
