import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Habilita as métricas default do Node (memória, CPU, event loop, etc)
client.collectDefaultMetrics({ prefix: 'nexus_' });

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'nexus_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 3, 5, 10], // P50, P95, P99 serao calculados baseados nesses buckets no Grafana
});

export const httpRequestsTotal = new client.Counter({
  name: 'nexus_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const agentCallsTotal = new client.Counter({
  name: 'nexus_agent_calls_total',
  help: 'Total number of AI agent calls',
  labelNames: ['agent_name', 'status'],
});

export const errorsTotal = new client.Counter({
  name: 'nexus_errors_total',
  help: 'Total number of errors',
  labelNames: ['type'],
});

// Middleware para medir requisições
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9;
    
    // Fallback para originalUrl se route.path nao estiver disponivel
    const route = req.route ? req.route.path : req.originalUrl.split('?')[0];

    httpRequestDurationSeconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(durationSeconds);

    httpRequestsTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });

  next();
};

export const getMetrics = async () => {
  return await client.register.metrics();
};
