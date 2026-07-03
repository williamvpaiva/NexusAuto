import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

/**
 * Route Guard para Rotas Protegidas
 * 
 * Redireciona para /login se não autenticado.
 * Opcionalmente verifica papel do usuário (admin, user, etc).
 * 
 * Uso:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Enquanto carrega, não renderiza nada (ou mostra loading)
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f4f7fb'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    // Salva localização atual para redirect após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se requer papel específico e usuário não tem
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuário autenticado e autorizado
  return <>{children}</>;
}

/**
 * Route Guard para Rotas Públicas (login, registro)
 * 
 * Redireciona para /dashboard se já autenticado.
 * 
 * Uso:
 * <Route
 *   path="/login"
 *   element={
 *     <PublicRoute>
 *       <LoginPage />
 *     </PublicRoute>
 *   }
 * />
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <p style={{ color: '#64748b' }}>Carregando...</p>
      </div>
    );
  }

  // Se já autenticado, redireciona para dashboard ou origem
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

/**
 * Route Guard para Rotas Admin
 * 
 * Requer papel de administrador.
 * 
 * Uso:
 * <Route
 *   path="/admin"
 *   element={
 *     <AdminRoute>
 *       <AdminDashboard />
 *     </AdminRoute>
 *   }
 * />
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}