# 11 — DOCUMENTAÇÃO

> Documentação técnica: README, Storybook, JSDoc, guias de contribuição e arquitetura
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### DOC-001 — README.md Principal Completo
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Reescrever README.md com: descrição do projeto, stack, pré-requisitos, instalação (local + Docker), configuração, scripts disponíveis, estrutura de diretórios e links para docs
- **Critério de aceite:** README cobre todas as seções; desenvolvedor novo consegue rodar o projeto em < 10 min seguindo o guia
- **Esforço:** 3h
- **Prioridade:** Alta

### DOC-002 — Guia de Contribuição (CONTRIBUTING.md)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar CONTRIBUTING.md com: Setup, workflow (branch/commit/PR), coding standards, padrão de commits (Conventional Commits), checklist de review
- **Critério de aceite:** CONTRIBUTING.md linkado no README; cobre todo o ciclo de contribuição
- **Esforço:** 2h
- **Prioridade:** Alta

### DOC-003 — JSDoc/TSDoc em Funções Públicas
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar JSDoc em todas as funções/classes exportadas no backend: @param, @returns, @throws e exemplos de uso
- **Critério de aceite:** `npx typedoc` (ou similar) gera documentação sem warnings; funções públicas têm JSDoc
- **Esforço:** 4h
- **Prioridade:** Média

### DOC-004 — CHANGELOG.md Automatizado
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configurar CHANGELOG.md gerado a partir de commits (Conventional Commits) via standard-version ou semantic-release
- **Critério de aceite:** `npm run release` gera CHANGELOG.md com seções Features/Fixes/Breaking; version bump automático
- **Esforço:** 1h
- **Prioridade:** Média

### DOC-005 — API Docs (Swagger/OpenAPI)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Documentar todas as rotas da API com OpenAPI/Swagger (swagger-jsdoc + swagger-ui-express)
- **Critério de aceite:** GET /api-docs exibe UI Swagger com todas as rotas documentadas; schemas de request/response
- **Esforço:** 4h
- **Prioridade:** Média

### DOC-006 — Architecture Decision Records (ADR)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar primeiros ADRs para decisões arquiteturais chave: SQLite vs PostgreSQL, Express vs Fastify, estrutura de agentes
- **Critério de aceite:** ADRs no formato `docs/adr/NNNN-titulo.md`; linkados no README; cada ADR contém contexto, decisão e consequências
- **Esforço:** 2h
- **Prioridade:** Baixa

### DOC-007 — Integração OpenWiki (Automação de Docs)
- [x] **Status:** 🟢 Concluído
- **Descrição:** Implementar estrutura do OpenWiki (`scripts/openwiki/`) para geração automatizada de AGENTS.md e CLAUDE.md via LLM.
- **Critério de aceite:** Diretório, package.json configurados, scripts de LLM e config inicializados.
- **Esforço:** 2h
- **Prioridade:** Alta

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
