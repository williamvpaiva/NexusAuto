import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RegisterSchema } from '../schemas/auth';

type RegisterFormData = z.infer<typeof RegisterSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerAuth(data.name, data.email, data.password);
      toast.success('Conta criada com sucesso!', 'Bem-vindo ao NexusAuto.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(message);
      toast.error('Falha no cadastro', message);
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
          maxWidth: '480px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)'
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Crie sua conta
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Junte-se à NexusAuto
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Nome */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="name" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              {...register('name')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: errors.name ? '1px solid #dc2626' : '1px solid #cbd5e1',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.name && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }}>{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
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
                outline: 'none'
              }}
            />
            {errors.email && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: errors.password ? '1px solid #dc2626' : '1px solid #cbd5e1',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.password && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
              Confirme a Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: errors.confirmPassword ? '1px solid #dc2626' : '1px solid #cbd5e1',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }}>{errors.confirmPassword.message}</p>}
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: '500', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

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
              opacity: isLoading || !isValid || !isDirty ? 0.6 : 1
            }}
          >
            {isLoading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
          Já tem uma conta?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
