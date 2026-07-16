import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useToast } from '../context/ToastContext';
import { getAccessToken } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface AdminStats {
  database: { totalTables: number; sizeKB: number };
  users: { total: number; admins: number; testUsers: number };
  emailTemplates: { total: number };
  vehicles: { total: number };
  conversations: { total: number };
  messages: { total: number };
  errorLogs: { total: number; open: number; investigating: number; resolved: number; closed: number };
  tokenOptimizations: { total: number; totalTokensSaved: number; totalOriginalTokens: number };
}

interface CleanupLogEntry {
  id: string;
  executed_by: string;
  dry_run: number;
  deleted_count: number;
  skipped_count: number;
  total_before: number;
  total_after: number;
  users_found: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// AdminDashboardPage
// ---------------------------------------------------------------------------

export function AdminDashboardPage() {
  const toast = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cleanupHistory, setCleanupHistory] = useState<CleanupLogEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const authHeaders = useCallback((): Record<string, string> => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // -----------------------------------------------------------------------
  // Load stats
  // -----------------------------------------------------------------------

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/admin/stats', {
        headers: { ...authHeaders() },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || 'Falha ao carregar métricas');
      }

      const body = await res.json();
      setStats(body.data);
    } catch (err: any) {
      const msg = err.message || 'Falha ao carregar métricas';
      setError(msg);
      toast.error('Erro', msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // -----------------------------------------------------------------------
  // Load cleanup history
  // -----------------------------------------------------------------------

  const loadCleanupHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const res = await fetch('/api/v1/admin/cleanup-history?limit=10', {
        headers: { ...authHeaders() },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || 'Falha ao carregar histórico');
      }

      const body = await res.json();
      setCleanupHistory(body.data);
    } catch {
      // Silencia erro do histórico — não bloqueia o painel
      setCleanupHistory([]);
    } finally {
      setHistoryLoading(false);
    }    }, []);

  useEffect(() => {
    loadStats();
    loadCleanupHistory();
  }, [loadStats, loadCleanupHistory]);

  // -----------------------------------------------------------------------
  // Auto-refresh a cada 30s
  // -----------------------------------------------------------------------

  useEffect(() => {
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <h1>📊 Painel Administrativo</h1>
          <p>Métricas do sistema — total de registros por entidade</p>
        </div>
        <div className="nav" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={loadStats}
            disabled={loading}
            className="secondary"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            {loading ? '🔄 Atualizando...' : '🔄 Atualizar'}
          </button>
          <ExportButton
            label="JSON"
            icon="📋"
            onClick={() => exportAsJSON(stats, cleanupHistory)}
            disabled={!stats}
          />
          <ExportButton
            label="CSV"
            icon="📊"
            onClick={() => exportAsCSV(stats, cleanupHistory)}
            disabled={!stats}
          />
        </div>
      </div>

      <div className="content">
        {loading && !stats && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem' }}>Carregando métricas...</p>
          </div>
        )}

        {error && !stats && (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}
          >
            <p style={{ fontSize: '1.1rem' }}>❌ {error}</p>
            <button onClick={loadStats} className="secondary" style={{ marginTop: '1rem' }}>
              Tentar novamente
            </button>
          </div>
        )}

        {stats && (
          <>
            {/* ── Seção: Banco de Dados ─────────────────────────────── */}

            <SectionTitle icon="🗄️" title="Banco de Dados" />
            <div className="stat-grid">
              <MetricCard
                icon="📦"
                label="Tabelas"
                value={stats.database.totalTables}
                color="#6366f1"
              />
              <MetricCard
                icon="💾"
                label="Tamanho"
                value={`${stats.database.sizeKB} KB`}
                color="#8b5cf6"
              />
            </div>

            {/* ── Seção: Usuários ───────────────────────────────────── */}

            <SectionTitle icon="👥" title="Usuários" />
            <div className="stat-grid">
              <MetricCard
                icon="👤"
                label="Total"
                value={stats.users.total}
                color="#2563eb"
              />
              <MetricCard
                icon="🛡️"
                label="Administradores"
                value={stats.users.admins}
                color="#d97706"
              />
              <MetricCard
                icon="🧪"
                label="Usuários de Teste"
                value={stats.users.testUsers}
                color={stats.users.testUsers > 0 ? '#dc2626' : '#64748b'}
              />
            </div>

            {/* ── Seção: Conteúdo ───────────────────────────────────── */}

            <SectionTitle icon="📄" title="Conteúdo" />
            <div className="stat-grid">
              <MetricCard
                icon="📧"
                label="Templates de Email"
                value={stats.emailTemplates.total}
                color="#0891b2"
              />
              <MetricCard
                icon="🚗"
                label="Veículos"
                value={stats.vehicles.total}
                color="#059669"
              />
            </div>

            {/* ── Seção: Conversas e Mensagens ───────────────────────── */}

            <SectionTitle icon="💬" title="Conversas & Mensagens" />
            <div className="stat-grid">
              <MetricCard
                icon="💬"
                label="Conversas"
                value={stats.conversations.total}
                color="#7c3aed"
              />
              <MetricCard
                icon="✉️"
                label="Mensagens"
                value={stats.messages.total}
                color="#0891b2"
              />
            </div>

            {/* ── Seção: Logs de Erro ───────────────────────────────── */}

            <SectionTitle icon="⚠️" title="Logs de Erro" />
            <div className="stat-grid">
              <MetricCard
                icon="📊"
                label="Total"
                value={stats.errorLogs.total}
                color={stats.errorLogs.total > 0 ? '#dc2626' : '#64748b'}
              />
              <MetricCard
                icon="🔴"
                label="Abertos"
                value={stats.errorLogs.open}
                color={stats.errorLogs.open > 0 ? '#dc2626' : '#64748b'}
              />
              <MetricCard
                icon="🔍"
                label="Investigando"
                value={stats.errorLogs.investigating}
                color={stats.errorLogs.investigating > 0 ? '#d97706' : '#64748b'}
              />
              <MetricCard
                icon="✅"
                label="Resolvidos"
                value={stats.errorLogs.resolved}
                color={stats.errorLogs.resolved > 0 ? '#16a34a' : '#64748b'}
              />
              <MetricCard
                icon="🔒"
                label="Fechados"
                value={stats.errorLogs.closed}
                color={stats.errorLogs.closed > 0 ? '#6366f1' : '#64748b'}
              />
            </div>

            {/* ── Seção: Otimizações de Token ───────────────────────── */}

            <SectionTitle icon="⚡" title="Otimizações de Token" />
            <div className="stat-grid">
              <MetricCard
                icon="📐"
                label="Total de Otimizações"
                value={stats.tokenOptimizations.total}
                color="#7c3aed"
              />
              <MetricCard
                icon="📥"
                label="Tokens Originais"
                value={formatNumber(stats.tokenOptimizations.totalOriginalTokens)}
                color="#0891b2"
              />
              <MetricCard
                icon="💚"
                label="Tokens Economizados"
                value={formatNumber(stats.tokenOptimizations.totalTokensSaved)}
                color={stats.tokenOptimizations.totalTokensSaved > 0 ? '#16a34a' : '#64748b'}
              />
            </div>

            {/* ── Seção: Histórico de Cleanups ─────────────────────── */}

            <SectionTitle icon="📋" title="Histórico de Cleanups" />
            {historyLoading ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Carregando histórico...
              </p>
            ) : cleanupHistory.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Nenhuma operação de cleanup registrada ainda.
              </p>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <Th>Data</Th>
                      <Th>Usuários Encontrados</Th>
                      <Th>Removidos</Th>
                      <Th>Pulados</Th>
                      <Th>Antes</Th>
                      <Th>Depois</Th>
                      <Th>Tipo</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleanupHistory.map((entry) => (
                      <tr
                        key={entry.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Td>{formatDate(entry.created_at)}</Td>
                        <Td>{entry.users_found}</Td>
                        <Td>
                          <Badge
                            label={String(entry.deleted_count)}
                            color={entry.deleted_count > 0 ? '#16a34a' : '#64748b'}
                          />
                        </Td>
                        <Td>{entry.skipped_count}</Td>
                        <Td>{entry.total_before}</Td>
                        <Td>{entry.total_after}</Td>
                        <Td>
                          <Badge
                            label={entry.dry_run ? '🔍 Dry-run' : '🧹 Execução'}
                            color={entry.dry_run ? '#d97706' : '#2563eb'}
                          />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer: última atualização */}
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '2rem' }}>
              Atualizado automaticamente a cada 30s ·{' '}
              <button
                onClick={loadStats}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.8rem',
                  padding: 0,
                }}
              >
                {loading ? 'Atualizando...' : 'Atualizar agora'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#334155',
        margin: '1.5rem 0 0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {icon} {title}
    </h2>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        textAlign: 'center',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color, lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table helpers
// ---------------------------------------------------------------------------

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        padding: '0.6rem 0.75rem',
        textAlign: 'left',
        fontWeight: 600,
        color: '#475569',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return (
    <td style={{ padding: '0.6rem 0.75rem', color: '#334155' }}>
      {children}
    </td>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#fff',
        background: color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

/** Botão de exportação estilizado */
function ExportButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={`Exportar como ${label}`}
      style={{
        padding: '0.5rem 0.75rem',
        fontSize: '0.85rem',
        background: disabled ? '#f1f5f9' : '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? '#94a3b8' : '#475569',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = '#e2e8f0';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = disabled ? '#f1f5f9' : '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {icon} {label}
    </button>
  );
}

/** Cria e baixa um arquivo */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Exporta stats + histórico como JSON */
function exportAsJSON(
  stats: AdminStats | null,
  history: CleanupLogEntry[],
) {
  if (!stats) return;

  const payload = {
    exportedAt: new Date().toISOString(),
    stats,
    cleanupHistory: history,
  };

  const filename = `nexusauto-metrics-${new Date().toISOString().slice(0, 10)}.json`;
  downloadFile(JSON.stringify(payload, null, 2), filename, 'application/json');
}

/** Escapa vírgulas e aspas para CSV */
function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/** Exporta stats + histórico como CSV com separadores visuais */
function exportAsCSV(stats: AdminStats | null, history: CleanupLogEntry[]) {
  if (!stats) return;

  // ── Seção 1: Métricas ────────────────────────────────────────────────

  const rows: string[] = [];

  // Cabeçalho da seção de métricas
  rows.push(escapeCSV('═════ MÉTRICAS DO SISTEMA ═════'));
  rows.push([escapeCSV('Categoria'), escapeCSV('Métrica'), escapeCSV('Valor')].join(','));

  // Linhas de métricas
  const metricRows: [string, string, number][] = [
    ['Banco de Dados', 'Tabelas', stats.database.totalTables],
    ['Banco de Dados', 'Tamanho (KB)', stats.database.sizeKB],
    ['Usuários', 'Total', stats.users.total],
    ['Usuários', 'Administradores', stats.users.admins],
    ['Usuários', 'Teste', stats.users.testUsers],
    ['Conteúdo', 'Templates de Email', stats.emailTemplates.total],
    ['Conteúdo', 'Veículos', stats.vehicles.total],
    ['Conversas', 'Total', stats.conversations.total],
    ['Mensagens', 'Total', stats.messages.total],
    ['Erros', 'Total', stats.errorLogs.total],
    ['Erros', 'Abertos', stats.errorLogs.open],
    ['Erros', 'Investigando', stats.errorLogs.investigating],
    ['Erros', 'Resolvidos', stats.errorLogs.resolved],
    ['Erros', 'Fechados', stats.errorLogs.closed],
    ['Tokens', 'Otimizações', stats.tokenOptimizations.total],
    ['Tokens', 'Originais', stats.tokenOptimizations.totalOriginalTokens],
    ['Tokens', 'Economizados', stats.tokenOptimizations.totalTokensSaved],
  ];

  for (const [cat, metric, val] of metricRows) {
    rows.push([escapeCSV(cat), escapeCSV(metric), String(val)].join(','));
  }

  // ── Separador visual ─────────────────────────────────────────────────

  rows.push('');
  rows.push(escapeCSV('────────────────────────────────────────────'));
  rows.push('');

  // ── Seção 2: Histórico de Cleanups ───────────────────────────────────

  if (history.length === 0) {
    rows.push(escapeCSV('═════ HISTÓRICO DE CLEANUPS ═════'));
    rows.push(escapeCSV('Nenhuma operação de cleanup registrada.'));
  } else {
    rows.push(escapeCSV('═════ HISTÓRICO DE CLEANUPS ═════'));
    rows.push([
      escapeCSV('Data'),
      escapeCSV('Usuários Encontrados'),
      escapeCSV('Removidos'),
      escapeCSV('Pulados'),
      escapeCSV('Total Antes'),
      escapeCSV('Total Depois'),
      escapeCSV('Tipo'),
    ].join(','));

    for (const entry of history) {
      rows.push([
        escapeCSV(formatDate(entry.created_at)),
        String(entry.users_found),
        String(entry.deleted_count),
        String(entry.skipped_count),
        String(entry.total_before),
        String(entry.total_after),
        escapeCSV(entry.dry_run ? 'Dry-run' : 'Execução'),
      ].join(','));
    }
  }

  const csvContent = rows.join('\n');
  const filename = `nexusauto-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
