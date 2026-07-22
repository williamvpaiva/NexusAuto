import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClickjackingCheck } from './components/ClickjackingCheck';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SessionTimeoutProvider } from './components/SessionTimeoutProvider';
import { useCsrfProtection } from './hooks/useCsrfProtection';
import App from './App';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Root component com CSRF protection
 */
function AppRoot() {
  // Inicia proteção CSRF
  useCsrfProtection();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ClickjackingCheck>
          <AuthProvider>
            <ToastProvider position="top-right" defaultDuration={5000} maxToasts={5}>
              <SessionTimeoutProvider onLogout={() => {
                console.log('[Session Timeout] Logout forçado por inatividade');
                localStorage.clear();
                window.location.reload();
              }}>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </SessionTimeoutProvider>
            </ToastProvider>
          </AuthProvider>
        </ClickjackingCheck>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);