# 🏭 AI Factory - Configuração do Projeto

> Este arquivo configura a AI Factory para **ESTE** projeto específico.

---

## 📋 Identidade do Projeto

```yaml
nome: NEXUSAUTO
tipo: SaaS # SaaS | E-commerce | API | App | Legacy
status: MVP # Planejamento | MVP | Crescimento | Escala | Legado
descricao: Fabrica autonoma de software com agentes de IA
```

---

## 🛠️ Stack Tecnológico

```yaml
frontend:
  framework: React # React | Vue | Angular | Svelte | Outro
  linguagem: TypeScript # TypeScript | JavaScript
  bundler: Vite # Vite | Webpack | Next.js | Outro
  testes: Jest # Jest | Vitest | Cypress | Outro

backend:
  runtime: Node.js # Node.js | Python | Go | Java | Outro
  framework: Express # Express | FastAPI | Django | Gin | Spring
  linguagem: TypeScript # TypeScript | JavaScript | Python | Go
  testes: Vitest # Jest | Vitest | Pytest | Outro

banco:
  principal: PostgreSQL # PostgreSQL | MySQL | MongoDB | Outro
  cache: Redis # Redis | Memcached | Nenhum
  orm: Prisma # Prisma | TypeORM | Sequelize | SQLAlchemy

infra:
  deploy: Vercel + Railway # Vercel | Railway | AWS | Azure | GCP
  ci_cd: GitHub Actions # GitHub Actions | GitLab CI | CircleCI
  monitoramento: TBD # Sentry | Datadog | New Relic
```

---

## 📁 Estrutura de Pastas do Projeto

```yaml
raiz: .
frontend: frontend/
backend: backend/
docs: docs/
scripts: scripts/
ai_factory: .ai-factory/
```

---

## 🎯 Prioridades Atuais

```yaml
critico:
  - Segurança (OWASP Top 10)
  - Bugs em produção
  - Testes de módulos críticos

alto:
  - Performance (gargalos)
  - Testes de integração
  - CI/CD robusto

medio:
  - Code smells
  - Documentação
  - DX (Developer Experience)

baixo:
  - Refatoração cosmética
  - Acessibilidade (se não for crítico)
  - SEO (se aplicável)
```

---

## 🤖 Configuração do Tech Lead

```yaml
auto_scan: true # Varre automático ao iniciar
auto_assign: true # Atribuição automática de tarefas
vv_obrigatorio: true # V&V obrigatório após cada alteração
daily_review: true # Daily de melhorias
weekly_report: true # Relatório semanal

# Agentes disponíveis
agentes:
  - analyst
  - architect
  - backend-dev
  - frontend-dev
  - security
  - qa-tester
  - devops
  - performance
  - tech-lead

# Matriz de roteamento personalizada
roteamento:
  "segurança|owasp|pentest": security
  "teste|coverage|jest": qa-tester
  "api|backend|controller": backend-dev
  "frontend|react|componente": frontend-dev
  "arquitetura|adr|diagrama": architect
  "ci|cd|deploy|docker": devops
  "performance|otimização": performance
  "doc|readme|onboarding": tech-lead
```

---

## 📊 Métricas e Metas

```yaml
metricas:
  taxa_aprovacao_vv: 85% # Meta: >85% de aprovação no V&V
  ciclos_correcao: 1.5 # Meta: <1.5 ciclos por tarefa
  tarefas_semana: 10 # Meta: 10 tarefas/semana
  bugs_producao: 0 # Meta: 0 bugs em produção

acompanhamento:
  diario: true # Daily de melhorias
  semanal: true # Weekly review
  mensal: true # Retrospectiva
```

---

## 🔗 Integrações

```yaml
github:
  enabled: true
  auto_pr: false # Não criar PRs automaticamente
  require_vv: true # Exigir V&V nos PRs

slack:
  enabled: false
  canal: "#ai-factory"
  notificar_conclusao: true

jira:
  enabled: false
  projeto: POLY
  auto_create_issues: false
```

---

## 🚀 Comandos de Inicialização

### Iniciar Tech Lead
```bash
node .ai-factory/scripts/init.js
```

### Scan Rápido
```bash
# No chat da IA:
Leia .ai-factory/agents/tech-lead.md
Scan tarefas pendentes
```

### Relatório Diário
```bash
# No chat da IA:
Leia .ai-factory/agents/tech-lead.md
Gere relatório diário de melhorias
```

---

## 📝 Histórico de Mudanças

| Data | Versão | Mudança |
|------|--------|---------|
| 02/07/2026 | 1.0.0 | Configuração inicial do NEXUSAUTO |

---

**Próxima ação:** Execute `node .ai-factory/scripts/init.js` para começar! 🚀