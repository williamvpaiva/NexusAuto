# 01 — ARQUITETURA

> Correções e melhorias na arquitetura do backend
>
> **Status:** 🟢 Concluído
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

### ARQ-001 — Registrar Memory Router em `routes/index.ts`

- [x] **Status:** ✅ Concluído
- **Descrição:** Adicionar `import memoryRouter` e registrar `apiRouter.use('/memory', ...)` em `routes/index.ts`
- **Evidência:** `routes/index.ts:6,47` — importação e registro do `memoryRouter` existentes
- **V&V:** ✅ APROVADO

### ARQ-002 — Unificar Error Handling no Memory Controller

- [x] **Status:** ✅ Concluído
- **Descrição:** Substituir `res.status(4xx).json(...)` por `throw new AppError(...)` no `memory.controller.ts`
- **Evidência:** Controller usa `asyncHandler` + `throw new AppError()`, sem `res.status(4xx).json()` direto
- **V&V:** ✅ APROVADO

### ARQ-003 — Persistir Users no SQLite

- [x] **Status:** ✅ Concluído
- **Descrição:** Migrar `users.service.ts` para usar SQLite (mesmo padrão de `memory.service.ts`)
- **Evidência:** `users.repository.ts` usa `db.run/all/get` com SQLite; `database.ts` cria tabela `users` com índices
- **V&V:** ✅ APROVADO

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
