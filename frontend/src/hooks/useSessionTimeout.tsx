import { useState, useEffect, useCallback } from 'react';

/**
 * Hook de Timeout de Sessão Automático
 * 
 * Implementa logout automático após período de inatividade
 * para prevenir acesso não autorizado em estações compartilhadas.
 * 
 * Uso:
 * useSessionTimeout({
 *   timeoutMs: 15 * 60 * 1000, // 15 minutos
 *   warningMs: 2 * 60 * 1000,  // 2 minutos antes
 *   onTimeout: () => logout(),
 *   onWarning: () => showWarning()
 * });
 */

interface UseSessionTimeoutOptions {
  /** Tempo total antes do timeout (ms) */
  timeoutMs: number;
  /** Tempo para mostrar warning antes do timeout (ms) */
  warningMs: number;
  /** Callback quando timeout ocorre */
  onTimeout: () => void;
  /** Callback quando warning é disparado */
  onWarning?: () => void;
  /** Callback quando usuário interage (reset do timer) */
  onActivity?: () => void;
  /** Eventos que resetam o timer (padrão: mouse, teclado, touch) */
  events?: string[];
  /** Desabilitar timeout (para desenvolvimento) */
  disabled?: boolean;
}

interface UseSessionTimeoutReturn {
  /** Tempo restante em ms */
  timeRemaining: number;
  /** Se está no período de warning */
  isWarning: boolean;
  /** Se sessão expirou */
  isExpired: boolean;
  /** Reseta o timer manualmente */
  resetTimer: () => void;
  /** Prolonga a sessão */
  extendSession: () => void;
}

export function useSessionTimeout({
  timeoutMs,
  warningMs,
  onTimeout,
  onWarning,
  onActivity,
  events = ['mousedown', 'keydown', 'touchstart', 'mousemove', 'scroll'],
  disabled = false
}: UseSessionTimeoutOptions): UseSessionTimeoutReturn {
  const [timeRemaining, setTimeRemaining] = useState(timeoutMs);
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  /**
   * Reseta o timer baseado na última atividade
   */
  const resetTimer = useCallback(() => {
    if (disabled) return;
    
    setTimeRemaining(timeoutMs);
    setIsWarning(false);
    setIsExpired(false);
    
    if (onActivity) {
      onActivity();
    }
  }, [disabled, timeoutMs, onActivity]);

  /**
   * Prolonga a sessão (chama após usuário confirmar que está presente)
   */
  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  /**
   * Efeito principal - gerencia countdown do timer
   */
  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1000; // Decrementa 1 segundo

        // Chegou no warning
        if (next <= warningMs && next > 0 && !isWarning) {
          setIsWarning(true);
          if (onWarning) {
            onWarning();
          }
        }

        // Timeout ocorreu
        if (next <= 0) {
          setIsExpired(true);
          setIsWarning(false);
          onTimeout();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled, warningMs, isWarning, onWarning, onTimeout]);

  /**
   * Setup dos listeners de atividade do usuário
   */
  useEffect(() => {
    if (disabled) return;

    const handleActivity = () => {
      resetTimer();
    };

    // Adiciona listeners para todos os eventos
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [disabled, events, resetTimer]);

  /**
   * Converte tempo restante para formato legível
   */
  /* eslint-disable */ const getFormattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

return {
    timeRemaining,
    isWarning,
    isExpired,
    resetTimer,
    extendSession
  };
}

/**
 * Componente de Warning Modal para Timeout
 * 
 * Exibe modal quando sessão está prestes a expirar
 * 
 * Uso:
 * <SessionTimeoutWarning
 *   show={isWarning}
 *   timeRemaining={getFormattedTime()}
 *   onExtend={extendSession}
 *   onLogout={handleLogout}
 * />
 */
interface SessionTimeoutWarningProps {
  show: boolean;
  timeRemaining: string;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutWarning({
  show,
  timeRemaining,
  onExtend,
  onLogout
}: SessionTimeoutWarningProps) {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <h2
          id="session-warning-title"
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#dc2626'
          }}
        >
          ⏰ Sessão Expirando
        </h2>

        <p
          id="session-warning-desc"
          style={{
            fontSize: '1rem',
            color: '#475569',
            marginBottom: '1.5rem'
          }}
        >
          Sua sessão será encerrada em <strong>{timeRemaining}</strong> por inatividade.
        </p>

        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
          Clique em "Continuar" para prolongar sua sessão.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onLogout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e2e8f0',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>

          <button
            onClick={onExtend}
            autoFocus
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
