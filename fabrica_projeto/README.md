# Polymarketing - AI Factory Full Stack

> Estrutura de fábrica de software com agentes IA especializados para desenvolvimento full stack.

## 🏗️ Estrutura do Projeto

```
polymarketing/
├── .ai-factory/           # Agentes, workflows, standards
│   ├── agents/           # Definições de agentes (analyst, architect, devs, etc)
│   ├── skills/           # Habilidades transversais
│   ├── standards/        # Padrões obrigatórios
│   ├── workflows/        # Fluxos de trabalho
│   ├── handoffs/         # Regras de transição
│   └── prompts/          # Prompts reutilizáveis
├── frontend/             # Aplicação React
│   └── src/
├── backend/              # API Express
│   └── src/
├── docs/                 # Documentação
│   ├── adr/             # Architecture Decision Records
│   └── analysis/        # Análise de requisitos
└── docker-compose.yml    # Infraestrutura
```

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
```bash
copy .env.example .env
```

### 3. Subir infraestrutura (opcional)
```bash
npm run docker:up
```

### 4. Rodar aplicação
```bash
npm run dev
```

## 🌐 Endpoints

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health API | http://localhost:3000/api/v1/health |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Frontend + Backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build            # Build completo
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Testes
npm run test             # Todos os testes
npm run test:backend     # Testes backend
npm run test:frontend    # Testes frontend

# Docker
npm run docker:up        # Sobe PostgreSQL + Redis
npm run docker:down      # Para containers
npm run docker:logs      # Logs dos containers
```

## 🤖 AI Factory - Como Usar

### Em Qualquer IDE

1. **Leia o contexto do projeto:**
   ```
   .ai-factory/PROJECT_CONTEXT.md
   ```

2. **Verifique a fase atual em:**
   ```
   .ai-factory/PROGRESS.md
   ```

3. **Assuma o agente da fase:**
   ```
   .ai-factory/agents/{agente}.md
   ```

4. **Siga o workflow:**
   ```
   .ai-factory/workflows/{workflow}.md
   ```

### Agentes Disponíveis

| Agente | Responsabilidade |
|--------|------------------|
| `product-owner` | Definição de problema e prioridade |
| `analyst` | Levantamento de requisitos |
| `architect` | Design de arquitetura |
| `frontend-dev` | Desenvolvimento frontend |
| `backend-dev` | Desenvolvimento backend |
| `security` | Auditoria de segurança |
| `performance` | Otimização de performance |
| `qa-tester` | Garantia de qualidade |
| `devops` | Deploy e operação |

### Workflows

- **new-feature:** Implementação de nova funcionalidade
- **bugfix:** Correção de bugs
- **refactor:** Refatoração de código
- **release:** Deploy em produção

## 📚 Documentação

### AI Factory
- [ORCHESTRATOR.md](./.ai-factory/ORCHESTRATOR.md) - Como usar a fábrica
- [PROJECT_CONTEXT.md](./.ai-factory/PROJECT_CONTEXT.md) - Contexto do projeto
- [PROGRESS.md](./.ai-factory/PROGRESS.md) - Progresso atual

### Standards
- [Code Style](./.ai-factory/standards/code-style.md) - Padrões de código
- [Testing Policy](./.ai-factory/standards/testing-policy.md) - Política de testes
- [Backend Patterns](./.ai-factory/standards/backend-patterns.md) - Padrões backend
- [Frontend Patterns](./.ai-factory/standards/frontend-patterns.md) - Padrões frontend

## 🛠️ Stack Tecnológico

### Frontend
- React 18+
- TypeScript
- Vite
- React Router
- CSS Modules / Tailwind

### Backend
- Node.js 18+
- Express
- TypeScript
- Zod (validação)
- Vitest (testes)

### Infraestrutura
- Docker + Docker Compose
- PostgreSQL 15
- Redis 7

## 📝 Convenções

### Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Configurações
```

### Branches
```
feat/US-001-descricao
fix/BUG-042-descricao
hotfix/critico-prod
```

## 🔒 Segurança

- ✅ Secrets em variáveis de ambiente
- ✅ Validação de inputs com Zod
- ✅ CORS configurado
- ✅ Helmet (security headers)
- ✅ Rate limiting
- ✅ Hash de senhas (bcrypt)

## 📊 Métricas de Qualidade

| Métrica | Target |
|---------|--------|
| Cobertura de testes (backend) | > 80% |
| Cobertura de testes (frontend) | > 70% |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |
| Zero bugs críticos em produção | ✅ |

## 🤝 Contribuindo

1. Leia `.ai-factory/ORCHESTRATOR.md`
2. Verifique `PROJECT_CONTEXT.md` para a fase atual
3. Assuma o agente correspondente
4. Siga o workflow definido
5. Registre handoff em `PROGRESS.md`

## 📄 Licença

Proprietário - Todos os direitos reservados.

---

**Próxima ação:** Leia [`.ai-factory/ORCHESTRATOR.md`](./.ai-factory/ORCHESTRATOR.md) para entender como operar com agentes IA.