# 19 — ONBOARDING E DX

> Experiência do desenvolvedor: setup rápido, tooling, scripts e documentação de ambiente
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** 03-SISTEMAS, 11-DOCUMENTACAO

---

## 📋 Tarefas

### DX-001 — Setup Script (Makefile + Scripts NPM)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar Makefile ou npm scripts que automatizam setup completo: `make setup` = install deps + migrate + seed + env check
- **Critério de aceite:** `make setup` funciona em um clone limpo; verifica Node 22+, npm, Docker (opcional); cria .env se ausente
- **Esforço:** 2h
- **Prioridade:** Alta

### DX-002 — Git Hooks (Husky + lint-staged)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configurar Husky (pre-commit, commit-msg) + lint-staged: lint + format nos arquivos staged, validação de mensagem de commit
- **Critério de aceite:** Commit com lint error → bloqueado; commit sem conventional commit → bloqueado; lint-staged só roda em arquivos staged
- **Esforço:** 1h
- **Prioridade:** Alta

### DX-003 — VS Code Workspace Config
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configuração compartilhada VS Code: extensions recomendadas, settings (format on save, ESLint, Prettier), debug profiles e tasks
- **Critério de aceite:** Abrir projeto → popup "Recommended extensions" → format on save → ESLint + Prettier funcionam
- **Esforço:** 1h
- **Prioridade:** Média

### DX-004 — .env Example Completo
- [ ] **Status:** 🔴 Pendente
- **Descrição:** .env.example com todas as variáveis, documentação inline, valores dummy seguros e categorias (app, db, auth, integrations)
- **Critério de aceite:** Copiar .env.example → .env → `make setup` funciona sem valores reais (usando dummies)
- **Esforço:** 1h
- **Prioridade:** Alta

### DX-005 — Docker Dev Environment
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configuração Docker para desenvolvimento: hot-reload com volumes bind, perfil compose dev, porta mapeada e rede isolada
- **Critério de aceite:** `docker compose --profile dev up` sobe app + banco + Redis; alteração no código reflete automaticamente
- **Esforço:** 2h
- **Prioridade:** Média

### DX-006 — Debug Config (VS Code + Chrome)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configurações de debug para VS Code: backend (attach ou launch), frontend (Chrome debugger), e testes (Vitest watch)
- **Critério de aceite:** F5 no VS Code inicia debug backend com breakpoints; F5 para debug de testes; F5 para frontend
- **Esforço:** 1h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
