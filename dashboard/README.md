# 🚀 Líder Dashboard - NexusAuto

Dashboard de orquestração em tempo real para monitorar tarefas, agentes, métricas de V&V e handoffs no NexusAuto AI Factory.

![Dashboard Preview](./preview.png)

---

## ✨ Funcionalidades

- **📊 Métricas em Tempo Real**: Total de tarefas, taxa de conclusão, agentes ativos, cache hit rate
- **🤖 Monitoramento de Agentes**: Status de cada agente (idle/busy) e carga de tarefas
- **✅ Tarefas Recentes**: Lista de tarefas com status (pending, in_progress, completed)
- **🔍 Validações V&V**: Distribuição por nível (Crítico, Médio, Cache)
- **🔄 Handoffs**: Histórico de transferências entre agentes
- **⚡ Auto-Refresh**: Atualização automática a cada 30 segundos

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- NexusAuto configurado na raiz do projeto
- Memory Manager funcional (`nexusauto_memory.db`)

### Instalação

```bash
# Na raiz do dashboard
cd dashboard

# Instalar dependências
npm install
```

### Iniciar Dashboard

**Opção 1: API + Web separadamente**

```bash
# Terminal 1: Iniciar API (porta 3001)
npm run start

# Terminal 2: Iniciar Web Server (porta 3000)
npm run start:web
```

**Opção 2: Ambos simultaneamente (requer `concurrently`)**

```bash
npm run dev
```

### Acessar Dashboard

Abra o navegador em:
```
http://localhost:3000
```

---

## 📡 API Endpoints

A API roda em `http://localhost:3001` e fornece os seguintes endpoints:

### GET `/api/tasks`
Lista de tarefas com status e área.

```json
{
  "total": 45,
  "byStatus": {
    "completed": 20,
    "in_progress": 10,
    "pending": 15
  },
  "tasks": [...]
}
```

### GET `/api/agents`
Agentes ativos e status.

```json
{
  "agents": [
    { "name": "backend-dev", "tasks": 5, "status": "busy" },
    { "name": "frontend-dev", "tasks": 0, "status": "idle" }
  ],
  "total": 11,
  "active": 3
}
```

### GET `/api/metrics`
Métricas de orquestração, performance e V&V.

```json
{
  "orchestration": { ... },
  "performance": {
    "cacheHitRate": 65.4
  },
  "vv": {
    "totalValidations": 23,
    "level1Count": 5,
    "level2Count": 10,
    "level3Count": 8
  }
}
```

### GET `/api/handoffs`
Histórico de handoffs entre agentes.

```json
{
  "handoffs": [...],
  "total": 15
}
```

### GET `/api/health`
Health check da API.

```json
{
  "status": "ok",
  "timestamp": "2026-07-21T15:30:00.000Z",
  "mmInitialized": true
}
```

---

## 🎨 Interface

### Métricas Principais (Topo)
- **Total de Tarefas**: Soma de todas as tarefas (pending + in_progress + completed)
- **Tarefas Concluídas**: Tarefas com status completed
- **Agentes Ativos**: Agentes com status busy
- **Cache Hit Rate**: Porcentagem de validações puladas por cache

### Agentes (Grid)
Cada agente mostra:
- Nome
- Status (idle = azul, busy = laranja)
- Contagem de tarefas

### Tarefas Recentes (Lista)
- Cor da borda indica status:
  - 🟠 Laranja: Pending
  - 🔵 Azul: In Progress
  - 🟢 Verde: Completed
- Área de origem
- Descrição da tarefa

### Validações V&V (Gráfico de Barras)
- 🔴 Nível 1 (Crítico): 7 passos, ~3000 tokens
- 🟡 Nível 2 (Médio): 3 passos, ~1000 tokens
- 🟢 Nível 3 (Cache): 0 passos, ~50 tokens

### Handoffs Recentes (Timeline)
- Agente de origem → Agente de destino
- Timestamp da transferência

---

## 🛠️ Configuração Avançada

### Mudar Porta da API

```bash
# Definir variável de ambiente
export DASHBOARD_PORT=4000
npm run start
```

A API vai rodar em `http://localhost:4000`

### Integrar com Dados Reais

O dashboard busca dados de:
1. `.ai-factory/MELHORIAS/*/TAREFAS.md` - Tarefas por área
2. `nexusauto_memory.db` - Memórias do SQLite
3. `.ai-factory/wiki/session/log.md` - Log de sessões
4. `.ai-factory/MELHORIAS/LOG-VALIDACOES.md` - Validações V&V

Certifique-se de que estes arquivos existam e estejam atualizados.

---

## 📸 Screenshots

### Visão Geral
![Dashboard Overview](./screenshots/overview.png)

### Detalhe de Agentes
![Agents Grid](./screenshots/agents.png)

### Métricas V&V
![V&V Metrics](./screenshots/vv-metrics.png)

---

## 🐛 Troubleshooting

### Erro: "Memory Manager init failed"
- Verifique se `nexusauto_memory.db` existe na raiz
- Execute `node scripts/memory-manager.js stats` para inicializar

### Erro: "Cannot connect to API"
- Verifique se a API está rodando (`npm run start`)
- Acesse `http://localhost:3001/api/health` para testar

### Dashboard não mostra dados
- Execute `npm run dev` para ver logs no console
- Verifique se há tarefas em `.ai-factory/MELHORIAS/*/TAREFAS.md`

---

## 🔄 Auto-Refresh

O dashboard atualiza automaticamente a cada **30 segundos**.

Para refresh manual, clique no botão **🔄 Atualizar Dados**.

---

## 📊 Roadmap

### Fase 1 (✅ Implementado)
- [x] API REST com endpoints básicos
- [x] Frontend React estático
- [x] Auto-refresh a cada 30s
- [x] Métricas de V&V

### Fase 2 (🚧 Em Progresso)
- [ ] WebSocket para atualizações em tempo real
- [ ] Gráficos com Recharts
- [ ] Filtros por período e agente
- [ ] Export de dados (CSV, JSON)

### Fase 3 (📋 Planejado)
- [ ] Alertas em tempo real (tarefa bloqueada > 2 dias)
- [ ] Predição de bloqueios (ML)
- [ ] Integração com Slack/Discord
- [ ] Multi-projeto support

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/dashboard-improvement`)
3. Commit mudanças (`git commit -m 'Add dashboard improvement'`)
4. Push para branch (`git push origin feature/dashboard-improvement`)
5. Abra Pull Request

---

## 📄 Licença

MIT License - ver [LICENSE](../../LICENSE) para detalhes.

---

## 🔗 Referências

- [TECH-LEAD.md](../../TECH-LEAD.md) - Diretrizes do Tech Lead
- [PROPOSTA.md](../skills/lider/PROPOSTA.md) - Proposta da skill Líder
- [CASOS_DE_USO.md](../skills/lider/CASOS_DE_USO.md) - Casos de uso avançados
- [memory-manager.cjs](../../scripts/memory-manager.cjs) - Módulo de memória

---

**Skill Owner**: NexusAuto AI Factory  
**Status**: ✅ Ativa  
**Versão**: 1.0.0  
**Última Atualização**: 2026-07-21