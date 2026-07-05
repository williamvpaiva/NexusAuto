# 17 — GESTÃO DE ESTADO

> Gerenciamento de estado frontend: cache, sincronização, estado global e offline
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** 07-UI-COMPONENTS

---

## 📋 Tarefas

### EST-001 — Estado Global com Context + useReducer
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar estado global com React Context + useReducer para: auth (user, token, permissões) e app (tema, sidebar, notificações)
- **Critério de aceite:** `useAuth()` retorna user + login/logout; `useApp()` retorna tema + toggle; dispatch actions tipadas
- **Esforço:** 3h
- **Prioridade:** Alta

### EST-002 — Server State com TanStack Query (React Query)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Substituir fetch manual por TanStack Query com cache, stale-while-revalidate, refetch automático e optimistic updates
- **Critério de aceite:** Dados de API cached por 30s; refetch em focus; mutation atualiza cache sem refetch; loading/error estado do React Query
- **Esforço:** 4h
- **Prioridade:** Alta

### EST-003 — Estado de Formulário com React Hook Form + Zod
- [ ] **Status:** 🔴 Pendente
- **Descrição:** (Já implementado parcialmente) Integrar React Hook Form com validação Zod em todos os formulários, com erros por campo e disabled state durante submit
- **Critério de aceite:** Submit mostra erros por campo; botão disabled durante submit; validação async (ex: email único) funciona
- **Esforço:** 2h
- **Prioridade:** Alta

### EST-004 — Persistência de Estado (localStorage)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Persistir estado crítico no localStorage: token de autenticação, tema, preferências do usuário, draft de formulários
- **Critério de aceite:** Refresh mantém sessão; tema persiste; draft de formulário recuperado se página fechar acidentalmente
- **Esforço:** 2h
- **Prioridade:** Média

### EST-005 — Zustand para Estado Complexo
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Substituir Context por Zustand para estado que muda frequentemente (fila de mensagens, progresso de agente, notificações)
- **Critério de aceite:** Store Zustand sem re-renderizações desnecessárias; actions imutáveis; devtools integration
- **Esforço:** 3h
- **Prioridade:** Baixa

### EST-006 — URL State (Search Params)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Gerenciar estado compartilhável via URL search params: filtros, paginação, busca, abas ativas
- **Critério de aceite:** `?page=2&search=termo` persiste em navegação; back/forward restaura estado; link compartilhável replica estado
- **Esforço:** 2h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
