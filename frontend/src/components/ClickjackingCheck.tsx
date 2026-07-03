import { useEffect, useState } from 'react';

interface ClickjackingCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente de Verificação de Clickjacking
 * 
 * Detecta se a aplicação está sendo executada dentro de um iframe
 * e bloqueia a renderização se estiver.
 * 
 * Uso:
 * <ClickjackingCheck>
 *   <App />
 * </ClickjackingCheck>
 */
export function ClickjackingCheck({ children, fallback }: ClickjackingCheckProps) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Verifica se está dentro de um iframe
    const checkEmbedded = () => {
      try {
        // Se window.self !== window.top, está em iframe
        const embedded = window.self !== window.top;
        setIsEmbedded(embedded);

        if (embedded) {
          console.warn('[Security] Aplicação detectada dentro de iframe - Possível clickjacking!');
          
          // Tenta quebrar o frame (nem sempre funciona devido a X-Frame-Options)
          if (window.top) {
            window.top.location.assign(window.location.href);
          }
        }

        setIsChecked(true);
      } catch (error) {
        // Erro ao acessar window.top indica que está em iframe de domínio diferente
        console.warn('[Security] Erro ao verificar iframe - Provável cross-origin frame');
        setIsEmbedded(true);
        setIsChecked(true);
      }
    };

    checkEmbedded();

    // Verificação periódica (a cada 5 segundos)
    const interval = setInterval(checkEmbedded, 5000);

    return () => clearInterval(interval);
  }, []);

  // Enquanto não verificou, não renderiza nada
  if (!isChecked) {
    return null;
  }

  // Se está em iframe, mostra fallback ou bloqueia
  if (isEmbedded) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Fallback padrão
    return (
      <div style={{
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
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫 Acesso Bloqueado</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Esta aplicação não pode ser executada dentro de um iframe.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>
          Isso é uma medida de proteção contra ataques de clickjacking.
        </p>
        <a
          href={window.location.href}
          target="_top"
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Abrir em Nova Janela
        </a>
      </div>
    );
  }

  // Se não está em iframe, renderiza normalmente
  return <>{children}</>;
}

/**
 * Hook para verificação de clickjacking
 * 
 * Retorna o estado de verificação e função de verificação manual
 */
export function useClickjackingCheck() {
  const [isEmbedded, setIsEmbedded] = useState(false);

  const checkEmbedded = () => {
    try {
      const embedded = window.self !== window.top;
      setIsEmbedded(embedded);
      
      if (embedded && window.top) {
        window.top.location.assign(window.location.href);
      }
      
      return embedded;
    } catch {
      setIsEmbedded(true);
      return true;
    }
  };

  return { isEmbedded, checkEmbedded };
}