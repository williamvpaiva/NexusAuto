import { useEffect, useState } from 'react';
import { getHealth, type Health } from '../lib/api';

export function HealthPage() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadHealth() {
    setLoading(true);
    setError(null);

    try {
      const result = await getHealth();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar healthcheck');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <section className="card health-card">
      <div className="section-header">
        <h2>Healthcheck</h2>
        <button onClick={loadHealth} disabled={loading} className="secondary">
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