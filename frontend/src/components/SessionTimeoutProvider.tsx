import { useEffect, useState } from 'react';
import { useSessionTimeout, SessionTimeoutWarning } from '../hooks/useSessionTimeout';

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos
const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutos

export function SessionTimeoutProvider({ children, onLogout }: SessionTimeoutProviderProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleTimeout = () => {
    console.log('[Session Timeout] Sessão expirada por inatividade');
    onLogout();
  };

  const handleWarning = () => {
    console.log('[Session Timeout] Warning disparado');
    setShowWarning(true);
  };

  const handleExtend = () => {
    setShowWarning(false);
  };

  const {
    timeRemaining,
    isWarning,
    extendSession
  } = useSessionTimeout({
    timeoutMs: SESSION_TIMEOUT_MS,
    warningMs: WARNING_BEFORE_TIMEOUT_MS,
    onTimeout: handleTimeout,
    onWarning: handleWarning
  });

  // Auto-logout quando warning expira
  useEffect(() => {
    if (isWarning) {
      const timer = setTimeout(() => {
        handleTimeout();
      }, WARNING_BEFORE_TIMEOUT_MS);
      
      return () => clearTimeout(timer);
    }
  }, [isWarning]);

  // Converte ms para minutos
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <>
      {children}
      <SessionTimeoutWarning
        show={showWarning}
        timeRemaining={`${minutes}:${seconds.toString().padStart(2, '0')}`}
        onExtend={() => {
          extendSession();
          handleExtend();
        }}
        onLogout={onLogout}
      />
    </>
  );
}