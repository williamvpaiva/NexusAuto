import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '../context/ToastContext';
import { ForgotPasswordSchema } from '../schemas/auth';
import { AuthLayout } from '../components/AuthLayout';

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

/**
 * Página de Esqueci Minha Senha
 * 
 * Formulário que recebe o email e envia solicitação de reset.
 * SEMPRE retorna sucesso (mesmo que o email não exista) para
 * evitar enumeração de usuários.
 */
export function ForgotPasswordPage() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema as any),
    mode: 'onChange'
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const body = await res.json();

      if (!res.ok) {
        const message = body?.error?.message || 'Erro ao solicitar redefinição de senha';
        setError(message);
        toast.error('Falha na solicitação', message);
        return;
      }

      setSent(true);
      toast.success('Email enviado!', body?.message || 'Verifique sua caixa de entrada.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro de conexão. Tente novamente.';
      setError(message);
      toast.error('Erro de rede', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Estado de sucesso - instruções enviadas
  if (sent) {
    return (
      <AuthLayout title="Email enviado!" centerText>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
            <path d="M8 12L11 15L16 9" />
          </svg>
        </div>

        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Se o email estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
          Lembre-se de verificar a caixa de spam.
        </p>
        <Link
          to="/login"
          style={{
            color: '#2563eb',
            fontWeight: '600',
            fontSize: '0.95rem',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Voltar para o login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Esqueceu a senha?" subtitle="Digite seu email e enviaremos as instruções para redefinir sua senha.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
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
                Enviando...
              </span>
            ) : (
              'Enviar instruções'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
          Lembrou a senha?{' '}
          <Link
            to="/login"
            style={{
              color: '#2563eb',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Fazer login
          </Link>
        </p>
    </AuthLayout>
  );
}
