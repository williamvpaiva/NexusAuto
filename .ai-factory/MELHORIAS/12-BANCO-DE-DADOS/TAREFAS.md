# 12 — BANCO DE DADOS

> Migrations, seeds, backup, query optimization e evolução do schema SQLite
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### BAN-001 — Sistema de Migrations (SQLite)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar sistema de migrations versionadas (up/down) para SQLite com arquivos SQL sequenciais, lock e rollback
- **Critério de aceite:** `npm run db:migrate` executa pendentes; `npm run db:rollback` desfaz última; estado tracking em `_migrations` table
- **Esforço:** 4h
- **Prioridade:** Alta

### BAN-002 — Seeds de Dados para Desenvolvimento
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Scripts seed que populam banco com dados realistas para dev: usuários, agentes, conversas, mensagens e logs de execução
- **Critério de aceite:** `npm run db:seed` popula banco em < 2s; dados coerentes (relações válidas); `npm run db:reset` = migrate + seed
- **Esforço:** 2h
- **Prioridade:** Alta

### BAN-003 — Backup Automático (SQLite Dump)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Script de backup que executa `.backup` ou dump SQL, compacta (gzip), rotaciona (últimos 7 dias) e opcionalmente envia para S3/Blob
- **Critério de aceite:** `npm run db:backup` gera arquivo `.sql.gz`; rotação mantém 7 backups; restauração via `sqlite3 < dump.sql`
- **Esforço:** 2h
- **Prioridade:** Média

### BAN-004 — Índices e Otimização de Schema
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Auditar e adicionar índices faltantes: busca por usuário, data, status, agente; índices compostos para queries frequentes
- **Critério de aceite:** EXPLAIN QUERY PLAN mostra apenas index scans para queries principais; cobertura de > 90% das queries
- **Esforço:** 3h
- **Prioridade:** Alta

### BAN-005 — Data Validation Constraints
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar constraints no schema SQLite: NOT NULL, UNIQUE, CHECK, FOREIGN KEY com ON DELETE CASCADE/RESTRICT
- **Critério de aceite:** Inserir registro duplicado → erro; deletar pai com filhos RESTRICT → erro; ON DELETE CASCADE funciona
- **Esforço:** 2h
- **Prioridade:** Média

### BAN-006 — Migração futura para PostgreSQL (Doc/Plan)
- [x] **Status:** 🟢 Concluído
- **Descrição:** Documentar plano de migração SQLite → PostgreSQL: mapeamento de tipos, compatibilidade de queries, estratégia de zero-downtime
- **Critério de aceite:** Documento `docs/adr/0002-postgresql-migration.md` com análise de impacto, riscos e plano passo-a-passo
- **Esforço:** 2h
- **Prioridade:** Baixa

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
