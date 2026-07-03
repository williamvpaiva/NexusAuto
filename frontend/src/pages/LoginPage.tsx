import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoginSchema } from '../schemas/auth';

type LoginFormData = z.infer<typeof LoginSchema>;

/**
 * Página de Login
 * 
 * Formulário de autenticação com validação Zod + React Hook Form
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React Hook Form com validação Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema as any),
    mode: 'onChange' // Valida enquanto digita
  });

  // Origem para redirect após login
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!', 'Bem-vindo de volta.');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      toast.error('Falha no login', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f7fb',
        padding: '1rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Bem-vindo de volta
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#334155'
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              {...register('email')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: errors.email ? '1px solid #dc2626' : '1px solid #cbd5e1',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errors.email ? '#dc2626' : '#2563eb';
                e.currentTarget.style.boxShadow = errors.email 
                  ? '0 0 0 3px rgba(220, 38, 38, 0.1)' 
                  : '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.email ? '#dc2626' : '#cbd5e1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }} role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#334155'
              }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: errors.password ? '1px solid #dc2626' : '1px solid #cbd5e1',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errors.password ? '#dc2626' : '#2563eb';
                e.currentTarget.style.boxShadow = errors.password 
                  ? '0 0 0 3px rgba(220, 38, 38, 0.1)' 
                  : '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.password ? '#dc2626' : '#cbd5e1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }} role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
            <Link
              to="/forgot-password"
              style={{
                color: '#2563eb',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isValid || !isDirty}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading || !isValid || !isDirty ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading && isValid && isDirty) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && isValid && isDirty) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
          Não tem uma conta?{' '}
          <Link
            to="/register"
            style={{
              color: '#2563eb',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Cadastre-se
          </Link>
        </p>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
