# Protocolo V&V Adaptativo

## Visão Geral
Validação por camadas baseada em criticidade e cache de hash.

## Níveis de Validação

### Nível 1: Completo (7 Passos)
**Aplicação**: Arquivos críticos

**Critérios**:
- Envolve autenticação/autorização
- Envolve pagamentos/financeiro
- Schema do banco de dados
- APIs públicas
- Segurança

**Passos**:
1. ✅ Lint (ESLint/Prettier)
2. ✅ Type Check (TypeScript)
3. ✅ Testes Unitários
4. ✅ Testes de Integração
5. ✅ Testes E2E (se aplicável)
6. ✅ Security Scan (Semgrep/SAST)
7. ✅ Performance Check

**Tokens estimados**: ~3.000

---

### Nível 2: Parcial (3 Passos)
**Aplicação**: Baixa complexidade

**Critérios**:
- Componentes UI simples
- Utils/funções puras
- Estilos/CSS
- Documentação

**Passos**:
1. ✅ Lint (ESLint/Prettier)
2. ✅ Type Check (TypeScript)
3. ✅ Smoke Test

**Tokens estimados**: ~1.000

---

### Nível 3: Cache (0 Passos)
**Aplicação**: Hash inalterado

**Critérios**:
- Hash atual == Hash cacheado
- Status anterior == "Aprovado"
- V&V anterior == "Sim"

**Passos**:
- Nenhum (pula validação)

**Tokens estimados**: ~50 (apenas verificação de hash)

---

## Matriz de Decisão

| Tipo de Arquivo | Criticidade | Nível V&V |
|-----------------|-------------|-----------|
| `backend/src/auth/**` | 🔴 Crítica | Nível 1 |
| `backend/src/payments/**` | 🔴 Crítica | Nível 1 |
| `backend/prisma/schema.prisma` | 🔴 Crítica | Nível 1 |
| `backend/src/**` | 🟡 Média | Nível 2 |
| `frontend/src/components/**` | 🟡 Média | Nível 2 |
| `frontend/src/utils/**` | 🟢 Baixa | Nível 2 |
| `frontend/src/**/*.css` | 🟢 Baixa | Nível 2 |
| `*.test.ts` | 🟡 Média | Nível 2 |
| `*.md` | 🟢 Baixa | Nível 2 |
| Cache Hit | - | Nível 3 |

---

## Fluxo de Decisão

```
Início
  ↓
Verificar Cache (check-cache.js)
  ↓
Cache Hit? ──Sim──→ Nível 3 (Pular)
  ↓ Não
Analisar Criticidade
  ↓
┌─────────────────┬─────────────────┬────────────────┐
│   🔴 Crítica    │   🟡 Média      │   🟢 Baixa     │
│   Nível 1       │   Nível 2       │   Nível 2      │
│   (7 passos)    │   (3 passos)    │   (3 passos)   │
└─────────────────┴─────────────────┴────────────────┘
  ↓
Executar Validação
  ↓
Atualizar VALIDATION_CACHE.md
  ↓
Fim
```

---

## Script de Seleção Automática

```bash
# Seleciona nível de V&V automaticamente
node scripts/select-vv-level.js backend/src/auth/login.ts
# Output: {"level": 1, "reason": "CRITICAL_PATH", "steps": 7}
```

---

## Exceções

### Forçar Nível 1 (independente do caminho)
- Mudanças em dependências críticas
- Após merge de branch principal
- Antes de deploy em produção
- Request explícito do usuário

### Pular Validação (mesmo sem cache)
- Hotfix de produção (validar post-facto)
- Mudanças apenas em comentários
- Reformatação de código (lint apenas)

---

## Métricas

| Métrica | Meta | Atual |
|---------|------|-------|
| Hit rate de cache | 80% | - |
| Redução de tokens | 70% | - |
| Tempo médio de V&V | < 2 min | - |

---

*Atualizar conforme evolução da fábrica*