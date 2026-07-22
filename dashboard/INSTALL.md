# 📦 Instalação e Configuração - Líder Dashboard

Guia completo para instalar e configurar o Dashboard de Orquestração do Líder.

---

## ⚡ Instalação Rápida (Windows)

### Passo 1: Navegar até o diretório do dashboard
```cmd
cd D:\NexusAuto\dashboard
```

### Passo 2: Instalar dependências
```cmd
npm install
```

### Passo 3: Iniciar o dashboard
```cmd
start.bat
```

### Passo 4: Acessar no navegador
```
http://localhost:3000
```

**Pronto! 🎉**

---

## 📋 Pré-requisitos Detalhados

### Software Necessário

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **NexusAuto Configurado**
   - Projeto NexusAuto na raiz (`D:\NexusAuto`)
   - Memory Manager funcional
   - SQLite instalado (via npm)

3. **npm**
   - Já vem com Node.js
   - Verificar: `npm --version`

### Verificação de Pré-requisitos

```cmd
# Verificar Node.js
node --version
# Deve mostrar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve mostrar: 9.x.x ou superior

# Verificar se NexusAuto existe
dir D:\NexusAuto\scripts\memory-manager.cjs
# Deve mostrar o arquivo

# Verificar banco de dados
dir D:\NexusAuto\nexusauto_memory.db
# Deve mostrar o arquivo (ou será criado automaticamente)
```

---

## 🔧 Instalação Passo a Passo

### 1. Instalar Dependências do Projeto

```cmd
cd D:\NexusAuto\dashboard
npm install
```

**O que é instalado:**
- `concurrently` - Para rodar API e Web simultaneamente
- Dependências do memory-manager (sqlite3, etc.)

### 2. Configurar Variáveis de Ambiente (Opcional)

Copie o arquivo de exemplo:
```cmd
copy .env.example .env
```

Edite `.env` se precisar mudar:
- Portas (padrão: 3001 para API, 3000 para Web)
- Intervalo de refresh
- Nível de log

### 3. Testar Instalação

```cmd
# Testar API
node api/server.js
```

Deve mostrar:
```
📊 Dashboard API initialized
🚀 Dashboard API running on http://localhost:3001
📊 Endpoints disponíveis:
   GET /api/tasks
   GET /api/agents
   GET /api/metrics
   GET /api/handoffs
   GET /api/health
```

Pressione `Ctrl+C` para parar.

### 4. Iniciar Dashboard Completo

**Opção A: Script Automático (Recomendado)**
```cmd
start.bat
```

**Opção B: Comandos Separados**

Terminal 1:
```cmd
npm run start
```

Terminal 2:
```cmd
npm run start:web
```

**Opção C: Modo Desenvolvimento**
```cmd
npm run dev
```

---

## 🌐 Acessando o Dashboard

Após iniciar, abra o navegador em:

```
http://localhost:3000
```

### O que você deve ver:

1. **Cabeçalho**
   - Título "Líder Dashboard"
   - Subtítulo "Orquestração de Agentes em Tempo Real"

2. **Botão de Refresh**
   - "🔄 Atualizar Dados"
   - Última atualização (timestamp)

3. **Cards de Métricas** (4 cards)
   - Total de Tarefas
   - Tarefas Concluídas
   - Agentes Ativos
   - Cache Hit Rate

4. **Seção de Agentes**
   - Grid com todos os agentes
   - Status (idle/busy)
   - Contagem de tarefas

5. **Lista de Tarefas**
   - Tarefas recentes
   - Status colorido
   - Área de origem

6. **Gráfico V&V**
   - 3 barras (Nível 1, 2, 3)
   - Contagem de validações

7. **Handoffs Recentes**
   - Timeline de transferências
   - Agente origem → destino

---

## 🐛 Troubleshooting

### Erro: "npm não é reconhecido"

**Solução:** Instale Node.js em https://nodejs.org/

### Erro: "Cannot find module 'sqlite3'"

**Solução:**
```cmd
npm install sqlite3
```

### Erro: "Memory Manager init failed"

**Solução:**
```cmd
# Verificar se banco de dados existe
dir D:\NexusAuto\nexusauto_memory.db

# Se não existir, inicializar:
cd D:\NexusAuto
node scripts/memory-manager.js stats
```

### Erro: "Port 3001 already in use"

**Solução 1:** Matar processo usando a porta
```cmd
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Solução 2:** Mudar porta no `.env`
```
DASHBOARD_API_PORT=3002
```

### Dashboard não mostra dados

**Verificações:**

1. API está rodando?
   ```cmd
   curl http://localhost:3001/api/health
   ```
   Deve retornar: `{"status":"ok",...}`

2. Existem tarefas?
   ```cmd
   dir D:\NexusAuto\.ai-factory\MELHORIAS\*\TAREFAS.md
   ```
   Deve mostrar arquivos.

3. Memory Manager tem dados?
   ```cmd
   node scripts/memory-manager.js stats
   ```
   Deve mostrar estatísticas.

---

## 📊 Populando Dados de Teste

Se o dashboard está vazio, execute:

```cmd
cd D:\NexusAuto

# Salvar memória de teste
node scripts/memory-manager.js save "Teste de orquestração - tarefa delegada para backend-dev" ^
  --agent tech-lead ^
  --type decision ^
  --tags teste,orchestration

# Verificar se foi salvo
node scripts/memory-manager.js search "teste" --topK 5
```

Depois refresh no dashboard.

---

## 🔐 Segurança (Produção)

### Para uso em produção:

1. **Habilitar Autenticação**
   - Adicionar middleware de auth na API
   - Usar JWT ou API keys

2. **Configurar HTTPS**
   - Usar reverse proxy (Nginx)
   - Certificado SSL/TLS

3. **Rate Limiting**
   - Limitar requisições por IP
   - Evitar abuso da API

4. **Logs e Monitoramento**
   - Habilitar logs detalhados
   - Integrar com Sentry/Datadog

---

## 📈 Performance

### Otimizações Recomendadas

1. **Cache de Requisições**
   - API já usa cache do SQLite
   - Frontend pode cachear por 5s

2. **Lazy Loading**
   - Carregar apenas últimas 20 tarefas
   - Infinite scroll para mais

3. **WebSocket (Futuro)**
   - Push notifications ao invés de polling
   - Reduzir latência

---

## 🎨 Personalização

### Mudar Cores

Edite `web/index.html`, seção `<style>`:

```css
/* Cores do tema */
--primary-color: #00d9ff;
--success-color: #00ff88;
--warning-color: #ffa600;
--error-color: #ff4757;
```

### Adicionar Novas Métricas

1. Adicionar endpoint na API (`api/server.js`):
```javascript
else if (pathname === '/api/new-metric' && method === 'GET') {
  const data = await getNewMetric();
  sendJSON(res, 200, data);
}
```

2. Adicionar card no HTML (`web/index.html`):
```html
<div class="metric-card">
  <h3>Nova Métrica</h3>
  <div class="value" id="newMetric">0</div>
</div>
```

3. Atualizar JavaScript:
```javascript
const newMetric = await fetchJSON('/api/new-metric');
document.getElementById('newMetric').textContent = newMetric.value;
```

---

## 📞 Suporte

### Documentação Adicional

- [README.md](./README.md) - Visão geral
- [API Server](./api/server.js) - Código da API
- [Web UI](./web/index.html) - Código do frontend

### Contato

- **GitHub Issues**: https://github.com/nexusauto/nexusauto/issues
- **Discord**: [link]
- **Email**: support@nexusauto.ai

---

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] npm funcionando
- [ ] NexusAuto configurado
- [ ] Memory Manager funcional
- [ ] Dependências instaladas (`npm install`)
- [ ] API rodando (http://localhost:3001)
- [ ] Web rodando (http://localhost:3000)
- [ ] Dashboard mostrando dados
- [ ] Auto-refresh funcionando

**Se todos os itens estiverem marcados, está pronto! 🎉**

---

**Última Atualização**: 2026-07-21  
**Versão**: 1.1.0