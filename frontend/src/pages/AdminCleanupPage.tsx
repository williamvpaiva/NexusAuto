import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { getAccessToken } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface TestUser {
  email: string;
  name: string;
  created_at: string;
}

interface CleanupResult {
  deleted: number;
  skipped: number;
  totalBefore: number;
  totalAfter: number;
  users: TestUser[];
}

// ---------------------------------------------------------------------------
// AdminCleanupPage
// ---------------------------------------------------------------------------

export function AdminCleanupPage() {
  const toast = useToast();

  const [result, setResult] = useState<CleanupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [mode, setMode] = useState<'idle' | 'dry-run' | 'executed'>('idle');

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const authHeaders = useCallback((): Record<string, string> => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // -----------------------------------------------------------------------
  // Visualizar (dry-run)
  // -----------------------------------------------------------------------

  const handleDryRun = async () => {
    setLoading(true);
    setResult(null);
    setMode('dry-run');

    try {
      const res = await fetch('/api/v1/admin/cleanup-test-users?dry_run=true', {
        headers: { ...authHeaders() },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || 'Falha ao listar usuários de teste');
      }

      const body = await res.json();
      setResult(body.data);
      toast.success('Dry-run concluído', `${body.data.users.length} usuário(s) de teste encontrado(s)`);
    } catch (err: any) {
      toast.error('Erro', err.message || 'Falha ao listar usuários de teste');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // Limpar (executar)
  // -----------------------------------------------------------------------

  const handleExecute = async () => {
    if (!window.confirm('Tem certeza que deseja remover todos os usuários de teste?')) {
      return;
    }

    setExecuting(true);
    setResult(null);
    setMode('executed');

    try {
      const res = await fetch('/api/v1/admin/cleanup-test-users', {
        headers: { ...authHeaders() },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || 'Falha ao limpar usuários de teste');
      }

      const body = await res.json();
      setResult(body.data);
      toast.success('Limpeza concluída', `${body.data.deleted} usuário(s) removido(s)`);
    } catch (err: any) {
      toast.error('Erro', err.message || 'Falha ao limpar usuários de teste');
    } finally {
      setExecuting(false);
    }
  };

  // -----------------------------------------------------------------------
  // Formatação auxiliar
  // -----------------------------------------------------------------------

  function formatDate(raw: string): string {
    try {
      const iso = raw.replace(' ', 'T');
      return new Date(iso.endsWith('Z') ? iso : iso + 'Z').toLocaleString('pt-BR');
    } catch {
      return raw;
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <h1>🧹 Limpeza de Usuários de Teste</h1>
          <p>Gerencie usuários criados durante execuções de testes E2E e mutação</p>
        </div>
        <div className="nav" style={{ gap: '0.75rem' }}>
          <button
            onClick={handleDryRun}
            disabled={loading || executing}
            className="secondary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            {loading ? '🔍 Buscando...' : '🔍 Visualizar'}
          </button>
          <button
            onClick={handleExecute}
            disabled={loading || executing}
            className="danger"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            {executing ? '🧹 Limpando...' : '🧹 Limpar'}
          </button>
        </div>
      </div>

      <div className="content">
        {/* Estado inicial */}
        {mode === 'idle' && !loading && !executing && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#64748b',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Clique em <strong>Visualizar</strong> para listar os usuários de teste
              ou <strong>Limpar</strong> para removê-los do banco.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Padrões reconhecidos: e2e-test-*, mutation-*@test.com, test-*@test.com
            </p>
          </div>
        )}

        {/* Loading */}
        {(loading || executing) && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#64748b',
            }}
          >
            <p style={{ fontSize: '1.1rem' }}>
              {loading ? '🔍 Buscando usuários de teste...' : '🧹 Removendo usuários de teste...'}
            </p>
          </div>
        )}

        {/* Resultados */}
        {result && (
          <>
            {/* Stats */}
            <div
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <StatBox
                label="Total antes"
                value={result.totalBefore}
                color={result.totalBefore > 0 ? '#2563eb' : '#64748b'}
              />
              <StatBox
                label="Removidos"
                value={mode === 'dry-run' ? '-' : result.deleted}
                color={result.deleted > 0 ? '#16a34a' : '#64748b'}
              />
              <StatBox
                label="Pulados (admin)"
                value={result.skipped}
                color={result.skipped > 0 ? '#d97706' : '#64748b'}
              />
              <StatBox
                label="Total depois"
                value={mode === 'dry-run' ? result.totalBefore : result.totalAfter}
                color={result.totalAfter < result.totalBefore ? '#16a34a' : '#64748b'}
              />
            </div>

            {/* Badge de modo */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: mode === 'dry-run' ? '#fef3c7' : '#dcfce7',
                  color: mode === 'dry-run' ? '#92400e' : '#166534',
                }}
              >
                {mode === 'dry-run' ? '🔍 Modo visualização (dry-run) — nada foi deletado' : '✅ Limpeza executada'}
              </span>
            </div>

            {/* Tabela */}
            {result.users.length > 0 ? (
              <div className="card" style={{ overflow: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.9rem',
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.users.map((user, i) => (
                      <tr
                        key={user.email}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                        }}
                      >
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "'Consolas', monospace", fontSize: '0.85rem' }}>
                            {user.email}
                          </span>
                        </td>
                        <td style={tdStyle}>{user.name}</td>
                        <td style={tdStyle}>{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#64748b',
                }}
              >
                <p style={{ fontSize: '1.1rem' }}>✅ Nenhum usuário de teste encontrado.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  color: '#475569',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: '#334155',
};

function StatBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '10px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
}
