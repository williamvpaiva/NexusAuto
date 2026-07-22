import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../schemas/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provedor de Autenticação
 * 
 * Gerencia estado de autenticação, tokens e sessão do usuário.
 * 
 * Uso:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega dados da sessão ao iniciar
   */
  const loadSession = async () => {
    try {
      // Tenta carregar do localStorage (ou sessionStorage)
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('[Auth] Erro ao carregar sessão:', error);
      // Limpa dados corrompidos
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza login
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Erro ao fazer login' } }));
        throw new Error(error.error?.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Valida resposta
      if (!data.success || !data.data?.user || !data.data?.token) {
        throw new Error('Resposta inválida do servidor');
      }

      const { user: userData, token: tokenData } = data.data;

      // Armazena em localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenData.accessToken);

      setUser(userData);
      setToken(tokenData.accessToken);
    } catch (error) {
      logout(); // Limpa sessão em caso de erro
      throw error;
    }
  };

  /**
   * Realiza registro
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Erro ao registrar' } }));
        throw new Error(error.error?.message || 'Erro ao registrar');
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.user || !data.data?.token) {
        throw new Error('Resposta inválida do servidor');
      }

      const { user: userData, token: tokenData } = data.data;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenData.accessToken);

      setUser(userData);
      setToken(tokenData.accessToken);
    } catch (error) {
      logout();
      throw error;
    }
  };

  /**
   * Realiza logout
   */
  const logout = () => {
    // Limpa localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Limpa estado
    setUser(null);
    setToken(null);

    // Opcional: notificar backend
    fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).catch(() => {}); // Ignora erro se offline
  };

  /**
   * Atualiza dados do usuário
   */
  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;

    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  useEffect(() => {
    // Deixa o React processar o estado inicial antes de carregar a sessão
    const timer = setTimeout(() => {
      loadSession();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar contexto de autenticação
 * 
 * Uso:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

/**
 * Hook auxiliar para verificar se está autenticado
 */
export function useIsAuthenticated() {
  const auth = useAuth();
  return auth.isAuthenticated && !auth.isLoading;
}

/**
 * Hook auxiliar para obter usuário atual
 */
export function useCurrentUser() {
  const auth = useAuth();
  return auth.user;
}

/**
 * Obtém o token de acesso do localStorage.
 * Útil para chamadas imperativas fora do contexto React.
 */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}
