import { useEffect, useState } from 'react';
import { getHealth, type Health } from '../lib/api';

export function HealthPage() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getHealth()
      .then(result => {
        if (!cancelled) setData(result);
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar healthcheck');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleReload = () => {
    setLoading(true);
    setError(null);
    setReloadKey(k => k + 1);
  };

  return (
    <section className="card health-card">
      <div className="section-header">
        <h2>Healthcheck</h2>
        <button onClick={handleReload} disabled={loading} className="secondary">
          {loading ? 'Consultando...' : 'Recarregar'}
        </button>
      </div>

      {loading && <p className="loading">Consultando backend...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="health-grid">
          <div className="health-item">
            <span className="label">Status</span>
            <span className={`value status-${data.status}`}>{data.status}</span>
          </div>

          <div className="health-item">
            <span className="label">Serviço</span>
            <span className="value">{data.service}</span>
          </div>

          <div className="health-item">
            <span className="label">Versão</span>
            <span className="value">{data.version}</span>
          </div>

          <div className="health-item">
            <span className="label">Ambiente</span>
            <span className="value">{data.environment}</span>
          </div>

          <div className="health-item">
            <span className="label">Uptime</span>
            <span className="value">{Math.floor(data.uptime)}s</span>
          </div>

          <div className="health-item">
            <span className="label">Timestamp</span>
            <span className="value mono">
              {new Date(data.timestamp).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}