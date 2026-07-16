import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '../context/ToastContext';
import { ResetPasswordSchema } from '../schemas/auth';
import { AuthLayout } from '../components/AuthLayout';

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

/**
 * Página de Redefinição de Senha
 * 
 * Recebe o token da URL (?token=xxx) e permite ao usuário
 * definir uma nova senha forte.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const tokenFromUrl = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(!!tokenFromUrl);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Redireciona para o login após 3 segundos no estado de sucesso
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (success) {
      redirectTimer.current = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, [success, navigate]);

  // Valida o token na montagem (sem consumi-lo)
  useEffect(() => {
    if (!tokenFromUrl) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/v1/auth/forgot-password/validate/${encodeURIComponent(tokenFromUrl)}`);
        const body = await res.json();
        if (!cancelled) {
          setTokenValid(body?.data?.valid === true);
          setValidating(false);
        }
      } catch {
        if (!cancelled) {
          setTokenValid(false);
          setValidating(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [tokenFromUrl]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema as any),
    mode: 'onChange',
    defaultValues: {
      token: tokenFromUrl,
      password: '',
      confirmPassword: '',
    }
  });

  const passwordValue = watch('password');

  // Requisitos de senha para feedback visual
  const passwordChecks = [
    { label: 'Mínimo 8 caracteres', pass: (passwordValue?.length || 0) >= 8 },
    { label: 'Uma letra maiúscula', pass: /[A-Z]/.test(passwordValue || '') },
    { label: 'Uma letra minúscula', pass: /[a-z]/.test(passwordValue || '') },
    { label: 'Um número', pass: /[0-9]/.test(passwordValue || '') },
    { label: 'Um caractere especial', pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue || '') },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        const message = body?.error?.message || 'Erro ao redefinir senha';
        setError(message);
        toast.error('Falha na redefinição', message);
        return;
      }

      setSuccess(true);
      toast.success('Senha redefinida!', 'Sua senha foi alterada com sucesso.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro de conexão. Tente novamente.';
      setError(message);
      toast.error('Erro de rede', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validação do token em andamento
  if (validating) {
    return (
      <AuthLayout title="Verificando link..." centerText>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <span
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              display: 'block'
            }}
          />
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Aguarde um momento enquanto validamos seu link de redefinição.
        </p>
      </AuthLayout>
    );
  }

  // Token ausente na URL ou inválido
  if (!tokenFromUrl || tokenValid === false) {
    return (
      <AuthLayout title="Link inválido" centerText>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 8V12" />
            <path d="M12 16H12.01" />
            </svg>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          O link de redefinição de senha está ausente, expirou ou já foi utilizado.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Solicite um novo link na página de recuperação de senha.
        </p>
        <Link
          to="/forgot-password"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Solicitar novo link
        </Link>
      </AuthLayout>
    );
  }

  // Estado de sucesso
  if (success) {
    return (
      <AuthLayout title="Senha redefinida!" centerText>
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
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Sua senha foi alterada com sucesso. Redirecionando para o login...
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
          Ir para o login
        </Link>
      </AuthLayout>
    );
  }

  // Token válido — exibe formulário
  return (
    <AuthLayout title="Redefinir senha" subtitle="Escolha uma senha forte para sua conta.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Token (hidden) */}
          <input type="hidden" {...register('token')} />

          {/* Nova Senha */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#334155'
              }}
            >
              Nova senha
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

          {/* Password Strength Checklist */}
          {passwordValue && passwordValue.length > 0 && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}
            >
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.375rem',
                    fontSize: '0.85rem',
                    color: check.pass ? '#16a34a' : '#94a3b8',
                    transition: 'color 0.2s'
                  }}
                >
                  {check.pass ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                  {check.label}
                </div>
              ))}
            </div>
          )}

          {/* Confirmar Senha */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#334155'
              }}
            >
              Confirmar senha
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
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errors.confirmPassword ? '#dc2626' : '#2563eb';
                e.currentTarget.style.boxShadow = errors.confirmPassword
                  ? '0 0 0 3px rgba(220, 38, 38, 0.1)'
                  : '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.confirmPassword ? '#dc2626' : '#cbd5e1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.375rem' }} role="alert">
                {errors.confirmPassword.message}
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
                Redefinindo...
              </span>
            ) : (
              'Redefinir senha'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
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
            Voltar para o login
          </Link>
        </p>
    </AuthLayout>
  );
}
