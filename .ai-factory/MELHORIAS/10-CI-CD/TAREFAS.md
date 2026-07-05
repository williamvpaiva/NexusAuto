# 10 — CI/CD

> Pipeline de integração e deploy contínuo: build, test, quality gates, SAST e deploy
>
> **Status:** 🟢 Em Andamento (6/7 concluídas)
> **Prioridade:** Alta
> **Dependências:** Dockerfile (criado), workflow CI/CD (reescrito)

---

## 📋 Tarefas

### CICD-001 — Fix Matrix Node e Engines no CI
- [x] **Status:** ✅ Concluído
- **Descrição:** Matrix fixado para Node 22.9.0 (nomes `env.NODE_VERSION`), removido warning de engine incompatível
- **Critério de aceite:** ✅ CI roda sem aviso de engine incompatível (matrix única 22.9.0)
- **Esforço:** 30min
- **Arquivos:** `.github/workflows/ci-cd.yml`

### CICD-002 — Cache de Dependências (node_modules + Docker layers)
- [x] **Status:** ✅ Concluído
- **Descrição:** `actions/setup-node@v4` com `cache: 'npm'` já faz cache automático do npm; Docker build usa cache layers
- **Critério de aceite:** ✅ Cache via `actions/setup-node@v4` + `cache: 'npm'` já configurado
- **Esforço:** 1h
- **Arquivos:** `.github/workflows/ci-cd.yml` (linha 30)

### CICD-003 — Pipeline de Testes com Coverage Gate
- [x] **Status:** ✅ Concluído
- **Descrição:** Coverage thresholds configurados no backend (70% lines, 60% branches, 65% functions); relatório HTML enviado como artifact
- **Critério de aceite:** ✅ Coverage abaixo do gate quebra o CI; relatório HTML disponível como artifact
- **Esforço:** 2h
- **Arquivos:** `backend/vitest.config.ts`, `.github/workflows/ci-cd.yml`

### CICD-004 — SAST e Linting Automático
- [x] **Status:** ✅ Concluído
- **Descrição:** CodeQL SAST com `security-and-quality` queries em job separado; ESLint com fail on error (sem `continue-on-error`)
- **Critério de aceite:** ✅ CodeQL job independente; lint falha bloqueia CI
- **Esforço:** 2h
- **Arquivos:** `.github/workflows/ci-cd.yml` (job: codeql-sast)

### CICD-005 — Deploy Automático (Staging)
- [x] **Status:** ✅ Concluído
- **Descrição:** Dockerfile multi-stage (builder + runner), deploy staging com build Docker + download de artifacts + healthcheck
- **Critério de aceite:** ✅ Push na `main` → CI → build Docker → deploy staging
- **Esforço:** 6h
- **Arquivos:** `docker/Dockerfile`, `.github/workflows/ci-cd.yml` (job: deploy-staging), `docker-compose.yml`

### CICD-006 — Deploy em Produção com Approvals
- [x] **Status:** ✅ Concluído
- **Descrição:** Workflow separado `deploy-prod.yml` com GitHub Environments para approval manual, healthcheck pré/pós-deploy, rollback automático
- **Critério de aceite:** ✅ Deploy production requer `workflow_dispatch`; healthcheck pré-deploy (6 tentativas); rollback em falha; notificação
- **Esforço:** 4h
- **Arquivos:** `.github/workflows/deploy-prod.yml`

### CICD-007 — Testes Frontend no CI
- [x] **Status:** ✅ Concluído
- **Descrição:** Vitest configurado no frontend (jsdom, testing-library), teste placeholder incluído, CI executa `npm run test --workspace frontend`
- **Critério de aceite:** ✅ Testes frontend quebram o CI se falharem
- **Esforço:** 1h
- **Arquivos:** `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`, `frontend/src/App.test.tsx`, `frontend/package.json`

### CICD-008 (Extra) — Docker, dockerignore e docker-compose
- [x] **Status:** ✅ Concluído
- **Descrição:** `.dockerignore` criado para builds eficientes; app service adicionado ao `docker-compose.yml`
- **Arquivos:** `.dockerignore`, `docker-compose.yml`

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
